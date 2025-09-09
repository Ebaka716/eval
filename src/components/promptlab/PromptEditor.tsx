"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PromptEditor({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const [openBestPractices, setOpenBestPractices] = React.useState<boolean>(false);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="prompt" className="text-sm font-medium">
          Your prompt
        </Label>
        <Button variant="secondary" size="sm" onClick={() => setOpenBestPractices(true)}>
          Best practices
        </Button>
      </div>
      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your prompt here..."
        className="min-h-[220px]"
      />
      <div className="flex items-center gap-3">
        <Button onClick={onSubmit} disabled={disabled || !value.trim()}>
          {disabled ? "Evaluating..." : "Submit"}
        </Button>
      </div>

      {/* Best Practices Modal */}
      <Dialog open={openBestPractices} onOpenChange={setOpenBestPractices}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prompting Best Practices</DialogTitle>
            <DialogDescription>Structural components, reusability tips, and an example template.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">Structural components of a great prompt</h3>
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
                    <li>Example: “[Insert audience type]” or “{'{'}topic{'}'}”.</li>
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
              <div className="rounded-md bg-muted p-3 text-xs leading-relaxed font-mono mx-auto max-w-3xl">
                <div>[ROLE]</div>
                <div>You are an expert {'{'}domain_expert{'}'} helping {'{'}audience{'}'}.</div>
                <div className="h-2" />
                <div>[TASK]</div>
                <div>Your task is to {'{'}main_objective{'}'}.</div>
                <div className="h-2" />
                <div>[CONTEXT &amp; CONSTRAINTS]</div>
                <div>Context: {'{'}situation details{'}'}.</div>
                <div>Constraints: Write in {'{'}tone/style{'}'}. Avoid {'{'}pitfalls{'}'}.</div>
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
    </section>
  );
}

export default PromptEditor;


