import { describe, expect, it } from 'vitest'
import type { Candle } from '@/lib/detection/types'
import { defaultDetectorSettings } from '@/lib/app/settings-defaults'
import { runDetector } from '@/lib/detection'

const bearishSweepCandles: Candle[] = [
  { timestamp: 1, open: 100, high: 101, low: 99, close: 100 },
  { timestamp: 2, open: 100, high: 110, low: 99, close: 108 },
  { timestamp: 3, open: 108, high: 109, low: 100, close: 102 },
  { timestamp: 4, open: 102, high: 110.4, low: 101, close: 108 },
  { timestamp: 5, open: 108, high: 109, low: 100, close: 102 },
  { timestamp: 6, open: 117, high: 118, low: 104, close: 109 },
  { timestamp: 7, open: 109, high: 110, low: 98, close: 99 },
]

const bullishSweepCandles: Candle[] = [
  { timestamp: 1, open: 100, high: 101, low: 99, close: 100 },
  { timestamp: 2, open: 100, high: 105, low: 90, close: 92 },
  { timestamp: 3, open: 92, high: 98, low: 91, close: 97 },
  { timestamp: 4, open: 97, high: 99, low: 89.6, close: 91 },
  { timestamp: 5, open: 91, high: 103, low: 90.5, close: 102 },
  { timestamp: 6, open: 89, high: 103, low: 88, close: 102 },
  { timestamp: 7, open: 102, high: 106, low: 101, close: 105 },
]

describe('detector sweep and reclaim pipeline', () => {
  it('detects a bearish sweep after buy-side liquidity is taken and reclaimed', () => {
    const result = runDetector(bearishSweepCandles, {
      ...defaultDetectorSettings,
      swingLookback: 1,
      equalLevelTolerancePct: 1,
      minBreachPct: 0.01,
      reclaimWindowCandles: 2,
    })

    expect(result.errors).toEqual([])
    expect(result.signals.length).toBeGreaterThan(0)

    const signal = result.signals.find(
      (candidate) => candidate.direction === 'bearish' && candidate.levelType === 'equalHighs',
    )
    expect(signal).toBeDefined()
    expect(signal).toMatchObject({
      direction: 'bearish',
      state: 'confirmed',
      levelType: 'equalHighs',
    })
    expect(signal?.reasons.some((reason) => reason.includes('buy-side liquidity'))).toBe(true)
  })

  it('detects a bullish sweep after sell-side liquidity is taken and reclaimed', () => {
    const result = runDetector(bullishSweepCandles, {
      ...defaultDetectorSettings,
      swingLookback: 1,
      equalLevelTolerancePct: 2,
      minBreachPct: 0.01,
      reclaimWindowCandles: 2,
    })

    expect(result.errors).toEqual([])
    expect(result.signals.length).toBeGreaterThan(0)

    const signal = result.signals.find(
      (candidate) => candidate.direction === 'bullish' && candidate.levelType === 'equalLows',
    )
    expect(signal).toBeDefined()
    expect(signal).toMatchObject({
      direction: 'bullish',
      state: 'confirmed',
      levelType: 'equalLows',
    })
    expect(signal?.reasons.some((reason) => reason.includes('sell-side liquidity'))).toBe(true)
  })

  it('returns validation errors instead of throwing for invalid candles', () => {
    const result = runDetector([
      { timestamp: 1, open: 100, high: 99, low: 98, close: 101 },
    ], defaultDetectorSettings)

    expect(result.signals).toEqual([])
    expect(result.errors).toContain('Candle 0: high must be greater than or equal to open, close, and low')
  })
})
