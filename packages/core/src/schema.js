import { z } from "zod";
export const CrystallineToneSchema = z.object({
    frequency: z.number().positive(),
    note: z.string(),
    color: z.string(),
    name: z.string(),
});
export const ColorCodeSchema = z.object({
    hex: z.string(),
    rgb: z.tuple([z.number(), z.number(), z.number()]),
    name: z.string(),
});
export const ResonanceSignatureSchema = z.object({
    id: z.string().uuid(),
    crystallineTone: CrystallineToneSchema,
    colorCode: ColorCodeSchema,
    primaryPath: z.enum([
        "stillness", "harmonic", "detox", "somatic", "celestial", "union",
    ]),
    coherenceScore: z.number().min(0).max(1),
    createdAt: z.string().datetime(),
});
export const SessionFlowSchema = z.object({
    sessionId: z.string(),
    resonanceKey: z.string(),
    pathsVisited: z.array(z.enum([
        "stillness", "harmonic", "detox", "somatic", "celestial", "union",
    ])),
    coherenceMoments: z.number().int().nonnegative(),
    lightCoherence: z.number().min(0).max(100),
    startedAt: z.string().datetime(),
    lastActivity: z.string().datetime(),
});
export const EngramSchema = z.object({
    id: z.string().uuid(),
    content: z.string(),
    embedding: z.array(z.number()),
    importance: z.number().min(0).max(1),
    strength: z.number().min(0).max(1),
    tags: z.array(z.string()),
    accessCount: z.number().int().nonnegative(),
    createdAt: z.number(),
    lastAccessed: z.number(),
    resonanceKey: z.string().optional(),
    pathId: z.enum([
        "stillness", "harmonic", "detox", "somatic", "celestial", "union",
    ]).optional(),
});
export const ChatMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    timestamp: z.string().datetime().optional(),
});
export const ChatSessionSchema = z.object({
    sessionId: z.string(),
    messages: z.array(ChatMessageSchema),
    resonanceKey: z.string().optional(),
    pathId: z.enum([
        "stillness", "harmonic", "detox", "somatic", "celestial", "union",
    ]).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export const BreathSessionSchema = z.object({
    duration: z.number().positive(),
    pattern: z.enum(["box", "4-7-8", "ujjayi", "free", "coherent"]),
    rate: z.number().positive(),
    coherenceScore: z.number().min(0).max(1),
    timestamp: z.string().datetime(),
});
//# sourceMappingURL=schema.js.map