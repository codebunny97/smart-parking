import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const empty = { name: '', address: '', lat: '', lng: '', totalSlots: '', availableSlots: '' };

export default function AdminPanel({ onClose }) {
  const { addParking } = useApp();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, address, lat, lng, totalSlots, availableSlots } = form;
    if (!name || !address || !lat || !lng || !totalSlots || !availableSlots) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(lat) || isNaN(lng)) { setError('Lat/Lng must be numbers.'); return; }
    if (Number(availableSlots) > Number(totalSlots)) { setError('Available cannot exceed total.'); return; }

    addParking({
      name,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      totalSlots: parseInt(totalSlots),
      availableSlots: parseInt(availableSlots),
    });
    setForm(empty);
    setSuccess(true);
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>Add Parking Location</span>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: 'Name', name: 'name', placeholder: 'e.g. Central Park Parking' },
          { label: 'Address', name: 'address', placeholder: 'e.g. Downtown, City' },
          { label: 'Latitude', name: 'lat', placeholder: 'e.g. 17.4475' },
          { label: 'Longitude', name: 'lng', placeholder: 'e.g. 78.3762' },
          { label: 'Total Slots', name: 'totalSlots', placeholder: 'e.g. 100' },
          { label: 'Available Slots', name: 'availableSlots', placeholder: 'e.g. 45' },
        ].map((f) => (
          <div key={f.name} style={styles.field}>
            <label style={styles.label}>{f.label}</label>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              style={styles.input}
            />
          </div>
        ))}

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>✓ Parking location added.</p>}

        <button type="submit" style={styles.submitBtn}>Add Location</button>
      </form>
    </div>
  );
}

const styles = {
  panel: {
    borderTop: '1px solid #e5e7eb',
    background: '#fff',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f1f3f4',
  },
  headerTitle: { fontSize: '13px', fontWeight: '600', color: '#202124' },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#5f6368',
    padding: '2px 6px',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  form: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', color: '#5f6368', fontWeight: '500' },
  input: {
    padding: '8px 10px',
    border: '1px solid #dadce0',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#202124',
    outline: 'none',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  error: { color: '#d93025', fontSize: '12px', margin: 0 },
  success: { color: '#1e8e3e', fontSize: '12px', margin: 0 },
  submitBtn: {
    padding: '9px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
};
