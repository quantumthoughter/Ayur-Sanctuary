import { Router } from "express";
import { SanctuaryMemory } from "@asi/engine";

const memory = new SanctuaryMemory();

export function createMemoryRouter(): Router {
  const router = Router();

  router.post("/store", async (req, res) => {
    try {
      const { content, importance, tags, resonanceKey, pathId } = req.body;
      const id = await memory.store(content, { importance, tags, resonanceKey, pathId });
      res.json({ id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/recall", async (req, res) => {
    try {
      const { query, topK } = req.body;
      const results = await memory.recall(query, topK ?? 5);
      res.json({ results });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/engrams", (_req, res) => {
    const limit = parseInt(_req.query.limit as string) || 20;
    const offset = parseInt(_req.query.offset as string) || 0;
    res.json({ engrams: memory.list(limit, offset) });
  });

  router.get("/stats", (_req, res) => {
    res.json(memory.stats());
  });

  router.post("/decay", async (req, res) => {
    const rate = req.body.rate ?? 0.05;
    const result = await memory.decay(rate);
    res.json(result);
  });

  router.post("/consolidate", async (req, res) => {
    const threshold = req.body.threshold ?? 0.88;
    const result = await memory.consolidate(threshold);
    res.json(result);
  });

  router.delete("/clear", (_req, res) => {
    memory.clear();
    res.json({ cleared: true });
  });

  return router;
}
