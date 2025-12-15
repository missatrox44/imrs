export interface GazetteerEntry {
  id: string
  name: string
  description: string
  latitude: number | null
  longitude: number | null
  elevationMeters: number | null
  alternateNames?: Array<string>
  references?: Array<string>
}