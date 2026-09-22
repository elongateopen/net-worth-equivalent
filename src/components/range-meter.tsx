import type { LedgerResult } from "@/lib/ledger";

export function RangeMeter({ result }: { result: LedgerResult }) {
  const v = result.dynamicRange;
  const peaked = v < 0.34;
  return (
    <div className="rounded-xl bg-surface p-4 shadow-border sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-fg">生活动态范围</h2>
        <span className={`font-mono text-xs tabular-nums ${peaked ? "text-danger" : "text-muted"}`}>
          {peaked ? "最大音量" : v > 0.65 ? "有强弱" : "偏紧"}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        借用音乐里的动态范围：有高强度判断，就需要低刺激时段。从头到尾都在最大音量，时间一长只会疲劳。
      </p>
      <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-paper-2">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-danger/15" />
        <div className="absolute inset-y-0 left-1/3 w-1/3 bg-primary/10" />
        <div
          className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-border transition-[left,background-color] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)] ${
            peaked ? "bg-danger" : "bg-primary"
          }`}
          style={{ left: `${8 + v * 84}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] tracking-wide text-subtle">
        <span>压扁</span>
        <span>强弱变化</span>
        <span>留白充足</span>
      </div>
    </div>
  );
}
