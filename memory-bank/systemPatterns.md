# systemPatterns.md

## Architecture Overview
- Next.js App Router for UI and API routes
- API route `/api/promptlab/evaluate` handles rubric scoring (EVALUATOR mode)
- Client components render editor and results modal; server route calls OpenAI
- shadcn/ui for consistent, composable components (dialog, tabs, accordion, textarea, etc.)

## Key Technical Decisions
- System prompt encodes roles/modes and rubric definitions
- OpenAI JSON mode (`response_format: json_object`) for structured output
- Zod validation of the Evaluation JSON; server normalization for dimension keys
- Segmented 5-part visual bars for scores (instead of continuous progress)
- Pluggable persistence planned; not implemented yet

## Design Patterns
- Schema-first contracts with Zod and server-side normalization
- Error surfaced in UI dialog; no silent failures
- Simple client state (React state) for editor and results
- Global layout with shared header navigation

## Component Relationships
- Header nav → links to Evaluator and Prompt Builder
- Evaluator → Scenario (randomized) + Textarea + Submit
- Results modal → Tabs (Results | Rubric), segmented bars, per-dimension rationale
- Best practices modal → prompt structure guidance and template

## Critical Paths
1. User types prompt → POST to `/api/promptlab/evaluate` → validate/normalize JSON → render scores
2. Future: Prompt Builder → compose steps and guardrails → run sheet
