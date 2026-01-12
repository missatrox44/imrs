export type TaxonGroup =
  | 'all'
  | 'mammals'
  | 'birds'
  | 'reptiles'
  | 'amphibians'
  | 'plants'
  | 'insects'
  | 'invertebrates'
  | 'fish'
  | 'fungi'
  | 'arachnid'

export const GROUP_TO_TAXON_ID: Partial<Record<TaxonGroup, number>> = {
  mammals: 40151,       // Mammalia (class)
  birds: 3,             // Aves (class)
  reptiles: 26036,      // Reptilia (class)
  amphibians: 20978,    // Amphibia (class)
  plants: 47126,        // Plantae (kingdom)
  insects: 47158,       // Insecta (class)
  invertebrates: 47120, // Invertebrata (subkingdom)
  fish: 47178,          // Actinopterygii (class - ray-finned fishes, the largest fish group)
  fungi: 47170,         // Fungi (kingdom)
  arachnid: 47119,      // Arachnida (class)
}