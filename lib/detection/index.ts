import type { Candle, DetectorSettings, SweepSignal } from '@/lib/detection/types'
import { applyConfirmation } from '@/lib/detection/confirm'
import { detectEqualLevels } from '@/lib/detection/equal-levels'
import { toSweepSignals } from '@/lib/detection/explain'
import { detectReclaims } from '@/lib/detection/reclaim'
import { detectSwings } from '@/lib/detection/swing'
import { detectSweepCandidates } from '@/lib/detection/sweep'
import { validateCandles } from '@/lib/validation/guards'

export type DetectorRunResult = {
  candles: Candle[]
  swings: ReturnType<typeof detectSwings>
  equalLevels: ReturnType<typeof detectEqualLevels>
  signals: SweepSignal[]
  errors: string[]
}

export function runDetector(candles: Candle[], settings: DetectorSettings): DetectorRunResult {
  const validation = validateCandles(candles)

  if (!validation.valid) {
    return {
      candles,
      swings: { highs: [], lows: [] },
      equalLevels: { equalHighs: [], equalLows: [] },
      signals: [],
      errors: validation.errors,
    }
  }

  const swings = detectSwings(candles, settings.swingLookback)
  const equalLevels = detectEqualLevels(swings, settings.equalLevelTolerancePct)
  const candidates = detectSweepCandidates(candles, swings, equalLevels, settings)
  const reclaimed = detectReclaims(candles, candidates, settings)
  const confirmed = applyConfirmation(candles, reclaimed, settings)
  const signals = toSweepSignals(confirmed, settings.showFailedSignals)

  return {
    candles,
    swings,
    equalLevels,
    signals,
    errors: [],
  }
}
