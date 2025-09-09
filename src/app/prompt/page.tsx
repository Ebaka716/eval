"use client";

import * as React from "react";
import { type Scenario, getRandomScenario } from "@/lib/promptlab/scenarios";
import ScenarioHeader from "@/components/promptlab/ScenarioHeader";
import PromptEditor from "@/components/promptlab/PromptEditor";
import EvaluationDialog from "@/components/promptlab/EvaluationDialog";


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
  const [overallScore, setOverallScore] = React.useState<number>(0);
  const [dimensionScores, setDimensionScores] = React.useState<DimensionScore[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  function randomizeScenario() {
    const next = getRandomScenario(currentScenario?.id);
    if (next) setCurrentScenario(next);
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

      <ScenarioHeader scenario={currentScenario} onReload={randomizeScenario} />

      <PromptEditor value={promptText} onChange={setPromptText} onSubmit={handleSubmit} disabled={isEvaluating} />

      <EvaluationDialog
        open={showResults || !!errorMsg}
        onOpenChange={(open) => {
          setShowResults(open);
          if (!open) setErrorMsg("");
        }}
        overallScore={overallScore}
        dimensions={dimensionScores}
        error={errorMsg || undefined}
      />

      {/* Best Practices now lives within PromptEditor */}
    </div>
  );
}

// Components handle rationale and segmented bars internally.


