export type Candle = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export type SwingPoint = {
  index: number
  timestamp: number
  price: number
  kind: 'high' | 'low'
  strength?: number
}

export type EqualLevelCluster = {
  id: string
  kind: 'equalHighs' | 'equalLows'
  startIndex: number
  endIndex: number
  memberIndexes: number[]
  lowerBound: number
  upperBound: number
  representativePrice: number
}

export type DetectorSettings = {
  swingLookback: number
  equalLevelTolerancePct: number
  reclaimWindowCandles: number
  minBreachPct: number
  requireCloseReclaim: boolean
  requireConfirmation: boolean
  enableDisplacementCheck: boolean
  enableStructureShiftCheck: boolean
  showFailedSignals: boolean
}

export type SweepCandidate = {
  id: string
  direction: 'bullish' | 'bearish'
  levelType: 'swingHigh' | 'swingLow' | 'equalHighs' | 'equalLows'
  levelPrice: number
  levelBounds?: {
    lower: number
    upper: number
  }
  breachIndex: number
  breachTimestamp: number
  breachPrice: number
  breachMagnitudePct: number
  wickOnly: boolean
}

export type SweepSignal = {
  id: string
  symbol?: string
  timeframe?: string
  direction: 'bullish' | 'bearish'
  levelType: 'swingHigh' | 'swingLow' | 'equalHighs' | 'equalLows'
  sweptLevelPrice: number
  breachIndex: number
  reclaimIndex?: number
  state: 'candidate' | 'reclaimed' | 'confirmed' | 'failed'
  confidence: 'low' | 'medium' | 'high'
  reasons: string[]
  metrics: {
    breachMagnitudePct: number
    reclaimWindowUsed?: number
    displacementDetected?: boolean
    structureShiftDetected?: boolean
  }
}
