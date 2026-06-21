import type { DetectorSettings } from '@/lib/detection/types'

export const defaultDetectorSettings: DetectorSettings = {
  swingLookback: 2,
  equalLevelTolerancePct: 0.08,
  reclaimWindowCandles: 3,
  minBreachPct: 0.03,
  requireCloseReclaim: true,
  requireConfirmation: false,
  enableDisplacementCheck: true,
  enableStructureShiftCheck: false,
  showFailedSignals: false,
}

export const supportedSymbols = ['BTCUSDT', 'ETHUSDT'] as const
export const supportedTimeframes = ['5m', '15m', '1h'] as const
