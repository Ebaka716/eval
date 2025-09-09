import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export const runtime = "nodejs";
import { z } from "zod";
import { EvaluationSchema } from "@/lib/promptlab/schemas";
import { PROMPTLAB_SYSTEM_PROMPT } from "@/lib/promptlab/systemPrompt";

const RequestSchema = z.object({
  scenarioId: z.string().optional(),
  scenarioText: z.string(),
  userPrompt: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", issues: parsed.error.format() }, { status: 400 });
    }

    const { scenarioText, userPrompt } = parsed.data;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!client.apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const rubric = `Rubric v1.0 Dimensions (1–5):\n1. Prompt Clarity\n2. Context & Grounding\n3. Sequencing & Modularity\n4. Guarding & Verification\n5. Outcome Quality\n6. Originality & Innovation\n7. Efficiency\nAnchors: 5=exemplary; 3=workable; 1=unclear/risky.`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: PROMPTLAB_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          `MODE: EVALUATOR\nSCENARIO: ${scenarioText}\nSUBMISSION:\n${userPrompt}\n\nReturn ONLY JSON with keys: overallScore (1-5 int), dimensions (array of {key,label,score:int,comments?:string}), evidence (array of strings), suggestions (>=2 strings), stretchIdea (string).\nUse EXACT dimension keys: clarity, context, sequencing, guarding, outcome, originality, efficiency. Do NOT use numbers for keys.\nInclude at least 2 suggestions and a stretch idea. Rubric: ${rubric}`,
      },
    ];

    let response;
    try {
      response = await client.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        response_format: { type: "json_object" },
        messages,
      });
    } catch (e) {
      const err = e as unknown as { error?: { message?: string }; message?: string; status?: number };
      console.error("OpenAI API error", err);
      const msg = (err?.error?.message || err?.message || "OpenAI request failed").toString();
      const status = Number(err?.status || 502);
      return NextResponse.json({ error: "OpenAI error", message: msg }, { status });
    }

    const text = response.choices[0]?.message?.content ?? "{}";
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Model returned non-JSON output." }, { status: 502 });
    }

    // Normalize model output (coerce numeric keys to canonical strings, clamp scores)
    const DIMENSION_MAP: Record<number, { key: string; label: string }> = {
      1: { key: "clarity", label: "Prompt Clarity" },
      2: { key: "context", label: "Context & Grounding" },
      3: { key: "sequencing", label: "Sequencing & Modularity" },
      4: { key: "guarding", label: "Guarding & Verification" },
      5: { key: "outcome", label: "Outcome Quality" },
      6: { key: "originality", label: "Originality & Innovation" },
      7: { key: "efficiency", label: "Efficiency" },
    };

    type RawDimension = { key: string | number; label?: string; score: number | string; comments?: string };
    type RawPayload = {
      overallScore?: number | string;
      dimensions?: RawDimension[];
      evidence?: unknown[];
      suggestions?: unknown[];
      stretchIdea?: unknown;
    };

    const raw = parsedJson as RawPayload;
    const rawDims: RawDimension[] = Array.isArray(raw?.dimensions) ? raw.dimensions : [];
    const normalizedDims = rawDims.map((d: RawDimension) => {
      let key = d?.key;
      let label = d?.label;
      const scoreNum = Math.max(1, Math.min(5, parseInt(String(d?.score), 10) || 0));
      if (typeof key === "number") {
        const mapped = DIMENSION_MAP[key];
        if (mapped) {
          key = mapped.key;
          if (!label) label = mapped.label;
        } else {
          key = String(key);
        }
      }
      if (typeof key !== "string") {
        const labelStr = typeof label === "string" ? label : String(label ?? "");
        key = labelStr ? labelStr.toLowerCase().split(" ")[0] : "unknown";
      }
      if (typeof label !== "string") {
        // If label missing, synthesize from key
        const backfill = Object.values(DIMENSION_MAP).find((m) => m.key === key)?.label;
        label = backfill ?? key;
      }
      return {
        key,
        label,
        score: scoreNum,
        comments: typeof d?.comments === "string" ? d.comments : undefined,
      };
    });

    const normalized = {
      overallScore: Math.max(1, Math.min(5, parseInt(String(raw?.overallScore), 10) || 0)),
      dimensions: normalizedDims,
      evidence: Array.isArray(raw?.evidence) ? raw.evidence.filter((e): e is string => typeof e === "string") : [],
      suggestions: Array.isArray(raw?.suggestions) ? raw.suggestions.filter((e): e is string => typeof e === "string") : [],
      stretchIdea: typeof raw?.stretchIdea === "string" ? (raw.stretchIdea as string) : undefined,
      meta: { model: response.model, latencyMs: Date.now() - start },
    };

    const validated = EvaluationSchema.safeParse(normalized);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid evaluation JSON", issues: validated.error.format() }, { status: 502 });
    }

    return NextResponse.json(validated.data, { status: 200 });
  } catch (err: unknown) {
    console.error("/api/promptlab/evaluate unexpected", err);
    const msg = (err as { message?: string } | undefined)?.message || "Unexpected error";
    return NextResponse.json({ error: "Unexpected error", message: msg }, { status: 500 });
  }
}


