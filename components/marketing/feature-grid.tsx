import { Card } from '@/components/ui/card'

const features = [
  {
    title: 'Liquidity level mapping',
    description: 'Track prior swing highs/lows and equal-level zones that may act as buy-side or sell-side liquidity pools.',
  },
  {
    title: 'Sweep and reclaim states',
    description: 'Classify events as candidate, reclaimed, confirmed, or failed instead of treating every breakout as equal.',
  },
  {
    title: 'Explainable signal context',
    description: 'Show the rule reasons behind each signal so traders can inspect logic instead of blindly following labels.',
  },
]

export function FeatureGrid() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-12 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title}>
          <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
        </Card>
      ))}
    </section>
  )
}
