import { ChartContainer } from '@/components/chart/chart-container'
import { SiteHeader } from '@/components/layout/site-header'
import { WorkspaceShell } from '@/components/layout/workspace-shell'
import { ExplanationPanel } from '@/components/panels/explanation-panel'
import { SettingsPanel } from '@/components/panels/settings-panel'
import { demoCandles, demoSignals } from '@/lib/market-data/fixtures'

export default function WorkspacePage() {
  const selectedSignal = demoSignals[0]

  return (
    <>
      <SiteHeader />
      <WorkspaceShell
        settings={<SettingsPanel />}
        chart={<ChartContainer candles={demoCandles} signals={demoSignals} />}
        explanation={<ExplanationPanel signal={selectedSignal} />}
      />
    </>
  )
}
