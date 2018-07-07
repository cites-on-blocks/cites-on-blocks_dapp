import { COUNTRIES } from './countries'

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
