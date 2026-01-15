export const GROUP_LABEL = 'PSR'
export const GROUP_NAME = 'psr'

export const B01 = 'B01'
export const B02 = 'B02'
export const B03 = 'B03'
export const B04 = 'B04'
export const B05 = 'B05'
export const B06 = 'B06'
export const B07 = 'B07'
export const B08 = 'B08'
export const B09 = 'B09'
export const B10 = 'B10'
export const B11 = 'B11'
export const B12 = 'B12'
export const B13 = 'B13'
export const B14 = 'B14'
export const B15 = 'B15'
export const B16 = 'B16'
export const B17 = 'B17'
export const B18 = 'B18'
export const B19 = 'B19'
export const B20 = 'B20'

export const DEFAULT_FUEL_TECH_ORDER = [
  B01,
  B02,
  B03,
  B04,
  B05,
  B06,
  B07,
  B08,
  B09,
  B10,
  B11,
  B12,
  B13,
  B14,
  B15,
  B16,
  B17,
  B18,
  B19,
  B20
]

export const DEFAULT_FUEL_TECH_COLOUR = {}
DEFAULT_FUEL_TECH_COLOUR[B01] = '#2E8B57'
DEFAULT_FUEL_TECH_COLOUR[B02] = '#8B5A2B'
DEFAULT_FUEL_TECH_COLOUR[B03] = '#6B4F2A'
DEFAULT_FUEL_TECH_COLOUR[B04] = '#F4A259'
DEFAULT_FUEL_TECH_COLOUR[B05] = '#1C1C1C'
DEFAULT_FUEL_TECH_COLOUR[B06] = '#D95F02'
DEFAULT_FUEL_TECH_COLOUR[B07] = '#A65628'
DEFAULT_FUEL_TECH_COLOUR[B08] = '#7A4E2D'
DEFAULT_FUEL_TECH_COLOUR[B09] = '#E6AB02'
DEFAULT_FUEL_TECH_COLOUR[B10] = '#4E79A7'
DEFAULT_FUEL_TECH_COLOUR[B11] = '#59A14F'
DEFAULT_FUEL_TECH_COLOUR[B12] = '#4F81BD'
DEFAULT_FUEL_TECH_COLOUR[B13] = '#76B7B2'
DEFAULT_FUEL_TECH_COLOUR[B14] = '#9C9EDE'
DEFAULT_FUEL_TECH_COLOUR[B15] = '#8CD17D'
DEFAULT_FUEL_TECH_COLOUR[B16] = '#F1CE63'
DEFAULT_FUEL_TECH_COLOUR[B17] = '#B07AA1'
DEFAULT_FUEL_TECH_COLOUR[B18] = '#1F77B4'
DEFAULT_FUEL_TECH_COLOUR[B19] = '#2CA02C'
DEFAULT_FUEL_TECH_COLOUR[B20] = '#BAB0AC'

export const LOAD = 'load'
export const SOURCE = 'source'
export const FUEL_TECH_CATEGORY = {}
DEFAULT_FUEL_TECH_ORDER.forEach((ft) => {
  FUEL_TECH_CATEGORY[ft] = SOURCE
})

export const FUEL_TECH_RENEWABLE = {}
FUEL_TECH_RENEWABLE[B01] = true
FUEL_TECH_RENEWABLE[B02] = false
FUEL_TECH_RENEWABLE[B03] = false
FUEL_TECH_RENEWABLE[B04] = false
FUEL_TECH_RENEWABLE[B05] = false
FUEL_TECH_RENEWABLE[B06] = false
FUEL_TECH_RENEWABLE[B07] = false
FUEL_TECH_RENEWABLE[B08] = false
FUEL_TECH_RENEWABLE[B09] = true
FUEL_TECH_RENEWABLE[B10] = false
FUEL_TECH_RENEWABLE[B11] = true
FUEL_TECH_RENEWABLE[B12] = true
FUEL_TECH_RENEWABLE[B13] = true
FUEL_TECH_RENEWABLE[B14] = false
FUEL_TECH_RENEWABLE[B15] = true
FUEL_TECH_RENEWABLE[B16] = true
FUEL_TECH_RENEWABLE[B17] = false
FUEL_TECH_RENEWABLE[B18] = true
FUEL_TECH_RENEWABLE[B19] = true
FUEL_TECH_RENEWABLE[B20] = false

export const FUEL_TECH_LABEL = {}
FUEL_TECH_LABEL[B01] = 'Biomass'
FUEL_TECH_LABEL[B02] = 'Fossil Brown coal/Lignite'
FUEL_TECH_LABEL[B03] = 'Fossil Coal-derived gas'
FUEL_TECH_LABEL[B04] = 'Fossil Gas'
FUEL_TECH_LABEL[B05] = 'Fossil Hard coal'
FUEL_TECH_LABEL[B06] = 'Fossil Oil'
FUEL_TECH_LABEL[B07] = 'Fossil Oil shale'
FUEL_TECH_LABEL[B08] = 'Fossil Peat'
FUEL_TECH_LABEL[B09] = 'Geothermal'
FUEL_TECH_LABEL[B10] = 'Hydro Pumped Storage'
FUEL_TECH_LABEL[B11] = 'Hydro Run-of-river and poundage'
FUEL_TECH_LABEL[B12] = 'Hydro Water Reservoir'
FUEL_TECH_LABEL[B13] = 'Marine'
FUEL_TECH_LABEL[B14] = 'Nuclear'
FUEL_TECH_LABEL[B15] = 'Other renewable'
FUEL_TECH_LABEL[B16] = 'Solar'
FUEL_TECH_LABEL[B17] = 'Waste'
FUEL_TECH_LABEL[B18] = 'Wind Offshore'
FUEL_TECH_LABEL[B19] = 'Wind Onshore'
FUEL_TECH_LABEL[B20] = 'Other'

export const FUEL_TECH_SHORT_LABEL = {}

export function getFuelTechObjs(fuelTechs, type) {
  return Object.keys(fuelTechs).map((ft) => {
    return {
      id: fuelTechs[ft],
      domain: fuelTechs[ft],
      fuelTech: ft,
      label: FUEL_TECH_LABEL[ft],
      colour: DEFAULT_FUEL_TECH_COLOUR[ft],
      category: FUEL_TECH_CATEGORY[ft],
      renewable: FUEL_TECH_RENEWABLE[ft],
      type
    }
  })
}

export function isLoad(fuelTech) {
  return FUEL_TECH_CATEGORY[fuelTech] === LOAD
}

export function isValidFuelTech(fuelTech) {
  return FUEL_TECH_LABEL[fuelTech] !== undefined
}
