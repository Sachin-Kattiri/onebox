import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import { esClient } from "../elastic/elasticClient";
dotenv.config();
const accounts = [
    {
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER1,
            pass: process.env.IMAP_PASS1,
        },
    },
    {
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER2,
            pass: process.env.IMAP_PASS2,
        },
    },
];
export async function startEmailSync() {
    for (const account of accounts) {
        const client = new ImapFlow(account);
        client.on("error", (err) => console.error(`[${account.auth.user}] IMAP Error:`, err));
        await client.connect();
        console.log(`✅ Connected to ${account.auth.user}`);
        await client.mailboxOpen("INBOX");
        // --- Initial sync: fetch emails from last 30 days ---
        const since = new Date();
        since.setDate(since.getDate() - 30);
        for await (let message of client.fetch({ since }, { source: true })) {
            if (!message.source)
                continue;
            const parsed = await simpleParser(message.source);
            await indexEmail({
                subject: parsed.subject ?? "(No Subject)",
                body: parsed.text ?? "",
                accountId: account.auth.user,
                folder: "INBOX",
                date: parsed.date ?? new Date(),
                aiCategory: "initial_sync",
            });
        }
        // --- Real-time listener for new emails ---
        client.on("exists", async () => {
            const mailbox = await client.mailboxOpen("INBOX");
            const latest = mailbox.exists;
            for await (let message of client.fetch({ seq: `${latest}` }, { source: true })) {
                if (!message.source)
                    continue;
                const parsed = await simpleParser(message.source);
                await indexEmail({
                    subject: parsed.subject ?? "(No Subject)",
                    body: parsed.text ?? "",
                    accountId: account.auth.user,
                    folder: "INBOX",
                    date: parsed.date ?? new Date(),
                    aiCategory: "new_mail",
                });
                console.log(`[${account.auth.user}] Indexed new email: ${parsed.subject}`);
            }
        });
        // Keep IDLE alive
        const keepAlive = async () => {
            try {
                await client.idle();
            }
            catch (err) {
                console.error(`[${account.auth.user}] IDLE error:`, err);
                setTimeout(keepAlive, 5000);
            }
        };
        setInterval(keepAlive, 28 * 60 * 1000);
        await keepAlive();
    }
}
async function indexEmail(email) {
    await esClient.index({
        index: "emails",
        document: email,
    });
    console.log(`📥 Indexed email: ${email.subject}`);
}
