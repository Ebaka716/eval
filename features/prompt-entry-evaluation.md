# Prompt Entry & Evaluation UI Plan

## Goal
Provide a simple flow for a user to:
1) Choose a starting scenario
2) Write a prompt in a large textarea
3) Submit the prompt
4) See a modal with rubric-based ratings and feedback

## Screens/Sections

### A. Scenario Display (randomized)
- Purpose: Show one randomized scenario at a time; Reload swaps it
- Components:
  - Header with Reload icon button
  - Title and description (purple hierarchy)

### B. Prompt Editor
- Purpose: Capture user's prompt clearly
- Components:
  - Form (Form, FormField, FormItem, FormLabel, FormMessage)
  - Textarea (large, monospace optional)
  - Tooltip/HoverCard for guidance
  - Button (primary) for Submit
  - Secondary actions: Clear (ghost), Copy (outline)
  - Optional: Character/Token counter (muted text)

### C. Submission & Evaluation Modal
- Purpose: Display rubric ratings and suggestions
- Components:
  - Dialog with Tabs (Results | Rubric)
  - Segmented 5-part bars (overall and per-dimension)
  - Accordion rationale per dimension; overall rationale auto-open
  - Error state shown in Dialog on failures

## Minimal Component Install List (shadcn)
- Button
- Card
- Form
- Textarea
- Dialog
- Accordion
- Tabs
- Alert
- Badge
- Tooltip (optional; replaced by modal for best practices)

## Basic UX Flow
1. User lands on page with Scenario Picker (Cards). Selects a scenario → pre-fills prompt editor with template.
2. User edits prompt in Textarea.
3. User clicks Submit (Button).
4. App calls /api/promptlab/evaluate with scenario text and user prompt.
5. On success, open Dialog showing:
   - Overall score + per-dimension segmented bars
   - Accordion with evidence and suggestions
   - Tabs with Results and Rubric
6. User can close Dialog, iterate prompt, and resubmit.

## Data Contracts (high-level)
- Request: { mode: "EVALUATOR", taskId, prompt }
- Response: { overallScore, dimensions: [{ key, label, score, comments }], evidence: string[], suggestions: string[], json: any }

## Next Steps
- Install listed components via shadcn
- Scaffold Prompt page with Scenario Picker + Prompt Editor + Submit
- Stub API with mocked evaluation JSON until LLM wired
- Wire Dialog to show stubbed evaluation
