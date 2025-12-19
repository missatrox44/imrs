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
