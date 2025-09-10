import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="p-6 space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold">PromptLab</h1>
        <p className="text-muted-foreground text-sm">The fast lane to better prompts, clearer workflows, and demo‑ready agent flows.</p>
      </section>

      {/* Evaluator */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Evaluator</CardTitle>
            <CardDescription>Instant, structured feedback on your prompt — like a friendly (but honest) editor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Write a prompt, get a rubric‑based score (1–5) across clarity, grounding, sequencing, guardrails, outcome quality, originality, and efficiency — plus a concise overall rationale.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Business value</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Standardize prompt quality across teams with a transparent rubric.</li>
                  <li>Reduce iteration time; ship docs, drafts, and analyses faster.</li>
                  <li>Create repeatable quality bars for onboarding and QA.</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium">Learning outcomes</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>See exactly which dimensions need work and why.</li>
                  <li>Build prompt “muscle memory” with evidence and suggestions.</li>
                  <li>Level up with stretch ideas without getting overwhelmed.</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/prompt">
              <Button variant="secondary" size="sm">Open Evaluator</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Prompt Builder */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Prompt Builder</CardTitle>
            <CardDescription>Design multi‑step prompts with proven frameworks — no more spaghetti prompts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Compose prompts using ICE, CRISPE, or CRAFT blocks. Preview the live prompt, copy it, or download as a .txt for your playbook.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Business value</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Create reusable templates that scale across teams and use cases.</li>
                  <li>Speed up delivery with shared patterns and consistent outputs.</li>
                  <li>Reduce risk by baking guardrails and structure into every prompt.</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium">Learning outcomes</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Internalize best‑practice scaffolds (instructions, context, examples).</li>
                  <li>See how small tweaks change clarity and results in real time.</li>
                  <li>Graduate from “one big prompt” to modular, maintainable design.</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/builder">
              <Button variant="secondary" size="sm">Open Builder</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Agent Runner */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Agent Runner</CardTitle>
            <CardDescription>String prompts together like LEGO — run step‑by‑step with visible handoffs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Build a simple agentic chain: input context → summarize → draft. Edit each step with a pencil, run it, and watch variables flow forward. A vertical progress bar shows milestones; logs live in a modal.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Business value</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Demo agent workflows quickly to stakeholders — no custom tooling required.</li>
                  <li>De‑risk automation by validating steps, handoffs, and guardrails early.</li>
                  <li>Make experimentation safe and measurable with per‑step logs.</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium">Learning outcomes</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Understand chaining: how one output becomes the next input.</li>
                  <li>Practice per‑step iteration without losing the bigger picture.</li>
                  <li>See cost, latency, and quality trade‑offs per step.</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/runner">
              <Button variant="secondary" size="sm">Open Runner</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
