import { createFileRoute } from '@tanstack/react-router'
import SpeciesIndex from '@/components/SpeciesIndex'

export const Route = createFileRoute('/species/')({
  //   loader: async () => {
  //   const res = await fetch('/api/species');
  //   if (!res.ok) throw new Error('Failed to fetch species');
  //   return res.json();
  // },
  component: SpeciesIndex,
})

