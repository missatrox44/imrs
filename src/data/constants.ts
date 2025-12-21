import type { Category } from '@/types/category'

export const STATS = [
  {
    value: 40000,
    label: 'Acres Protected',
    suffix: '+',
  },
  {
    value: 3000,
    label: 'Species Documented',
    suffix: '+',
  },
  {
    value: 1400,
    label: 'iNaturalist Observations',
    suffix: '+',
  },
  {
    value: 84,
    label: 'Scientific Publications',
    suffix: '',
  },
]

export const PER_PAGE = 50
export const SKELETON_COUNT = 8
export const iNaturalistUrl  = new URL('https://api.inaturalist.org/v1/observations')
export const PLACE_ID = '225419'
export const ORDER = 'desc'
export const ORDER_BY = 'observed_on' 
export const STALE_TIME = 1000 * 60 * 60 * 24 * 30 // 30 days
export const GC_TIME = 1000 * 60 * 60 * 24 * 60 // 60 days


// FUTURE for filtering observations
export const TAXON_GROUPS = [
  { value: '', label: 'All' },
  { value: 'Mammalia', label: 'Mammals' },
  { value: 'Aves', label: 'Birds' },
  { value: 'Reptilia', label: 'Reptiles' },
  { value: 'Amphibia', label: 'Amphibians' },
  { value: 'Insecta', label: 'Insects' },
  { value: 'Plantae', label: 'Plants' },
  { value: 'Fungi', label: 'Fungi' }
]

export const ALL_CATEGORIES: Array<Category> = [
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'plants',
  'fungi',
  'arthropods',
  'worms',
]