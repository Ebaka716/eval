# progress.md

## What Works
- Next.js app with shadcn/ui
- Evaluator page: randomized scenarios, prompt editor, submit flow
- API: `/api/promptlab/evaluate` with OpenAI gpt-4o JSON mode
- Results modal: segmented bars, per-dimension rationale, rubric tab
- Best practices modal; global header nav

## What's Left
- Agent settings in UI and API mapping
- Prompt Builder UI/API
- Persistence layer decision and wiring

## Current Status
- Evaluator MVP implemented and usable; Prompt Builder in planning

## Known Issues
- Popover component dependency conflict (workaround: modal)
- Need broader scenario set and calibration

## Decision Evolution
- Favor Zod schemas and structured JSON outputs
- Keep evaluation rubric stable but configurable per task
