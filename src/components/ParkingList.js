import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ParkingCard from './ParkingCard';
import AdminPanel from './AdminPanel';

export default function ParkingList({ selectedParking, onSelectParking }) {
  const { parkingList, user, logout, userLocation, setUserLocation } = useApp();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [showAdmin, setShowAdmin] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const filtered = useMemo(() => {
    let list = parkingList.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === 'available') {
      list = [...list].sort((a, b) => b.availableSlots - a.availableSlots);
    } else if (sort === 'distance' && userLocation) {
      list = [...list].sort((a, b) => {
        const dist = (p) =>
          Math.hypot(p.lat - userLocation.lat, p.lng - userLocation.lng);
        return dist(a) - dist(b);
      });
    } else if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [parkingList, search, sort, userLocation]);

  const handleLocate = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        alert('Unable to get location.');
        setLocLoading(false);
      }
    );
  };

  const available = parkingList.reduce((s, p) => s + p.availableSlots, 0);
  const total = parkingList.reduce((s, p) => s + p.totalSlots, 0);

  return (
    <div style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="8" fill="#1a73e8" />
            <text x="9" y="23" fontSize="18" fontWeight="700" fill="white" fontFamily="Arial">P</text>
          </svg>
          <span style={styles.logoText}>ParkFinder</span>
          <div style={styles.headerRight}>
            <button onClick={handleLocate} style={styles.iconBtn} title="Use my location">
              {locLoading ? '⏳' : '📍'}
            </button>
            <button onClick={logout} style={styles.iconBtn} title="Sign out">
              Sign out
            </button>
          </div>
        </div>
        <div style={styles.userRow}>
          <span style={styles.userName}>
            {user?.name} · <span style={{ color: user?.role === 'admin' ? '#f29900' : '#1a73e8' }}>{user?.role}</span>
          </span>
          {userLocation && <span style={styles.locBadge}>📍 Located</span>}
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchBar}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search parking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Sort + Stats */}
      <div style={styles.controls}>
        <div style={styles.sortRow}>
          <span style={styles.controlLabel}>Sort:</span>
          {['name', 'available', 'distance'].map((s) => (
            <button
              key={s}
              style={{ ...styles.sortBtn, ...(sort === s ? styles.sortBtnActive : {}) }}
              onClick={() => setSort(s)}
            >
              {s === 'name' ? 'Name' : s === 'available' ? 'Availability' : 'Distance'}
            </button>
          ))}
        </div>
        <div style={styles.statsRow}>
          <span style={styles.stat}>
            <span style={{ fontWeight: '600', color: '#1e8e3e' }}>{available}</span> / {total} total spots free
          </span>
          <span style={styles.stat}>{filtered.length} locations</span>
        </div>
      </div>

      {/* List */}
      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>No parking locations found.</div>
        ) : (
          filtered.map((p) => (
            <ParkingCard
              key={p.id}
              parking={p}
              isSelected={selectedParking?.id === p.id}
              onClick={() => onSelectParking(p)}
            />
          ))
        )}
      </div>

      {/* Admin Panel */}
      {user?.role === 'admin' && (
        <>
          {!showAdmin ? (
            <div style={styles.adminToggle}>
              <button onClick={() => setShowAdmin(true)} style={styles.addBtn}>
                + Add Parking Location
              </button>
            </div>
          ) : (
            <AdminPanel onClose={() => setShowAdmin(false)} />
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    width: '340px',
    minWidth: '340px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRight: '1px solid #e5e7eb',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    overflow: 'hidden',
  },
  header: {
    padding: '14px 16px 10px',
    borderBottom: '1px solid #f1f3f4',
    flexShrink: 0,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  logoText: { fontSize: '17px', fontWeight: '600', color: '#202124', flex: 1 },
  headerRight: { display: 'flex', gap: '6px', alignItems: 'center' },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#5f6368',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  userRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  userName: { fontSize: '12px', color: '#5f6368' },
  locBadge: { fontSize: '11px', color: '#1a73e8', fontWeight: '500' },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '10px 12px',
    padding: '8px 12px',
    background: '#f1f3f4',
    borderRadius: '8px',
    flexShrink: 0,
  },
  searchIcon: { fontSize: '14px', flexShrink: 0 },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#202124',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#5f6368',
    fontSize: '12px',
    padding: 0,
  },
  controls: {
    padding: '0 12px 8px',
    flexShrink: 0,
    borderBottom: '1px solid #f1f3f4',
  },
  sortRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' },
  controlLabel: { fontSize: '12px', color: '#5f6368' },
  sortBtn: {
    fontSize: '12px',
    padding: '3px 8px',
    border: '1px solid #dadce0',
    borderRadius: '20px',
    background: '#fff',
    color: '#5f6368',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  sortBtnActive: {
    background: '#e8f0fe',
    color: '#1a73e8',
    borderColor: '#1a73e8',
    fontWeight: '600',
  },
  statsRow: { display: 'flex', justifyContent: 'space-between' },
  stat: { fontSize: '12px', color: '#5f6368' },
  list: { flex: 1, overflowY: 'auto' },
  empty: { padding: '24px 16px', textAlign: 'center', color: '#9aa0a6', fontSize: '14px' },
  adminToggle: { padding: '12px 16px', borderTop: '1px solid #f1f3f4', flexShrink: 0 },
  addBtn: {
    width: '100%',
    padding: '9px',
    background: '#fff',
    border: '1px dashed #1a73e8',
    borderRadius: '6px',
    color: '#1a73e8',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
};
