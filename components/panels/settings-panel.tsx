import { defaultDetectorSettings, supportedSymbols, supportedTimeframes } from '@/lib/app/settings-defaults'

export function SettingsPanel() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Detector setup</p>
      <h2 className="mt-2 text-lg font-semibold text-white">Workspace settings</h2>
      <div className="mt-5 space-y-5 text-sm">
        <label className="block">
          <span className="mb-2 block text-slate-400">Symbol</span>
          <select className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
            {supportedSymbols.map((symbol) => (
              <option key={symbol}>{symbol}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-slate-400">Timeframe</span>
          <select className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" defaultValue="15m">
            {supportedTimeframes.map((timeframe) => (
              <option key={timeframe}>{timeframe}</option>
            ))}
          </select>
        </label>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="font-medium text-slate-200">Default sensitivity</p>
          <dl className="mt-3 space-y-2 text-slate-400">
            <div className="flex justify-between gap-3">
              <dt>Swing lookback</dt>
              <dd>{defaultDetectorSettings.swingLookback}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Equal-level tolerance</dt>
              <dd>{defaultDetectorSettings.equalLevelTolerancePct}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Reclaim window</dt>
              <dd>{defaultDetectorSettings.reclaimWindowCandles} candles</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
