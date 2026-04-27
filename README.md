# ParkFinder – Smart Parking App

A clean, production-style parking availability app built with React + React Leaflet.

## Setup & Run

1. **Install dependencies**
   ```bash
   cd smart-parking
   npm install
   ```

2. **Start the app**
   ```bash
   npm start
   ```
   Opens at http://localhost:3000

## Features

- **Login** with name + role (User or Admin)
- **Map** powered by React Leaflet + OpenStreetMap (no API key needed)
- **Search** parking by name or address
- **Sort** by name, availability, or distance (requires location)
- **Location** — click 📍 in sidebar to enable your current location
- **Directions** — opens Google Maps routing from your location
- **Admin**: Add new parking, delete locations, update available slots

## Admin Access
Select "Admin" role on the login screen to access:
- Add parking form (name, address, lat/lng, slots)
- Delete button on each card
- Slot editor (type new count + press Enter or click away)

## Stack
- React 18 (functional components + hooks)
- React Leaflet 4 + Leaflet 1.9
- OpenStreetMap tiles (free, no API key)
- React Context for state management
- In-memory JSON data (src/data/parkingData.json)
