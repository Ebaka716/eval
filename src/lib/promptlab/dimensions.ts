export type DimensionMeta = { key: string; label: string };

export const DIMENSIONS: DimensionMeta[] = [
  { key: "clarity", label: "Prompt Clarity" },
  { key: "context", label: "Context & Grounding" },
  { key: "sequencing", label: "Sequencing & Modularity" },
  { key: "guarding", label: "Guarding & Verification" },
  { key: "outcome", label: "Outcome Quality" },
  { key: "originality", label: "Originality & Innovation" },
  { key: "efficiency", label: "Efficiency" },
];

export const RUBRIC_TEXT = `Rubric v1.0 Dimensions (1–5):
1. Prompt Clarity
2. Context & Grounding
3. Sequencing & Modularity
4. Guarding & Verification
5. Outcome Quality
6. Originality & Innovation
7. Efficiency
Anchors: 5=exemplary; 3=workable; 1=unclear/risky.`;

export const RUBRIC_DESCRIPTIONS: Record<string, string> = {
  clarity: "Prompt Clarity: clear intent, role, constraints, examples.",
  context: "Context & Grounding: uses provided inputs, references sources, avoids speculation.",
  sequencing: "Sequencing & Modularity: logical steps, clean handoffs, reusable templates/variables.",
  guarding: "Guarding & Verification: schemas, checklists, references, acceptance criteria.",
  outcome: "Outcome Quality: accuracy, usefulness, and fit for the business task.",
  originality: "Originality & Innovation: novel leverage without bloat.",
  efficiency: "Efficiency: minimal tokens/steps for value delivered.",
};


