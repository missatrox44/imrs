import type { GazetteerEntry } from '@/types/gazetteer'

export const GAZETTEER_ENTRIES: Array<GazetteerEntry> = [
  {
    id: 'access-road',
    name: 'Access Road',
    description: 'Alternate name for IMRS Access Road; see Main Road.',

    alternateNames: ['IMRS Access Road', 'Main Road'],
  },
  {
    id: 'agate-hill',
    name: 'Agate Hill',
    description:
      'Small hill composed of igneous rock along River Road, west of Flat Top Mountain.',
    latitude: 30.74028,
    longitude: -105.00278,
    elevationMeters: 1235,
  },
  {
    id: 'bailey-evens-arroyo',
    name: 'Bailey Evens Arroyo',
    description:
      'Arroyo leaving Bailey Evens Canyon and draining to the Rio Grande.',
  },
  {
    id: 'bailey-evens-canyon',
    name: 'Bailey Evens Canyon',
    description:
      'Canyon and arroyo north of dormitory and bathroom building at IMRS HQ; drains to the Rio Grande near The Box.',
  },
  {
    id: 'bailey-evans-peak',
    name: 'Bailey Evans Peak',
    description:
      'Highest mountain peak east-northeast of Indio Ranch House. Also known as Mount Everest.',
    latitude: 30.781661,
    longitude: -105.004167,
    elevationMeters: 1461.6,
    alternateNames: ['Mount Everest'],
  },
  {
    id: 'black-diamond-mine',
    name: 'Black Diamond Mine',
    description:
      'Abandoned mine southeast of IMRS HQ developed in the late 1940s with a 30.5 m deep vertical shaft.',
    latitude: 30.76806,
    longitude: -105.001,
    elevationMeters: 1281,
  },
  {
    id: 'bramlett-ranch',
    name: 'Bramlett Ranch',
    description:
      'Principal land holdings surrounding the southwest, west, and northwest boundaries of IMRS.',
  },
  {
    id: 'campo-bonito',
    name: 'Campo Bonito',
    description:
      'Abandoned, partially dismantled windmill on River Road north of South Gate at Eagle Canyon Road junction.',
    latitude: 30.70778,
    longitude: -104.969,
    elevationMeters: 1140,
  },
  {
    id: 'carpenter-mine',
    name: 'Carpenter Mine',
    description:
      'Abandoned mine and former mining headquarters ruins south-southwest of IMRS HQ; yielded copper ore.',
    latitude: 30.76056,
    longitude: -105.023,
    elevationMeters: 1220,
  },
  {
    id: 'clay-bluffs-draw',
    name: 'Clay Bluffs Draw',
    description:
      'Large arroyo system east of River Road with high vertical banks draining into Green River.',
  },
  {
    id: 'corral-tank',
    name: 'Corral Tank',
    description:
      'Northernmost seasonal impoundment near Double Tank Corral; often holds water early or late in the year.',
    latitude: 30.78729,
    longitude: -104.986,
    elevationMeters: 1339,
    alternateNames: ['Road Tank'],
  },
  {
    id: 'cottonwood-canyon-tank',
    name: 'Cottonwood Canyon Tank',
    description: 'Cattle tank near the northwest corner of the IMRS boundary.',

    elevationMeters: 1287.1,
  },
  {
    id: 'cougar-cave',
    name: 'Cougar Cave',
    description:
      'Cave located in an arroyo crossing the road to Echo Spring north of IMRS HQ.',
  },
  {
    id: 'double-tank',
    name: 'Double Tank',
    description: 'Collective name referring to Pirtle Tank and Road Tank.',

    alternateNames: ['Pirtle Tank', 'Road Tank'],
  },
  {
    id: 'double-tank-corral',
    name: 'Double Tank Corral',
    description:
      'Abandoned cattle corral along Main Road near Pirtle and Road Tanks.',
    latitude: 30.78585,
    longitude: -104.985,
    elevationMeters: 1287,
  },
  {
    id: 'eagle-canyon',
    name: 'Eagle Canyon',
    description:
      'Rugged canyon system east of IMRS draining southward to the Rio Grande; contains Palmas Well and The Narrows.',

    alternateNames: ['Snake Canyon'],
  },
  {
    id: 'eagle-canyon-road',
    name: 'Eagle Canyon Road',
    description:
      'Bulldozed gravel road running over Eagle Pass through upper Eagle Canyon to River Road; currently impassable.',
  },
  {
    id: 'eagle-pass',
    name: 'Eagle Pass',
    description:
      'Pass at the top of Eagle Canyon south-southwest of East Gate.',
    latitude: 30.769444,
    longitude: -104.979167,
    elevationMeters: 1418.3,
  },
  {
    id: 'east-gate',
    name: 'East Gate',
    description:
      'Primary access gate to IMRS on Main Road east of Double Tank Corral.',
    latitude: 30.78545,
    longitude: -104.979,
    elevationMeters: 1342,
  },
  {
    id: 'east-well',
    name: 'East Well',
    description:
      'Defunct well and metal tank on the east slope of the Indio Mountains.',
    latitude: 30.7681,
    longitude: -104.953,
    elevationMeters: 1242.9,
  },
  {
    id: 'east-well-arroyo',
    name: 'East Well Arroyo',
    description:
      'East-draining arroyo immediately north of East Well that washes out East Well Road.',
  },
  {
    id: 'east-well-road',
    name: 'East Well Road',
    description:
      'Primitive road extending south from Main Road past Grassy Tank and Lost Well to East Well.',
  },
  {
    id: 'echo-canyon',
    name: 'Echo Canyon',
    description:
      'Southwest-draining canyon along Main Road on east slope of the Indio Mountains below Indio Pass.',
  },
  {
    id: 'echo-canyon-overlook',
    name: 'Echo Canyon Overlook',
    description:
      'West-facing observation point along Main Road just west of Indio Pass summit.',
    latitude: 30.78333,
    longitude: -104.99444,
    elevationMeters: 1596,
  },
  {
    id: 'echo-canyon-tank',
    name: 'Echo Canyon Tank',
    description: 'Tank on jeep road to Echo Spring below Echo Canyon Overlook.',
  },
  {
    id: 'echo-canyon-twin-tanks',
    name: 'Echo Canyon Twin Tanks',
    description:
      'Two adjacent seasonally dry impoundments along Main Road northeast of Black Diamond Mine Road junction.',
    latitude: 30.77384,
    longitude: -105.001,
    elevationMeters: 1189.5,
    alternateNames: ['North Twin Tanks', 'Wrong Red Tank'],
  },
  {
    id: 'echo-creek-canyon',
    name: 'Echo Creek Canyon',
    description:
      'Major arroyo draining southwest to the Rio Grande; contains Echo Spring.',

    alternateNames: ['Echo Creek', 'Echo Spring Canyon'],
  },
  {
    id: 'echo-pass',
    name: 'Echo Pass',
    description:
      'Mountain pass through Echo Ridge west-northwest of Echo Peak.',
    latitude: 30.825,
    longitude: -105.006667,
    elevationMeters: 1418.3,
  },
  {
    id: 'echo-peak',
    name: 'Echo Peak',
    description:
      'Highest and isolated peak in the Indio Mountains near the north-central boundary of IMRS.',
    latitude: 30.81852,
    longitude: -105.015,
    elevationMeters: 1600,
  },
  {
    id: 'echo-ridge',
    name: 'Echo Ridge',
    description:
      'Ridgeline extending east-southeast and west-northwest from Echo Peak.',
  },
  {
    id: 'flat-top-mountain',
    name: 'Flat Top Mountain',
    description:
      'Mesa and ridge system north-northeast of Red Tank; highest elevation occurs at the southern end of the mountain.',
    latitude: 30.74805,
    longitude: -104.997,
    elevationMeters: 1359,
  },

  {
    id: 'glenn-creek',
    name: 'Glenn Creek',
    description:
      'Alternate name listed on some maps for Green River; Green River is the preferred usage.',

    alternateNames: ['Green River'],
  },
  {
    id: 'green-peak',
    name: 'Green Peak',
    description:
      'Summit of ridge south-southeast of Indio Pass, south of Double Tank Corral and west of Eagle Pass.',
    latitude: 30.76944,
    longitude: -104.8175,
    elevationMeters: 5130, // NOTE: elevation appears erroneous in source but preserved as written
  },
  {
    id: 'green-river',
    name: 'Green River',
    description:
      'Large normally dry wash forming the eastern boundary of the Indio Mountains. Preferred name over Glenn Creek.',

    alternateNames: ['Glenn Creek'],
  },
  {
    id: 'green-river-road',
    name: 'Green River Road',
    description:
      'Gravel road forming the main eastern access to IMRS, following the Green River through Wolf Creek Ranch toward The Box.',
  },
  {
    id: 'grassy-tank',
    name: 'Grassy Tank',
    description:
      'Dry impoundment west of the junction of Main Road and Green River Road; East Well Road passes through its bed.',
    latitude: 30.78587,
    longitude: -104.971,
    elevationMeters: 1305.4,
  },
  {
    id: 'horizon-tank',
    name: 'Horizon Tank',
    description:
      'Tank located on the southwest boundary of IMRS east of The Box along the Rio Grande.',
    latitude: 30.77194,
    longitude: -105.04805,
    elevationMeters: 1174,
  },
  {
    id: 'indio-fault',
    name: 'Indio Fault',
    description:
      'Northwest–southeast trending fault dividing the Indio Mountains into higher eastern and lower western blocks.',
  },
  {
    id: 'indio-mountains',
    name: 'Indio Mountains',
    description:
      'Southern spur of the Eagle Mountains in Hudspeth County, Texas, bounded by Oxford Canyon, the Rio Grande, Red Light Draw, and Green River.',
  },
  {
    id: 'indio-pass',
    name: 'Indio Pass',
    description:
      'Mountain pass over the Indio Mountains traversed by Main Road; summit lies just east of Echo Canyon Overlook.',
  },
  {
    id: 'imrs',
    name: 'IMRS',
    description: 'Abbreviation for UTEP’s Indio Mountains Research Station.',

    alternateNames: ['Indio Mountains Research Station'],
  },
  {
    id: 'juniper-grove',
    name: 'Juniper Grove',
    description:
      'Area north of Double Tank Corral along the road to Echo Spring.',
    latitude: 30.79537,
    longitude: -104.994,
  },
  {
    id: 'lonely-tank',
    name: 'Lonely Tank',
    description:
      'Tank on jeep road east of River Road above Eagle Canyon Arroyo; contains a pit-fall trap array.',
    latitude: 30.72787,
    longitude: -104.972,
    elevationMeters: 1190,
  },
  {
    id: 'lost-tank',
    name: 'Lost Tank',
    description:
      'Abandoned tank and adobe retaining wall along East Well Road south of its junction with Main Road.',
  },
  {
    id: 'main-road',
    name: 'Main Road',
    description:
      'Primary gravel road running from Green River Road through East Gate, Echo Canyon, IMRS HQ, and north toward Oxford Canyon.',

    alternateNames: ['IMRS Access Road', 'Access Road'],
  },
  {
    id: 'mesquite-tank',
    name: 'Mesquite Tank',
    description: 'Tank near Bailey Evens Arroyo west-southwest of IMRS HQ.',
    latitude: 30.76153,
    longitude: -105.031,
    elevationMeters: 1167,
  },
  {
    id: 'monroes-nose',
    name: 'Monroe’s Nose',
    description:
      'Angular prominence south of Echo Spring and visible from Echo Canyon Overlook.',
    latitude: 30.33333,
    longitude: -105.00833,
    elevationMeters: 1415.2,
  },
  {
    id: 'oak-wash',
    name: 'Oak Wash',
    description:
      'Wash located on Main Road approximately 0.40 km west of Double Tank Corral.',
    latitude: 30.78511,
    longitude: -104.98961,
  },
  {
    id: 'north-gate',
    name: 'North Gate',
    description:
      'Gate across Main Road north of Woodpecker Well, separating IMRS from Bramlett Ranch.',
  },
  {
    id: 'oak-arroyo',
    name: 'Oak Arroyo',
    description:
      'First arroyo inside East Gate along Main Road; contains pit-fall trap arrays.',
    latitude: 30.78601,
    longitude: -104.981,
    elevationMeters: 1327,
  },
  {
    id: 'oconnor-ranch',
    name: 'O’Connor Ranch',
    description:
      'Former Lado Ranch holdings along the southeastern and southern boundary of IMRS; access is gated.',

    alternateNames: ['Lado Ranch', 'Ballinamona II'],
  },
  {
    id: 'oxford-canyon',
    name: 'Oxford Canyon',
    description:
      'Draw at the north end of the Indio Mountains separating them from the Eagle Mountains.',
  },
  {
    id: 'oxford-spring',
    name: 'Oxford Spring',
    description:
      'Permanent spring in Oxford Canyon north of Woodpecker Well, just outside IMRS property.',
    latitude: 30.84023,
    longitude: -105.041,
  },
  {
    id: 'painted-cliffs',
    name: 'Painted Cliffs',
    description:
      'Eroded ash formation on a north-facing arroyo slope south-southwest of the junction of Green River and Main Roads.',
    latitude: 30.78056,
    longitude: -104.94583,
  },
  {
    id: 'palmas-well',
    name: 'Palmas Well',
    description:
      'Former solar-powered well and remains of older water infrastructure on the west-facing slope of Eagle Canyon.',
    latitude: 30.74555,
    longitude: -104.972,
    elevationMeters: 1266,
  },
  {
    id: 'peccary-tank',
    name: 'Peccary Tank',
    description:
      'Seasonally dry impoundment along River Road southeast of IMRS HQ.',
    latitude: 30.75592,
    longitude: -105.004,
    elevationMeters: 1213,
  },
  {
    id: 'pirtle-tank',
    name: 'Pirtle Tank',
    description:
      'Southeastern seasonal impoundment in the Double Tank Corral area near Main Road.',
    latitude: 30.7852,
    longitude: -104.984,
    elevationMeters: 1336,
    alternateNames: ['Bull Tank'],
  },
  {
    id: 'prospect-pits-arroyo',
    name: 'Prospect Pits Arroyo',
    description:
      'Large arroyo draining Echo Canyon and Ranch House Draw near the Y on Main Road.',
  },
  {
    id: 'prospect-pits',
    name: 'Prospect Pits',
    description:
      'Complex of prospect digs and partially finished mineshafts southwest of IMRS HQ; contains pit-fall trap arrays.',
    latitude: 30.76792,
    longitude: -105.01018,
    elevationMeters: 1281,
  },
  {
    id: 'purple-sage-mine',
    name: 'Purple Sage Mine',
    description:
      'Abandoned mine south of IMRS HQ with a 53.4 m deep vertical shaft dug in the 1950s.',
    latitude: 30.7495,
    longitude: -105.026,
    elevationMeters: 1688,
  },
  {
    id: 'purple-sage-mine-road',
    name: 'Purple Sage Mine Road',
    description:
      'Gravel road extending south-southwest from Main Road to Carpenter and Purple Sage Mines.',
  },
  {
    id: 'ranch-house-draw',
    name: 'Ranch House Draw',
    description:
      'Depression running alongside Main Road leading to IMRS HQ from the Y junction with River Road.',
  },
  {
    id: 'rattlesnake-tank',
    name: 'Rattlesnake Tank',
    description:
      'Seasonally dry impoundment east-northeast of Red Mountain near River Road.',
    latitude: 30.74678,
    longitude: -105.008,
    elevationMeters: 1198,
    alternateNames: ['Trap Tank', 'Oh Shit Tank'],
  },
  {
    id: 'redetzkes-knob',
    name: 'Redetzke’s Knob',
    description: 'South-facing ridge at the summit of Flat Top Mountain.',
  },
  {
    id: 'red-mountain',
    name: 'Red Mountain',
    description:
      'Isolated ridge and peak south of IMRS HQ and west of Agate Hill.',
    latitude: 30.73,
    longitude: -104.988,
    elevationMeters: 1335.3,
  },
  {
    id: 'red-tank',
    name: 'Red Tank',
    description:
      'Large seasonally dry impoundment along River Road west of Eagle Canyon; contains pit-fall trap array.',
    latitude: 30.73067,
    longitude: -104.988,
    elevationMeters: 1195.6,
  },
  {
    id: 'river-road',
    name: 'River Road',
    description:
      'Gravel road running north from the Green River near The Box through South Gate and Campo Bonito to Main Road.',
  },
  {
    id: 'scotts-crossing',
    name: 'Scott’s Crossing',
    description:
      'Crossing where Green River Road intersects the Southern Pacific Railroad tracks south-southeast of Van Horn.',
  },
  {
    id: 'south-gate',
    name: 'South Gate',
    description:
      'Gate across River Road separating IMRS from O’Connor Ranch, north of The Box.',
    latitude: 30.69022,
    longitude: -104.967,
    elevationMeters: 1228.5,
  },
  {
    id: 'south-well',
    name: 'South Well',
    description: 'Alternate name referring to Campo Bonito.',
    latitude: 30.70778,
    longitude: -104.969,
    elevationMeters: 1140,
    alternateNames: ['Campo Bonito'],
  },
  {
    id: 'snake-canyon',
    name: 'Snake Canyon',
    description: 'Former name for Eagle Canyon.',

    alternateNames: ['Eagle Canyon'],
  },
  {
    id: 'sunflower-tank',
    name: 'Sunflower Tank',
    description: 'Tank located east of Horizon Tank near the Rio Grande.',
    latitude: 30.76667,
    longitude: -105.06528,
    elevationMeters: 1072,
  },
  {
    id: 'the-box',
    name: 'The Box',
    description:
      'Eastern opening of the Rio Grande canyon near the southern end of IMRS.',
    latitude: 30.66716,
    longitude: -104.993,
    elevationMeters: 960.8,
  },
  {
    id: 'the-narrows',
    name: 'The Narrows',
    description:
      'Narrow constriction of Eagle Canyon through which River Road passes, east of Red Tank.',
    latitude: 30.73359,
    longitude: -104.984,
    elevationMeters: 1415.2,
  },
  {
    id: 'the-narrows-twin-tanks',
    name: 'The Narrows Twin Tanks',
    description:
      'Two seasonally dry impoundments north of River Road at the east end of The Narrows.',
    latitude: 30.73611,
    longitude: -104.98433,
    elevationMeters: 1204.8,
    alternateNames: ['South Twin Tanks'],
  },
  {
    id: 'trap-tank',
    name: 'Trap Tank',
    description: 'Alternate name for Rattlesnake Tank.',
    latitude: 30.74678,
    longitude: -105.008,
    elevationMeters: 1198,
    alternateNames: ['Rattlesnake Tank'],
  },
  {
    id: 'tres-amigos',
    name: 'Tres Amigos',
    description:
      'Group of three hills at the west entrance to Oxford Canyon on Bramlett Ranch.',
  },
  {
    id: 'twin-tanks',
    name: 'Twin Tanks',
    description:
      'Collective term referring to Echo Canyon Twin Tanks and The Narrows Twin Tanks.',

    alternateNames: ['Echo Canyon Twin Tanks', 'The Narrows Twin Tanks'],
  },
  {
    id: 'viejo-seep',
    name: 'Viejo Seep',
    description:
      'Natural spring on Wolf Creek Ranch west-northwest of the junction of Green River Road and Main Road.',
    latitude: 30.79306,
    longitude: -104.95,
    elevationMeters: 1226.1,
  },
  {
    id: 'willoughby-creek',
    name: 'Willoughby Creek',
    description:
      'Dry arroyo north-northwest of Echo Ridge draining into the Green River.',
  },
  {
    id: 'woodpecker-well',
    name: 'Woodpecker Well',
    description:
      'Dysfunctional water well on Main Road northwest of IMRS HQ; contains pit-fall trap array.',
    latitude: 30.81784,
    longitude: -105.054,
    elevationMeters: 1246.2,
  },
  {
    id: 'wolf-creek-ranch',
    name: 'Wolf Creek Ranch',
    description:
      'Ranch holdings north and northeast of IMRS providing primary access to IMRS via Green River Road.',
  },
  {
    id: 'wrong-red-tank',
    name: 'Wrong Red Tank',
    description: 'Alternate name for Echo Canyon Twin Tanks.',
    latitude: 30.77384,
    longitude: -105.001,
    elevationMeters: 1189.5,
    alternateNames: ['Echo Canyon Twin Tanks'],
  },
  {
    id: 'wynn-anderson-learning-center',
    name: 'Wynn Anderson Learning Center',
    description:
      'Room attached to the original Indio Ranch House, expanded and screened in 2003; named after Wynn Anderson.',
    latitude: 30.77667,
    longitude: -105.01583,
    elevationMeters: 1230,
  },
  {
    id: 'yucca-ridge',
    name: 'Yucca Ridge',
    description:
      'Ridge running northwest to southeast between Oxford Canyon and Echo Creek Canyon, south of Echo Ridge.',
  },
]

