import type { LedgerResult } from "@/lib/ledger";
import { Badge } from "@/components/ui/badge";

export function InsightList({ result }: { result: LedgerResult }) {
  if (result.insights.length === 0) return null;
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-fg">账本批注</h2>
      <p className="mt-1 text-sm text-muted">不是建议你少赚钱，是把这份收入正在消耗的东西写回到账上。</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {result.insights.map((item) => (
          <li key={item.id} className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
            <Badge variant={item.tone}>{item.kicker}</Badge>
            <h3 className="mt-3 font-display text-base font-semibold leading-snug text-fg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
