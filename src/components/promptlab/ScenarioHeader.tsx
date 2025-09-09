"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { Scenario } from "@/lib/promptlab/scenarios";

export function ScenarioHeader({ scenario, onReload }: { scenario: Scenario | null; onReload: () => void }) {
  return (
    <section className="space-y-4 text-center my-16 md:my-24">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-medium">Scenarios</h2>
        <Button variant="ghost" size="icon" aria-label="Reload scenario" onClick={onReload}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-purple-600">
          {scenario ? scenario.title : "Preparing scenario…"}
        </p>
        <p className="text-sm text-purple-500">
          {scenario ? scenario.description : "One moment while we load a scenario for you."}
        </p>
      </div>
    </section>
  );
}

export default ScenarioHeader;


