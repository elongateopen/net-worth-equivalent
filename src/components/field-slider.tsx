import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

export function FieldSlider({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label className="text-sm text-fg">{label}</label>
        <span className="font-mono text-sm tabular-nums text-ink-soft">{display}</span>
      </div>
      {ready ? (
        <Slider min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
      ) : (
        <div className="flex h-9 items-center">
          <div className="h-1.5 w-full rounded-full bg-paper-2" />
        </div>
      )}
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}
