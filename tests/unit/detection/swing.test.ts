import { describe, expect, it } from 'vitest'
import type { Candle } from '@/lib/detection/types'
import { detectSwings } from '@/lib/detection/swing'

const candles: Candle[] = [
  { timestamp: 1, open: 100, high: 101, low: 99, close: 100 },
  { timestamp: 2, open: 100, high: 103, low: 98, close: 102 },
  { timestamp: 3, open: 102, high: 108, low: 101, close: 107 },
  { timestamp: 4, open: 107, high: 104, low: 97, close: 99 },
  { timestamp: 5, open: 99, high: 102, low: 96, close: 101 },
]

describe('detectSwings', () => {
  it('detects local swing highs and lows with configured lookback', () => {
    const result = detectSwings(candles, 1)

    expect(result.highs).toEqual([
      { index: 2, timestamp: 3, price: 108, kind: 'high', strength: 1 },
    ])
    expect(result.lows).toEqual([
      { index: 1, timestamp: 2, price: 98, kind: 'low', strength: 1 },
    ])
  })

  it('does not mark candles without enough surrounding context', () => {
    const result = detectSwings(candles, 2)

    expect(result.highs.map((swing) => swing.index)).toEqual([2])
    expect(result.lows).toEqual([])
  })

  it('marks equal-height double tops inside the lookback window as swing highs', () => {
    const doubleTopCandles: Candle[] = [
      { timestamp: 1, open: 100, high: 101, low: 99, close: 100 },
      { timestamp: 2, open: 100, high: 110, low: 99, close: 108 },
      { timestamp: 3, open: 108, high: 110, low: 100, close: 104 },
      { timestamp: 4, open: 104, high: 105, low: 98, close: 99 },
    ]

    const result = detectSwings(doubleTopCandles, 1)

    expect(result.highs.map((swing) => swing.index)).toEqual([1, 2])
  })

  it('rejects invalid lookback values', () => {
    expect(() => detectSwings(candles, 0)).toThrow('Swing lookback must be a positive integer')
  })
})
