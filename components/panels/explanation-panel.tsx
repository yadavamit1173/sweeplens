import type { SweepSignal } from '@/lib/detection/types'

type ExplanationPanelProps = Readonly<{
  signal?: SweepSignal
}>

export function ExplanationPanel({ signal }: ExplanationPanelProps) {
  if (!signal) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Signal details</p>
        <h2 className="mt-2 text-lg font-semibold text-white">No signal selected</h2>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Select a sweep marker to inspect level type, reclaim state, confidence, and rule-based reasons.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Signal details</p>
      <h2 className="mt-2 text-lg font-semibold text-white">
        {signal.direction} {signal.state} sweep
      </h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
          <dt className="text-slate-400">Level type</dt>
          <dd className="text-slate-100">{signal.levelType}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
          <dt className="text-slate-400">Swept price</dt>
          <dd className="text-slate-100">{signal.sweptLevelPrice}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
          <dt className="text-slate-400">Confidence</dt>
          <dd className="capitalize text-teal-200">{signal.confidence}</dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="font-medium text-slate-200">Reasons</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          {signal.reasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
