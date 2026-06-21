import { describe, expect, it } from 'vitest'
import { normalizeCandles } from '@/lib/market-data/normalize'
import { validateCandles } from '@/lib/validation/guards'

describe('candle validation and normalization', () => {
  it('accepts valid ordered candles', () => {
    const result = validateCandles([
      { timestamp: 1, open: 100, high: 105, low: 99, close: 104 },
      { timestamp: 2, open: 104, high: 106, low: 101, close: 102 },
    ])

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects malformed OHLC values', () => {
    const result = validateCandles([
      { timestamp: 1, open: 100, high: 99, low: 98, close: 101 },
    ])

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Candle 0: high must be greater than or equal to open, close, and low')
  })

  it('normalizes string provider values and sorts by timestamp', () => {
    const candles = normalizeCandles([
      { timestamp: '2', open: '104', high: '106', low: '101', close: '102', volume: '2000' },
      { timestamp: '1', open: '100', high: '105', low: '99', close: '104' },
    ])

    expect(candles).toEqual([
      { timestamp: 1, open: 100, high: 105, low: 99, close: 104, volume: undefined },
      { timestamp: 2, open: 104, high: 106, low: 101, close: 102, volume: 2000 },
    ])
  })
})
