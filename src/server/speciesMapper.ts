// fixes type errors when mapping Turso rows to Species
import type { Species } from '@/types/species'

export function rowToSpecies(row: Record<string, unknown>): Species {
  return {
    id: Number(row.id),

    category: row.category as string | undefined,
    kingdom: row.kingdom as string | undefined,
    phylum: row.phylum as string | undefined,
    phylum_common_name: row.phylum_common_name as string | undefined,
    sub_phylum: row.sub_phylum as string | undefined,
    sub_phylum_common_name: row.sub_phylum_common_name as string | undefined,
    class_name: row.class_name as string | undefined,
    class_common_name: row.class_common_name as string | undefined,
    sub_class: row.sub_class as string | undefined,
    sub_class_common_name: row.sub_class_common_name as string | undefined,
    order_name: row.order_name as string | undefined,
    order_common_name: row.order_common_name as string | undefined,
    sub_order: row.sub_order as string | undefined,
    sub_order_common_name: row.sub_order_common_name as string | undefined,
    family: row.family as string | undefined,
    family_common_name: row.family_common_name as string | undefined,
    sub_family: row.sub_family as string | undefined,
    sub_family_common_name: row.sub_family_common_name as string | undefined,
    genus: row.genus as string | undefined,
    species: row.species as string | undefined,
    authorship: row.authorship as string | undefined,
    collectors_field_numbers: row.collectors_field_numbers as string | undefined,
    note: row.note as string | undefined,
    species_common_name: row.species_common_name as string | undefined,
    records: row.records as string | undefined,
  }
}