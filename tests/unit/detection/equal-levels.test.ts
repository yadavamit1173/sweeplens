import { describe, expect, it } from 'vitest'
import type { SwingPoint } from '@/lib/detection/types'
import { detectEqualLevels } from '@/lib/detection/equal-levels'

const highs: SwingPoint[] = [
  { index: 1, timestamp: 1, price: 100, kind: 'high' },
  { index: 3, timestamp: 3, price: 100.05, kind: 'high' },
  { index: 5, timestamp: 5, price: 104, kind: 'high' },
]

const lows: SwingPoint[] = [
  { index: 2, timestamp: 2, price: 95, kind: 'low' },
  { index: 4, timestamp: 4, price: 95.04, kind: 'low' },
  { index: 6, timestamp: 6, price: 90, kind: 'low' },
]

describe('detectEqualLevels', () => {
  it('clusters swing highs and lows inside tolerance', () => {
    const result = detectEqualLevels({ highs, lows }, 0.1)

    expect(result.equalHighs).toHaveLength(1)
    expect(result.equalHighs[0]).toMatchObject({
      kind: 'equalHighs',
      memberIndexes: [1, 3],
      lowerBound: 100,
      upperBound: 100.05,
    })

    expect(result.equalLows).toHaveLength(1)
    expect(result.equalLows[0]).toMatchObject({
      kind: 'equalLows',
      memberIndexes: [2, 4],
      lowerBound: 95,
      upperBound: 95.04,
    })
  })

  it('does not cluster levels outside tolerance', () => {
    const result = detectEqualLevels({ highs, lows }, 0.01)

    expect(result.equalHighs).toEqual([])
    expect(result.equalLows).toEqual([])
  })

  it('rejects invalid tolerance values', () => {
    expect(() => detectEqualLevels({ highs, lows }, -1)).toThrow('Equal-level tolerance must be a non-negative finite number')
  })
})
