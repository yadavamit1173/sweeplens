import type { Candle, SweepSignal } from '@/lib/detection/types'

export const demoCandles: Candle[] = [
  { timestamp: 1700000000000, open: 100, high: 104, low: 98, close: 103, volume: 1200 },
  { timestamp: 1700000900000, open: 103, high: 106, low: 101, close: 102, volume: 1100 },
  { timestamp: 1700001800000, open: 102, high: 108, low: 100, close: 107, volume: 1500 },
  { timestamp: 1700002700000, open: 107, high: 109, low: 105, close: 106, volume: 1300 },
  { timestamp: 1700003600000, open: 106, high: 110, low: 104, close: 109, volume: 1800 },
  { timestamp: 1700004500000, open: 109, high: 111, low: 106, close: 107, volume: 1700 },
  { timestamp: 1700005400000, open: 107, high: 112, low: 105, close: 111, volume: 2100 },
  { timestamp: 1700006300000, open: 111, high: 113, low: 108, close: 109, volume: 2400 },
  { timestamp: 1700007200000, open: 109, high: 110, low: 103, close: 104, volume: 2600 },
  { timestamp: 1700008100000, open: 104, high: 106, low: 101, close: 105, volume: 1900 },
  { timestamp: 1700009000000, open: 105, high: 107, low: 102, close: 103, volume: 1700 },
  { timestamp: 1700009900000, open: 103, high: 105, low: 99, close: 100, volume: 2200 },
]

export const demoSignals: SweepSignal[] = [
  {
    id: 'demo-bearish-sweep-1',
    symbol: 'BTCUSDT',
    timeframe: '15m',
    direction: 'bearish',
    levelType: 'equalHighs',
    sweptLevelPrice: 111,
    breachIndex: 7,
    reclaimIndex: 8,
    state: 'confirmed',
    confidence: 'medium',
    reasons: [
      'Swept prior equal highs near 111',
      'Closed back below the swept zone within 1 candle',
      'Follow-through candle moved away from the swept level',
    ],
    metrics: {
      breachMagnitudePct: 1.8,
      reclaimWindowUsed: 1,
      displacementDetected: true,
      structureShiftDetected: false,
    },
  },
]
