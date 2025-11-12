// 🌵 DOUBLE CHECK
import { useQuery } from '@tanstack/react-query'

export function useSpecies(searchTerm: string) {
  return useQuery({
    queryKey: ['species', searchTerm],
    queryFn: () =>
      fetch(`/api/species?search=${encodeURIComponent(searchTerm)}`)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok')
          return res.json()
        })
        .then((data) => data as Array<{
          id: number
          scientific_name: string
          common_name: string | null
          family: string | null
          notes: string | null
          category: string
        }>),
    staleTime: 1000 * 60 * 5,  // 5 minutes
  })
}