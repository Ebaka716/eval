"use client";

export function SegmentedBar({ score, max = 5 }: { score: number; max?: number }) {
  const segments = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex gap-1" aria-label={`Score ${score} out of ${max}`}>
      {segments.map((s) => (
        <div key={s} className={`h-2 flex-1 rounded ${s <= score ? "bg-foreground" : "bg-muted"}`} />
      ))}
    </div>
  );
}

export default SegmentedBar;


