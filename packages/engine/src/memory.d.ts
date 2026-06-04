export interface StoredEngram {
    id: string;
    content: string;
    embedding: number[];
    importance: number;
    strength: number;
    tags: string[];
    accessCount: number;
    createdAt: number;
    lastAccessed: number;
    resonanceKey?: string;
    pathId?: string;
}
export interface EngramRecord {
    id: string;
    content: string;
    contentPreview: string;
    importance: number;
    strength: number;
    bloomScore: number;
    tags: string[];
    accessCount: number;
    createdAt: number;
    lastAccessed: number;
    resonanceKey?: string;
    pathId?: string;
}
export interface MemoryConfig {
    dataDir: string;
    embeddingUrl: string;
    embeddingModel: string;
    dimension: number;
    defaultImportance: number;
    minStrength: number;
    decayRate: number;
    consolidationThreshold: number;
}
export declare const DEFAULT_CONFIG: MemoryConfig;
export declare class SanctuaryMemory {
    private engrams;
    private filePath;
    private dirty;
    private saveTimer;
    private config;
    constructor(config?: Partial<MemoryConfig>);
    private ensureDataDir;
    private load;
    private persist;
    private toRecord;
    private cosineSim;
    private embed;
    private fallbackEmbed;
    store(content: string, options?: {
        importance?: number;
        tags?: string[];
        resonanceKey?: string;
        pathId?: string;
    }): Promise<string>;
    recall(query: string, topK?: number, minStrength?: number): Promise<EngramRecord[]>;
    list(limit?: number, offset?: number): EngramRecord[];
    get(id: string): EngramRecord | undefined;
    delete(id: string): boolean;
    clear(): void;
    stats(): {
        total: number;
        avgStrength: number;
        avgImportance: number;
        totalAccesses: number;
    };
    decay(rate?: number): Promise<{
        decayed: number;
        removed: number;
    }>;
    consolidate(threshold?: number): Promise<{
        merged: number;
        into: number;
    }>;
}
//# sourceMappingURL=memory.d.ts.map