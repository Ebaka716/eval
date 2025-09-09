"use client";

import * as React from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";

type Scenario = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  template: string;
};

const scenarios: Scenario[] = [
  {
    id: "meeting-summary-email",
    title: "Summarize meeting → draft email",
    description: "Turn a transcript into a concise summary and a follow-up email.",
    tags: ["foundations", "chaining"],
    template:
      "You are an assistant that summarizes meetings and drafts follow-up emails.\nInput: <paste transcript>\nConstraints: 5 bullet summary, action items, tone: professional.\nOutput: Summary + Email draft.",
  },
  {
    id: "policy-to-faq",
    title: "Policy document → FAQ",
    description: "Convert a policy document into a concise FAQ for employees.",
    tags: ["foundations"],
    template:
      "You convert a policy document to FAQ entries.\nInput: <paste policy>\nConstraints: Q&A format, keep answers <120 words, cite sections.",
  },
  {
    id: "jd-to-resume",
    title: "Job description → resume tailoring",
    description: "Tailor a resume to match a target job description.",
    tags: ["innovation"],
    template:
      "You tailor a resume to a JD.\nInputs: <resume>, <JD>\nConstraints: bullet edits, highlight impact, keep truthfulness.",
  },
  {
    id: "jira-bug-report",
    title: "Notes → Jira bug report",
    description: "Turn rough notes into a clear, reproducible Jira bug report.",
    tags: ["ux", "jira", "communication"],
    template:
      "You write a Jira bug report.\nInput: <rough notes, screenshots/links>\nConstraints: Include: Summary, Environment, Steps to Reproduce, Expected, Actual, Attachments, Severity. Tone: concise, neutral.",
  },
  {
    id: "standup-update",
    title: "Notes → standup update",
    description: "Convert yesterday’s work and today’s plan into a crisp standup update.",
    tags: ["standup", "communication"],
    template:
      "You write a standup update.\nInput: <yesterday, today, blockers>\nConstraints: Format as: Yesterday, Today, Blockers. Keep each bullet ≤ 16 words. Tone: concise.",
  },
  {
    id: "pr-description",
    title: "Diff summary → PR description",
    description: "Draft a high-quality PR description from a diff summary.",
    tags: ["review", "github", "dev"],
    template:
      "You write a PR description.\nInput: <diff summary / key changes>\nConstraints: Include: Context, Changes, Screenshots/UX impact, Risks, Testing, Rollback. Use markdown headings.",
  },
  {
    id: "code-review-comment",
    title: "Terse feedback → actionable review",
    description: "Transform terse notes into constructive, actionable code review comments.",
    tags: ["review", "ux", "communication"],
    template:
      "You rewrite code review comments.\nInput: <raw notes>\nConstraints: One comment per issue with: What/Why, Suggestion, Impact. Tone: respectful, specific. Include code snippet if helpful.",
  },
  {
    id: "usability-invite-email",
    title: "Details → usability test invite email",
    description: "Compose an email inviting participants to a short usability test.",
    tags: ["ux", "research", "email"],
    template:
      "You write an invite email for a usability test.\nInput: <study purpose, time, incentive, scheduling link>\nConstraints: Subject, Greeting, 3 bullets (purpose/time/incentive), CTA link, Thank you. Tone: friendly, clear.",
  },
  {
    id: "research-to-persona",
    title: "Interview notes → provisional personas",
    description: "Summarize interview notes into 2–3 provisional personas with goals and pains.",
    tags: ["ux", "research"],
    template:
      "You create provisional personas.\nInput: <interview notes>\nConstraints: For each persona include: Name, Role, Goals, Pains, Behaviors, Key quotes. Max 3 personas.",
  },
  {
    id: "handoff-agenda",
    title: "Specs → design-dev handoff agenda",
    description: "Create a meeting agenda for a design-to-dev handoff.",
    tags: ["handoff", "meeting", "ux"],
    template:
      "You write a meeting agenda.\nInput: <feature specs, designs, open questions>\nConstraints: Sections: Objectives, Files/Links, Open Questions, Risks, Decisions Needed, Next Steps. Duration: 30–45 min.",
  },
  {
    id: "jira-acceptance-criteria",
    title: "Task → acceptance criteria (Gherkin)",
    description: "Draft acceptance criteria for a UX task using Gherkin syntax.",
    tags: ["jira", "ux", "qa"],
    template:
      "You write acceptance criteria.\nInput: <task summary / user story>\nConstraints: Provide 3–5 Given/When/Then scenarios covering happy path and key edge cases.",
  },
  {
    id: "teams-thread-summary",
    title: "Teams thread → decision log",
    description: "Summarize a Microsoft Teams thread into a decision record with follow-ups.",
    tags: ["communication", "documentation"],
    template:
      "You write a decision log entry.\nInput: <Teams thread text/links>\nConstraints: Include: Context, Decision, Rationale (quotes), Owners, Due dates, Links. Max 150 words.",
  },
  {
    id: "ux-release-notes",
    title: "Changes → UX release notes",
    description: "Create concise release notes emphasizing UX changes and impact.",
    tags: ["release", "ux", "communication"],
    template:
      "You write UX-focused release notes.\nInput: <list of merged changes / screenshots>\nConstraints: Sections: Highlights, User impact, Screens/Flows affected, Known issues. Keep bullets ≤ 14 words.",
  },
];

