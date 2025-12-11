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
          id: number;
          category?: string;
          kingdom?: string;
          phylum?: string;
          phylum_common_name?: string;
          sub_phylum?: string;
          sub_phylum_common_name?: string;
          class_name?: string;
          class_common_name?: string;
          sub_class?: string;
          sub_class_common_name?: string;
          order_name?: string;
          order_common_name?: string;
          sub_order?: string;
          sub_order_common_name?: string;
          family?: string;
          family_common_name?: string;
          sub_family?: string;
          sub_family_common_name?: string;
          genus?: string;
          species?: string;
          authorship?: string;
          collectors_field_numbers?: string;
          note?: string;
          species_common_name?: string;
          records?: string;
        }>),
    staleTime: 1000 * 60 * 5,  // 5 minutes
  })
}