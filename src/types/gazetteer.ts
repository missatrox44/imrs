export interface GazetteerEntry {
  id: string
  name: string
  description: string
  latitude?: number
  longitude?: number
  elevationMeters?: number
  alternateNames?: Array<string>
  references?: Array<string>
}