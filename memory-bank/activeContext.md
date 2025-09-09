# activeContext.md

## Current Focus
- Evaluator flow MVP: randomized scenario, prompt editor, evaluation modal
- Robust JSON parsing and normalization; clear UI feedback for errors

## Recent Changes
- Next.js + shadcn/ui initialized
- Evaluator page with segmented bars, rubric tab, and rationale accordions
- Best practices modal; header nav with Evaluator/Builder links
- OpenAI gpt-4o integration with JSON mode and Zod validation

## Next Steps
- Add agent settings (reasoning effort, eagerness, context budget)
- Persist attempts and score history (choose Supabase/Prisma)
- Improve scenario set and taxonomy

## Decisions & Preferences
- Schema-first contracts; JSON responses rendered directly in UI
- Keep modes symmetrical in request shape

## Insights
- Clear rubrics improve user trust and learning velocity
- Structured outputs enable powerful progress dashboards
