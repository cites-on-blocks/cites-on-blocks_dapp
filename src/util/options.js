import { COUNTRIES } from './countries'
import { SPECIES } from './species'

export const COUNTRY_OPTS = Object.values(COUNTRIES).map(c => ({
  ...c,
  label: `${c.value} - ${c.name}`
}))

export const COUNTRY_FILTER_OPTS = [
  {
    value: 'all',
    label: 'All'
  }
].concat(COUNTRY_OPTS)

export const STATUS_FILTER_OPTS = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'created',
    label: 'Created'
  },
  {
    value: 'processed',
    label: 'Processed'
  }
]

export const SPECIES_SC_NAME_OPTS = SPECIES.map(s => ({
  ...s,
  label: s.scientificName
}))

export const SPECIES_COM_NAME_OPTS = SPECIES.map(s => ({
  ...s,
  label: s.commonName
}))

export const LISTED_COUNTRIES = Object.values(COUNTRIES).filter(key =>
  key.hasOwnProperty('entry')
)
