import type { EqualLevelCluster, SwingPoint } from '@/lib/detection/types'

export type EqualLevelResult = {
  equalHighs: EqualLevelCluster[]
  equalLows: EqualLevelCluster[]
}

function assertValidTolerance(tolerancePct: number): void {
  if (!Number.isFinite(tolerancePct) || tolerancePct < 0) {
    throw new Error('Equal-level tolerance must be a non-negative finite number')
  }
}

function toleranceForPrice(price: number, tolerancePct: number): number {
  return Math.abs(price) * (tolerancePct / 100)
}

function buildCluster(
  kind: EqualLevelCluster['kind'],
  members: SwingPoint[],
  clusterIndex: number,
): EqualLevelCluster {
  const prices = members.map((member) => member.price)
  const indexes = members.map((member) => member.index)
  const lowerBound = Math.min(...prices)
  const upperBound = Math.max(...prices)
  const representativePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

  return {
    id: `${kind}-${clusterIndex}-${indexes.join('-')}`,
    kind,
    startIndex: Math.min(...indexes),
    endIndex: Math.max(...indexes),
    memberIndexes: indexes,
    lowerBound,
    upperBound,
    representativePrice,
  }
}

function clusterSwings(
  kind: EqualLevelCluster['kind'],
  swings: SwingPoint[],
  tolerancePct: number,
): EqualLevelCluster[] {
  const clusters: EqualLevelCluster[] = []
  const sortedSwings = [...swings].sort((a, b) => a.index - b.index)

  for (const swing of sortedSwings) {
    let matchedClusterMembers: SwingPoint[] | undefined

    for (const cluster of clusters) {
      const tolerance = toleranceForPrice(cluster.representativePrice, tolerancePct)
      const lower = cluster.representativePrice - tolerance
      const upper = cluster.representativePrice + tolerance

      if (swing.price >= lower && swing.price <= upper) {
        matchedClusterMembers = cluster.memberIndexes.map((index) => {
          const found = sortedSwings.find((candidate) => candidate.index === index)
          if (!found) throw new Error(`Missing swing index ${index} while rebuilding cluster`)
          return found
        })

        if (!cluster.memberIndexes.includes(swing.index)) {
          matchedClusterMembers.push(swing)
        }

        const updatedCluster = buildCluster(kind, matchedClusterMembers, clusters.length)
        Object.assign(cluster, updatedCluster, { id: cluster.id })
        break
      }
    }

    if (!matchedClusterMembers) {
      const tolerance = toleranceForPrice(swing.price, tolerancePct)
      const nearby = sortedSwings.filter((candidate) => {
        if (candidate.index === swing.index) return false
        if (candidate.index < swing.index) return false
        return Math.abs(candidate.price - swing.price) <= tolerance
      })

      if (nearby.length > 0) {
        clusters.push(buildCluster(kind, [swing, ...nearby], clusters.length))
      }
    }
  }

  const uniqueByMembers = new Map<string, EqualLevelCluster>()
  for (const cluster of clusters) {
    const key = cluster.memberIndexes.join('-')
    uniqueByMembers.set(key, cluster)
  }

  return [...uniqueByMembers.values()].sort((a, b) => a.startIndex - b.startIndex)
}

export function detectEqualLevels(
  swings: { highs: SwingPoint[]; lows: SwingPoint[] },
  tolerancePct: number,
): EqualLevelResult {
  assertValidTolerance(tolerancePct)

  return {
    equalHighs: clusterSwings('equalHighs', swings.highs, tolerancePct),
    equalLows: clusterSwings('equalLows', swings.lows, tolerancePct),
  }
}
