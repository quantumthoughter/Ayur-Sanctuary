import { v4 as uuid } from "uuid";
import * as fs from "fs";
import * as path from "path";
export const DEFAULT_CONFIG = {
    dataDir: path.resolve(process.cwd(), "data"),
    embeddingUrl: "http://localhost:11434/api/embed",
    embeddingModel: "nomic-embed-text",
    dimension: 768,
    defaultImportance: 0.5,
    minStrength: 0.05,
    decayRate: 0.05,
    consolidationThreshold: 0.88,
};
export class SanctuaryMemory {
    engrams = new Map();
    filePath;
    dirty = false;
    saveTimer = null;
    config;
    constructor(config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.filePath = path.join(this.config.dataDir, "sanctuary-engrams.json");
        this.ensureDataDir();
        this.load();
    }
    ensureDataDir() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    load() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
                for (const e of data) {
                    this.engrams.set(e.id, e);
                }
            }
        }
        catch {
            this.engrams.clear();
        }
    }
    persist() {
        this.dirty = true;
        if (this.saveTimer)
            clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            if (!this.dirty)
                return;
            this.dirty = false;
            const data = Array.from(this.engrams.values());
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
        }, 200);
    }
    toRecord(e) {
        return {
            id: e.id,
            content: e.content,
            contentPreview: e.content.slice(0, 200),
            importance: e.importance,
            strength: e.strength,
            bloomScore: e.strength * e.importance,
            tags: e.tags,
            accessCount: e.accessCount,
            createdAt: e.createdAt,
            lastAccessed: e.lastAccessed,
            resonanceKey: e.resonanceKey,
            pathId: e.pathId,
        };
    }
    cosineSim(a, b) {
        let dot = 0, na = 0, nb = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            na += a[i] * a[i];
            nb += b[i] * b[i];
        }
        return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
    }
    async embed(text) {
        try {
            const resp = await fetch(this.config.embeddingUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: this.config.embeddingModel, input: text }),
                signal: AbortSignal.timeout(5000),
            });
            if (resp.ok) {
                const data = await resp.json();
                return data.embeddings?.[0] ?? this.fallbackEmbed(text);
            }
        }
        catch {
            // fall through
        }
        return this.fallbackEmbed(text);
    }
    fallbackEmbed(text) {
        const dim = this.config.dimension;
        const arr = new Array(dim).fill(0);
        for (let i = 0; i < text.length; i++) {
            arr[i % dim] += text.charCodeAt(i) / 255;
        }
        const mag = Math.sqrt(arr.reduce((s, v) => s + v * v, 0)) || 1;
        return arr.map(v => v / mag);
    }
    async store(content, options) {
        const embedding = await this.embed(content);
        const engram = {
            id: uuid(),
            content,
            embedding,
            importance: options?.importance ?? this.config.defaultImportance,
            strength: 1.0,
            tags: options?.tags ?? [],
            accessCount: 1,
            createdAt: Date.now() / 1000,
            lastAccessed: Date.now() / 1000,
            resonanceKey: options?.resonanceKey,
            pathId: options?.pathId,
        };
        this.engrams.set(engram.id, engram);
        this.persist();
        return engram.id;
    }
    async recall(query, topK = 5, minStrength = 0.01) {
        const queryEmb = await this.embed(query);
        const now = Date.now() / 1000;
        const scored = [];
        for (const e of this.engrams.values()) {
            if (e.strength < minStrength)
                continue;
            const sim = this.cosineSim(queryEmb, e.embedding);
            const bloomScore = sim * e.strength * e.importance;
            scored.push({ score: bloomScore, record: this.toRecord(e), raw: e });
        }
        scored.sort((a, b) => b.score - a.score);
        const top = scored.slice(0, topK);
        for (const { raw } of top) {
            raw.accessCount += 1;
            raw.strength = Math.min(raw.strength + 0.03, 1.0);
            raw.lastAccessed = now;
        }
        if (top.length > 0)
            this.persist();
        return top.map(t => t.record);
    }
    list(limit = 20, offset = 0) {
        return Array.from(this.engrams.values())
            .map(e => this.toRecord(e))
            .sort((a, b) => b.bloomScore - a.bloomScore)
            .slice(offset, offset + limit);
    }
    get(id) {
        const e = this.engrams.get(id);
        return e ? this.toRecord(e) : undefined;
    }
    delete(id) {
        const ok = this.engrams.delete(id);
        if (ok)
            this.persist();
        return ok;
    }
    clear() {
        this.engrams.clear();
        this.persist();
    }
    stats() {
        const values = Array.from(this.engrams.values());
        return {
            total: values.length,
            avgStrength: values.reduce((s, e) => s + e.strength, 0) / (values.length || 1),
            avgImportance: values.reduce((s, e) => s + e.importance, 0) / (values.length || 1),
            totalAccesses: values.reduce((s, e) => s + e.accessCount, 0),
        };
    }
    async decay(rate = 0.05) {
        const now = Date.now() / 1000;
        let decayed = 0, removed = 0;
        for (const [id, e] of this.engrams) {
            const daysSince = (now - e.lastAccessed) / 86400;
            if (daysSince > 14) {
                this.engrams.delete(id);
                removed++;
            }
            else if (daysSince > 3) {
                e.strength = Math.max(e.strength * (1 - rate * daysSince / 7), 0);
                if (e.strength < this.config.minStrength) {
                    this.engrams.delete(id);
                    removed++;
                }
                else {
                    decayed++;
                }
            }
        }
        if (removed > 0 || decayed > 0)
            this.persist();
        return { decayed, removed };
    }
    async consolidate(threshold = 0.88) {
        const values = Array.from(this.engrams.values());
        let merged = 0, into = 0;
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                const sim = this.cosineSim(values[i].embedding, values[j].embedding);
                if (sim > threshold) {
                    const a = values[i], b = values[j];
                    const weightA = a.importance * a.accessCount;
                    const weightB = b.importance * b.accessCount;
                    const total = weightA + weightB;
                    const mergedEmbedding = a.embedding.map((v, k) => (v * weightA + b.embedding[k] * weightB) / total);
                    const mergedEngram = {
                        id: uuid(),
                        content: `[consolidated]\n${a.content}\n\n---\n\n${b.content}`,
                        embedding: mergedEmbedding,
                        importance: Math.max(a.importance, b.importance),
                        strength: 1.0,
                        tags: [...new Set([...a.tags, ...b.tags])],
                        accessCount: a.accessCount + b.accessCount,
                        createdAt: Math.min(a.createdAt, b.createdAt),
                        lastAccessed: Date.now() / 1000,
                    };
                    this.engrams.delete(a.id);
                    this.engrams.delete(b.id);
                    this.engrams.set(mergedEngram.id, mergedEngram);
                    merged += 2;
                    into++;
                }
            }
        }
        if (merged > 0)
            this.persist();
        return { merged, into };
    }
}
//# sourceMappingURL=memory.js.map