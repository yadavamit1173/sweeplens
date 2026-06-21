import type { SweepSignal } from '@/lib/detection/types'
import type { ConfirmedCandidate } from '@/lib/detection/confirm'

export function scoreCandidate(candidate: ConfirmedCandidate): SweepSignal['confidence'] {
  let score = 0

  if (candidate.breachMagnitudePct >= 0.1) score += 1
  if (candidate.wickOnly) score += 1
  if (candidate.reclaimed) score += 1
  if (candidate.displacementDetected) score += 1
  if (candidate.structureShiftDetected) score += 1

  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}
