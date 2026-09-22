import { PRESETS, formatMoney, horizonLabel, trimNum, INCOME_MIN, INCOME_MAX } from "@/lib/ledger";
import { useLedger } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FieldSlider } from "@/components/field-slider";

export function ControlPanel() {
  const s = useLedger();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-semibold text-fg">情景样本</h2>
        <p className="mt-1 text-sm text-muted">先看别人的完整账单，再拖自己的。</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              type="button"
              variant="outline"
              className="h-auto min-h-11 w-full min-w-0 flex-col items-start gap-0.5 whitespace-normal px-3 py-2.5 text-left"
              onClick={() => s.loadPreset(p.id)}
            >
              <span className="text-sm text-fg">{p.label}</span>
              <span className="w-full text-xs font-normal leading-snug text-muted">{p.blurb}</span>
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <Header kicker="可见数字" title="账面" />
        <FieldSlider
          label="月收入"
          value={s.income}
          display={formatMoney(s.income)}
          min={INCOME_MIN}
          max={INCOME_MAX}
          step={1000}
          onChange={(v) => s.setField("income", v)}
          hint="每天都能看见的那一栏"
        />
        <FieldSlider
          label="觉得「够了」"
          value={s.enough}
          display={formatMoney(s.enough)}
          min={INCOME_MIN}
          max={INCOME_MAX}
          step={1000}
          onChange={(v) => s.setField("enough", v)}
          hint="心理基准。抬高它，账面涨了也像失败"
        />
      </section>

      <section className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <Header kicker="此消彼长" title="追逐强度" />
          <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs text-muted">
            联动代价
            <Switch checked={s.linkage} onCheckedChange={s.setLinkage} />
          </label>
        </div>
        <FieldSlider
          label="工作强度"
          value={s.chase}
          display={`${Math.round(s.chase)}`}
          min={0}
          max={100}
          onChange={s.setChase}
          hint={s.linkage ? "打开联动时，强度会拉动工时、睡眠、关系和情绪" : "已关闭联动，强度不再改写下面的代价"}
        />
      </section>

      <section className="space-y-5">
        <Header kicker="共赢杠杆" title="结构，不是更用力" />
        <FieldSlider
          label="恢复空间"
          value={s.recovery}
          display={`${Math.round(s.recovery)}`}
          min={0}
          max={100}
          onChange={(v) => s.setField("recovery", v)}
          hint="低刺激时段。休息提前进入系统，而不是做完再剩"
        />
        <FieldSlider
          label="冲刺期限"
          value={s.horizonMonths}
          display={horizonLabel(s.horizonMonths)}
          min={0}
          max={60}
          step={6}
          onChange={(v) => s.setField("horizonMonths", v)}
          hint="0 表示没有退出条件，高强度会被当成无限期透支"
        />
      </section>

      <details className="group rounded-xl bg-paper-2 px-4 py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm text-fg [&::-webkit-details-marker]:hidden">
          细调生活资源
          <span className="text-xs text-subtle group-open:hidden">工时 / 睡眠 / 关系</span>
        </summary>
        <div className="mt-4 space-y-5 pb-2">
          <FieldSlider
            label="每周工时"
            value={s.workHours}
            display={`${trimNum(s.workHours)} h`}
            min={20}
            max={90}
            step={0.5}
            onChange={(v) => s.setField("workHours", v)}
          />
          <FieldSlider
            label="注意残留"
            value={s.residueHours}
            display={`${trimNum(s.residueHours)} h`}
            min={0}
            max={40}
            step={0.5}
            onChange={(v) => s.setField("residueHours", v)}
            hint="人离开屏幕后，脑子还停在工作上的小时"
          />
          <FieldSlider
            label="每晚睡眠"
            value={s.sleepHours}
            display={`${trimNum(s.sleepHours)} h`}
            min={4.5}
            max={9}
            step={0.1}
            onChange={(v) => s.setField("sleepHours", v)}
          />
          <FieldSlider
            label="身体"
            value={s.health}
            display={`${Math.round(s.health)}`}
            min={0}
            max={100}
            onChange={(v) => s.setField("health", v)}
          />
          <FieldSlider
            label="关系在场"
            value={s.relationships}
            display={`${Math.round(s.relationships)}`}
            min={0}
            max={100}
            onChange={(v) => s.setField("relationships", v)}
          />
          <FieldSlider
            label="情绪与耐心"
            value={s.emotion}
            display={`${Math.round(s.emotion)}`}
            min={0}
            max={100}
            onChange={(v) => s.setField("emotion", v)}
          />
        </div>
      </details>
    </div>
  );
}

function Header({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-subtle">{kicker}</p>
      <h2 className="mt-1 font-display text-lg font-semibold text-fg">{title}</h2>
    </div>
  );
}
