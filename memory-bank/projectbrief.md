# Project Overview: PromptLab – An AI Prompt Learning & Evaluation Platform

## 1. Vision

PromptLab is an interactive web experience that helps professionals learn, practice, and evaluate AI prompting skills. The goal is to make the often-abstract practice of “prompt chaining” and “agent workflows” concrete, workplace-relevant, and progressively more advanced.

Users can:
• Explore scenario-driven tasks and write prompts.
• Build their own prompt workflows inside the app (Prompt Builder).
• Receive structured feedback from AI using a transparent rubric.
• Track their progress over time (levels, scores, suggestions, and creative sandboxing).

Think of it as a “Duolingo for prompting” that evolves into an innovation sandbox for real-world AI automation.

---

## 2. Core Use Cases
1. Evaluator – Write prompts and get rubric-based feedback.
2. Prompt Builder – Design multi-step prompt workflows.

---

## 3. Evaluation Rubric

Evaluation happens in two modes:
• EVALUATOR – AI applies a rubric and returns structured scores + comments.

Rubric Dimensions (scored 1–5):
1. Prompt Clarity (intent, constraints, examples)
2. Context & Grounding (input use, referencing, avoiding hallucination)
3. Sequencing & Modularity (logical steps, clean handoffs)
4. Guarding & Verification (schemas, error handling)
5. Outcome Quality (accuracy, usefulness, fit for task)
6. Originality & Innovation (novel applications, efficiency gains)
7. Efficiency (minimal steps/tokens for max value)

Outputs from evaluations are structured JSON, making them easy to render as progress dashboards, scorecards, and visualizations.

---

## 4. Technical Stack (MVP)
• Frontend: Next.js + shadcn/ui + Tailwind for modern, composable UI.
• Backend: API routes in Next.js for LLM calls and rubric evaluation.
• LLM Layer: System + user prompt templates for EVALUATOR.
• Data: JSON schemas for evaluations and task submissions.
• Persistence: Store user tasks, attempts, evaluations (Supabase, Prisma, or similar).
• UI Components (initial set):
  • Prompt Editor (textarea + submit)
  • Evaluator Results (scores, rationales, rubric)
  • Prompt Builder (workflow editor; planned)

---

## 5. System Requirements So Far
• System Prompt: Defines EVALUATOR behavior, rubric, and schema.
• User Prompt Template: Accepts scenario context and participant submission.
• Schemas:
  • Evaluation JSON (scored results with evidence, suggestions, and stretch ideas).
• Few-Shot Examples: Seeded for Evaluator to keep outputs consistent.

---

## 6. MVP Flow
1. User selects task (e.g., “Summarize meeting + draft email”).
2. User submits their prompt.
3. In EVALUATOR, AI scores submission → returns JSON → UI renders scores, evidence, suggestions.
5. User sees feedback, iterates, and tracks improvement.

---

## 7. Next Steps
• Implement /api/promptlab route with system + user prompts.
• Build Prompt Builder UI (workflow editor).
• Enhance Evaluator UI (agent settings, history).
• Seed initial tasks (meeting → email, policy doc → FAQ, job description → resume tailoring).
• Persist attempts + scores for longitudinal tracking.


