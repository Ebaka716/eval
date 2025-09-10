"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

type Block =
  | { id: string; type: "Input"; label: string; settings: { value: string } }
  | { id: string; type: "Prompt"; label: string; inputs: { vars: Record<string, string> }; settings: { template: string; model?: string; temperature?: number; maxTokens?: number } }
  | { id: string; type: "Transform"; label: string; inputs: { data?: string }; settings: { picks?: string[]; rename?: Record<string, string> } }
  | { id: string; type: "Output"; label: string; inputs: { data?: string }; settings: { fields?: string[] } };

type AgentSettings = { model: string; temperature: number; maxTokens: number };

export default function AgentRunnerPage() {
  const [notes, setNotes] = React.useState<string>("");
  // Keeping stepOutputs source of truth; summary/email local states removed
  const [logs, setLogs] = React.useState<Array<Record<string, unknown>>>([]);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [stepStatus, setStepStatus] = React.useState<Record<string, "idle" | "running" | "done" | "error">>({});
  const [stepOutputs, setStepOutputs] = React.useState<Record<string, string>>({});
  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [editBlockId, setEditBlockId] = React.useState<string | null>(null);
  const [editTemplateDraft, setEditTemplateDraft] = React.useState<string>("");
  const [logOpen, setLogOpen] = React.useState<boolean>(false);

  const [blocks, setBlocks] = React.useState<Block[]>([
    { id: "inputNotes", type: "Input", label: "Meeting Notes", settings: { value: "" } },
    {
      id: "summarize",
      type: "Prompt",
      label: "Summarize",
      inputs: { vars: { notes: "inputNotes.data" } },
      settings: { template: "Summarize into 5 bullets:\n{{notes}}", temperature: 0.2 },
    },
    {
      id: "email",
      type: "Prompt",
      label: "Draft Email",
      inputs: { vars: { summary: "summarize.text" } },
      settings: { template: "Write a concise stakeholder email based on:\n{{summary}}", temperature: 0.3 },
    },
  ]);

  // Keep input block bound to notes editor
  React.useEffect(() => {
    setBlocks((prev) => prev.map((b) => (b.id === "inputNotes" && b.type === "Input" ? { ...b, settings: { value: notes } } : b)));
  }, [notes]);

  const agentSettings: AgentSettings = { model: "gpt-4o", temperature: 0.3, maxTokens: 800 };

  // Preview helpers removed (not currently used)

  async function runAll() {
    setIsRunning(true);
    setLogs([]);
    try {
      const res = await fetch("/api/promptlab/runner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentSettings, blocks }),
      });
      const data = await res.json();
      setLogs(data.logs || []);
      // collect outputs for each prompt step
      const outputs: Record<string, string> = {};
      blocks.forEach((blk) => {
        if (blk.type === "Prompt") {
          const text = data?.variables?.[blk.id]?.text ?? "";
          outputs[blk.id] = typeof text === "string" ? text : "";
        }
      });
      setStepOutputs(outputs);
      // outputs stored in stepOutputs
      // Mark steps statuses based on logs
      const status: Record<string, "idle" | "running" | "done" | "error"> = {};
      for (const l of data.logs || []) {
        status[l.id] = l.status === "error" ? "error" : "done";
      }
      setStepStatus(status);
    } catch (e) {
      setLogs([{ id: "error", type: "Output", status: "error", error: e instanceof Error ? e.message : String(e) } as unknown as Record<string, unknown>]);
    } finally {
      setIsRunning(false);
    }
  }

  async function runToIndex(index: number) {
    setIsRunning(true);
    // set running status for current step
    const b = blocks[index];
    setStepStatus((prev) => ({ ...prev, [b.id]: "running" }));
    try {
      const res = await fetch("/api/promptlab/runner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentSettings, blocks, endIndex: index }),
      });
      const data = await res.json();
      setLogs(data.logs || []);
      // Update outputs only for steps present in this partial run
      setStepOutputs((prev) => {
        const next = { ...prev };
        for (let i = 0; i <= index; i++) {
          const blk = blocks[i];
          if (blk.type === "Prompt") {
            const text = data?.variables?.[blk.id]?.text ?? "";
            next[blk.id] = typeof text === "string" ? text : "";
          }
        }
        return next;
      });
      // outputs stored in stepOutputs
      // Update per-step status up to index
      const status: Record<string, "idle" | "running" | "done" | "error"> = {};
      for (const l of data.logs || []) {
        status[l.id] = l.status === "error" ? "error" : "done";
      }
      setStepStatus((prev) => ({ ...prev, ...status }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLogs([{ id: b.id, type: b.type, status: "error", error: msg } as unknown as Record<string, unknown>]);
      setStepStatus((prev) => ({ ...prev, [b.id]: "error" }));
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Agent Runner</h1>
        <p className="text-sm text-muted-foreground">Chain small blocks and run to see step-by-step outputs.</p>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Steps</div>
        <div className="flex gap-4">
          {/* Vertical progress with milestone circles */}
          <div className="relative self-stretch w-6 pt-1">
            {(() => {
              const milestoneSteps = blocks.filter((b) => b.type === "Input" || b.type === "Prompt");
              const totalSegments = Math.max(1, (milestoneSteps.length - 1));
              // Derive status including Input done when notes present
              const getStatus = (id: string, type: Block["type"]): "idle" | "running" | "done" => {
                if (type === "Input") {
                  return notes.trim() ? "done" : "idle";
                }
                const current = stepStatus[id];
                return current === "running" || current === "done" || current === "idle" ? current : "idle";
              };
              let runningIndex = -1;
              let lastDoneIndex = -1;
              milestoneSteps.forEach((m, i) => {
                const st = getStatus(m.id, m.type);
                if (st === "running") runningIndex = i;
                if (st === "done") lastDoneIndex = i;
              });
              const targetIndex = runningIndex >= 0 ? runningIndex : Math.max(0, lastDoneIndex);
              const value = Math.round((targetIndex / totalSegments) * 100);
              return (
                <>
                  <Progress value={value} orientation="vertical" className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-2" />
                  {milestoneSteps.map((p, i) => {
                    const y = (milestoneSteps.length > 1) ? (i / (milestoneSteps.length - 1)) * 100 : 100;
                    const status = getStatus(p.id, p.type);
                    const circleBase = "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border";
                    const circleClass =
                      status === "done"
                        ? "bg-primary border-primary"
                        : status === "running"
                        ? "bg-primary/70 border-primary animate-pulse"
                        : "bg-background border-border";
                    return <div key={p.id} className={`${circleBase} ${circleClass}`} style={{ top: `${y}%` }} />;
                  })}
                </>
              );
            })()}
          </div>
          <div className="flex-1 space-y-0">
          {blocks.map((b, idx) => {
            const isPrompt = b.type === "Prompt";
            // Compute consumes and produces
            let consumes: string | undefined;
            let produces: string | undefined;
            if (b.type === "Input") {
              produces = `${b.id}.data`;
            }
            if (b.type === "Prompt") {
              const firstVar = Object.values(b.inputs.vars || {})[0];
              consumes = firstVar ? String(firstVar) : undefined;
              produces = `${b.id}.text`;
            }
            if (b.type === "Output") {
              consumes = b.inputs.data ? String(b.inputs.data) : undefined;
              produces = `${b.id}.data`;
            }
            return (
              <div key={b.id} className="py-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium flex items-center gap-1">
                      <span>{idx + 1}. {b.label} <span className="text-muted-foreground">({b.type})</span></span>
                      {isPrompt && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditBlockId(b.id);
                            setEditTemplateDraft(b.type === "Prompt" ? b.settings.template : "");
                            setEditOpen(true);
                          }}
                          aria-label="Edit step"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div />
                  </div>
                  {isPrompt && (
                    <div className="mt-2">
                      <Button size="sm" onClick={() => runToIndex(idx)} disabled={isRunning}>
                        <Play className="h-3 w-3 mr-1" /> Run step
                      </Button>
                    </div>
                  )}
                  {b.type !== "Input" && (consumes || produces) && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {consumes && <span>consumes: <code>{consumes}</code> → </span>}
                      {produces && <span>produces: <code>{produces}</code></span>}
                    </div>
                  )}
                  {b.type === "Input" && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      <code>{`${b.id}.data`}</code>
                    </div>
                  )}
                  {b.type === "Input" && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground">Meeting notes</div>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Paste meeting notes here for the summarization step."
                        className="min-h-[160px]"
                      />
                    </div>
                  )}
                  {b.type === "Prompt" && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground">{b.id === "summarize" ? "Summary" : b.id === "email" ? "Email draft" : "Result"}</div>
                      <Textarea readOnly value={stepOutputs[b.id] || ""} className="min-h-[120px] font-mono text-xs" />
                    </div>
                  )}
                  {false && isPrompt && <div className="mt-2" />}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setLogOpen(true)} disabled={(logs || []).length === 0}>View run logs</Button>
          <Button size="sm" onClick={runAll} disabled={isRunning || !notes.trim()}>Run all</Button>
        </div>
      </div>

      {/* Run Logs Modal */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Run logs</DialogTitle>
            <DialogDescription>Detailed prompts, outputs, timings, and errors from the latest run.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto rounded border p-2 space-y-2 bg-background">
            {(logs || []).length === 0 && (
              <div className="text-xs text-muted-foreground">No logs yet. Run a step or run all to populate logs.</div>
            )}
            {(logs || []).map((l: Record<string, unknown>) => (
              <div key={String(l.id) + String(l.startedAt || "")} className="text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{String(l.label || l.id)} <span className="text-muted-foreground">({String(l.type)})</span></div>
                  <div className="text-muted-foreground">{typeof l.durationMs === "number" ? `${l.durationMs}ms` : ""}</div>
                </div>
                {l.promptPreview ? (
                  <details>
                    <summary className="cursor-pointer">Prompt</summary>
                    <pre className="whitespace-pre-wrap break-words">{String(l.promptPreview)}</pre>
                  </details>
                ) : null}
                {l.outputPreview ? (
                  <details>
                    <summary className="cursor-pointer">Output</summary>
                    <pre className="whitespace-pre-wrap break-words">{String(l.outputPreview)}</pre>
                  </details>
                ) : null}
                {l.error ? <div className="text-red-600">{String(l.error)}</div> : null}
                <hr className="my-2 opacity-50" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" variant="secondary" onClick={() => setLogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit prompt</DialogTitle>
            <DialogDescription>Update the template for this step. Variables like {"{{notes}}"} will be injected at run time.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={editTemplateDraft}
            onChange={(e) => setEditTemplateDraft(e.target.value)}
            className="min-h-[220px] font-mono text-xs"
          />
          <DialogFooter>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!editBlockId) return setEditOpen(false);
                setBlocks((prev) => prev.map((x) => (x.id === editBlockId && x.type === "Prompt" ? { ...x, settings: { ...x.settings, template: editTemplateDraft } } : x)));
                setEditOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


