import { createFileRoute } from "@tanstack/react-router";
import { computeLedger } from "@/lib/ledger";
import { useLedger } from "@/lib/store";
import { HeroYield } from "@/components/hero-yield";
import { QuadrantMap } from "@/components/quadrant-map";
import { LedgerSheet } from "@/components/ledger-sheet";
import { Waterfall } from "@/components/waterfall";
import { RangeMeter } from "@/components/range-meter";
import { ControlPanel } from "@/components/control-panel";
import { InsightList } from "@/components/insight-list";
import { ModelNotes } from "@/components/model-notes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const snapshot = useLedger();
  const result = computeLedger(snapshot);

  return (
    <main className="min-h-dvh overflow-x-hidden">
      <header className="border-b border-border/80">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-fg">净当量</p>
            <p className="mt-1 text-xs tracking-widest text-subtle">NET EQUIVALENT</p>
          </div>
          <p className="max-w-64 text-right text-xs leading-relaxed text-muted sm:text-sm">
            把钱和代价放进同一张账本
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8">
        <HeroYield result={result} />

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
              <Tabs defaultValue="quadrant">
                <TabsList>
                  <TabsTrigger value="quadrant">象限</TabsTrigger>
                  <TabsTrigger value="ledger">账单</TabsTrigger>
                  <TabsTrigger value="fall">瀑布</TabsTrigger>
                </TabsList>
                <TabsContent value="quadrant">
                  <QuadrantMap result={result} />
                </TabsContent>
                <TabsContent value="ledger">
                  <LedgerSheet result={result} />
                </TabsContent>
                <TabsContent value="fall">
                  <Waterfall result={result} />
                </TabsContent>
              </Tabs>
            </div>
            <RangeMeter result={result} />
          </div>

          <aside className="min-w-0 rounded-2xl bg-surface p-4 shadow-border sm:p-5">
            <ControlPanel />
          </aside>
        </div>

        <InsightList result={result} />
        <ModelNotes />
      </div>

      <footer className="border-t border-border/80">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-subtle sm:px-6">
          初稿。净当量把高收入的隐藏成本写成可拖动的当量，方便看见：有些钱很贵，有些日子看起来普通，账上却有盈余。
        </p>
      </footer>
    </main>
  );
}
