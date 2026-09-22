import type { LedgerResult } from "@/lib/ledger";

export function QuadrantMap({ result }: { result: LedgerResult }) {
  const x = result.moneyAxis;
  const y = result.lifeAxis;
  const gy = result.spectatorY;
  const pad = 0.12;
  const toPct = (v: number) => pad * 100 + v * (1 - pad * 2) * 100;
  const left = toPct(x);
  const bottom = toPct(y);
  const gBottom = toPct(gy);
  const drop = Math.max(0, gy - y);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-fg">四象限拉扯</h2>
          <p className="mt-1 text-sm text-muted">空心点是旁观者只看见收入时的位置，实心点是完整账单。</p>
        </div>
        <p className="hidden text-xs text-subtle sm:block">纵轴 · 可持有的生活</p>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-paper-2 shadow-border sm:h-80">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <Cell title="够了" sub="低账面 · 高生活" pos="tl" active={result.quadrant === "enough"} tone="good" />
          <Cell title="盈余" sub="高账面 · 高生活" pos="tr" active={result.quadrant === "surplus"} tone="good" />
          <Cell title="双亏" sub="低账面 · 低生活" pos="bl" active={result.quadrant === "loss"} tone="bad" />
          <Cell title="透支" sub="高账面 · 低生活" pos="br" active={result.quadrant === "overdraft"} tone="bad" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 right-[12%] left-[12%] h-px bg-fg/10" />
          <div className="absolute top-[12%] bottom-[12%] left-1/2 w-px bg-fg/10" />
        </div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <line
            x1={`${left}%`}
            y1={`${100 - gBottom}%`}
            x2={`${left}%`}
            y2={`${100 - bottom}%`}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-danger/70"
            strokeWidth="1.5"
          />
        </svg>

        <span
          className="absolute size-3 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-muted bg-transparent"
          style={{ left: `${left}%`, bottom: `${gBottom}%` }}
          title="旁观者看见的结果"
        />
        <span
          className={`absolute size-3.5 -translate-x-1/2 translate-y-1/2 rounded-full shadow-border transition-[left,bottom] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] ${
            result.quadrant === "overdraft" || result.quadrant === "loss" ? "bg-danger" : "bg-primary"
          }`}
          style={{ left: `${left}%`, bottom: `${bottom}%` }}
        />

        {drop > 0.08 ? (
          <span
            className="absolute hidden -translate-x-full pr-2 text-xs tracking-wide text-danger sm:block"
            style={{ left: `${left}%`, bottom: `${(bottom + gBottom) / 2}%` }}
          >
            隐藏成本
          </span>
        ) : null}

        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs tracking-wide text-subtle">
          账面收入 →
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <Legend swatch="ring" label="旁观者只看收入" />
        <Legend
          swatch={result.quadrant === "overdraft" || result.quadrant === "loss" ? "bad" : "good"}
          label="把代价算进去"
        />
      </div>
    </div>
  );
}

function Cell({
  title,
  sub,
  pos,
  active,
  tone,
}: {
  title: string;
  sub: string;
  pos: "tl" | "tr" | "bl" | "br";
  active: boolean;
  tone: "good" | "bad";
}) {
  const align =
    pos === "tl"
      ? "items-start text-left"
      : pos === "tr"
        ? "items-end text-right"
        : pos === "bl"
          ? "items-start justify-end text-left"
          : "items-end justify-end text-right";
  const wash = tone === "good" ? "bg-primary/10" : "bg-danger/10";
  return (
    <div className={`flex flex-col p-3 ${align} ${active ? wash : "bg-transparent"}`}>
      <span className={`font-display text-sm font-semibold ${active ? "text-fg" : "text-subtle"}`}>{title}</span>
      <span className="mt-0.5 text-xs text-subtle">{sub}</span>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: "ring" | "good" | "bad"; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={
          swatch === "ring"
            ? "size-2.5 rounded-full border-2 border-muted"
            : swatch === "good"
              ? "size-2.5 rounded-full bg-primary"
              : "size-2.5 rounded-full bg-danger"
        }
      />
      {label}
    </span>
  );
}
