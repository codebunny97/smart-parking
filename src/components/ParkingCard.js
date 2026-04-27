import React from 'react';
import { useApp } from '../context/AppContext';

function getStatusColor(available, total) {
  if (available === 0) return '#d93025';
  const ratio = available / total;
  if (ratio < 0.25) return '#f29900';
  return '#1e8e3e';
}

function getStatusLabel(available, total) {
  if (available === 0) return 'Full';
  const ratio = available / total;
  if (ratio < 0.25) return 'Almost Full';
  return 'Available';
}

export default function ParkingCard({ parking, isSelected, onClick }) {
  const { user, deleteParking, updateSlots, userLocation } = useApp();
  const { id, name, address, availableSlots, totalSlots, lat, lng } = parking;

  const color = getStatusColor(availableSlots, totalSlots);
  const label = getStatusLabel(availableSlots, totalSlots);
  const pct = Math.round((availableSlots / totalSlots) * 100);

  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  function getDistance() {
    if (!userLocation) return null;
    const R = 6371;
    const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  }

  const dist = getDistance();

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        ...(isSelected ? styles.cardSelected : {}),
      }}
    >
      <div style={styles.row}>
        <div style={styles.nameBlock}>
          <div style={styles.name}>{name}</div>
          <div style={styles.address}>{address}</div>
        </div>
        <div style={{ ...styles.badge, background: color + '18', color }}>
          {label}
        </div>
      </div>

      <div style={styles.slotRow}>
        <span style={{ color, fontWeight: '600', fontSize: '14px' }}>{availableSlots}</span>
        <span style={styles.slotTotal}> / {totalSlots} spots</span>
        {dist && <span style={styles.dist}>· {dist}</span>}
      </div>

      <div style={styles.barBg}>
        <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
      </div>

      <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={styles.dirBtn}>
          Directions
        </a>

        {user?.role === 'admin' && (
          <>
            <input
              type="number"
              min="0"
              max={totalSlots}
              defaultValue={availableSlots}
              style={styles.slotInput}
              title="Update available slots"
              onBlur={(e) => updateSlots(id, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') updateSlots(id, e.target.value); }}
            />
            <button onClick={() => deleteParking(id)} style={styles.deleteBtn} title="Delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f3f4',
    cursor: 'pointer',
    background: '#fff',
    transition: 'background 0.1s',
  },
  cardSelected: {
    background: '#e8f0fe',
    borderLeft: '3px solid #1a73e8',
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  nameBlock: { flex: 1, marginRight: '8px' },
  name: { fontSize: '14px', fontWeight: '600', color: '#202124', marginBottom: '2px' },
  address: { fontSize: '12px', color: '#5f6368' },
  badge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  slotRow: { display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '13px' },
  slotTotal: { color: '#5f6368', fontSize: '13px' },
  dist: { color: '#9aa0a6', fontSize: '12px', marginLeft: '4px' },
  barBg: { background: '#f1f3f4', borderRadius: '4px', height: '5px', marginBottom: '10px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  dirBtn: {
    fontSize: '12px',
    color: '#1a73e8',
    fontWeight: '500',
    textDecoration: 'none',
    padding: '4px 10px',
    border: '1px solid #1a73e8',
    borderRadius: '4px',
    background: '#fff',
  },
  slotInput: {
    width: '64px',
    padding: '4px 8px',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#202124',
    outline: 'none',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  deleteBtn: {
    fontSize: '12px',
    color: '#d93025',
    background: '#fff',
    border: '1px solid #d93025',
    borderRadius: '4px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
};
