export type LedgerInputs = {
  income: number;
  enough: number;
  chase: number;
  workHours: number;
  residueHours: number;
  sleepHours: number;
  health: number;
  relationships: number;
  emotion: number;
  recovery: number;
  horizonMonths: number;
};

export type QuadrantId = "surplus" | "overdraft" | "enough" | "loss";

export type Deduction = {
  id: string;
  label: string;
  note: string;
  amount: number;
  remaining: number;
  weight: number;
  gap: number;
};

export type Insight = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  tone: "warn" | "ok" | "note";
};

export type LedgerResult = {
  inputs: LedgerInputs;
  timeFreedom: number;
  healthScore: number;
  relScore: number;
  emoScore: number;
  lifeQuality: number;
  hedonicFit: number;
  sustain: number;
  dynamicRange: number;
  moneyAxis: number;
  lifeAxis: number;
  spectatorY: number;
  quadrant: QuadrantId;
  book: number;
  net: number;
  tax: number;
  taxRate: number;
  deductions: Deduction[];
  dimensions: { id: string; label: string; score: number; hint: string }[];
  insights: Insight[];
  verdict: { kicker: string; title: string; line: string };
};

export const INCOME_MIN = 8000;
export const INCOME_MAX = 250000;

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function costsFromChase(chase: number) {
  const t = smoothstep(chase / 100);
  return {
    workHours: round1(lerp(32, 78, t)),
    residueHours: round1(lerp(2, 30, t)),
    sleepHours: round1(lerp(8.2, 4.9, t)),
    health: Math.round(lerp(88, 28, t)),
    relationships: Math.round(lerp(84, 18, t)),
    emotion: Math.round(lerp(82, 24, t)),
  };
}

export const PRESETS: {
  id: string;
  label: string;
  blurb: string;
  values: Pick<LedgerInputs, "income" | "enough" | "chase" | "recovery" | "horizonMonths">;
}[] = [
  {
    id: "trader",
    label: "高压交易员",
    blurb: "账面很好看，生活动态范围被压扁",
    values: { income: 180000, enough: 250000, chase: 84, recovery: 16, horizonMonths: 0 },
  },
  {
    id: "sprint",
    label: "两年冲刺",
    blurb: "高强度，但有期限和退出条件",
    values: { income: 92000, enough: 60000, chase: 60, recovery: 52, horizonMonths: 24 },
  },
  {
    id: "pro",
    label: "稳定专业",
    blurb: "收入不炫目，账单却有余量",
    values: { income: 38000, enough: 30000, chase: 36, recovery: 70, horizonMonths: 60 },
  },
  {
    id: "winwin",
    label: "共赢系统",
    blurb: "有「够」的标准，休息提前进入系统",
    values: { income: 76000, enough: 52000, chase: 46, recovery: 78, horizonMonths: 48 },
  },
  {
    id: "grind",
    label: "双亏内卷",
    blurb: "钱不多，占用却很高",
    values: { income: 16000, enough: 42000, chase: 72, recovery: 14, horizonMonths: 0 },
  },
];

export function applyPreset(id: string): LedgerInputs {
  const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
  return {
    ...preset.values,
    ...costsFromChase(preset.values.chase),
  };
}

export const DEFAULT_INPUTS: LedgerInputs = applyPreset("trader");

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function hedonicFit(income: number, enough: number) {
  const base = Math.max(enough, 1);
  const ratio = income / base;
  if (ratio >= 1) {
    const extra = Math.log2(1 + (ratio - 1));
    return clamp(0.54 + 0.4 * (1 - 1 / (1 + extra)), 0, 1);
  }
  return clamp(0.54 * Math.pow(ratio, 1.35), 0, 1);
}

function sustainability(input: LedgerInputs, lifeQuality: number, intensity: number) {
  const rec = input.recovery / 100;
  const horizon = input.horizonMonths;

  if (horizon === 0) {
    let s = rec * 0.38 + lifeQuality * 0.22;
    if (intensity > 0.55) s *= 0.5;
    else s *= 0.78;
    return clamp(s, 0.08, 0.9);
  }

  if (horizon <= 36) {
    return clamp(0.5 + rec * 0.32 + (1 - Math.max(0, intensity - 0.42)) * 0.14, 0.2, 0.95);
  }

  let s = rec * 0.52 + lifeQuality * 0.32 + 0.1;
  if (intensity > 0.62) s *= 0.72;
  return clamp(s, 0.12, 0.96);
}