export const GAZETTEER_ROLODEX: Array<GazetteerEntry> = [
  {
    id: 'bailey-evans-peak',
    name: 'Bailey Evans Peak',
    description:
      'Highest mountain peak east-northeast of Indio Ranch House. Also known as Mount Everest.',
    latitude: 30.781661,
    longitude: -105.004167,
    elevationMeters: 1461.6,
    alternateNames: ['Mount Everest'],
  },
  {
    id: 'mesquite-tank',
    name: 'Mesquite Tank',
    description: 'Tank near Bailey Evens Arroyo west-southwest of IMRS HQ.',
    latitude: 30.76153,
    longitude: -105.031,
    elevationMeters: 1167,
  },
  {
    id: 'red-tank',
    name: 'Red Tank',
    description:
      'Large seasonally dry impoundment along River Road west of Eagle Canyon; contains pit-fall trap array.',
    latitude: 30.73067,
    longitude: -104.988,
    elevationMeters: 1195.6,
  },
  {
    id: 'corral-tank',
    name: 'Corral Tank',
    description:
      'Northernmost seasonal impoundment near Double Tank Corral; often holds water early or late in the year.',
    latitude: 30.78729,
    longitude: -104.986,
    elevationMeters: 1339,
    alternateNames: ['Road Tank'],
  },
  {
    id: 'woodpecker-well',
    name: 'Woodpecker Well',
    description:
      'Dysfunctional water well on Main Road northwest of IMRS HQ; contains pit-fall trap array.',
    latitude: 30.81784,
    longitude: -105.054,
    elevationMeters: 1246.2,
  },
]
