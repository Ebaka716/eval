"use client";

import * as React from "react";
import { BLOCK_DEFINITIONS, type CanvasBlock, assemblePrompt, exportConfig } from "@/lib/promptlab/builderTypes";
import { FRAMEWORKS, getFramework, type Framework } from "@/lib/promptlab/frameworks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BuilderPage() {
  const [frameworkId, setFrameworkId] = React.useState<Framework["id"]>("ICE");
  const [canvas, setCanvas] = React.useState<CanvasBlock[]>([]);

  // reset canvas when framework changes
  React.useEffect(() => {
    const fw = getFramework(frameworkId);
    if (!fw) return;
    const initial: CanvasBlock[] = fw.blocks.map((bt) => {
      const def = BLOCK_DEFINITIONS.find((d) => d.type === bt)!;
      return {
        instanceId: `${bt}-${Math.random().toString(36).slice(2, 6)}`,
        type: bt,
        data: Object.fromEntries(def.fields.map((f) => [f.key, ""])),
      } satisfies CanvasBlock;
    });
    setCanvas(initial);
  }, [frameworkId]);

  function updateField(index: number, key: string, value: string) {
    setCanvas((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], data: { ...next[index].data, [key]: value } };
      return next;
    });
  }

  // no-op

  const preview = React.useMemo(() => assemblePrompt(canvas), [canvas]);
  const config = React.useMemo(() => JSON.stringify(exportConfig(canvas), null, 2), [canvas]);

  function frameworkHints(id: Framework["id"], type: string): string[] {
    if (id === "CRISPE") {
      switch (type) {
        case "context":
          return [
            "Provide background information about the scenario or situation. This helps the AI understand the environment and the task at hand.",
          ];
        case "role":
          return [
            "Define the role the AI should assume when responding (e.g., a consultant, expert, or advisor).",
          ];
        case "instructions":
          return [
            "Clearly state what the AI is supposed to do or the specific action it should take.",
          ];
        case "subject":
          return [
            "Define the subject matter or area of focus for the response (e.g., marketing, business strategy, etc.).",
          ];
        case "preset":
          return [
            "Offer any predefined parameters, guidelines, or expected formats for the response (e.g., tone, length, structure).",
          ];
        case "exception":
          return [
            "State any exceptions or constraints that the AI should be aware of when providing the response (e.g., avoiding certain topics, adhering to specific rules).",
          ];
        default:
          return [];
      }
    }
    if (id === "ICE") {
      switch (type) {
        case "instructions":
          return ["Instruction (I): This is the core command that tells the AI what to do. Instructions should be clear, direct, and specific."];
        case "context":
          return ["Context (C): Provide the AI with the necessary background information to perform the task correctly. Context helps the model understand the broader situation and avoid irrelevant tangents."];
        case "examples":
          return ["Examples (E): Offering one or more examples of the desired output can significantly improve the quality and format of the model's response. This is also known as \"few-shot prompting\"."];
        default:
          return [];
      }
    }
    if (id === "CRAFT") {
      switch (type) {
        case "capability":
          return ["Describe the assistant’s capability relevant to the task."];
        case "role":
          return ["Define who the AI is (expertise, audience, perspective)."];
        case "action":
          return ["State the specific action to perform (write, generate, analyze, etc.)."];
        case "output_format":
          return ["Specify the desired output structure or sections for consistency."];
        case "tone":
          return ["Set the voice and style (e.g., professional, concise, friendly)."];
        default:
          return [];
      }
    }
    return [];
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Prompt Builder</h1>
          <p className="text-sm text-muted-foreground">Choose a framework; fill blocks; preview & export.</p>
        </div>
        <Tabs value={frameworkId} onValueChange={(v) => setFrameworkId(v as Framework["id"])}>
          <TabsList>
            {FRAMEWORKS.map((fw) => (
              <TabsTrigger key={fw.id} value={fw.id}>{fw.title}</TabsTrigger>
            ))}
          </TabsList>
          {FRAMEWORKS.map((fw) => (
            <TabsContent key={fw.id} value={fw.id} className="space-y-4">
              <div className="text-xs text-muted-foreground">{fw.description}</div>
              <p className="text-sm text-muted-foreground">{fw.summary}</p>
              <div className="space-y-3">
                <div className="text-sm font-medium">Blocks</div>
                <Accordion type="multiple" className="space-y-2">
                  {canvas.map((blk, i) => {
                    const def = BLOCK_DEFINITIONS.find((d) => d.type === blk.type)!;
                    const summary = Object.values(blk.data).find((v) => (v ?? "").trim()) || "";
                    const hints = frameworkHints(frameworkId, def.type);
                    return (
                      <AccordionItem key={blk.instanceId} value={blk.instanceId}>
                        <div className="flex items-center justify-between gap-2">
                          <AccordionTrigger className="text-sm flex-1">
                            <div className="text-left">
                              <div className="font-medium">{def.title}</div>
                              {summary && (
                                <div className="text-xs text-muted-foreground truncate">{String(summary).slice(0, 120)}</div>
                              )}
                            </div>
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Clear fields instead of removing the block
                              setCanvas((prev) => {
                                const next = [...prev];
                                const def = BLOCK_DEFINITIONS.find((d) => d.type === next[i].type)!;
                                next[i] = {
                                  ...next[i],
                                  data: Object.fromEntries(def.fields.map((f) => [f.key, ""])),
                                };
                                return next;
                              });
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="space-y-3 p-2">
                            {def.fields.map((f) => (
                              <div key={f.key} className="space-y-1">
                                {hints.length === 0 && (
                                  <Label className="text-xs">{f.label}</Label>
                                )}
                                {hints.length === 0 && f.helper && (
                                  <div className="text-[10px] text-muted-foreground">{f.helper}</div>
                                )}
                                {hints.length > 0 && (
                                  <div className="text-sm text-muted-foreground">{hints.join(" ")}</div>
                                )}
                                {f.multiline ? (
                                  <Textarea
                                    value={blk.data[f.key] ?? ""}
                                    onChange={(e) => updateField(i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="min-h-[120px]"
                                  />
                                ) : (
                                  <input
                                    value={blk.data[f.key] ?? ""}
                                    onChange={(e) => updateField(i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="w-full rounded border px-2 py-1 text-sm bg-background"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Live Preview</div>
        <Textarea readOnly value={preview} className="min-h-[420px] font-mono text-xs" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(preview);
            }}
            disabled={!preview.trim()}
          >
            Copy Prompt
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(config);
            }}
            disabled={canvas.length === 0}
          >
            Copy JSON
          </Button>
        </div>
      </div>
    </div>
  );
}


