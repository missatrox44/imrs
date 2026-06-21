// Hand-curated theses, dissertations, papers, and notes tied to IMRS species.
//
// This is the single place to maintain academic references shown on the species
// detail page. Each entry lists the integer species ids (`specimens.id`, the
// same id used in the species URL) it applies to — the relationship is
// many-to-many, so one publication can cover several species and a species can
// have several publications. Only species named directly in the title are
// tagged. Omit `url` (or set it to '') until a link is available; the entry
// still renders as a non-clickable citation until then.

export type PublicationType = 'thesis' | 'dissertation' | 'article' | 'note'

export interface Publication {
  /** Stable slug used as the React key, e.g. 'worthington-1972-thesis'. */
  id: string
  title: string
  /** Author(s), as displayed, e.g. 'R. D. Worthington'. */
  authors: string
  year: number
  type: PublicationType
  /** Journal / volume / pages for papers and notes, e.g. 'Herpetological Review 49(1): 93'. Omit for theses. */
  venue?: string
  /** Direct link to the paper. Omit (or '') until a link is available. */
  url?: string
  /** Integer species ids this publication applies to (the `specimens.id`). */
  speciesIds: Array<number>
}

export const publications: Array<Publication> = [
  // --- Theses & dissertations ---
  {
    id: 'alva-2014-thesis',
    title:
      'Thermal Ecology of Urosaurus ornatus (Ornate Tree Lizard), in the Northern Chihuahuan Desert on Indio Mountains Research Station, Texas.',
    authors: 'Alva, J. S.',
    year: 2014,
    type: 'thesis',
    url: 'https://media.proquest.com/media/hms/ORIG/2/gZ78H?_s=4oYc0tUrtOav%2BOGj6vQCmM8QnKk%3D',
    speciesIds: [242],
  },
  {
    id: 'desantis-2019-dissertation',
    title:
      'Movement Ecology of a Cryptic Ambush Predator: Case Studies Integrating Traditional and Novel Techniques in Snake Ecology with Western Diamond-backed Rattlesnakes (Crotalus atrox).',
    authors: 'DeSantis, D. L.',
    year: 2019,
    type: 'dissertation',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=2978&context=open_etd',
    speciesIds: [232],
  },
  {
    id: 'emerson-2020-dissertation',
    title:
      'Behavioral ecology of a desert ambush predator: assessing movement patterns, habitat and microhabitat use, and the innate feeding response of Eastern Black-tailed Rattlesnakes (Crotalus ornatus) in the northern Chihuahuan Desert.',
    authors: 'Emerson, J. D.',
    year: 2020,
    type: 'dissertation',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=3959&context=open_etd',
    speciesIds: [234],
  },
  {
    id: 'franco-2015-thesis',
    title:
      'Ecological features of the greater earless lizard, Cophosaurus texanus, (Squamata: Phrynosomatidae) on Indio mountains research station, Hudspeth County, Texas.',
    authors: 'Franco, G. R.',
    year: 2015,
    type: 'thesis',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=2043&context=open_etd',
    speciesIds: [237],
  },
  {
    id: 'horne-2022-thesis',
    title:
      'Population genetics of two sympatric species, the Round-tailed Horned Lizard (Phrynosoma modestum) and the Greater Earless Lizard (Cophosaurus texanus), in the Indio Mountains of west Texas.',
    authors: 'Horne, L. M.',
    year: 2022,
    type: 'thesis',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=4914&context=open_etd',
    speciesIds: [239, 237],
  },
  {
    id: 'lukefahr-2013-thesis',
    title:
      'Comparison of ectoparasitic mite loads between gonochoristic (Aspidoscelis marmorata) and parthenogenic (A. tesselata) syntopic whiptail lizards (Teiidae) from the northern Chihuahuan desert of Trans-Pecos, Texas.',
    authors: 'Lukefahr, W. D.',
    year: 2013,
    type: 'thesis',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=2864&context=open_etd',
    speciesIds: [248, 249],
  },
  {
    id: 'mata-silva-2005-thesis',
    title:
      'Diet comparison between two syntopic teiid lizards, Aspidoscelis marmorata and Aspidoscelis tesselata, in the northern Chihuahuan Desert.',
    authors: 'Mata-Silva, V.',
    year: 2005,
    type: 'thesis',
    url: 'https://www.proquest.com/docview/305383590',
    speciesIds: [248, 249],
  },
  {
    id: 'mata-silva-2011-dissertation',
    title:
      'Ecology of the Rock Rattlesnake, Crotalus lepidus, in the northern Chihuahuan Desert.',
    authors: 'Mata-Silva, V.',
    year: 2011,
    type: 'dissertation',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=3337&context=open_etd',
    speciesIds: [233],
  },
  {
    id: 'miranda-2009-thesis',
    title:
      'Ecological study of oxygen consumption in three species of rattlesnakes, Crotalus atrox, Crotalus lepidus, and Crotalus molossus (Viperidae) from the northern Chihuahuan Desert.',
    authors: 'Miranda, L.',
    year: 2009,
    type: 'thesis',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=3731&context=open_etd',
    speciesIds: [232, 233, 234],
  },
  {
    id: 'rocha-2012-thesis',
    title:
      'Spatial ecology of the Trans-Pecos Rat Snake (Bogertophis subocularis) in the Chihuahuan Desert of Trans-Pecos Texas.',
    authors: 'Rocha, A.',
    year: 2012,
    type: 'thesis',
    url: 'https://scholarworks.utep.edu/cgi/viewcontent.cgi?article=3174&context=open_etd',
    speciesIds: [214],
  },

  // --- Papers & natural-history notes ---
  {
    id: 'alvarez-2018-anaxyrus-punctatus-note',
    title: 'Anaxyrus punctatus (Red-spotted Toad). Diet.',
    authors: 'Alvarez, G., J. D. Johnson, and V. Mata-Silva',
    year: 2018,
    type: 'note',
    venue: 'Herpetological Review 49(1): 93',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [256],
  },
  {
    id: 'chavarria-2021-crotalus-atrox-note',
    title: 'Crotalus atrox (Western Diamond-backed Rattlesnake). Diet.',
    authors:
      'Chavarria, C. A., A. Moreno, A. Benson-Pedraza, L. M. Horne, O. Da Cunha, J. J. Mead, J. D. Johnson, and V. Mata-Silva',
    year: 2021,
    type: 'note',
    venue: 'Herpetological Review 52(4): 866–867',
    url: 'https://www.researchgate.net/profile/Vicente-Mata-Silva/publication/357407018_Crotalus_atrox_Diet_Natural_History_Note/links/61ccc13bb8305f7c4b0e0948/Crotalus-atrox-Diet-Natural-History-Note.pdf',
    speciesIds: [232],
  },
  {
    id: 'da-cunha-2023-crotalus-lepidus-note',
    title: 'Crotalus lepidus (Rock Rattlesnake). Diet.',
    authors:
      'Da Cunha, O., A. Olivas-Avila, R. P. Dominguez, M. Jimenez, L. M. Horne, A. Rocha, and V. Mata-Silva',
    year: 2023,
    type: 'note',
    venue: 'Herpetological Review 54(2): 310–311',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [233],
  },
  {
    id: 'desantis-2015-crotalus-lepidus-note',
    title: 'Crotalus lepidus (Rock Rattlesnake). Diet/Scavenging.',
    authors: 'DeSantis, D. L., V. Mata-Silva, and J. D. Johnson',
    year: 2015,
    type: 'note',
    venue: 'Herpetological Review 46(2): 268–269',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [233],
  },
  {
    id: 'desantis-2016-salvadora-grahamiae-note',
    title: 'Salvadora grahamiae (Mountain Patch-nosed Snake). Winter Foraging.',
    authors: 'DeSantis, D. L., V. Mata-Silva, and J. D. Johnson',
    year: 2016,
    type: 'note',
    venue: 'Herpetological Review 47(3): 483–484',
    url: 'https://www.researchgate.net/publication/320087222_Natural_History_Salvadora_grahamiae_Mountain_Patch-nosed_Snake_Winter_Foraging_Herpetological_Review_47_483-484',
    speciesIds: [222],
  },
  {
    id: 'emerson-2022-crotalus-ornatus-article',
    title:
      'Movement, home range size, and habitat use of Eastern Black-tailed Rattlesnakes (Crotalus ornatus) in the Chihuahuan Desert.',
    authors:
      'Emerson, J. D., D. L. DeSantis, V. Mata-Silva, A. E. Wagler, and J. D. Johnson',
    year: 2022,
    type: 'article',
    venue: 'Herpetologica 78(2): 110–118',
    url: 'https://bioone.org/journals/herpetologica/volume-78/issue-2/Herpetologica-D-21-00009/Movement-Home-Range-Size-and-Habitat-Use-of-Eastern-Black/10.1655/Herpetologica-D-21-00009.short',
    speciesIds: [234],
  },
  {
    id: 'emerson-2020-crotalus-ornatus-note',
    title:
      'Crotalus ornatus (Eastern Black-tailed Rattlesnake). Feeding Behavior.',
    authors: 'Emerson, J. D., and J. D. Johnson',
    year: 2020,
    type: 'note',
    venue: 'Herpetological Review 51(2): 346',
    url: 'https://www.academia.edu/161894343/C_ornatus_Feeding_Behavior',
    speciesIds: [234],
  },
  {
    id: 'garza-2017-urosaurus-ornatus-note',
    title:
      'Urosaurus ornatus (Ornate Tree Lizard). Necrophilia and feeding behavior.',
    authors:
      'Garza, K. R., J. Schlichte, N. Peters, D. L. DeSantis, J. D. Johnson, and V. Mata-Silva',
    year: 2017,
    type: 'note',
    venue: 'Herpetological Review 48(2): 442–443',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [242],
  },
  {
    id: 'garza-2018-anisota-oslari-article',
    title:
      'First record of Anisota oslari from Trans-Pecos, Texas using Sandpaper Oak as a host.',
    authors: 'Garza, K. R., K. A. Martinez, and J. D. Johnson',
    year: 2018,
    type: 'article',
    venue: 'Southwestern Entomologist 43(3): 799–801',
    url: 'https://bioone.org/journals/southwestern-entomologist/volume-43/issue-3/059.043.0327/First-Record-of-Anisota-oslari1-from-Trans-Pecos-Texas-Using/10.3958/059.043.0327.short',
    speciesIds: [1145],
  },
  {
    id: 'johnson-2004-coleonyx-brevis-note',
    title: 'Coleonyx brevis. Tail regeneration.',
    authors: 'Johnson, J. D., G. W. Johnson, and H. Riveroll, Jr.',
    year: 2004,
    type: 'note',
    venue: 'Herpetological Review 35(4): 388',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [236],
  },
  {
    id: 'johnson-2022-crotalus-atrox-note',
    title:
      'Crotalus atrox (Western Diamond-backed Rattlesnake). Longevity, growth, and movement in the wild.',
    authors:
      'Johnson, J. D., G. H. Wiseman, J. Sandoval-Alva, A. Rocha, and V. Mata-Silva',
    year: 2022,
    type: 'note',
    venue: 'Herpetological Review 53(4): 693–694',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [232],
  },
  {
    id: 'johnson-2007-sonora-semiannulata-note',
    title: 'Sonora semiannulata. Predation by Scolopendra heros.',
    authors: 'Johnson, J. D., G. W. Johnson, and H. Riveroll, Jr.',
    year: 2007,
    type: 'note',
    venue: 'Herpetological Review 38(1): 93–94',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [223, 738],
  },
  {
    id: 'lenhart-2010-antrozous-pallidus-article',
    title:
      'Diet of the Pallid Bat, Antrozous pallidus (Vespertilionidae), in the Chihuahuan Desert of Trans-Pecos, Texas.',
    authors: 'Lenhart, P. A., V. Mata-Silva, and J. D. Johnson',
    year: 2010,
    type: 'article',
    venue: 'Southwestern Naturalist 55(1): 110–115',
    url: 'https://bioone.org/journals/the-southwestern-naturalist/volume-55/issue-1/CLG-21.1/Foods-of-the-Pallid-Bat-Antrozous-pallidus-Chiroptera--Vespertilionidae/10.1894/CLG-21.1.short',
    speciesIds: [4],
  },
  {
    id: 'lukefahr-2011-sceloporus-poinsettii-note',
    title: 'Sceloporus poinsettii (Crevice Spiny Lizard). Ectoparasites.',
    authors:
      'Lukefahr, W. D., J. D. Johnson, V. Mata-Silva, A. Rocha, R. Couvillon, and F. de la Cerda',
    year: 2011,
    type: 'note',
    venue: 'Herpetological Review 42(3): 433–434',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [241],
  },
  {
    id: 'mata-silva-2010-reproductive-aspidoscelis-article',
    title:
      'Reproductive characteristics of two syntopic species of whiptail lizards (Aspidoscelis marmorata and Aspidoscelis tesselata), from the Northern Chihuahuan Desert.',
    authors: 'Mata-Silva, V., A. Ramírez-Bautista, and J. D. Johnson',
    year: 2010,
    type: 'article',
    venue: 'Southwestern Naturalist 55(1): 125–129',
    url: 'https://bioone.org/journals/the-southwestern-naturalist/volume-55/issue-1',
    speciesIds: [248, 249],
  },
  {
    id: 'mata-silva-2010-cophosaurus-texanus-note',
    title: 'Cophosaurus texanus (Greater Earless Lizard). Multiple tails.',
    authors: 'Mata-Silva, V., A. Rocha, A. Gandara, and J. D. Johnson',
    year: 2010,
    type: 'note',
    venue: 'Herpetological Review 41(3): 352–353',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [237],
  },
  {
    id: 'mata-silva-2011-phrynosoma-modestum-note',
    title: 'Phrynosoma modestum (Round-tailed Horned Lizard). Predation.',
    authors: 'Mata-Silva, V., and J. D. Johnson',
    year: 2011,
    type: 'note',
    venue: 'Herpetological Review 42(1): 95',
    url: 'https://www.dropbox.com/s/pvx5vgs6wej6gp2/HR42-1.pdf?dl=1',
    speciesIds: [239],
  },
  {
    id: 'mata-silva-2014-crotalus-atrox-note',
    title:
      'Crotalus atrox (Western Diamondback Rattlesnake). Rain Harvesting Behavior.',
    authors: 'Mata-Silva, V., and J. D. Johnson',
    year: 2014,
    type: 'note',
    venue: 'Herpetological Review 45(3): 514–515',
    url: 'https://www.dropbox.com/s/vu4nkxfaevyuuxa/HR%20Sept%202014%20ebook.pdf?dl=1',
    speciesIds: [232],
  },
  {
    id: 'mata-silva-2011-rena-humilis-note',
    title: 'Rena humilis (Blind Snake). Predation.',
    authors: 'Mata-Silva, V., and J. D. Johnson',
    year: 2011,
    type: 'note',
    venue: 'Herpetological Review 42(3): 444',
    url: 'https://www.dropbox.com/s/jyzvm7k2ifjwd6f/HR42-3.pdf?dl=1',
    speciesIds: [229],
  },
  {
    id: 'mata-silva-2022-phrynosoma-modestum-note',
    title:
      'Phrynosoma modestum (Round-tailed Horned Lizard). Defensive Behavior.',
    authors: 'Mata-Silva, V., J. D. Johnson, G. Alvarez, and D. DeSantis',
    year: 2022,
    type: 'note',
    venue: 'Herpetological Review 53(2): 328–329',
    url: 'https://www.dropbox.com/s/po8adalcitu4t1w/HR_June_2022_150dpi_Contents.pdf?dl=1',
    speciesIds: [239],
  },
  {
    id: 'mata-silva-2008-gut-parasites-aspidoscelis-article',
    title:
      'Gut parasites of two syntopic species of whiptail lizards (Aspidoscelis marmorata and Aspidoscelis tesselata) from the northern Chihuahuan Desert.',
    authors: 'Mata-Silva, V., C. R. Bursey, and J. D. Johnson',
    year: 2008,
    type: 'article',
    venue: 'Boletín de la Sociedad Herpetológica Mexicana 16(1): 1–4',
    url: 'https://sociedadherpetologicamexicana.org.mx/principal/boletines.html',
    speciesIds: [248, 249],
  },
  {
    id: 'mata-silva-2018-crotalus-lepidus-article',
    title:
      'Spatial ecology of Rock Rattlesnakes (Crotalus lepidus) in far west Texas.',
    authors: 'Mata-Silva, V., D. L. DeSantis, A. Wagler, and J. D. Johnson',
    year: 2018,
    type: 'article',
    venue: 'Herpetologica 74(3): 245–254',
    url: 'https://bioone.org/journals/herpetologica/volume-74/issue-3/Herpetologica-D-16-00030.1/Spatial-Ecology-of-Rock-Rattlesnakes-iCrotalus-lepidus-i-in-Far/10.1655/Herpetologica-D-16-00030.1.short',
    speciesIds: [233],
  },
  {
    id: 'mata-silva-2006-cophosaurus-texanus-note',
    title: 'Cophosaurus texanus (Greater Earless Lizard). Mortality.',
    authors: 'Mata-Silva, V., J. D. Johnson, and A. Juárez-Reina',
    year: 2006,
    type: 'note',
    venue: 'Herpetological Review 37(4): 464',
    url: 'https://www.researchgate.net/publication/291307966_Cophosaurus_texanus_Greater_Earless_Lizard_Mortality',
    speciesIds: [237],
  },
  {
    id: 'mata-silva-2013-diet-aspidoscelis-article',
    title:
      'Comparison of diets of two syntopic lizards, Aspidoscelis marmorata and Aspidoscelis tesselata (Teiidae), from the northern Chihuahuan Desert of Texas.',
    authors: 'Mata-Silva, V., J. D. Johnson, and A. Ramírez-Bautista',
    year: 2013,
    type: 'article',
    venue: 'Southwestern Naturalist 58(2): 209–215',
    url: 'https://bioone.org/journals/the-southwestern-naturalist/volume-58/issue-2/0038-4909-58.2.209/Comparison-of-Diets-of-Two-Syntopic-Lizards-Aspidoscelis-marmorata-and/10.1894/0038-4909-58.2.209.short',
    speciesIds: [248, 249],
  },
  {
    id: 'mata-silva-2011-crotalus-lepidus-note',
    title: 'Crotalus lepidus (Rock Rattlesnake). Feeding Behavior.',
    authors: 'Mata-Silva, V., J. D. Johnson, and A. Rocha',
    year: 2011,
    type: 'note',
    venue: 'Herpetological Review 42(3): 439',
    url: 'https://www.dropbox.com/s/jyzvm7k2ifjwd6f/HR42-3.pdf?dl=1',
    speciesIds: [233],
  },
  {
    id: 'mata-silva-2012-crotalus-molossus-note',
    title:
      'Crotalus molossus (Black-tailed Rattlesnake). Rain harvesting behavior.',
    authors: 'Mata-Silva, V., J. D. Johnson, and A. Rocha',
    year: 2012,
    type: 'note',
    venue: 'Herpetological Review 43(1): 145–146',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [234],
  },
  {
    id: 'mata-silva-2012-sonora-semiannulata-note',
    title: 'Sonora semiannulata (Ground Snake). Predation.',
    authors:
      'Mata-Silva, V., J. D. Johnson, G. Barragan, A. Rocha, W. D. Lukefahr, and R. Couvillon',
    year: 2012,
    type: 'note',
    venue: 'Herpetological Review 43(4): 661–662',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [223],
  },
  {
    id: 'mata-silva-2014-crotalus-lepidus-article',
    title:
      'Rainwater-harvesting by the Rock Rattlesnake, Crotalus lepidus, in the Chihuahuan Desert of west Texas.',
    authors: 'Mata-Silva, V., J. D. Johnson, A. Rocha, and S. Dilks',
    year: 2014,
    type: 'article',
    venue: 'Southwestern Naturalist 59(2): 303–304',
    url: 'https://www.researchgate.net/publication/276406039_Rainwater-harvesting_by_the_rock_rattlesnake_Crotalus_lepidus_in_the_Chihuahuan_Desert_of_western_Texas',
    speciesIds: [233],
  },
  {
    id: 'mata-silva-2015-masticophis-flagellum-note',
    title: 'Coluber/Masticophis flagellum (Coachwhip). General Ecology.',
    authors:
      'Mata-Silva, V., J. D. Johnson, A. Rocha, S. Dilks, and L. D. Wilson',
    year: 2015,
    type: 'note',
    venue: 'Herpetological Review 46(2): 267',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [217],
  },
  {
    id: 'mata-silva-2011-crotalus-atrox-note',
    title: 'Crotalus atrox (Western Diamondback Rattlesnake). Diet.',
    authors:
      'Mata-Silva, V., J. D. Johnson, R. Couvillon, W. Lukefahr, and A. Rocha',
    year: 2011,
    type: 'note',
    venue: 'Herpetological Review 42(3): 438–439',
    url: 'https://www.dropbox.com/s/jyzvm7k2ifjwd6f/HR42-3.pdf?dl=1',
    speciesIds: [232],
  },
  {
    id: 'mata-silva-2012-anaxyrus-punctatus-note',
    title: 'Anaxyrus punctatus (Red-spotted Toad). Predation.',
    authors:
      'Mata-Silva, V., L. D. Wilson, J. D. Johnson, A. Rocha, and W. D. Lukefahr',
    year: 2012,
    type: 'note',
    venue: 'Herpetological Review 43(4): 629',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [256],
  },
  {
    id: 'mata-silva-2010-crotalus-lepidus-note',
    title: 'Crotalus lepidus (Rock Rattlesnake). Diet.',
    authors: 'Mata-Silva, V., S. Dilks, and J. D. Johnson',
    year: 2010,
    type: 'note',
    venue: 'Herpetological Review 41(2): 235–236',
    url: 'https://www.academia.edu/52155827/CROTALUS_LEPIDUS_Rock_Rattlesnake_DIET',
    speciesIds: [233],
  },
  {
    id: 'miranda-2008-crotalus-molossus-note',
    title: 'Crotalus molossus (Blacktail Rattlesnake). Morphology.',
    authors:
      'Miranda, L. Jr., V. Mata-Silva, S. Dilks, H. Riveroll Jr., and J. D. Johnson',
    year: 2008,
    type: 'note',
    venue: 'Herpetological Review 39(1): 97',
    url: 'https://ssarherps.org/herpetological-review-pdfs/',
    speciesIds: [234],
  },
  {
    id: 'moreno-2021-hypsiglena-jani-note',
    title: 'Hypsiglena jani (Chihuahuan Nightsnake). Predation.',
    authors:
      'Moreno, A., C. A. Chavarria, A. Benson-Pedraza, L. M. Horne, O. Da Cunha, J. J. Mead, J. D. Johnson, and V. Mata-Silva',
    year: 2021,
    type: 'note',
    venue: 'Herpetological Review 52(1): 159–160',
    url: 'https://www.researchgate.net/publication/349912895_Hypsiglena_jani_Chihuahuan_Nightsnake_Predation_by_Pallid_Bats_Natural_History_Note',
    speciesIds: [228],
  },
  {
    id: 'rocha-2023-aspidoscelis-marmoratus-article',
    title:
      'First record of scoliosis in the Western Marbled Whiptail, Aspidoscelis marmoratus (Baird & Girard, 1852).',
    authors: 'Rocha, A., M. Jimenez, M. Montoya, and V. Mata-Silva',
    year: 2023,
    type: 'article',
    venue: 'Revista Latinoamericana de Herpetología e781: 200–202',
    url: 'https://doi.org/10.22201/fc.25942158e.2023.3.781',
    speciesIds: [248],
  },
  {
    id: 'rocha-2014-bogertophis-subocularis-note',
    title: 'Bogertophis subocularis (Trans-Pecos Ratsnake). Maximum movement.',
    authors: 'Rocha, A., V. Mata-Silva, and J. D. Johnson',
    year: 2014,
    type: 'note',
    venue: 'Herpetological Review 45(1): 140',
    url: '',
    speciesIds: [214],
  },
  {
    id: 'rocha-2013-bogertophis-subocularis-note',
    title:
      'Bogertophis subocularis (Trans-Pecos Ratsnake). Overwintering behavior.',
    authors: 'Rocha, A., V. Mata-Silva, J. D. Johnson, and W. D. Lukefahr',
    year: 2013,
    type: 'note',
    venue: 'Herpetological Review 44(3): 517–518',
    url: 'https://www.researchgate.net/publication/325536745_Bogertophis_subocularis_Trans-Pecos_Rat_Snake_Overwintering_Behavior',
    speciesIds: [214],
  },
]
