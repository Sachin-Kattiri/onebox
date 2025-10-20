import express from "express";
import { esClient } from "../elastic/elasticClient";
const router = express.Router();
router.post("/emails/search", async (req, res) => {
    try {
        const { query, accountId, folder, from = 0, size = 10 } = req.body;
        const esQuery = {
            from,
            size,
            query: {
                bool: {
                    must: query
                        ? [{ multi_match: { query, fields: ["subject", "body"] } }]
                        : [{ match_all: {} }],
                    filter: [
                        ...(accountId ? [{ term: { accountId } }] : []),
                        ...(folder ? [{ term: { folder } }] : []),
                    ],
                },
            },
        };
        // ✅ Elasticsearch v8 expects this shape (no `body:` key)
        const result = await esClient.search({
            index: "emails",
            ...esQuery,
        });
        res.json(result.hits.hits.map((h) => h._source));
    }
    catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
});
export default router;
