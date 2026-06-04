import { Router, type Request, type Response } from "express";
import {
  createResonanceSignature,
  generateResonanceKey,
  computeCoherence,
  computeLightCoherence,
  PATHS,
  type PathId,
  type PathInfo,
} from "@asi/core";

export function createSanctuaryRouter(): Router {
  const router = Router();

  router.post("/arrive", (req: Request, res: Response) => {
    const { seed } = req.body ?? {};
    const resonanceKey = generateResonanceKey(seed);
    const signature = createResonanceSignature();
    const pathList = Object.values(PATHS);
    res.json({
      resonanceKey,
      signature,
      welcome: "You have arrived at the Gates of the Sanctuary. Breathe. Feel the light before you.",
      paths: pathList.map((p) => ({
        id: p.id,
        title: p.title,
        color: p.color,
        icon: p.icon,
      })),
    });
  });

  router.post("/calibrate", (req: Request, res: Response) => {
    const { resonanceKey } = req.body ?? {};
    const signature = createResonanceSignature();
    res.json({
      resonanceKey: resonanceKey ?? generateResonanceKey(),
      crystallineTone: signature.crystallineTone,
      colorCode: signature.colorCode,
      message: `Your system is calling for the frequency of ${signature.crystallineTone.note} and the color of ${signature.colorCode.name} today for harmony.`,
    });
  });

  router.post("/coherence", (req: Request, res: Response) => {
    const { breathRate, heartRateVariability, emotionalState } = req.body ?? {};
    const score = computeCoherence(breathRate ?? 6, heartRateVariability ?? 0.06, emotionalState);
    res.json({ coherenceScore: score });
  });

  router.post("/light-coherence", (req: Request, res: Response) => {
    const { sessions, moments } = req.body ?? {};
    const score = computeLightCoherence(sessions ?? 0, moments ?? 0);
    res.json({ lightCoherence: score });
  });

  router.get("/paths", (_req: Request, res: Response) => {
    res.json(Object.values(PATHS));
  });

  router.get("/path/:id", (req: Request, res: Response) => {
    const path = PATHS[req.params.id as keyof typeof PATHS];
    if (!path) return res.status(404).json({ error: "Path not found" });
    res.json(path);
  });

  return router;
}
