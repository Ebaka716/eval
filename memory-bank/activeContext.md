# activeContext.md

## Current Focus
- Evaluator flow MVP: randomized scenario, prompt editor, evaluation modal
- Robust JSON parsing/normalization; clear UI feedback for errors
- Componentization and shared contracts (scenarios, dimensions, rubric)
- Model‑synthesized overall rationale for concise summary
- Framework‑driven Prompt Builder (ICE / CRISPE / CRAFT) with inline editors and live preview
- Consistent layout: centered top nav menu with left‑aligned brand; unified page shells (max‑w‑5xl, px‑6)

## Recent Changes
- Extracted UI components: `ScenarioHeader`, `PromptEditor`, `EvaluationDialog`, `SegmentedBar`
- Shared modules: `src/lib/promptlab/scenarios.ts`, `src/lib/promptlab/dimensions.ts`
- API `/api/promptlab/evaluate` now requires `scenarioId` and performs server‑side scenario lookup
- Centralized rubric/dimension keys; single source of truth for UI and API
- Added `overallRationale` to schema; updated system prompt and API to request/return it
- Evaluator page now sends only `scenarioId` + `userPrompt`; displays overall rationale with fallback
- Builder: Framework tabs (ICE/CRISPE/CRAFT), accordion blocks with inline editors and helper microcopy
  - ICE order set to Instructions → Context → Examples with tailored copy
  - CRISPE acronym mapped to Context, Role, Instruction, Subject, Preset, Exception; microcopy shown inline
  - Clear action resets a block’s fields (no deletion); live prompt + JSON preview on right
- Layout polish: centered nav menu with brand at left; standardized page width and horizontal padding
- Typography: scenario title/description use serif styling with higher weight for readability

## Next Steps
- Add agent settings (reasoning effort, eagerness, context budget)
- Persist attempts and score history (choose Supabase/Prisma)
- Improve scenario set and taxonomy
- Consider prefill option from scenario template (opt‑in)
- Add caching/rate limiting; optional model toggle (quality vs cost)
- Builder enhancements: per‑field AI suggestions, save/load configs, optional drag‑reorder, validation states

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