function moneyAxis(income: number) {
  const lo = Math.log(12000);
  const hi = Math.log(200000);
  return clamp((Math.log(Math.max(income, 8000)) - lo) / (hi - lo), 0, 1);
}

const TAX_WEIGHTS = [
  { id: "time", label: "时间与注意残留", note: "工时之外，脑子还停在工作上", weight: 0.24, score: (d: Scores) => d.timeFreedom },
  { id: "health", label: "睡眠与身体", note: "恢复不足会折损判断质量", weight: 0.14, score: (d: Scores) => d.healthScore },
  { id: "rel", label: "关系疏远", note: "朋友和在场被挤出账本", weight: 0.12, score: (d: Scores) => d.relScore },
  { id: "emo", label: "情绪与耐心", note: "基准抬高后，盈利也可能像失败", weight: 0.16, score: (d: Scores) => d.emoScore },
  { id: "sustain", label: "可持续折让", note: "三年后还能持有，才算真收益", weight: 0.2, score: (d: Scores) => d.sustain },
  { id: "hedonic", label: "享乐适应", note: "心理基准把多余的钱贴现", weight: 0.1, score: (d: Scores) => d.hedonic },
] as const;

type Scores = {
  timeFreedom: number;
  healthScore: number;
  relScore: number;
  emoScore: number;
  sustain: number;
  hedonic: number;
};

export function computeLedger(input: LedgerInputs): LedgerResult {
  const occupied = input.workHours + input.residueHours * 0.55;
  const timeFreedom = clamp(1 - (occupied - 36) / 55, 0, 1);
  const sleepScore = clamp((input.sleepHours - 4.6) / 3.6, 0, 1);
  const healthScore = clamp(input.health / 100, 0, 1) * 0.62 + sleepScore * 0.38;
  const relScore = clamp(input.relationships / 100, 0, 1);
  const emoScore = clamp(input.emotion / 100, 0, 1);
  const lifeQuality = clamp(
    timeFreedom * 0.28 + healthScore * 0.22 + relScore * 0.22 + emoScore * 0.28,
    0,
    1,
  );
  const intensity = clamp((input.chase / 100) * 0.55 + (1 - lifeQuality) * 0.45, 0, 1);
  const hedonic = hedonicFit(input.income, input.enough);
  const sustain = sustainability(input, lifeQuality, intensity);
  const dynamicRange = clamp((input.recovery / 100) * 0.7 + timeFreedom * 0.3, 0, 1);
  const scores: Scores = { timeFreedom, healthScore, relScore, emoScore, sustain, hedonic };

  const book = input.income;
  const deductions: Deduction[] = [];
  let remaining = book;
  for (const layer of TAX_WEIGHTS) {
    const gap = 1 - layer.score(scores);
    const amount = book * layer.weight * gap;
    remaining -= amount;
    deductions.push({
      id: layer.id,
      label: layer.label,
      note: layer.note,
      weight: layer.weight,
      gap,
      amount,
      remaining: Math.max(0, remaining),
    });
  }
  const net = Math.max(book * 0.06, remaining);
  const tax = book - net;
  const taxRate = book > 0 ? tax / book : 0;

  const mx = moneyAxis(book);
  const lifeAxis = clamp(lifeQuality * 0.7 + sustain * 0.3, 0, 1);
  const spectatorY = clamp(0.58 + mx * 0.28, 0.58, 0.9);

  let quadrant: QuadrantId;
  if (mx >= 0.5 && lifeAxis >= 0.5) quadrant = "surplus";
  else if (mx >= 0.5 && lifeAxis < 0.5) quadrant = "overdraft";
  else if (mx < 0.5 && lifeAxis >= 0.5) quadrant = "enough";
  else quadrant = "loss";

  const dimensions = [
    { id: "money", label: "钱", score: clamp(hedonic, 0, 1), hint: "相对「够了」的满足，不是账面绝对值" },
    { id: "time", label: "时间", score: timeFreedom, hint: "工作时长 + 注意残留" },
    { id: "health", label: "健康", score: healthScore, hint: "睡眠和身体报警" },
    { id: "rel", label: "关系", score: relScore, hint: "还能不能无目的地在场" },
    { id: "emo", label: "情绪", score: emoScore, hint: "耐心、焦虑、对生活本身的兴趣" },
    { id: "hold", label: "可持续", score: sustain, hint: "有没有期限、退出和恢复" },
  ];

  return {
    inputs: input,
    timeFreedom,
    healthScore,
    relScore,
    emoScore,
    lifeQuality,
    hedonicFit: hedonic,
    sustain,
    dynamicRange,
    moneyAxis: mx,
    lifeAxis,
    spectatorY,
    quadrant,
    book,
    net,
    tax,
    taxRate,
    deductions,
    dimensions,
    insights: buildInsights(input, {
      timeFreedom,
      healthScore,
      relScore,
      emoScore,
      lifeQuality,
      hedonic,
      sustain,
      dynamicRange,
      occupied,
      taxRate,
      net,
      book,
      quadrant,
    }),
    verdict: VERDICT[quadrant](net, book, taxRate),
  };
}

