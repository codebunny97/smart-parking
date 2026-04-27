import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getMarkerColor(available, total) {
  if (available === 0) return '#d93025';
  const ratio = available / total;
  if (ratio < 0.25) return '#f29900';
  return '#1e8e3e';
}

function createIcon(available, total) {
  const color = getMarkerColor(available, total);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="7" fill="white"/>
      <text x="14" y="18" text-anchor="middle" font-size="9" font-weight="700" font-family="Arial" fill="${color}">P</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { duration: 1 });
    }
  }, [target, map]);
  return null;
}

function OpenPopupOnSelect({ target, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (target && markerRefs.current[target.id]) {
      setTimeout(() => {
        markerRefs.current[target.id].openPopup();
      }, 800);
    }
  }, [target, markerRefs, map]);
  return null;
}

export default function MapView({ selectedParking, onSelectParking }) {
  const { parkingList, userLocation } = useApp();
  const markerRefs = useRef({});

  const defaultCenter = [17.4475, 78.3762];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={10}
          pathOptions={{ color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1 }}
        >
          <Popup>
            <div style={{ fontSize: '13px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
              <strong>Your Location</strong>
            </div>
          </Popup>
        </CircleMarker>
      )}

      {parkingList.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={createIcon(p.availableSlots, p.totalSlots)}
          ref={(ref) => { markerRefs.current[p.id] = ref; }}
          eventHandlers={{ click: () => onSelectParking && onSelectParking(p) }}
        >
          <Popup>
            <PopupContent parking={p} />
          </Popup>
        </Marker>
      ))}

      <FlyTo target={selectedParking} />
      <OpenPopupOnSelect target={selectedParking} markerRefs={markerRefs} />
    </MapContainer>
  );
}

function PopupContent({ parking }) {
  const { userLocation } = useApp();
  const { name, address, availableSlots, totalSlots, lat, lng } = parking;
  const color = getMarkerColor(availableSlots, totalSlots);
  const pct = Math.round((availableSlots / totalSlots) * 100);

  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minWidth: '180px' }}>
      <div style={{ fontWeight: '600', fontSize: '14px', color: '#202124', marginBottom: '2px' }}>{name}</div>
      <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '8px' }}>{address}</div>
      <div style={{ fontSize: '12px', color: '#202124', marginBottom: '4px' }}>
        <span style={{ color, fontWeight: '600' }}>{availableSlots}</span>
        <span style={{ color: '#5f6368' }}> / {totalSlots} spots available</span>
      </div>
      <div style={{ background: '#f1f3f4', borderRadius: '4px', height: '6px', marginBottom: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '4px' }} />
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '6px 10px',
          background: '#1a73e8',
          color: '#fff',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
        }}
      >
        Get Directions
      </a>
    </div>
  );
}
