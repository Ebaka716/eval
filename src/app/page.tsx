import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="p-6 space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold">PromptLab</h1>
        <p className="text-muted-foreground text-sm">
          Learn, practice, and evaluate AI prompting skills with clear rubrics and reusable patterns.
        </p>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Project brief</CardTitle>
            <CardDescription>
              An interactive platform to teach prompt chaining, evaluate workflows, and track progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Two modes: Evaluator (score with rubric) and Prompt Builder (design workflows).</li>
              <li>Structured outputs (JSON/Markdown) for dashboards and learning.</li>
              <li>Reusable templates, guardrails, and scenario-driven practice.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evaluator</CardTitle>
            <CardDescription>Score your prompt against a 1–5 rubric and see rationales.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/prompt">
              <Button size="sm">Open Evaluator</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Builder</CardTitle>
            <CardDescription>Design multi‑step prompt workflows (coming soon).</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/builder">
              <Button variant="ghost" size="sm">Open Builder</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What we’ve built</CardTitle>
            <CardDescription>Current functionality and UI</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Randomized scenarios, user‑typed prompt editor, and submit flow.</li>
              <li>LLM evaluation via OpenAI (gpt‑4o) with strict JSON validation.</li>
              <li>Per‑dimension scores with segmented bars and rationales.</li>
              <li>Rubric tab and Best practices modal.</li>
              <li>Global nav with Evaluator and Builder.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Planned improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Prompt Builder: multi‑step workflow editor with guardrails.</li>
              <li>Configurable agent settings (reasoning effort, eagerness, budget).</li>
              <li>Persistence of attempts and score history.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
