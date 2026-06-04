import { Router } from "express";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export function createOllamaRouter(): Router {
  const router = Router();

  router.get("/models", async (_req, res) => {
    try {
      const resp = await fetch(`${OLLAMA_URL}/api/tags`);
      const data: any = await resp.json();
      res.json(data.models ?? []);
    } catch {
      res.status(503).json({ error: "Ollama not reachable" });
    }
  });

  router.post("/chat", async (req, res) => {
    try {
      const { model, messages, stream } = req.body;

      if (stream) {
        const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: model ?? "deepseek-r1:8b", messages, stream: true }),
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.trim());
          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                res.write(`data: ${JSON.stringify({ token: json.message.content })}\n\n`);
              }
              if (json.done) {
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
              }
            } catch {
              // skip parse errors
            }
          }
        }
        res.end();
      } else {
        const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: model ?? "deepseek-r1:8b", messages, stream: false }),
        });
        const data = await resp.json();
        res.json(data);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/embed", async (req, res) => {
    try {
      const { input, model } = req.body;
      const resp = await fetch(`${OLLAMA_URL}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model ?? "nomic-embed-text", input }),
      });
      const data = await resp.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
