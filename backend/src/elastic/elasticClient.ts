import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

export const esClient = new Client({ node: process.env.ES_URL || "http://localhost:9200" });

// Create index if it doesn’t exist
(async () => {
  const indexName = "emails";
  const exists = await esClient.indices.exists({ index: indexName });
  if (!exists) {
    await esClient.indices.create({
      index: indexName,
      mappings: {
        properties: {
          subject: { type: "text" },
          body: { type: "text" },
          accountId: { type: "keyword" },
          folder: { type: "keyword" },
          date: { type: "date" },
          aiCategory: { type: "keyword" },
        },
      },
    });
    console.log("🧱 Created 'emails' index in Elasticsearch");
  }
})();
