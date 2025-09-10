# activeContext.md

## Current Focus
- Evaluator flow MVP: randomized scenario, prompt editor, evaluation modal
- Robust JSON parsing/normalization; clear UI feedback for errors
- Componentization and shared contracts (scenarios, dimensions, rubric)
- Model‑synthesized overall rationale for concise summary
- Framework‑driven Prompt Builder (ICE / CRISPE / CRAFT) with inline editors and live preview
- Agent Runner MVP: linear timeline with per‑step edit (modal) and Run step; vertical progress bar with milestone circles; modal run logs; inputs and results rendered inline in their steps
- Consistent layout: centered nav menu with left‑aligned brand; unified page shells (max‑w‑5xl, px‑6)

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
  - Clear action resets a block’s fields (no deletion); live prompt preview on right
  - Simplified actions: `Copy` prompt text and `Download` `.txt`; removed JSON snippet under headings; fixed header/preview layout bleed
- Agent Runner: new nav item; page shows linear Steps timeline with per‑step Run (under heading) and pencil edit opening a modal; results appear within each Prompt step; Input editor lives in its step
  - Vertical progress bar with milestone circles (Input, Summarize, Draft Email); fill snaps to current/last‑done milestone
  - Run logs moved to modal with ghost button; per‑step run hits `/api/promptlab/runner` with `endIndex`
- Layout polish: centered nav menu with brand at left; standardized page width and horizontal padding
- Typography: scenario title/description use serif styling with higher weight for readability

## Next Steps
- Add agent settings (reasoning effort, eagerness, context budget)
- Persist attempts and score history (choose Supabase/Prisma)
- Improve scenario set and taxonomy
- Consider prefill option from scenario template (opt‑in)
- Add caching/rate limiting; optional model toggle (quality vs cost)
- Builder enhancements: per‑field AI suggestions, save/load configs, optional drag‑reorder, validation states
- Agent Runner Phase 2: Validate block (Zod), basic Decision, per‑step model/temperature controls, streaming, save/share flows

## Decisions & Preferences
- Schema-first contracts; JSON responses rendered directly in UI
- Keep modes symmetrical in request shape
- Centralize constants (dimensions/rubric) and scenarios for consistency
- Prefer server‑side lookup by `scenarioId` to avoid client tampering and reduce payloads
- Preserve stable dimension keys; UI derives rubric text from shared map
- Agent Runner progress fills top→bottom with milestone circles; Input milestone counts as done when notes present; progress snaps to current running or last done step
- Edit prompts via modal to reduce timeline clutter; Run step button sits below the heading per Prompt step

## Insights
- Clear rubrics improve user trust and learning velocity
- Structured outputs enable powerful progress dashboards
- Single synthesized overall rationale improves scannability vs concatenated per‑dimension comments
- A linear "lego" flow with visible milestones and logs makes agentic chaining easier to reason about for learners
