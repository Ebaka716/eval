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
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

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
    setSelectedIndex(null);
  }, [frameworkId]);

  function updateField(index: number, key: string, value: string) {
    setCanvas((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], data: { ...next[index].data, [key]: value } };
      return next;
    });
  }

  function remove(index: number) {
    setCanvas((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex(null);
  }

  const preview = React.useMemo(() => assemblePrompt(canvas), [canvas]);
  const config = React.useMemo(() => JSON.stringify(exportConfig(canvas), null, 2), [canvas]);

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
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
              <div className="space-y-3">
                <div className="text-sm font-medium">Blocks</div>
                <Accordion type="multiple" className="space-y-2">
                  {canvas.map((blk, i) => {
                    const def = BLOCK_DEFINITIONS.find((d) => d.type === blk.type)!;
                    const summary = Object.values(blk.data).find((v) => (v ?? "").trim()) || "";
                    return (
                      <AccordionItem key={blk.instanceId} value={blk.instanceId}>
                        <AccordionTrigger className="text-sm">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{def.title}</div>
                            {summary && (
                              <div className="text-xs text-muted-foreground truncate">{String(summary).slice(0, 120)}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); remove(i); }}>Remove</Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 p-2">
                            {def.fields.map((f) => (
                              <div key={f.key} className="space-y-1">
                                <Label className="text-xs">{f.label}</Label>
                                {f.helper && <div className="text-[10px] text-muted-foreground">{f.helper}</div>}
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


