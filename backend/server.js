import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 JS Server running on port ${PORT}`));
