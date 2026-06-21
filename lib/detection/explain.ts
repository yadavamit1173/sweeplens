import type { SweepSignal } from '@/lib/detection/types'
import type { ConfirmedCandidate } from '@/lib/detection/confirm'
import { scoreCandidate } from '@/lib/detection/score'

function signalState(candidate: ConfirmedCandidate): SweepSignal['state'] {
  if (candidate.failed) return 'failed'
  if (candidate.confirmed) return 'confirmed'
  if (candidate.reclaimed) return 'reclaimed'
  return 'candidate'
}

function levelDescription(candidate: ConfirmedCandidate): string {
  switch (candidate.levelType) {
    case 'equalHighs':
      return 'prior equal highs'
    case 'equalLows':
      return 'prior equal lows'
    case 'swingHigh':
      return 'prior swing high'
    case 'swingLow':
      return 'prior swing low'
  }
}

function buildReasons(candidate: ConfirmedCandidate): string[] {
  const side = candidate.direction === 'bearish' ? 'buy-side' : 'sell-side'
  const reasons = [
    `Swept ${levelDescription(candidate)} (${side} liquidity)`,
    `Breach magnitude was ${candidate.breachMagnitudePct.toFixed(2)}%`,
  ]

  if (candidate.wickOnly) {
    reasons.push('Sweep was wick-only relative to the swept threshold')
  }

  if (candidate.reclaimed && candidate.reclaimIndex !== undefined) {
    reasons.push(`Reclaimed swept level within ${candidate.reclaimIndex - candidate.breachIndex} candle(s)`)
  }

  if (candidate.failed) {
    reasons.push('No reclaim occurred within the configured reclaim window')
  }

  if (candidate.displacementDetected) {
    reasons.push('Opposite-direction displacement candle detected')
  }

  if (candidate.structureShiftDetected) {
    reasons.push('Simple short-term structure shift detected')
  }

  return reasons
}

export function toSweepSignal(candidate: ConfirmedCandidate): SweepSignal {
  return {
    id: candidate.id,
    direction: candidate.direction,
    levelType: candidate.levelType,
    sweptLevelPrice: candidate.levelPrice,
    breachIndex: candidate.breachIndex,
    reclaimIndex: candidate.reclaimIndex,
    state: signalState(candidate),
    confidence: scoreCandidate(candidate),
    reasons: buildReasons(candidate),
    metrics: {
      breachMagnitudePct: candidate.breachMagnitudePct,
      reclaimWindowUsed: candidate.reclaimIndex === undefined ? undefined : candidate.reclaimIndex - candidate.breachIndex,
      displacementDetected: candidate.displacementDetected,
      structureShiftDetected: candidate.structureShiftDetected,
    },
  }
}

export function toSweepSignals(candidates: ConfirmedCandidate[], showFailedSignals: boolean): SweepSignal[] {
  return candidates
    .filter((candidate) => showFailedSignals || !candidate.failed)
    .map(toSweepSignal)
}
