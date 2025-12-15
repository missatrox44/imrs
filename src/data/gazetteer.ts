import type { GazetteerEntry } from "@/types/gazetteer";

export const GAZETTEER_ENTRIES: Array<GazetteerEntry> = [
  {
    id: "echo-spring",
    name: "Echo Spring",
    description:
      "Permanent spring in Echo Creek Canyon, approximately 2.5 km north of IMRS HQ. Contains a pit-fall trap array and is an important wildlife watering site.",
    latitude: 30.7972,
    longitude: -105.011,
    elevationMeters: 1263,
  },
  {
    id: "indio-ranch-house",
    name: "Indio Ranch House (IMRS HQ)",
    description:
      "Old Bailey Evans Ranch House and central facilities of IMRS HQ. Includes dorms, labs, the Jerry Johnson Assembly Hall, and solar-powered water and electricity infrastructure.",
    latitude: 30.77667,
    longitude: -105.01583,
    elevationMeters: 1230,
  },
  {
    id: "red-tank",
    name: "Red Tank",
    description:
      "Large seasonally dry impoundment along River Road just west of Eagle Canyon. Site includes a pit-fall trap array and is a common reference point for fieldwork.",
    latitude: 30.73067,
    longitude: -104.988,
    elevationMeters: 1195.6,
  },
  {
    id: "echo-peak",
    name: "Echo Peak",
    description:
      "Highest and somewhat isolated peak in the Indio Mountains, near the north-central IMRS boundary. Visible from Van Horn and associated with Echo Ridge and Echo Pass.",
    latitude: 30.81852,
    longitude: -105.015,
    elevationMeters: 1600,
  },
];
