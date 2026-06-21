import type { Candle } from '@/lib/detection/types'

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function validateCandles(candles: Candle[]): ValidationResult {
  const errors: string[] = []

  if (!Array.isArray(candles)) {
    return { valid: false, errors: ['Candles input must be an array'] }
  }

  if (candles.length === 0) {
    return { valid: false, errors: ['Candles input is empty'] }
  }

  candles.forEach((candle, index) => {
    const prefix = `Candle ${index}`

    if (!isFiniteNumber(candle.timestamp)) errors.push(`${prefix}: timestamp must be a finite number`)
    if (!isFiniteNumber(candle.open)) errors.push(`${prefix}: open must be a finite number`)
    if (!isFiniteNumber(candle.high)) errors.push(`${prefix}: high must be a finite number`)
    if (!isFiniteNumber(candle.low)) errors.push(`${prefix}: low must be a finite number`)
    if (!isFiniteNumber(candle.close)) errors.push(`${prefix}: close must be a finite number`)

    if (candle.volume !== undefined && !isFiniteNumber(candle.volume)) {
      errors.push(`${prefix}: volume must be a finite number when provided`)
    }

    if (
      isFiniteNumber(candle.open) &&
      isFiniteNumber(candle.high) &&
      isFiniteNumber(candle.low) &&
      isFiniteNumber(candle.close)
    ) {
      const maxBodyPrice = Math.max(candle.open, candle.close, candle.low)
      const minBodyPrice = Math.min(candle.open, candle.close, candle.high)

      if (candle.high < maxBodyPrice) {
        errors.push(`${prefix}: high must be greater than or equal to open, close, and low`)
      }

      if (candle.low > minBodyPrice) {
        errors.push(`${prefix}: low must be less than or equal to open, close, and high`)
      }
    }

    if (index > 0 && isFiniteNumber(candle.timestamp) && isFiniteNumber(candles[index - 1].timestamp)) {
      if (candle.timestamp <= candles[index - 1].timestamp) {
        errors.push(`${prefix}: timestamp must be greater than previous candle timestamp`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function assertValidCandles(candles: Candle[]): void {
  const result = validateCandles(candles)

  if (!result.valid) {
    throw new Error(result.errors.join('; '))
  }
}
