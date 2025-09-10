# systemPatterns.md

## Architecture Overview
- Next.js App Router for UI and API routes
- API route `/api/promptlab/evaluate` handles rubric scoring (EVALUATOR mode)
- Client components render editor and results modal; server route calls OpenAI
- shadcn/ui for consistent, composable components (dialog, tabs, accordion, textarea, etc.)
- Shared libs for scenarios and rubric/dimensions consumed by both UI and API
- Framework definitions drive Prompt Builder (ICE/CRISPE/CRAFT)

## Key Technical Decisions
- System prompt encodes roles/modes and rubric definitions
- OpenAI JSON mode (`response_format: json_object`) for structured output
- Zod validation of the Evaluation JSON; server normalization for dimension keys
- Segmented 5-part visual bars for scores (instead of continuous progress)
- Pluggable persistence planned; not implemented yet
- Server-side scenario lookup by `scenarioId` to ensure consistent evaluation context
- Model synthesizes `overallRationale` paragraph; UI falls back to concatenated comments when missing
- Builder uses ordered framework blocks with inline editors instead of a global editor; microcopy is framework‑specific

## Design Patterns
- Schema-first contracts with Zod and server-side normalization
- Error surfaced in UI dialog; no silent failures
- Simple client state (React state) for editor and results
- Global layout with shared header navigation
- Componentized Evaluator UI (header/editor/dialog) with clean props and local concerns
- Tabs + Accordion composition for Builder: framework selection (tabs) and block editing (accordion)
- Consistent page shells (`max-w-5xl`, `px-6`) and centered nav menu with left‑aligned brand

## Component Relationships
- Header nav → links to Evaluator and Prompt Builder
- Evaluator → ScenarioHeader (randomized) + PromptEditor + Submit
- Results modal → Tabs (Results | Rubric), segmented bars, per-dimension rationale, overall rationale
- Best practices modal → prompt structure guidance and template

## Critical Paths
1. User types prompt → POST to `/api/promptlab/evaluate` → validate/normalize JSON → render scores
2. Future: Prompt Builder → compose steps and guardrails → run sheet
