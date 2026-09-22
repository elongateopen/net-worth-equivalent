export function ModelNotes() {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-border sm:p-7">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle">初稿模型</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-fg">这份当量怎么算</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        净当量不是精确的幸福公式，是一张把代价重新放进账本的草稿。它回答的是：如果把钱、时间、健康、关系、情绪和可持续性一起记账，这份收入还值不值得长期持有。
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Note
          kicker="变量"
          title="三层账"
          body="可见结果是月收入。心理账户是「够了」的基准。生活资源是工时、注意残留、睡眠、身体、关系、情绪。结构杠杆是恢复空间和冲刺期限。"
        />
        <Note
          kicker="关系"
          title="此消彼长，或共赢"
          body="打开联动后，加强度会拉动代价——这是零和拉扯。设定「够」、留下恢复、给冲刺一个退出条件，则不必继续加力，也能同时抬高净当量和可持有性。"
        />
        <Note
          kicker="三种图"
          title="象限 · 账单 · 瀑布"
          body="象限看旁观者与真实位置的落差。账单看六条资源谁在被吃掉。瀑布把账面逐项贴现成净当量。同一套数，三种读法。"
        />
      </div>
    </section>
  );
}

function Note({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.14em] text-subtle">{kicker}</p>
      <h3 className="mt-1 font-display text-base font-semibold text-fg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
