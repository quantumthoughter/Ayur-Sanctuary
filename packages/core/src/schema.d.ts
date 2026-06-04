import { z } from "zod";
export declare const CrystallineToneSchema: z.ZodObject<{
    frequency: z.ZodNumber;
    note: z.ZodString;
    color: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    frequency: number;
    note: string;
    color: string;
    name: string;
}, {
    frequency: number;
    note: string;
    color: string;
    name: string;
}>;
export declare const ColorCodeSchema: z.ZodObject<{
    hex: z.ZodString;
    rgb: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    hex: string;
    rgb: [number, number, number];
}, {
    name: string;
    hex: string;
    rgb: [number, number, number];
}>;
export declare const ResonanceSignatureSchema: z.ZodObject<{
    id: z.ZodString;
    crystallineTone: z.ZodObject<{
        frequency: z.ZodNumber;
        note: z.ZodString;
        color: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        frequency: number;
        note: string;
        color: string;
        name: string;
    }, {
        frequency: number;
        note: string;
        color: string;
        name: string;
    }>;
    colorCode: z.ZodObject<{
        hex: z.ZodString;
        rgb: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        hex: string;
        rgb: [number, number, number];
    }, {
        name: string;
        hex: string;
        rgb: [number, number, number];
    }>;
    primaryPath: z.ZodEnum<["stillness", "harmonic", "detox", "somatic", "celestial", "union"]>;
    coherenceScore: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    crystallineTone: {
        frequency: number;
        note: string;
        color: string;
        name: string;
    };
    colorCode: {
        name: string;
        hex: string;
        rgb: [number, number, number];
    };
    primaryPath: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union";
    coherenceScore: number;
    createdAt: string;
}, {
    id: string;
    crystallineTone: {
        frequency: number;
        note: string;
        color: string;
        name: string;
    };
    colorCode: {
        name: string;
        hex: string;
        rgb: [number, number, number];
    };
    primaryPath: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union";
    coherenceScore: number;
    createdAt: string;
}>;
export declare const SessionFlowSchema: z.ZodObject<{
    sessionId: z.ZodString;
    resonanceKey: z.ZodString;
    pathsVisited: z.ZodArray<z.ZodEnum<["stillness", "harmonic", "detox", "somatic", "celestial", "union"]>, "many">;
    coherenceMoments: z.ZodNumber;
    lightCoherence: z.ZodNumber;
    startedAt: z.ZodString;
    lastActivity: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    resonanceKey: string;
    pathsVisited: ("stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union")[];
    coherenceMoments: number;
    lightCoherence: number;
    startedAt: string;
    lastActivity: string;
}, {
    sessionId: string;
    resonanceKey: string;
    pathsVisited: ("stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union")[];
    coherenceMoments: number;
    lightCoherence: number;
    startedAt: string;
    lastActivity: string;
}>;
export declare const EngramSchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    embedding: z.ZodArray<z.ZodNumber, "many">;
    importance: z.ZodNumber;
    strength: z.ZodNumber;
    tags: z.ZodArray<z.ZodString, "many">;
    accessCount: z.ZodNumber;
    createdAt: z.ZodNumber;
    lastAccessed: z.ZodNumber;
    resonanceKey: z.ZodOptional<z.ZodString>;
    pathId: z.ZodOptional<z.ZodEnum<["stillness", "harmonic", "detox", "somatic", "celestial", "union"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: number;
    content: string;
    embedding: number[];
    importance: number;
    strength: number;
    tags: string[];
    accessCount: number;
    lastAccessed: number;
    resonanceKey?: string | undefined;
    pathId?: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union" | undefined;
}, {
    id: string;
    createdAt: number;
    content: string;
    embedding: number[];
    importance: number;
    strength: number;
    tags: string[];
    accessCount: number;
    lastAccessed: number;
    resonanceKey?: string | undefined;
    pathId?: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union" | undefined;
}>;
export declare const ChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    timestamp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string;
    role: "user" | "assistant" | "system";
    timestamp?: string | undefined;
}, {
    content: string;
    role: "user" | "assistant" | "system";
    timestamp?: string | undefined;
}>;
export declare const ChatSessionSchema: z.ZodObject<{
    sessionId: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant", "system"]>;
        content: z.ZodString;
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        content: string;
        role: "user" | "assistant" | "system";
        timestamp?: string | undefined;
    }, {
        content: string;
        role: "user" | "assistant" | "system";
        timestamp?: string | undefined;
    }>, "many">;
    resonanceKey: z.ZodOptional<z.ZodString>;
    pathId: z.ZodOptional<z.ZodEnum<["stillness", "harmonic", "detox", "somatic", "celestial", "union"]>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    sessionId: string;
    messages: {
        content: string;
        role: "user" | "assistant" | "system";
        timestamp?: string | undefined;
    }[];
    updatedAt: string;
    resonanceKey?: string | undefined;
    pathId?: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union" | undefined;
}, {
    createdAt: string;
    sessionId: string;
    messages: {
        content: string;
        role: "user" | "assistant" | "system";
        timestamp?: string | undefined;
    }[];
    updatedAt: string;
    resonanceKey?: string | undefined;
    pathId?: "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union" | undefined;
}>;
export declare const BreathSessionSchema: z.ZodObject<{
    duration: z.ZodNumber;
    pattern: z.ZodEnum<["box", "4-7-8", "ujjayi", "free", "coherent"]>;
    rate: z.ZodNumber;
    coherenceScore: z.ZodNumber;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    coherenceScore: number;
    timestamp: string;
    duration: number;
    pattern: "box" | "4-7-8" | "ujjayi" | "free" | "coherent";
    rate: number;
}, {
    coherenceScore: number;
    timestamp: string;
    duration: number;
    pattern: "box" | "4-7-8" | "ujjayi" | "free" | "coherent";
    rate: number;
}>;
//# sourceMappingURL=schema.d.ts.map