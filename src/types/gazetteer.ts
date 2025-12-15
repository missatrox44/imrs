export interface GazetteerEntry {
  id: string;              // slug/id for the location
  name: string;            // place name (e.g., "Echo Spring")
  description: string;     // short paragraph describing the feature
  latitude: number;        // decimal degrees
  longitude: number;       // decimal degrees
  elevationMeters: number; // elevation in meters
}