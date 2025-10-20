// src/routes/emailSearch.ts
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
            : [],
          filter: [
            ...(accountId ? [{ term: { accountId } }] : []),
            ...(folder ? [{ term: { folder } }] : []),
          ],
        },
      },
    };

    const result = await esClient.search({
      index: "emails",
      query: esQuery.query,
      from,
      size,
    });

    res.json(result.hits.hits.map((h: any) => h._source));
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