const VERDICT: Record<
  QuadrantId,
  (net: number, book: number, taxRate: number) => LedgerResult["verdict"]
> = {
  surplus: (net, book) => ({
    kicker: "盈余 · 值得长期持有",
    title: "把完整账单算上，这份生活仍然有余量",
    line: `账面 ${formatMoney(book)}，净当量 ${formatMoney(net)}。钱和日子没有互相吃掉。`,
  }),
  overdraft: (net, book, taxRate) => ({
    kicker: "透支 · 高收入的隐藏成本",
    title: "旁观者看见的是收入，账本里记下的是折损",
    line: `账面 ${formatMoney(book)} 被折掉 ${Math.round(taxRate * 100)}%，只剩 ${formatMoney(net)} 的可持有当量。`,
  }),
  enough: (net, book) => ({
    kicker: "够了 · 安静的富足",
    title: "数字不刺眼，生活净收益却站得住",
    line: `账面 ${formatMoney(book)}，净当量 ${formatMoney(net)}。有些盈余从来不会出现在收益曲线上。`,
  }),
  loss: (net, book) => ({
    kicker: "双亏 · 钱和日子一起变窄",
    title: "收入没有把代价买回来",
    line: `账面 ${formatMoney(book)}，净当量只剩 ${formatMoney(net)}。这不是暂时的辛苦，是结构问题。`,
  }),
};

