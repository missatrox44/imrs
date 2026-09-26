import type { Category } from '@/types/category'
import type { TAXONOMIC_RANKS } from '@/data/constants'

export type TaxonRankKey = (typeof TAXONOMIC_RANKS)[number]['key']

export type SpeciesView = 'grid' | 'table'

export type SortDirection = 'asc' | 'desc'

/** One selected value per rank; absent = no filter at that rank. */
export type TaxonSelection = Partial<Record<TaxonRankKey, string>>

export type SpeciesSearch = {
  category: Category
  view: SpeciesView
  sort: SortDirection
  q?: string
} & TaxonSelection

export type RankOption = { value: string; count: number }
