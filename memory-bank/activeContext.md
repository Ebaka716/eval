# activeContext.md

## Current Focus
- Evaluator flow MVP: randomized scenario, prompt editor, evaluation modal
- Robust JSON parsing/normalization; clear UI feedback for errors
- Componentization and shared contracts (scenarios, dimensions, rubric)
- Model‑synthesized overall rationale for concise summary

## Recent Changes
- Extracted UI components: `ScenarioHeader`, `PromptEditor`, `EvaluationDialog`, `SegmentedBar`
- Shared modules: `src/lib/promptlab/scenarios.ts`, `src/lib/promptlab/dimensions.ts`
- API `/api/promptlab/evaluate` now requires `scenarioId` and performs server‑side scenario lookup
- Centralized rubric/dimension keys; single source of truth for UI and API
- Added `overallRationale` to schema; updated system prompt and API to request/return it
- Evaluator page now sends only `scenarioId` + `userPrompt`; displays overall rationale with fallback
- UI polish: centered scenario section with increased vertical spacing; kept editor left‑aligned

## Next Steps
- Add agent settings (reasoning effort, eagerness, context budget)
- Persist attempts and score history (choose Supabase/Prisma)
- Improve scenario set and taxonomy
- Consider prefill option from scenario template (opt‑in)
- Add caching/rate limiting; optional model toggle (quality vs cost)

## Decisions & Preferences
- Schema-first contracts; JSON responses rendered directly in UI
- Keep modes symmetrical in request shape
- Centralize constants (dimensions/rubric) and scenarios for consistency
- Prefer server‑side lookup by `scenarioId` to avoid client tampering and reduce payloads
- Preserve stable dimension keys; UI derives rubric text from shared map

## Insights
- Clear rubrics improve user trust and learning velocity
- Structured outputs enable powerful progress dashboards
- Single synthesized overall rationale improves scannability vs concatenated per‑dimension comments
