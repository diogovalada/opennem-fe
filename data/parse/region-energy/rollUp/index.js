import timeGroups from '@/data/helpers/time-groups'
import energyRollUp from './energyRollUp'
import powerRollUp from './powerRollUp'

export default function ({ domains, datasetFlat, interval }) {
  const isPowerInterval =
    interval === '5m' ||
    interval === '15m' ||
    interval === '30m' ||
    interval === '1h'

  return timeGroups({
    domains,
    datasetFlat,
    interval,
    rollUp: isPowerInterval ? powerRollUp : energyRollUp
  })
}
