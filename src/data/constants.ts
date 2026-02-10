import type { Category } from '@/types/category'

export const STATS = [
  {
    value: 40000,
    label: 'Acres Protected',
    suffix: '+',
  },
  {
    value: 1200,
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


export const TAXONOMIC_RANKS = [
  { key: 'kingdom' as const, label: 'Kingdom' },
  { key: 'phylum' as const, label: 'Phylum' },
  { key: 'class_name' as const, label: 'Class' },
  { key: 'order_name' as const, label: 'Order' },
  { key: 'family' as const, label: 'Family' },
  { key: 'genus' as const, label: 'Genus' },
]

export const ALL_CATEGORIES: Array<Category> = [
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'fish',
  'plants',
  'fungi',
  'arthropods',
  'inverts',
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

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/observations', label: 'Observations' },
  { to: '/species', label: 'Species Index' },
  { to: '/gazetteer', label: 'Gazetteer' },
]

export const externalLinks = [
  { to: 'https://www.utep.edu/science/indio/', label: 'IMRS' },
  { to: 'https://www.inaturalist.org/', label: 'iNaturalist' },
]

// export const otherLinks = [
//   { to: 'https://github.com/missatrox44/imrs/issues', label: 'Report an issue' }
// ]