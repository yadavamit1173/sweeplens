import { ButtonLink } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-sm font-medium text-teal-200">
          Explainable liquidity sweep analysis
        </p>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Detect likely liquidity sweeps with reclaim and confirmation context.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          SweepLens is a chart-based market-structure workspace for traders who want clearer visibility into prior highs/lows, equal-level liquidity pools, sweep candidates, reclaim behavior, and signal explanations.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/workspace">Open workspace</ButtonLink>
          <ButtonLink href="/docs" variant="secondary">
            Read methodology
          </ButtonLink>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl shadow-black/30">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
          <span>BTCUSDT · 15m</span>
          <span className="rounded-full bg-teal-300/10 px-3 py-1 text-teal-200">Demo</span>
        </div>
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="absolute inset-x-8 top-20 border-t border-dashed border-red-300/70" />
          <div className="absolute inset-x-8 bottom-28 border-t border-dashed border-teal-300/70" />
          <div className="absolute left-16 top-28 h-28 w-8 rounded-t bg-red-400/70" />
          <div className="absolute left-32 top-36 h-20 w-8 rounded-t bg-teal-400/70" />
          <div className="absolute left-48 top-24 h-32 w-8 rounded-t bg-red-400/70" />
          <div className="absolute left-64 top-16 h-40 w-8 rounded-t bg-teal-400/70" />
          <div className="absolute right-24 top-12 rounded-xl border border-red-300/40 bg-red-300/10 px-3 py-2 text-sm text-red-100">
            Bearish sweep candidate
          </div>
          <div className="absolute bottom-8 left-8 rounded-xl border border-teal-300/30 bg-teal-300/10 px-3 py-2 text-sm text-teal-100">
            Reclaim logic + confidence reasons
          </div>
        </div>
      </div>
    </section>
  )
}
