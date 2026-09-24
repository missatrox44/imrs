import type { Category } from '@/types/category'

export const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All Species',
  mammals: 'Mammals',
  birds: 'Birds',
  reptiles: 'Reptiles',
  amphibians: 'Amphibians',
  fish: 'Fish',
  plants: 'Plants',
  fungi: 'Fungi',
  arthropods: 'Arthropods',
  inverts: 'Invertebrates',
}

/** Inline colors for an active category pill (Tailwind can't see runtime var() names). */
export function categoryPillStyle(category: Category): {
  backgroundColor: string
  color: string
} {
  if (category === 'all') {
    return {
      backgroundColor: 'var(--color-brand-green)',
      color: 'var(--color-brand-light)',
    }
  }
  const textColor =
    category === 'fish' || category === 'fungi'
      ? 'var(--color-brand-light)'
      : 'var(--color-brand-ink)'
  return {
    backgroundColor: `var(--color-category-${category})`,
    color: textColor,
  }
}
