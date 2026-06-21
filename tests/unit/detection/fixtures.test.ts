import { describe, expect, it } from 'vitest'
import { defaultDetectorSettings } from '@/lib/app/settings-defaults'
import { demoCandles, demoSignals } from '@/lib/market-data/fixtures'

describe('project scaffold fixtures', () => {
  it('provides ordered demo candles for the workspace', () => {
    expect(demoCandles.length).toBeGreaterThan(0)

    for (let index = 1; index < demoCandles.length; index += 1) {
      expect(demoCandles[index].timestamp).toBeGreaterThan(demoCandles[index - 1].timestamp)
    }
  })

  it('provides a valid demo sweep signal shape', () => {
    expect(demoSignals).toHaveLength(1)
    expect(demoSignals[0]).toMatchObject({
      direction: 'bearish',
      levelType: 'equalHighs',
      state: 'confirmed',
      confidence: 'medium',
    })
    expect(demoSignals[0].reasons.length).toBeGreaterThan(0)
  })

  it('keeps detector defaults conservative for the initial workspace', () => {
    expect(defaultDetectorSettings.requireCloseReclaim).toBe(true)
    expect(defaultDetectorSettings.showFailedSignals).toBe(false)
    expect(defaultDetectorSettings.swingLookback).toBeGreaterThan(0)
  })
})
