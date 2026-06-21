import { useEffect } from 'react'
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import type { GazetteerEntry } from '@/types/gazetteer'
import { formatCoordinates } from '@/lib/formatCoordinates'
import { formatElevation } from '@/lib/formatElevation'
import boundaryData from '@/data/imrs-boundary.geojson'
import riverData from '@/data/rio-grande.geojson'
import roadData from '@/data/imrs-roads.geojson'

const defaultIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    width: 14px;
    height: 14px;
    background: hsl(25, 20%, 15%);
    border: 2px solid hsl(42, 45%, 94%);
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
})

const selectedIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    width: 20px;
    height: 20px;
    background: hsl(35, 50%, 65%);
    border: 3px solid hsl(25, 20%, 15%);
    border-radius: 50%;
    box-shadow: 0 0 0 4px hsl(35, 50%, 65%, 0.4);
  "></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

const starSvg = (size: number) => `<svg
    width="${size}"
    height="${size}"
    viewBox="0 0 24 24"
    fill="hsl(42, 85%, 55%)"
    stroke="hsl(25, 20%, 15%)"
    stroke-width="2"
    stroke-linejoin="round"
    style="filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4));"
  ><polygon points="12,2 15,9 22.5,9.5 16.5,14.5 18.5,22 12,17.5 5.5,22 7.5,14.5 1.5,9.5 9,9" /></svg>`

const featuredIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  ">${starSvg(22)}</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
})

const featuredSelectedIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 0 4px hsl(42, 85%, 55%, 0.4);
  ">${starSvg(30)}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -14],
})

const IMRS_CENTER: L.LatLngExpression = [30.77, -105.0]
const IMRS_ZOOM = 12

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    let frame = 0
    const handleResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => map.invalidateSize())
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [map])

  return null
}

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
    if (entry?.latitude != null && entry.longitude != null) {
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
    <div
      className="relative h-full w-full"
      role="region"
      aria-label="Interactive map of Indio Mountains Research Station locations"
    >
      {entriesWithCoords.length === 0 && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/70 pointer-events-none">
          <p className="bg-card text-card-foreground border border-border px-4 py-2 text-sm shadow-card">
            No mappable locations for this filter
          </p>
        </div>
      )}
      <MapContainer
        center={IMRS_CENTER}
        zoom={IMRS_ZOOM}
        className="h-full w-full rounded-sm"
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Street">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Roads">
            <GeoJSON
              data={roadData}
              filter={(feature: GeoJSON.Feature) =>
                feature.geometry.type === 'LineString' ||
                feature.geometry.type === 'MultiLineString'
              }
              style={{
                color: 'hsl(95, 70%, 50%)',
                weight: 2,
                opacity: 0.85,
                dashArray: '5 4',
              }}
            />
          </LayersControl.Overlay>
        </LayersControl>
        <GeoJSON
          data={boundaryData}
          style={{
            color: 'hsl(25, 20%, 15%)',
            weight: 2,
            opacity: 0.6,
            fillColor: 'hsl(35, 50%, 65%)',
            fillOpacity: 0.08,
          }}
        />
        <GeoJSON
          data={riverData}
          style={{
            color: 'hsl(205, 65%, 45%)',
            weight: 3,
            opacity: 0.85,
          }}
        />
        <MapResizeHandler />
        <FlyToSelected entries={entries} selectedId={selectedId} />
        {entriesWithCoords.map((entry) => (
          <Marker
            key={entry.id}
            position={[entry.latitude!, entry.longitude!]}
            icon={
              entry.featured
                ? entry.id === selectedId
                  ? featuredSelectedIcon
                  : featuredIcon
                : entry.id === selectedId
                  ? selectedIcon
                  : defaultIcon
            }
            title={entry.name}
            alt={entry.name}
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
    </div>
  )
}
