export type BlockType =
  | "role"
  | "task"
  | "context"
  | "constraints"
  | "steps"
  | "output_format"
  | "guardrails"
  | "examples"
  | "variables"
  | "evaluation_check";

export type BlockField = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

export type BlockDefinition = {
  type: BlockType;
  title: string;
  description?: string;
  fields: BlockField[];
};

export type CanvasBlock = {
  instanceId: string;
  type: BlockType;
  data: Record<string, string>;
};

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "role",
    title: "Role",
    description: "Who the AI should act as.",
    fields: [
      { key: "role", label: "Role description", placeholder: "You are an expert {domain_expert} helping {audience}." },
    ],
  },
  {
    type: "task",
    title: "Task",
    description: "One-sentence directive.",
    fields: [{ key: "task", label: "Task statement", placeholder: "Your task is to {main_objective}." }],
  },
  {
    type: "context",
    title: "Context",
    description: "Background, inputs, audience.",
    fields: [
      {
        key: "context",
        label: "Context",
        multiline: true,
        placeholder: "The audience is …; inputs include …; important background …",
      },
    ],
  },
  {
    type: "constraints",
    title: "Constraints",
    description: "Tone, limits, must/avoid.",
    fields: [
      { key: "constraints", label: "Constraints", multiline: true, placeholder: "Tone: …; Length: …; Avoid: …" },
    ],
  },
  {
    type: "steps",
    title: "Steps / Process",
    description: "Explicit ordered steps.",
    fields: [
      {
        key: "steps",
        label: "Steps (numbered)",
        multiline: true,
        placeholder: "1) …\n2) …\n3) …",
      },
    ],
  },
  {
    type: "output_format",
    title: "Output Format",
    description: "Expected structure of the answer.",
    fields: [
      {
        key: "format",
        label: "Format",
        multiline: true,
        placeholder: "Return Markdown with sections: …",
      },
    ],
  },
  {
    type: "guardrails",
    title: "Guardrails / Verification",
    description: "Checks, schemas, references.",
    fields: [
      {
        key: "guardrails",
        label: "Guardrails",
        multiline: true,
        placeholder: "Validate against schema …; verify citations …",
      },
    ],
  },
  {
    type: "examples",
    title: "Examples / Few-shot",
    description: "Examples and counterexamples.",
    fields: [
      {
        key: "examples",
        label: "Examples",
        multiline: true,
        placeholder: "Good: …\nBad: …",
      },
    ],
  },
  {
    type: "variables",
    title: "Variables / Placeholders",
    description: "Reusable parameters.",
    fields: [
      {
        key: "variables",
        label: "Variables",
        multiline: true,
        placeholder: "{audience}: …\n{topic}: …",
      },
    ],
  },
  {
    type: "evaluation_check",
    title: "Evaluation Check",
    description: "Self-check before finalizing.",
    fields: [
      {
        key: "check",
        label: "Checklist",
        multiline: true,
        placeholder: "- Each claim supported?\n- Structure matches format?\n- Jargon defined?",
      },
    ],
  },
];

export function assemblePrompt(blocks: CanvasBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "role":
        if (b.data.role?.trim()) parts.push(`[ROLE]\n${b.data.role.trim()}`);
        break;
      case "task":
        if (b.data.task?.trim()) parts.push(`[TASK]\n${b.data.task.trim()}`);
        break;
      case "context":
        if (b.data.context?.trim()) parts.push(`[CONTEXT]\n${b.data.context.trim()}`);
        break;
      case "constraints":
        if (b.data.constraints?.trim()) parts.push(`[CONSTRAINTS]\n${b.data.constraints.trim()}`);
        break;
      case "steps":
        if (b.data.steps?.trim()) parts.push(`[PROCESS]\n${b.data.steps.trim()}`);
        break;
      case "output_format":
        if (b.data.format?.trim()) parts.push(`[OUTPUT FORMAT]\n${b.data.format.trim()}`);
        break;
      case "guardrails":
        if (b.data.guardrails?.trim()) parts.push(`[GUARDRAILS]\n${b.data.guardrails.trim()}`);
        break;
      case "examples":
        if (b.data.examples?.trim()) parts.push(`[EXAMPLES]\n${b.data.examples.trim()}`);
        break;
      case "variables":
        if (b.data.variables?.trim()) parts.push(`[VARIABLES]\n${b.data.variables.trim()}`);
        break;
      case "evaluation_check":
        if (b.data.check?.trim()) parts.push(`[EVALUATION CHECK]\n${b.data.check.trim()}`);
        break;
    }
  }
  return parts.join("\n\n");
}

export function exportConfig(blocks: CanvasBlock[]) {
  return blocks.map((b) => ({ type: b.type, data: b.data }));
}


