import type { Candle, DetectorSettings } from '@/lib/detection/types'
import type { ReclaimedCandidate } from '@/lib/detection/reclaim'

export type ConfirmedCandidate = ReclaimedCandidate & {
  displacementDetected: boolean
  structureShiftDetected: boolean
  confirmed: boolean
}

function candleBodySize(candle: Candle): number {
  return Math.abs(candle.close - candle.open)
}

function averageBodySize(candles: Candle[]): number {
  if (candles.length === 0) return 0
  return candles.reduce((sum, candle) => sum + candleBodySize(candle), 0) / candles.length
}

function hasOppositeDisplacement(candles: Candle[], candidate: ReclaimedCandidate): boolean {
  const startIndex = candidate.reclaimIndex ?? candidate.breachIndex
  const confirmationCandle = candles[startIndex]
  if (!confirmationCandle) return false

  const lookbackStart = Math.max(0, startIndex - 5)
  const recentCandles = candles.slice(lookbackStart, startIndex)
  const averageBody = averageBodySize(recentCandles)
  const body = candleBodySize(confirmationCandle)

  const directionMatches =
    candidate.direction === 'bearish'
      ? confirmationCandle.close < confirmationCandle.open
      : confirmationCandle.close > confirmationCandle.open

  return directionMatches && (averageBody === 0 ? body > 0 : body >= averageBody)
}

function hasSimpleStructureShift(candles: Candle[], candidate: ReclaimedCandidate): boolean {
  const index = candidate.reclaimIndex ?? candidate.breachIndex
  const previous = candles[index - 1]
  const current = candles[index]
  if (!previous || !current) return false

  if (candidate.direction === 'bearish') {
    return current.low < previous.low && current.close < previous.close
  }

  return current.high > previous.high && current.close > previous.close
}

export function applyConfirmation(
  candles: Candle[],
  candidates: ReclaimedCandidate[],
  settings: Pick<DetectorSettings, 'enableDisplacementCheck' | 'enableStructureShiftCheck' | 'requireConfirmation'>,
): ConfirmedCandidate[] {
  return candidates.map((candidate) => {
    const displacementDetected = candidate.reclaimed && settings.enableDisplacementCheck
      ? hasOppositeDisplacement(candles, candidate)
      : false
    const structureShiftDetected = candidate.reclaimed && settings.enableStructureShiftCheck
      ? hasSimpleStructureShift(candles, candidate)
      : false

    const enabledChecks = [
      settings.enableDisplacementCheck ? displacementDetected : undefined,
      settings.enableStructureShiftCheck ? structureShiftDetected : undefined,
    ].filter((value): value is boolean => value !== undefined)

    const confirmed = candidate.reclaimed && (enabledChecks.length === 0 ? !settings.requireConfirmation : enabledChecks.some(Boolean))

    return {
      ...candidate,
      displacementDetected,
      structureShiftDetected,
      confirmed,
    }
  })
}
