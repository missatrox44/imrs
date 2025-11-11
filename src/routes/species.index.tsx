import { createFileRoute } from '@tanstack/react-router'
import SpeciesIndex from '@/components/SpeciesIndex'

export const Route = createFileRoute('/species/')({
  component: SpeciesIndex,
})

