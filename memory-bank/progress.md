# progress.md

## What Works
- Next.js app with shadcn/ui
- Evaluator page: randomized scenarios, prompt editor, submit flow
- API: `/api/promptlab/evaluate` with OpenAI gpt-4o JSON mode
- Results modal: segmented bars, per-dimension rationale, rubric tab
- Best practices modal; global header nav
- Componentized UI (ScenarioHeader, PromptEditor, EvaluationDialog, SegmentedBar)
- Shared scenarios and rubric/dimensions modules
- Server‑side scenario lookup by `scenarioId`
- Model returns `overallRationale` (concise overall summary)
- Framework‑driven Prompt Builder with tabs (ICE/CRISPE/CRAFT), inline accordion editors, and live prompt preview
- Consistent layout across pages; centered nav menu with left‑aligned brand
- Agent Runner: Steps timeline with per‑step edit (modal) and Run; vertical progress bar with milestone circles; modal run logs; inline inputs/results per step

## What's Left
- Agent settings in UI and API mapping
- Prompt Builder UI/API
- Persistence layer decision and wiring
- Streaming and error observability
- Scenario library expansion and calibration
- Per‑field AI suggestions and validation in Builder; save/load configs
- Agent Runner Phase 2: Validate/Decision blocks, per‑step model/temperature, streaming, save/share flows

## Current Status
- Evaluator MVP implemented and usable; Prompt Builder in planning
- Contracts stabilized; UI/API sharing single rubric source
- Builder MVP scaffold implemented with framework tabs and inline editors

## Known Issues
- Popover component dependency conflict (workaround: modal)
- Need broader scenario set and calibration
- Consider API rate limits/caching to reduce LLM costs
- Next.js Turbopack root warning due to multiple lockfiles (harmless; can set `turbopack.root` or remove extra lockfile)

## Decision Evolution
- Favor Zod schemas and structured JSON outputs
- Keep evaluation rubric stable but configurable per task
- Centralized constants; server‑side scenario lookup
