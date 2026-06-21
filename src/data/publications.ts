// Hand-curated theses and dissertations tied to IMRS species.
//
// This is the single place to maintain academic references shown on the species
// detail page. Each entry lists the integer species ids (`specimens.id`, the
// same id used in the species URL) it applies to — the relationship is
// many-to-many, so one publication can cover several species and a species can
// have several publications. Omit `url` until a link is available; the entry
// still renders as a non-clickable citation until then.

export type PublicationType = 'thesis' | 'dissertation'

export interface Publication {
  /** Stable slug used as the React key, e.g. 'worthington-1972-thesis'. */
  id: string
  title: string
  /** Author(s), as displayed, e.g. 'R. D. Worthington'. */
  authors: string
  year: number
  type: PublicationType
  /** Direct link to the paper. Omit until a link is available. */
  url?: string
  /** Integer species ids this publication applies to (the `specimens.id`). */
  speciesIds: Array<number>
}

export const publications: Array<Publication> = [
  // Add entries here, e.g.:
  // {
  //   id: 'worthington-1972-thesis',
  //   title: 'The distribution and ecology of the herpetofauna of ...',
  //   authors: 'R. D. Worthington',
  //   year: 1972,
  //   type: 'thesis',
  //   url: 'https://example.edu/theses/worthington-1972.pdf',
  //   speciesIds: [381, 12],
  // },
  {
    id: 'alva-2014-thesis',
    title: 'Thermal Ecology of Urosaurus ornatus (Ornate Tree Lizard), in the Northern Chihuahuan Desert on Indio Mountains Research Station, Texas.',
    authors: 'Alva, J. S.',
    year: 2014,
    type: 'thesis',
    url: 'https://media.proquest.com/media/hms/ORIG/2/gZ78H?_s=4oYc0tUrtOav%2BOGj6vQCmM8QnKk%3D',
    speciesIds: [242]
  }
]
