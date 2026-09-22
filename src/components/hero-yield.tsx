import { formatMoney, formatYuan, type LedgerResult } from "@/lib/ledger";
import { Badge } from "@/components/ui/badge";

export function HeroYield({ result }: { result: LedgerResult }) {
  const keep = Math.round((1 - result.taxRate) * 100);
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-widest text-muted">生活净收益</p>
        <Badge variant={result.quadrant}>{result.verdict.kicker}</Badge>
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <div>
          <p className="text-sm text-muted">净当量 / 月</p>
          <p className="mt-1 font-display text-5xl font-semibold leading-none tracking-tight text-fg tabular-nums sm:text-6xl">
            {formatMoney(result.net)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{result.verdict.title}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{result.verdict.line}</p>
        </div>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border shadow-border">
          <Stat label="账面收入" value={formatMoney(result.book)} />
          <Stat label="隐藏折损" value={formatMoney(result.tax)} danger />
          <Stat label="可持有" value={`${keep}%`} />
        </dl>
      </div>
      <p className="mt-5 border-t border-border pt-3 font-mono text-xs tabular-nums text-subtle">
        {formatYuan(result.book)} → {formatYuan(result.net)}　折损率 {Math.round(result.taxRate * 100)}%
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-surface px-3 py-3 sm:px-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={`mt-1 font-display text-lg font-semibold tabular-nums sm:text-xl ${danger ? "text-danger" : "text-fg"}`}
      >
        {value}
      </dd>
    </div>
  );
}
