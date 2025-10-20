import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import searchRoutes from "./routes/searchRoutes"; // ✅ correct import
const app = express();
app.use(cors());
app.use(bodyParser.json());
// ✅ Mount the route with `/api`
app.use("/api", searchRoutes);
app.get("/", (req, res) => {
    res.send("✅ Onebox backend running...");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
