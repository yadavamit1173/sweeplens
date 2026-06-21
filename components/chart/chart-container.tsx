import type { Candle, SweepSignal } from '@/lib/detection/types'

type ChartContainerProps = Readonly<{
  candles: Candle[]
  signals: SweepSignal[]
}>

export function ChartContainer({ candles, signals }: ChartContainerProps) {
  return (
    <div className="flex h-full min-h-[560px] flex-col">
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm text-slate-400">Demo workspace</p>
          <h1 className="text-xl font-semibold text-white">BTCUSDT · 15m</h1>
        </div>
        <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200">
          {signals.length} signal{signals.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="absolute inset-x-6 top-24 border-t border-dashed border-red-300/70" />
        <div className="absolute inset-x-6 bottom-28 border-t border-dashed border-teal-300/70" />
        <div className="absolute left-6 top-6 text-xs text-slate-500">Fixture candles: {candles.length}</div>

        {candles.slice(0, 16).map((candle, index) => {
          const isBullish = candle.close >= candle.open
          const height = Math.max(32, Math.abs(candle.close - candle.open) * 9)
          const top = isBullish ? 210 - height : 210
          return (
            <div
              key={`${candle.timestamp}-${index}`}
              className={`absolute bottom-20 w-5 rounded-sm ${isBullish ? 'bg-teal-400/80' : 'bg-red-400/80'}`}
              style={{ left: `${32 + index * 34}px`, height: `${height}px`, top: `${top}px` }}
              title={`O:${candle.open} H:${candle.high} L:${candle.low} C:${candle.close}`}
            />
          )
        })}

        {signals.map((signal) => (
          <div
            key={signal.id}
            className="absolute right-6 top-10 max-w-xs rounded-xl border border-red-300/40 bg-red-300/10 px-3 py-2 text-sm text-red-100"
          >
            {signal.state === 'confirmed' ? 'Confirmed' : 'Candidate'} {signal.direction} sweep
          </div>
        ))}
      </div>
    </div>
  )
}
