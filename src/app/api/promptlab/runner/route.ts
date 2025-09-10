import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  AgentRunRequest,
  AgentRunResponse,
  resolvePath,
  type AgentBlock,
  type BlockLog,
} from "@/lib/promptlab/agentTypes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = await req.json();
    const parsed = AgentRunRequest.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", issues: parsed.error.format() }, { status: 400 });
    }

    const { blocks, agentSettings, endIndex } = parsed.data;
    const settings = {
      model: agentSettings?.model ?? "gpt-4o",
      temperature: agentSettings?.temperature ?? 0.3,
      maxTokens: agentSettings?.maxTokens ?? 800,
    };

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!client.apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const store: Record<string, unknown> = {};
    const logs: BlockLog[] = [];

    const lastIndex = Math.min(typeof endIndex === "number" ? endIndex : blocks.length - 1, blocks.length - 1);
    for (let i = 0; i <= lastIndex; i++) {
      const b: AgentBlock = blocks[i];
      if (b.enabled === false) continue;
      const blockStart = Date.now();
      const log: BlockLog = {
        id: b.id,
        type: b.type,
        label: ("label" in b && typeof (b as { label?: string }).label === "string") ? (b as { label?: string }).label : undefined,
        status: "ok",
        startedAt: blockStart,
        endedAt: blockStart,
        durationMs: 0,
      };
      try {
        if (b.type === "Input") {
          store[b.id] = { data: b.settings.value };
        } else if (b.type === "Prompt") {
          // Build template vars
          const vars: Record<string, unknown> = {};
          const varMap = b.inputs?.vars ?? {};
          for (const [k, path] of Object.entries(varMap)) {
            vars[k] = resolvePath(store, path);
          }
          // Simple template replacement {{var}}
          let content = b.settings.template;
          content = content.replace(/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g, (_, name: string) => {
            const v = vars[name];
            try {
              return typeof v === "string" ? v : JSON.stringify(v);
            } catch {
              return String(v);
            }
          });
          log.promptPreview = content.slice(0, 800);

          const resp = await client.chat.completions.create({
            model: b.settings.model ?? settings.model,
            temperature: b.settings.temperature ?? settings.temperature,
            max_tokens: b.settings.maxTokens ?? settings.maxTokens,
            messages: [{ role: "user", content }],
          });
          const text = resp.choices[0]?.message?.content ?? "";
          store[b.id] = { text, raw: resp };
          log.outputPreview = text.slice(0, 800);
        } else if (b.type === "Transform") {
          const inputData = resolvePath(store, b.inputs?.data || "");
          let result: unknown = inputData;
          if (b.settings?.picks && typeof inputData === "object" && inputData) {
            const picked: Record<string, unknown> = {};
            for (const k of b.settings.picks) {
              picked[k] = (inputData as Record<string, unknown>)[k];
            }
            result = picked;
          }
          if (b.settings?.rename && typeof result === "object" && result) {
            const renamed: Record<string, unknown> = {};
            for (const [from, to] of Object.entries(b.settings.rename)) {
              renamed[to] = (result as Record<string, unknown>)[from];
            }
            result = { ...result, ...renamed };
          }
          store[b.id] = { data: result };
          log.outputPreview = (() => {
            try { return JSON.stringify(result).slice(0, 800); } catch { return String(result).slice(0, 800); }
          })();
        } else if (b.type === "Output") {
          const data = resolvePath(store, b.inputs?.data || "");
          store[b.id] = { data };
          log.outputPreview = (() => {
            try { return JSON.stringify(data).slice(0, 800); } catch { return String(data).slice(0, 800); }
          })();
        }
      } catch (e) {
        log.status = "error";
        log.error = e instanceof Error ? e.message : String(e);
      } finally {
        log.endedAt = Date.now();
        log.durationMs = log.endedAt - blockStart;
        logs.push(log);
        if (log.status === "error") break;
      }
    }

    const response = AgentRunResponse.parse({ logs, variables: store });
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const msg = (err as { message?: string } | undefined)?.message || "Unexpected error";
    return NextResponse.json({ error: "Unexpected error", message: msg, startedAt }, { status: 500 });
  }
}


