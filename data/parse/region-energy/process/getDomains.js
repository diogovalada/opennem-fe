import * as FT from '@/constants/energy-fuel-techs/group-detailed.js'
import * as PSR from '@/constants/energy-fuel-techs/group-psr.js'
import * as CFT from '@/constants/curtailment-fuel-techs/group-detailed.js'
import {
  PRICE,
  PRICE_ABOVE_300,
  PRICE_BELOW_0,
  VW_PRICE,
  VW_PRICE_ABOVE_300,
  VW_PRICE_BELOW_0,
  CPI
} from '@/constants/data-types'

const PRICE_COLOUR = '#e34a33'

export function getFuelTechInOrder(data) {
  const group = getFuelTechGroup(data)
  const fuelTechs = {}
  group.DEFAULT_FUEL_TECH_ORDER.forEach((ft) => {
    const find = data.find((d) => d.fuel_tech === ft)
    if (find) {
      fuelTechs[ft] = find.id
    }
  })
  return { ids: fuelTechs, group }
}

export function getFuelTechDomains(ids, type, group = FT) {
  return ids ? group.getFuelTechObjs(ids, type).reverse() : []
}

export function getCurtailmentInOrder(data) {
  const fuelTechs = {}
  CFT.DEFAULT_FUEL_TECH_ORDER.forEach((ft) => {
    const find = data.find((d) => d.fuel_tech === ft)
    if (find) {
      fuelTechs[ft] = find.id
    }
  })
  return fuelTechs
}

export function getCurtailmentDomains(ids, type) {
  return ids ? CFT.getFuelTechObjs(ids, type).reverse() : []
}

export function getFuelTechWithTypeDomains(ids, type, group = FT) {
  const mutateIds = {}
  Object.keys(ids).forEach((key) => {
    const split = ids[key].split('.')
    split.pop()
    const newId = `${split.join('.')}.${type}`
    mutateIds[key] = newId
  })
  return group.getFuelTechObjs(mutateIds, type).reverse()
}

function isPsrFuelTech(value) {
  return /^B\d{2}$/.test(value || '')
}

export function getFuelTechGroup(data) {
  if (!data) return FT
  const hasPsr = data.some((d) => isPsrFuelTech(d.fuel_tech))
  return hasPsr ? PSR : FT
}

export function getTemperatureDomains(data) {
  return data.map((d) => {
    return {
      id: d.id,
      domain: d.id,
      type: d.type,
      label: 'Temperature',
      colour: '#e34a33'
    }
  })
}

export function getPriceDomains(res) {
  let domains = res.map((d) => {
    return { id: d.id, domain: d.id, type: d.type, colour: PRICE_COLOUR, label: 'Price' }
  })
  if (domains.length > 0) {
    domains = [...domains, ...getDerivedPriceDomains()]
  }
  return domains
}

export function getDerivedPriceDomains() {
  return [
    {
      id: PRICE_ABOVE_300,
      domain: PRICE_ABOVE_300,
      type: PRICE,
      colour: PRICE_COLOUR
    },
    {
      id: PRICE_BELOW_0,
      domain: PRICE_BELOW_0,
      type: PRICE,
      colour: PRICE_COLOUR
    }
  ]
}

export function getVolWeightedPriceDomains() {
  return [
    {
      id: '_volWeightedPrice',
      domain: '_volWeightedPrice',
      type: 'price',
      colour: PRICE_COLOUR
    },
    {
      id: '_volWeightedPriceAbove300',
      domain: '_volWeightedPriceAbove300',
      type: 'price',
      colour: PRICE_COLOUR
    },
    {
      id: '_volWeightedPriceBelow0',
      domain: '_volWeightedPriceBelow0',
      type: 'price',
      colour: PRICE_COLOUR
    }
  ]
}

export function getDemandVWPriceDomains() {
  return [
    {
      id: VW_PRICE,
      domain: VW_PRICE,
      type: 'price',
      colour: PRICE_COLOUR
    },
    {
      id: VW_PRICE_ABOVE_300,
      domain: VW_PRICE_ABOVE_300,
      type: 'price',
      colour: PRICE_COLOUR
    },
    {
      id: VW_PRICE_BELOW_0,
      domain: VW_PRICE_BELOW_0,
      type: 'price',
      colour: PRICE_COLOUR
    }
  ]
}

export function getInflationDomain(id) {
  return {
    id,
    domain: id,
    type: CPI,
    colour: '#e34a33'
  }
}