function buildInsights(
  input: LedgerInputs,
  d: {
    timeFreedom: number;
    healthScore: number;
    relScore: number;
    emoScore: number;
    lifeQuality: number;
    hedonic: number;
    sustain: number;
    dynamicRange: number;
    occupied: number;
    taxRate: number;
    net: number;
    book: number;
    quadrant: QuadrantId;
  },
): Insight[] {
  const out: Insight[] = [];

  if (input.residueHours >= 12) {
    out.push({
      id: "residue",
      kicker: "注意残留",
      title: "人已经离开屏幕，脑子还没有离开市场",
      body: `每周名义工作 ${trimNum(input.workHours)} 小时，额外还有 ${trimNum(input.residueHours)} 小时心理占用。晚饭、聊天、睡前仍在复盘，生活时间被渗透了。`,
      tone: "warn",
    });
  }

  if (input.income >= input.enough * 0.9 && d.hedonic < 0.58) {
    out.push({
      id: "hedonic",
      kicker: "享乐适应",
      title: "钱增加得很快，满足感未必同步增长",
      body: `月入 ${formatMoney(input.income)}，但「够了」已经被抬到 ${formatMoney(input.enough)}。新的收入水平一旦成为常态，向上就从选择变成压力。`,
      tone: "warn",
    });
  } else if (input.enough > 0 && input.income >= input.enough && d.hedonic >= 0.7) {
    out.push({
      id: "enough-set",
      kicker: "主动设定「够」",
      title: "赚钱不必是一个没有自然终点的游戏",
      body: `心理基准 ${formatMoney(input.enough)} 低于账面收入。这是少数能同时抬高满足感和净当量、却不必加强度的杠杆。`,
      tone: "ok",
    });
  }

  if (d.dynamicRange < 0.34) {
    out.push({
      id: "range",
      kicker: "动态范围",
      title: "人不能长期活在最大音量",
      body: "高强度判断之后缺少低刺激时段。休息一旦也变成绩效任务，生活会失去强弱变化，主观体验随之贫乏。",
      tone: "warn",
    });
  } else if (input.recovery >= 65 && input.income >= 50000) {
    out.push({
      id: "periodize",
      kicker: "周期化",
      title: "专业训练很少靠每天把自己练废",
      body: "恢复空间被提前写进系统，而不是等所有事做完再剩一点。这是共赢结构：判断质量更稳，收入也更可持有。",
      tone: "ok",
    });
  }

  if (input.horizonMonths === 0 && input.chase >= 58) {
    out.push({
      id: "no-exit",
      kicker: "没有退出条件",
      title: "有期限的冲刺，和没有尽头的透支，是两种生活",
      body: "收入下降就加倍、身体变差也加倍、关系恶化仍加倍——短期能承受，很容易被误认成长期能力。",
      tone: "warn",
    });
  } else if (input.horizonMonths > 0 && input.horizonMonths <= 36 && input.chase >= 58) {
    out.push({
      id: "sprint-ok",
      kicker: "有期限的投入",
      title: "阶段性可以拼，但必须知道自己在换什么",
      body: `当前按 ${input.horizonMonths} 个月来持有高强度。有期限、有退出，透支才可能兑换成资本、技能或选择权，而不是无限期折损。`,
      tone: "note",
    });
  }

  if (d.relScore < 0.36) {
    out.push({
      id: "rel",
      kicker: "关系",
      title: "不社交被解释成专注，并不等于它没有成本",
      body: "朋友渐渐疏远很少出现在收益曲线上。可一份只能靠持续恶化关系来维持的收入，结构上并不适合长期持有。",
      tone: "warn",
    });
  }

  if (d.taxRate >= 0.55 && d.book >= 80000) {
    out.push({
      id: "expensive-money",
      kicker: "昂贵的钱",
      title: "高收入可以贵，但不该贵到持有的人自己拿不住",
      body: `每赚 1 块，大约有 ${Math.round(d.taxRate * 100)} 分被时间、身体、关系和情绪贴现。看收益率，也要看风险调整后的生活结果。`,
      tone: "warn",
    });
  }

  if (d.quadrant === "enough" || d.quadrant === "surplus") {
    out.push({
      id: "hold",
      kicker: "可持有",
      title: "把钱、时间、健康、关系、情绪和可持续性一起放进账本",
      body: `净当量 ${formatMoney(d.net)}。如果这份生活三年后身体大概率更好、仍有自由时间、对生活本身还有兴趣——它才是盈余。`,
      tone: "ok",
    });
  }

  const order = [
    "residue",
    "hedonic",
    "enough-set",
    "range",
    "periodize",
    "no-exit",
    "sprint-ok",
    "expensive-money",
    "rel",
    "hold",
  ];
  out.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return out.slice(0, 4);
}

export function formatMoney(n: number) {
  const sign = n < 0 ? "\u2212" : "";
  const abs = Math.abs(n);
  if (abs >= 10000) {
    const w = abs / 10000;
    const s = w >= 10 ? w.toFixed(1).replace(/\.0$/, "") : w.toFixed(1).replace(/\.0$/, "");
    return `${sign}${s}万`;
  }
  return `${sign}${Math.round(abs).toLocaleString("zh-CN")}`;
}

export function formatYuan(n: number) {
  return `${Math.round(n).toLocaleString("zh-CN")}`;
}

export function trimNum(n: number) {
  return String(Number(n.toFixed(1)));
}

export function horizonLabel(months: number) {
  if (months <= 0) return "无尽头";
  if (months < 12) return `${months} 个月`;
  const y = months / 12;
  return Number.isInteger(y) ? `${y} 年` : `${trimNum(y)} 年`;
}

export const QUADRANT_META: Record<
  QuadrantId,
  { label: string; x: "high" | "low"; y: "high" | "low" }
> = {
  surplus: { label: "盈余", x: "high", y: "high" },
  overdraft: { label: "透支", x: "high", y: "low" },
  enough: { label: "够了", x: "low", y: "high" },
  loss: { label: "双亏", x: "low", y: "low" },
};
