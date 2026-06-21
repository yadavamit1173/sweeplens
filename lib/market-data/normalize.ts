import type { Candle } from '@/lib/detection/types'
import { validateCandles } from '@/lib/validation/guards'

export type RawCandle = {
  timestamp: number | string
  open: number | string
  high: number | string
  low: number | string
  close: number | string
  volume?: number | string
}

function toNumber(value: number | string | undefined): number | undefined {
  if (value === undefined) return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

export function normalizeCandles(rawCandles: RawCandle[]): Candle[] {
  const parsedCandles = rawCandles.map((raw) => ({
    timestamp: toNumber(raw.timestamp) ?? Number.NaN,
    open: toNumber(raw.open) ?? Number.NaN,
    high: toNumber(raw.high) ?? Number.NaN,
    low: toNumber(raw.low) ?? Number.NaN,
    close: toNumber(raw.close) ?? Number.NaN,
    volume: toNumber(raw.volume),
  }))

  const candlesByTimestamp = new Map<number, Candle>()

  for (const candle of parsedCandles) {
    candlesByTimestamp.set(candle.timestamp, candle)
  }

  const candles = [...candlesByTimestamp.values()].sort((a, b) => a.timestamp - b.timestamp)

  const validation = validateCandles(candles)

  if (!validation.valid) {
    throw new Error(validation.errors.join('; '))
  }

  return candles
}
