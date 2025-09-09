"use client";

import * as React from "react";
import { BLOCK_DEFINITIONS, type BlockDefinition, type CanvasBlock, assemblePrompt, exportConfig } from "@/lib/promptlab/builderTypes";
import { FRAMEWORKS, getFramework, type Framework } from "@/lib/promptlab/frameworks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function BuilderPage() {
  const [frameworkId, setFrameworkId] = React.useState<Framework["id"]>("ICE");
  const [canvas, setCanvas] = React.useState<CanvasBlock[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  function addBlock(def: BlockDefinition) {
    const instance: CanvasBlock = {
      instanceId: `${def.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: def.type,
      data: Object.fromEntries(def.fields.map((f) => [f.key, ""])),
    };
    setCanvas((prev) => [...prev, instance]);
    setSelectedIndex(canvas.length);
  }

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

  function move(index: number, delta: number) {
    setCanvas((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
    setSelectedIndex((i) => (i === null ? i : Math.min(Math.max(i + delta, 0), canvas.length - 1)));
  }

  function remove(index: number) {
    setCanvas((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex(null);
  }

  const preview = React.useMemo(() => assemblePrompt(canvas), [canvas]);
  const config = React.useMemo(() => JSON.stringify(exportConfig(canvas), null, 2), [canvas]);

  return (
    <div className="p-6 grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-3">
        <h1 className="text-2xl font-semibold">Prompt Builder</h1>
        <p className="text-sm text-muted-foreground">Choose a framework; fill blocks; preview & export.</p>
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase text-muted-foreground">Framework</div>
          <div className="flex items-center gap-2 flex-wrap">
            {FRAMEWORKS.map((fw) => (
              <Button
                key={fw.id}
                size="sm"
                variant={fw.id === frameworkId ? "default" : "secondary"}
                onClick={() => setFrameworkId(fw.id)}
              >
                {fw.title}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {getFramework(frameworkId)?.description}
          </div>
        </div>
      </div>

      <div className="md:col-span-1 space-y-3">
        <div className="text-sm font-medium">Canvas</div>
        <div className="space-y-2">
          {canvas.map((blk, i) => {
              const def = BLOCK_DEFINITIONS.find((d) => d.type === blk.type)!;
              const isActive = i === selectedIndex;
              return (
                <div key={blk.instanceId} className={`p-2 rounded border ${isActive ? "border-foreground" : "border-muted"}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{def.title}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => remove(i)}>
                        Remove
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedIndex(i)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <div>
          <div className="text-sm font-medium">Editor</div>
          {selectedIndex === null ? (
            <div className="text-xs text-muted-foreground">Select a block on the canvas to edit its fields.</div>
          ) : (
            (() => {
              const blk = canvas[selectedIndex]!;
              const def = BLOCK_DEFINITIONS.find((d) => d.type === blk.type)!;
              return (
                <div className="space-y-3">
                  {def.fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-xs">{f.label}</Label>
                      {f.multiline ? (
                        <Textarea
                          value={blk.data[f.key] ?? ""}
                          onChange={(e) => updateField(selectedIndex, f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="min-h-[120px]"
                        />
                      ) : (
                        <input
                          value={blk.data[f.key] ?? ""}
                          onChange={(e) => updateField(selectedIndex, f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full rounded border px-2 py-1 text-sm bg-background"
                        />
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Live Preview</div>
          <Textarea readOnly value={preview} className="min-h-[220px] font-mono text-xs" />
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
    </div>
  );
}


