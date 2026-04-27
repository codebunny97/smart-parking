import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Inner() {
  const { user } = useApp();
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
