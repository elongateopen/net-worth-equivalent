import { formatMoney, type LedgerResult } from "@/lib/ledger";

export function Waterfall({ result }: { result: LedgerResult }) {
  const max = Math.max(result.book, 1);
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-fg">当量瀑布</h2>
      <p className="mt-1 text-sm text-muted">账面收入被六项生活税逐项贴现。最后留下的，才是可长期持有的月当量。</p>

      <div className="mt-5 space-y-3">
        <Row label="账面收入" note="每天都能看见的数字" value={result.book} width={100} tone="book" />
        {result.deductions.map((d) => (
          <Row
            key={d.id}
            label={d.label}
            note={d.note}
            value={-d.amount}
            width={(d.amount / max) * 100}
            tone="tax"
            remain={d.remaining}
          />
        ))}
        <div className="border-t border-border pt-3">
          <Row
            label="净当量"
            note="风险调整后的生活结果"
            value={result.net}
            width={(result.net / max) * 100}
            tone="net"
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  note,
  value,
  width,
  tone,
  remain,
}: {
  label: string;
  note: string;
  value: number;
  width: number;
  tone: "book" | "tax" | "net";
  remain?: number;
}) {
  const color = tone === "tax" ? "bg-danger/80" : tone === "net" ? "bg-primary" : "bg-fg";
  const text = tone === "tax" ? "text-danger" : "text-fg";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-fg">{label}</p>
          <p className="truncate text-xs text-subtle">{note}</p>
        </div>
        <p className={`shrink-0 font-mono text-sm tabular-nums ${text}`}>
          {tone === "tax" ? "\u2212" : ""}
          {formatMoney(Math.abs(value))}
        </p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
        <div
          className={`h-full rounded-full ${color} transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]`}
          style={{ width: `${Math.min(100, Math.max(tone === "tax" ? 2 : 6, width))}%` }}
        />
      </div>
      {remain != null ? (
        <p className="mt-1 text-right font-mono text-[10px] tabular-nums text-subtle">余 {formatMoney(remain)}</p>
      ) : null}
    </div>
  );
}
