import type { LedgerResult } from "@/lib/ledger";

export function LedgerSheet({ result }: { result: LedgerResult }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-fg">完整账单</h2>
      <p className="mt-1 text-sm text-muted">六条生活资源同场对照。短的那一端，就是此消彼长被吃掉的部分。</p>
      <ul className="mt-5 space-y-4">
        {result.dimensions.map((dim) => (
          <li key={dim.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm text-fg">{dim.label}</span>
              <span className="font-mono text-xs tabular-nums text-muted">{Math.round(dim.score * 100)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-paper-2">
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] ${
                  dim.score < 0.36 ? "bg-danger" : dim.score < 0.55 ? "bg-ink-soft" : "bg-primary"
                }`}
                style={{ width: `${Math.max(4, dim.score * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-subtle">{dim.hint}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
