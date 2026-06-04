import express from "express";
import cors from "cors";
import { createOllamaRouter } from "./ollama.js";
import { createDeepSeekRouter } from "./deepseek.js";
import { createSanctuaryRouter } from "./sanctuary.js";
import { createMemoryRouter } from "./memory.js";
const app = express();
const PORT = process.env.PORT || 3457;
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/ollama", createOllamaRouter());
app.use("/api/deepseek", createDeepSeekRouter());
app.use("/api/sanctuary", createSanctuaryRouter());
app.use("/api/memory", createMemoryRouter());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", sanctuary: "ĀyurDigital Sanctuary — The Chrysalis" });
});
app.listen(PORT, () => {
    console.log(`🕉️  Āyur Sanctuary server alive on port ${PORT}`);
});
//# sourceMappingURL=index.js.map