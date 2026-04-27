import React, { useState } from 'react';
import MapView from '../components/MapView';
import ParkingList from '../components/ParkingList';

export default function Dashboard() {
  const [selectedParking, setSelectedParking] = useState(null);

  return (
    <div style={styles.layout}>
      <ParkingList
        selectedParking={selectedParking}
        onSelectParking={setSelectedParking}
      />
      <div style={styles.mapArea}>
        <MapView
          selectedParking={selectedParking}
          onSelectParking={setSelectedParking}
        />
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  mapArea: {
    flex: 1,
    height: '100vh',
    position: 'relative',
  },
};
