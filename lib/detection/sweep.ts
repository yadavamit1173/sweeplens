import type { Candle, DetectorSettings, EqualLevelCluster, SweepCandidate, SwingPoint } from '@/lib/detection/types'
import type { EqualLevelResult } from '@/lib/detection/equal-levels'
import type { SwingDetectionResult } from '@/lib/detection/swing'

type TrackableLevel = {
  type: SweepCandidate['levelType']
  price: number
  bounds?: { lower: number; upper: number }
  sourceIndex: number
}

function pctMove(from: number, to: number): number {
  if (from === 0) return 0
  return (Math.abs(to - from) / Math.abs(from)) * 100
}

function highLevelFromSwing(swing: SwingPoint): TrackableLevel {
  return { type: 'swingHigh', price: swing.price, sourceIndex: swing.index }
}

function lowLevelFromSwing(swing: SwingPoint): TrackableLevel {
  return { type: 'swingLow', price: swing.price, sourceIndex: swing.index }
}

function levelFromCluster(cluster: EqualLevelCluster): TrackableLevel {
  return {
    type: cluster.kind,
    price: cluster.representativePrice,
    bounds: { lower: cluster.lowerBound, upper: cluster.upperBound },
    sourceIndex: cluster.endIndex,
  }
}

function buildBuySideLevels(swings: SwingDetectionResult, equalLevels: EqualLevelResult): TrackableLevel[] {
  return [...equalLevels.equalHighs.map(levelFromCluster), ...swings.highs.map(highLevelFromSwing)]
}

function buildSellSideLevels(swings: SwingDetectionResult, equalLevels: EqualLevelResult): TrackableLevel[] {
  return [...equalLevels.equalLows.map(levelFromCluster), ...swings.lows.map(lowLevelFromSwing)]
}

function candidateId(direction: SweepCandidate['direction'], level: TrackableLevel, breachIndex: number): string {
  return `${direction}-${level.type}-${level.sourceIndex}-${breachIndex}`
}

export function detectSweepCandidates(
  candles: Candle[],
  swings: SwingDetectionResult,
  equalLevels: EqualLevelResult,
  settings: Pick<DetectorSettings, 'minBreachPct'>,
): SweepCandidate[] {
  const candidates: SweepCandidate[] = []
  const buySideLevels = buildBuySideLevels(swings, equalLevels)
  const sellSideLevels = buildSellSideLevels(swings, equalLevels)

  for (let index = 0; index < candles.length; index += 1) {
    const candle = candles[index]

    for (const level of buySideLevels) {
      if (level.sourceIndex >= index) continue
      const breachThreshold = level.bounds?.upper ?? level.price
      if (candle.high <= breachThreshold) continue

      const breachMagnitudePct = pctMove(breachThreshold, candle.high)
      if (breachMagnitudePct < settings.minBreachPct) continue

      candidates.push({
        id: candidateId('bearish', level, index),
        direction: 'bearish',
        levelType: level.type,
        levelPrice: level.price,
        levelBounds: level.bounds,
        breachIndex: index,
        breachTimestamp: candle.timestamp,
        breachPrice: candle.high,
        breachMagnitudePct,
        wickOnly: candle.close <= breachThreshold,
      })
    }

    for (const level of sellSideLevels) {
      if (level.sourceIndex >= index) continue
      const breachThreshold = level.bounds?.lower ?? level.price
      if (candle.low >= breachThreshold) continue

      const breachMagnitudePct = pctMove(breachThreshold, candle.low)
      if (breachMagnitudePct < settings.minBreachPct) continue

      candidates.push({
        id: candidateId('bullish', level, index),
        direction: 'bullish',
        levelType: level.type,
        levelPrice: level.price,
        levelBounds: level.bounds,
        breachIndex: index,
        breachTimestamp: candle.timestamp,
        breachPrice: candle.low,
        breachMagnitudePct,
        wickOnly: candle.close >= breachThreshold,
      })
    }
  }

  return candidates.sort((a, b) => a.breachIndex - b.breachIndex || a.id.localeCompare(b.id))
}
