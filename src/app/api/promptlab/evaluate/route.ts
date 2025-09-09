import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export const runtime = "nodejs";
import { z } from "zod";
import { EvaluationSchema } from "@/lib/promptlab/schemas";
import { PROMPTLAB_SYSTEM_PROMPT } from "@/lib/promptlab/systemPrompt";
import { DIMENSIONS, RUBRIC_TEXT } from "@/lib/promptlab/dimensions";
import { getScenarioById } from "@/lib/promptlab/scenarios";

const RequestSchema = z.object({
  scenarioId: z.string(),
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

    const { scenarioId, userPrompt } = parsed.data;
    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Unknown scenarioId" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!client.apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const rubric = RUBRIC_TEXT;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: PROMPTLAB_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          `MODE: EVALUATOR\nSCENARIO TITLE: ${scenario.title}\nSCENARIO DESCRIPTION: ${scenario.description}\nSCENARIO TEMPLATE: ${scenario.template}\nSUBMISSION:\n${userPrompt}\n\nReturn ONLY JSON with keys: overallScore (1-5 int), overallRationale (string ≤ 500 chars), dimensions (array of {key,label,score:int,comments?:string}), evidence (array of strings), suggestions (>=2 strings), stretchIdea (string).\nUse EXACT dimension keys: ${DIMENSIONS.map((d) => d.key).join(", ")}. Do NOT use numbers for keys.\nOverall rationale: 2–4 sentences, no bullet points, no dimension names; synthesize strengths/weaknesses and end with one next improvement.\nInclude at least 2 suggestions and a stretch idea. Rubric: ${rubric}`,
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
      1: DIMENSIONS[0],
      2: DIMENSIONS[1],
      3: DIMENSIONS[2],
      4: DIMENSIONS[3],
      5: DIMENSIONS[4],
      6: DIMENSIONS[5],
      7: DIMENSIONS[6],
    } as const;

    type RawDimension = { key: string | number; label?: string; score: number | string; comments?: string };
    type RawPayload = {
      overallScore?: number | string;
      dimensions?: RawDimension[];
      evidence?: unknown[];
      suggestions?: unknown[];
      overallRationale?: unknown;
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
      overallRationale:
        typeof raw?.overallRationale === "string"
          ? String(raw.overallRationale).slice(0, 500)
          : undefined,
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


