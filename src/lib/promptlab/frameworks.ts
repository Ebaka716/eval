import type { BlockType } from "@/lib/promptlab/builderTypes";

export type Framework = {
  id: "ICE" | "CRISPE" | "CRAFT";
  title: string;
  description: string;
  blocks: BlockType[]; // ordered
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "ICE",
    title: "ICE",
    description: "Instruction, Context, (Few) Examples. Ensures essential info for complex tasks.",
    blocks: ["task", "context", "examples"],
  },
  {
    id: "CRISPE",
    title: "CRISPE",
    description: "Enterprise prompts with built-in evaluation and consistency checks.",
    blocks: [
      "capability",
      "constraints",
      "role",
      "instructions",
      "steps",
      "variables",
      "guardrails",
    ],
  },
  {
    id: "CRAFT",
    title: "CRAFT",
    description: "Capability, Role, Action, Format, Tone for specialized tasks.",
    blocks: ["capability", "role", "action", "output_format", "tone"],
  },
];

export function getFramework(id: Framework["id"]): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}


