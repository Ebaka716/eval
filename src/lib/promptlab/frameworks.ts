import type { BlockType } from "@/lib/promptlab/builderTypes";

export type Framework = {
  id: "ICE" | "CRISPE" | "CRAFT";
  title: string;
  description: string;
  summary: string;
  blocks: BlockType[]; // ordered
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "ICE",
    title: "ICE",
    description: "Instruction, Context, (Few) Examples.",
    summary:
      "ICE focuses on capturing the essentials for complex, detailed tasks: a clear instruction (what to do), the context (inputs, audience, constraints), and a few targeted examples to anchor behavior. It’s simple, reliable, and reduces ambiguity while keeping prompts compact.",
    blocks: ["instructions", "context", "examples"],
  },
  {
    id: "CRISPE",
    title: "CRISPE",
    description: "6-part system with evaluation hooks.",
    summary:
      "CRISPE is designed for enterprise-grade consistency and safety. It captures capability and constraints, role, high-level instructions, explicit steps, parameters/variables, and evaluation/guardrails. The result is a robust prompt with strong verification and reusability.",
    blocks: [
      // CRISPE acronym mapping: C (Context), R (Role), I (Instruction), S (Subject), P (Preset), E (Exception)
      "context",
      "role",
      "instructions",
      "subject",
      "preset",
      "exception",
    ],
  },
  {
    id: "CRAFT",
    title: "CRAFT",
    description: "Capability, Role, Action, Format, Tone.",
    summary:
      "CRAFT emphasizes control over style and output for specialized tasks. Define what the assistant can do (capability), who it is (role), the concrete action, the output format for structure, and the tone for voice—yielding precise, on-brand results.",
    blocks: ["capability", "role", "action", "output_format", "tone"],
  },
];

export function getFramework(id: Framework["id"]): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}


