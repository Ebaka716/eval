# techContext.md

## Technologies
- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui (dialog, tabs, accordion, textarea, badge, tooltip)
- OpenAI API (gpt-4o, JSON mode)
- Optional: Supabase + Prisma (not yet)

## Development Setup
- Node 18+
- `npm run dev` for local
- Environment variables for LLM keys and DB

## Constraints
- Schema-validated API responses with Zod
- Costs for LLM usage; prefer compact prompts and batching
- Privacy: avoid storing sensitive user data unless required

## Dependencies & Usage Patterns
- Zod for schemas; server normalization of model output
- OpenAI SDK for LLM calls (`chat.completions` JSON mode)
- API route `/api/promptlab/evaluate` accepts scenario text and user prompt
- API route `/api/promptlab/runner` accepts block list + agent settings; executes Input/Prompt/Transform/Output sequentially; returns logs + variables
