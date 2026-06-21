import type { Candle, SwingPoint } from '@/lib/detection/types'

export type SwingDetectionResult = {
  highs: SwingPoint[]
  lows: SwingPoint[]
}

function assertValidLookback(lookback: number): void {
  if (!Number.isInteger(lookback) || lookback < 1) {
    throw new Error('Swing lookback must be a positive integer')
  }
}

export function detectSwings(candles: Candle[], lookback: number): SwingDetectionResult {
  assertValidLookback(lookback)

  const highs: SwingPoint[] = []
  const lows: SwingPoint[] = []

  if (candles.length < lookback * 2 + 1) {
    return { highs, lows }
  }

  for (let index = lookback; index < candles.length - lookback; index += 1) {
    const candle = candles[index]
    const left = candles.slice(index - lookback, index)
    const right = candles.slice(index + 1, index + lookback + 1)
    const surrounding = [...left, ...right]

    const isSwingHigh = surrounding.every((nearby) => candle.high > nearby.high)
    const isSwingLow = surrounding.every((nearby) => candle.low < nearby.low)

    if (isSwingHigh) {
      highs.push({
        index,
        timestamp: candle.timestamp,
        price: candle.high,
        kind: 'high',
        strength: lookback,
      })
    }

    if (isSwingLow) {
      lows.push({
        index,
        timestamp: candle.timestamp,
        price: candle.low,
        kind: 'low',
        strength: lookback,
      })
    }
  }

  return { highs, lows }
}
