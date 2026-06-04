const API_BASE = "/api";

export async function apiArrive(seed?: string) {
  const resp = await fetch(`${API_BASE}/sanctuary/arrive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed }),
  });
  return resp.json();
}

export async function apiCalibrate(answers: Record<string, string>, resonanceKey?: string) {
  const resp = await fetch(`${API_BASE}/sanctuary/calibrate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, resonanceKey }),
  });
  return resp.json();
}

export async function apiCoherence(breathRate: number, heartRateVariability: number, emotionalState?: string) {
  const resp = await fetch(`${API_BASE}/sanctuary/coherence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ breathRate, heartRateVariability, emotionalState }),
  });
  return resp.json();
}

export async function apiOllamaChat(model: string, messages: { role: string; content: string }[], stream = true) {
  const resp = await fetch(`${API_BASE}/ollama/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream }),
  });

  if (!stream) return resp.json();

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          try {
            const data = JSON.parse(line.slice(6));
            yield data;
          } catch { /* skip */ }
        }
      }
    },
  };
}

export async function apiDeepSeekChat(messages: { role: string; content: string }[], stream = true) {
  const resp = await fetch(`${API_BASE}/deepseek/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, stream }),
  });

  if (!stream) return resp.json();

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          try {
            const data = JSON.parse(line.slice(6));
            yield data;
          } catch { /* skip */ }
        }
      }
    },
  };
}

export async function apiStoreMemory(content: string, tags?: string[], resonanceKey?: string, pathId?: string) {
  const resp = await fetch(`${API_BASE}/memory/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, tags, resonanceKey, pathId }),
  });
  return resp.json();
}

export async function apiRecallMemory(query: string, topK = 5) {
  const resp = await fetch(`${API_BASE}/memory/recall`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, topK }),
  });
  return resp.json();
}
