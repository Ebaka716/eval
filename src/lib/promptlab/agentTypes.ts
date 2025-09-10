import { z } from "zod";

export const AgentBlockTypeEnum = z.enum(["Input", "Prompt", "Transform", "Output"]);
export type AgentBlockType = z.infer<typeof AgentBlockTypeEnum>;

export const AgentBlockBase = z.object({
  id: z.string(),
  type: AgentBlockTypeEnum,
  label: z.string().optional(),
  enabled: z.boolean().optional().default(true),
});

export const InputBlock = AgentBlockBase.extend({
  type: z.literal("Input"),
  settings: z.object({ value: z.union([z.string(), z.record(z.any())]) }),
});

export const PromptBlock = AgentBlockBase.extend({
  type: z.literal("Prompt"),
  inputs: z
    .object({
      vars: z.record(z.string()).default({}), // { varName: pathString }
    })
    .default({ vars: {} }),
  settings: z.object({
    template: z.string(),
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().positive().optional(),
  }),
});

export const TransformBlock = AgentBlockBase.extend({
  type: z.literal("Transform"),
  inputs: z.object({ data: z.string().optional() }).default({}),
  settings: z
    .object({
      picks: z.array(z.string()).optional(),
      rename: z.record(z.string()).optional(),
    })
    .default({}),
});

export const OutputBlock = AgentBlockBase.extend({
  type: z.literal("Output"),
  inputs: z.object({ data: z.string().optional() }).default({}),
  settings: z.object({ fields: z.array(z.string()).optional() }).default({}),
});

export const AgentBlock = z.discriminatedUnion("type", [InputBlock, PromptBlock, TransformBlock, OutputBlock]);
export type AgentBlock = z.infer<typeof AgentBlock>;

export const AgentSettings = z.object({
  model: z.string().default("gpt-4o"),
  temperature: z.number().min(0).max(2).default(0.3),
  maxTokens: z.number().int().positive().default(800),
});
export type AgentSettings = z.infer<typeof AgentSettings>;

export const AgentRunRequest = z.object({
  agentSettings: AgentSettings.optional(),
  blocks: z.array(AgentBlock).min(1),
  endIndex: z.number().int().nonnegative().optional(),
});
export type AgentRunRequest = z.infer<typeof AgentRunRequest>;

export const BlockLog = z.object({
  id: z.string(),
  type: AgentBlockTypeEnum,
  label: z.string().optional(),
  status: z.enum(["ok", "error"]).default("ok"),
  startedAt: z.number(),
  endedAt: z.number(),
  durationMs: z.number(),
  promptPreview: z.string().optional(),
  outputPreview: z.string().optional(),
  error: z.string().optional(),
});
export type BlockLog = z.infer<typeof BlockLog>;

export const AgentRunResponse = z.object({
  logs: z.array(BlockLog),
  variables: z.record(z.any()),
});
export type AgentRunResponse = z.infer<typeof AgentRunResponse>;

// Utility: resolve a dotted path like "blockId.key" from the variables store
export function resolvePath(store: Record<string, unknown>, path?: string): unknown {
  if (!path) return undefined;
  const parts = String(path).split(".");
  let current: unknown = store;
  for (const p of parts) {
    if (current === null || typeof current !== "object") return undefined;
    const obj = current as Record<string, unknown>;
    current = obj[p];
  }
  return current;
}


