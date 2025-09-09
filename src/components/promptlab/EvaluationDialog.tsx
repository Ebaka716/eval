"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIMENSIONS, RUBRIC_DESCRIPTIONS } from "@/lib/promptlab/dimensions";
import SegmentedBar from "@/components/promptlab/SegmentedBar";

type DimensionScore = {
  key: string;
  label: string;
  score: number;
  comments?: string;
};

export function EvaluationDialog({
  open,
  onOpenChange,
  overallScore,
  dimensions,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overallScore: number;
  dimensions: DimensionScore[];
  error?: string;
}) {
  const overallRationale = dimensions
    .map((d) => `${d.label}: ${d.comments ? d.comments : anchorExplanation(d.score)}`)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{error ? "Evaluation Error" : "Evaluation Results"}</DialogTitle>
          <DialogDescription>
            {error ? "The evaluator encountered an issue." : "Scores based on the PromptLab rubric (1–5)."}
          </DialogDescription>
        </DialogHeader>

        {!error ? (
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
                  {dimensions.map((d) => (
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
                    {DIMENSIONS.map((d) => (
                      <li key={d.key}>{RUBRIC_DESCRIPTIONS[d.key]}</li>
                    ))}
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
          <div className="text-sm text-red-600">{error}</div>
        )}
      </DialogContent>
    </Dialog>
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

export default EvaluationDialog;


