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
export const iNaturalistUrl = new URL('https://api.inaturalist.org/v1/observations')
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

export const CAROUSEL_IMAGES = [
  { src: 'imgs/carousel_1.webp', alt: 'IMRS landscape photograph 1' },
  { src: 'imgs/carousel_2.webp', alt: 'IMRS landscape photograph 2' },
  { src: 'imgs/carousel_3.webp', alt: 'IMRS landscape photograph 3' },
  { src: 'imgs/carousel_4.webp', alt: 'IMRS landscape photograph 4' },
  { src: 'imgs/carousel_5.webp', alt: 'IMRS landscape photograph 5' },
  { src: 'imgs/carousel_6.webp', alt: 'IMRS landscape photograph 6' },
  { src: 'imgs/carousel_7.webp', alt: 'IMRS landscape photograph 7' },
  { src: 'imgs/carousel_8.webp', alt: 'IMRS landscape photograph 8' },
  { src: 'imgs/carousel_9.webp', alt: 'IMRS landscape photograph 9' },
  { src: 'imgs/carousel_10.webp', alt: 'IMRS landscape photograph 10' },
  { src: 'imgs/carousel_11.webp', alt: 'IMRS landscape photograph 11' },
  { src: 'imgs/carousel_12.webp', alt: 'IMRS landscape photograph 12' },
  { src: 'imgs/carousel_13.webp', alt: 'IMRS landscape photograph 13' },
];