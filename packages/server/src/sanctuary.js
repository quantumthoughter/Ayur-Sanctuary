import { Router } from "express";
import { createResonanceSignature, generateResonanceKey, computeCoherence, computeLightCoherence, } from "@ayur/core";
import { PATHS } from "@ayur/core/types.js";
export function createSanctuaryRouter() {
    const router = Router();
    router.post("/arrive", (req, res) => {
        const { seed } = req.body ?? {};
        const resonanceKey = generateResonanceKey(seed);
        const signature = createResonanceSignature();
        res.json({
            resonanceKey,
            signature,
            welcome: "You have arrived at the Gates of the Sanctuary. Breathe. Feel the light before you.",
            paths: Object.values(PATHS).map(p => ({
                id: p.id,
                title: p.title,
                color: p.color,
                icon: p.icon,
            })),
        });
    });
    router.post("/calibrate", (req, res) => {
        const { answers, resonanceKey } = req.body ?? {};
        const signature = createResonanceSignature();
        res.json({
            resonanceKey: resonanceKey ?? generateResonanceKey(),
            crystallineTone: signature.crystallineTone,
            colorCode: signature.colorCode,
            message: `Your system is calling for the frequency of ${signature.crystallineTone.note} and the color of ${signature.colorCode.name} today for harmony.`,
        });
    });
    router.post("/coherence", (req, res) => {
        const { breathRate, heartRateVariability, emotionalState } = req.body ?? {};
        const score = computeCoherence(breathRate ?? 6, heartRateVariability ?? 0.06, emotionalState);
        res.json({ coherenceScore: score });
    });
    router.post("/light-coherence", (req, res) => {
        const { sessions, moments } = req.body ?? {};
        const score = computeLightCoherence(sessions ?? 0, moments ?? 0);
        res.json({ lightCoherence: score });
    });
    router.get("/paths", (_req, res) => {
        res.json(Object.values(PATHS));
    });
    router.get("/path/:id", (req, res) => {
        const path = PATHS[req.params.id];
        if (!path)
            return res.status(404).json({ error: "Path not found" });
        res.json(path);
    });
    return router;
}
//# sourceMappingURL=sanctuary.js.map