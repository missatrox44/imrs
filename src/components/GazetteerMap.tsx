import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { GazetteerEntry } from '@/types/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'

const defaultIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 14px;
    height: 14px;
    background: hsl(25, 20%, 15%);
    border: 2px solid hsl(42, 45%, 94%);
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
})

const selectedIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 20px;
    height: 20px;
    background: hsl(35, 50%, 65%);
    border: 3px solid hsl(25, 20%, 15%);
    border-radius: 50%;
    box-shadow: 0 0 0 4px hsl(35, 50%, 65%, 0.4);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
})

const IMRS_CENTER: L.LatLngExpression = [30.77, -105.0]
const IMRS_ZOOM = 12

function FlyToSelected({
  entries,
  selectedId,
}: {
  entries: Array<GazetteerEntry>
  selectedId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedId) return
    const entry = entries.find((e) => e.id === selectedId)
    if (entry?.latitude && entry.longitude) {
      map.flyTo([entry.latitude, entry.longitude], 15, { duration: 0.8 })
    }
  }, [selectedId, entries, map])

  return null
}

export interface GazetteerMapProps {
  entries: Array<GazetteerEntry>
  selectedId: string | null
  onPinClick: (id: string) => void
}

export function GazetteerMap({
  entries,
  selectedId,
  onPinClick,
}: GazetteerMapProps) {
  const entriesWithCoords = entries.filter(
    (e) => e.latitude != null && e.longitude != null,
  )

  return (
    <MapContainer
      center={IMRS_CENTER}
      zoom={IMRS_ZOOM}
      className="h-full w-full rounded-sm"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected entries={entries} selectedId={selectedId} />
      {entriesWithCoords.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.latitude!, entry.longitude!]}
          icon={entry.id === selectedId ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onPinClick(entry.id),
          }}
        >
          <Popup>
            <div className="font-mono text-sm">
              <p className="font-bold mb-1">{entry.name}</p>
              <p className="text-xs">
                {formatCoordinates(entry.latitude, entry.longitude)}
              </p>
              {entry.elevationMeters && (
                <p className="text-xs">
                  {formatElevation(entry.elevationMeters)}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
