import type { Candle, DetectorSettings, SweepCandidate } from '@/lib/detection/types'

export type ReclaimedCandidate = SweepCandidate & {
  reclaimIndex?: number
  reclaimed: boolean
  failed: boolean
}

function assertValidWindow(window: number): void {
  if (!Number.isInteger(window) || window < 1) {
    throw new Error('Reclaim window must be a positive integer')
  }
}

function reclaimThreshold(candidate: SweepCandidate): number {
  if (candidate.direction === 'bearish') {
    return candidate.levelBounds?.upper ?? candidate.levelPrice
  }

  return candidate.levelBounds?.lower ?? candidate.levelPrice
}

function isReclaimed(candle: Candle, candidate: SweepCandidate, requireCloseReclaim: boolean): boolean {
  const threshold = reclaimThreshold(candidate)

  if (candidate.direction === 'bearish') {
    return requireCloseReclaim ? candle.close < threshold : candle.low < threshold
  }

  return requireCloseReclaim ? candle.close > threshold : candle.high > threshold
}

export function detectReclaims(
  candles: Candle[],
  candidates: SweepCandidate[],
  settings: Pick<DetectorSettings, 'reclaimWindowCandles' | 'requireCloseReclaim'>,
): ReclaimedCandidate[] {
  assertValidWindow(settings.reclaimWindowCandles)

  return candidates.map((candidate) => {
    const lastIndex = Math.min(candles.length - 1, candidate.breachIndex + settings.reclaimWindowCandles)

    for (let index = candidate.breachIndex; index <= lastIndex; index += 1) {
      const candle = candles[index]

      if (isReclaimed(candle, candidate, settings.requireCloseReclaim)) {
        return {
          ...candidate,
          reclaimIndex: index,
          reclaimed: true,
          failed: false,
        }
      }
    }

    return {
      ...candidate,
      reclaimed: false,
      failed: true,
    }
  })
}