type DimensionScore = {
  key: string;
  label: string;
  score: number; // 1-5
  comments?: string;
};

export default function PromptPage() {
  const [currentScenario, setCurrentScenario] = React.useState<Scenario | null>(null);
  const [promptText, setPromptText] = React.useState<string>("");
  const [isEvaluating, setIsEvaluating] = React.useState<boolean>(false);
  const [showResults, setShowResults] = React.useState<boolean>(false);
  const [showBestPractices, setShowBestPractices] = React.useState<boolean>(false);
  const [overallScore, setOverallScore] = React.useState<number>(0);
  const [dimensionScores, setDimensionScores] = React.useState<DimensionScore[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const overallRationale = React.useMemo(() => {
    if (!dimensionScores.length) return "";
    return dimensionScores
      .map((d) => `${d.label}: ${d.comments ? d.comments : anchorExplanation(d.score)}`)
      .join(" ");
  }, [dimensionScores]);

  function randomizeScenario() {
    if (scenarios.length === 0) return;
    const currentId = currentScenario?.id;
    const pool = scenarios.filter((s) => s.id !== currentId);
    const source = pool.length > 0 ? pool : scenarios;
    const next = source[Math.floor(Math.random() * source.length)];
    setCurrentScenario(next);
    // Do not modify promptText; user must type their own.
  }

  React.useEffect(() => {
    randomizeScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (!promptText.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/promptlab/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: currentScenario?.id,
          scenarioText: currentScenario?.description ?? "",
          userPrompt: promptText,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Evaluation failed");
      }
      const data = await res.json();
      type ApiDimension = { key: string; label: string; score: number; comments?: string };
      const dims: DimensionScore[] = (data.dimensions as ApiDimension[] | undefined)?.map((d) => ({
        key: d.key,
        label: d.label,
        score: d.score,
        comments: d.comments,
      })) ?? [];
      const avg = data.overallScore ?? 0;
      setDimensionScores(dims);
      setOverallScore(avg);
      setErrorMsg("");
      setShowResults(true);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Evaluator</h1>
        <p className="text-muted-foreground text-sm">
          Pick a scenario, write your prompt, submit, and get rubric-based feedback.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Scenarios</h2>
          <Button variant="ghost" size="icon" aria-label="Reload scenario" onClick={randomizeScenario}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-purple-600">
            {currentScenario ? currentScenario.title : "Preparing scenario…"}
          </p>
          <p className="text-sm text-purple-500">
            {currentScenario ? currentScenario.description : "One moment while we load a scenario for you."}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="prompt" className="text-sm font-medium">
            Your prompt
          </Label>
          <Button variant="secondary" size="sm" onClick={() => setShowBestPractices(true)}>Best practices</Button>
        </div>
        <Textarea
          id="prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Write your prompt here..."
          className="min-h-[220px]"
        />
        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={isEvaluating || !promptText.trim()}>
            {isEvaluating ? "Evaluating..." : "Submit"}
          </Button>
        </div>
      </section>

      <Dialog open={showResults || !!errorMsg} onOpenChange={(open) => { setShowResults(open); if (!open) setErrorMsg(""); }}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{errorMsg ? "Evaluation Error" : "Evaluation Results"}</DialogTitle>
            <DialogDescription>
              {errorMsg ? "The evaluator encountered an issue." : "Scores based on the PromptLab rubric (1–5)."}
            </DialogDescription>
          </DialogHeader>

          {!errorMsg ? (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="rubric">Rubric</TabsTrigger>
              </TabsList>
              <TabsContent value="results">
                <div className="space-y-4">
                  <div className="p-3 rounded border">
                    <div className="mb-3 flex items-end justify-between">
                      <div className="text-base font-medium">Overall</div>
                      <div className="text-3xl font-bold leading-none">{overallScore}/5</div>
                    </div>
                    <SegmentedBar score={overallScore} />
                    <Accordion type="single" defaultValue="overall-rationale" collapsible className="mt-3">
                      <AccordionItem value="overall-rationale">
                        <AccordionTrigger className="text-xs">Overall rationale</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm text-muted-foreground">{overallRationale}</div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-3">
                    {dimensionScores.map((d) => (
                      <div key={d.key}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{d.label}</span>
                          <span className="text-xs font-medium">{d.score}/5</span>
                        </div>
                        <SegmentedBar score={d.score} />
                        <Accordion type="single" collapsible className="mt-2">
                          <AccordionItem value={`rationale-${d.key}`}>
                            <AccordionTrigger className="text-xs">Rationale</AccordionTrigger>
                            <AccordionContent>
                              <div className="text-sm text-muted-foreground">
                                {d.comments ? d.comments : anchorExplanation(d.score)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="rubric">
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium">Rubric v1.0 (1–5)</div>
                    <ol className="list-decimal pl-5 space-y-1 mt-1">
                      <li>Prompt Clarity: clear intent, role, constraints, examples.</li>
                      <li>Context & Grounding: uses provided inputs, references sources, avoids speculation.</li>
                      <li>Sequencing & Modularity: logical steps, clean handoffs, reusable templates/variables.</li>
                      <li>Guarding & Verification: schemas, checklists, references, acceptance criteria.</li>
                      <li>Outcome Quality: accuracy, usefulness, and fit for the business task.</li>
                      <li>Originality & Innovation: novel leverage without bloat.</li>
                      <li>Efficiency: minimal tokens/steps for value delivered.</li>
                    </ol>
                  </div>
                  <div>
                    <div className="font-medium">Anchors</div>
                    <ul className="list-disc pl-5 mt-1">
                      <li>5 = exemplary and production-ready</li>
                      <li>3 = workable with gaps</li>
                      <li>1 = unclear or risky</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-sm text-red-600">
              {errorMsg}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Best Practices Modal */}
      <Dialog open={showBestPractices} onOpenChange={setShowBestPractices}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prompting Best Practices</DialogTitle>
            <DialogDescription>Structural components, reusability tips, and an example template.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">Structural Components of a World-Class Prompt</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  <span className="font-medium">Role & Perspective</span>
                  <ul className="list-disc pl-5">
                    <li>Define who the AI should be acting as (e.g., “expert UX writer,” “financial analyst,” “coach”).</li>
                    <li>Anchors tone, expertise, and expected outputs.</li>
                    <li>Example: “You are a senior UX researcher guiding a cross-functional team…”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Task Statement</span>
                  <ul className="list-disc pl-5">
                    <li>Clear, action-oriented directive.</li>
                    <li>One sentence that says exactly what needs to be done.</li>
                    <li>Example: “Summarize the research paper into a newsletter for UX designers.”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Context & Constraints</span>
                  <ul className="list-disc pl-5">
                    <li>Background knowledge, domain details, or audience description.</li>
                    <li>Constraints on tone, scope, or time.</li>
                    <li>Example: “The audience is mid-career designers with limited AI knowledge—avoid jargon but don’t oversimplify.”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Step-by-Step Process</span>
                  <ul className="list-disc pl-5">
                    <li>Break the task into explicit stages the model should follow.</li>
                    <li>Example: “1) Extract core ideas. 2) Quote supporting text. 3) Write UX takeaways. 4) Suggest implications.”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Formatting Instructions</span>
                  <ul className="list-disc pl-5">
                    <li>Define the desired output shape (markdown sections, JSON schema, bullet list, etc.).</li>
                    <li>Improves reusability and consistency.</li>
                    <li>Example: “Return the output in Markdown with sections: Introduction, Core Ideas, UX Takeaways, and Citation.”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Evaluation Criteria</span>
                  <ul className="list-disc pl-5">
                    <li>Include self-check or rubric prompts to help evaluate quality.</li>
                    <li>Example: “Before finalizing, check: Is every claim supported by a direct quote? Are technical terms defined?”</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Examples & Counterexamples (Few-shot Guidance)</span>
                  <ul className="list-disc pl-5">
                    <li>Show what “good” and “bad” outputs look like.</li>
                    <li>Helps set expectations and prevents drift.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Room for Adaptation</span>
                  <ul className="list-disc pl-5">
                    <li>Add placeholders or variables for reuse across tasks.</li>
                    <li>Example: “[Insert audience type]” or “&#123;topic&#125;”.</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-1">Best Practices for Reusability</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Modularize: Write prompts as blocks (role, task, context, format, evaluation) so they can be recombined.</li>
                <li>Abstract Audience/Domain: Use placeholders to make the prompt portable.</li>
                <li>Meta-prompting: Ask the model to critique its own answer against the rubric.</li>
                <li>Layered Prompts: Use a “controller” prompt (high-level strategy) plus “worker” prompts (specific tasks).</li>
                <li>Keep a Prompt Library: Store, tag, and version prompts with notes on when/why they worked.</li>
                <li>Include Guardrails: Explicitly state what not to do (e.g., “Avoid filler adjectives. No m-dashes.”).</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Example Prompt Template</h3>
              <div className="rounded-md bg-muted p-3 text-xs leading-relaxed font-mono">
                <div>[ROLE]</div>
                <div>You are an expert &#123;domain_expert&#125; helping &#123;audience&#125;.</div>
                <div className="h-2" />
                <div>[TASK]</div>
                <div>Your task is to &#123;main_objective&#125;.</div>
                <div className="h-2" />
                <div>[CONTEXT &amp; CONSTRAINTS]</div>
                <div>Context: &#123;situation details&#125;</div>
                <div>Constraints: Write in &#123;tone/style&#125;. Avoid &#123;pitfalls&#125;.</div>
                <div className="h-2" />
                <div>[PROCESS]</div>
                <div>1. Extract key points.</div>
                <div>2. Provide evidence/quotes.</div>
                <div>3. Translate into actionable insights.</div>
                <div>4. Suggest implications.</div>
                <div className="h-2" />
                <div>[OUTPUT FORMAT]</div>
                <div>Return in Markdown with sections:</div>
                <div>- Introduction</div>
                <div>- Core Ideas</div>
                <div>- Practical Takeaways</div>
                <div>- References</div>
                <div className="h-2" />
                <div>[EVALUATION CHECK]</div>
                <div>Before finalizing, check:</div>
                <div>- Is each idea supported by evidence?</div>
                <div>- Is jargon defined?</div>
                <div>- Does the structure match the format?</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function anchorExplanation(score: number): string {
  switch (score) {
    case 5:
      return "Exemplary and production-ready: precise, grounded, well-guarded, and efficient.";
    case 4:
      return "Strong with minor gaps: mostly clear and grounded with reasonable checks and flow.";
    case 3:
      return "Workable but with gaps: needs clearer constraints, grounding, or guardrails.";
    case 2:
      return "Weak: unclear intent or missing context/guards; risky to rely on as-is.";
    case 1:
      return "Unclear or risky: lacks clarity, grounding, and verification.";
    default:
      return "No rationale available.";
  }
}

function SegmentedBar({ score }: { score: number }) {
  const segments = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex gap-1" aria-label={`Score ${score} out of 5`}>
      {segments.map((s) => (
        <div
          key={s}
          className={`h-2 flex-1 rounded ${s <= score ? "bg-foreground" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}


