import React, { createContext, useContext, useState } from 'react';
import parkingData from '../data/parkingData.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { name, role }
  const [parkingList, setParkingList] = useState(parkingData);
  const [userLocation, setUserLocation] = useState(null);

  const login = (name, role) => setUser({ name, role });
  const logout = () => setUser(null);

  const addParking = (entry) => {
    setParkingList((prev) => [...prev, { ...entry, id: Date.now().toString() }]);
  };

  const deleteParking = (id) => {
    setParkingList((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSlots = (id, availableSlots) => {
    setParkingList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, availableSlots: Number(availableSlots) } : p))
    );
  };

  return (
    <AppContext.Provider
      value={{ user, login, logout, parkingList, addParking, deleteParking, updateSlots, userLocation, setUserLocation }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
