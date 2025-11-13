# BC Wildfire Explorer

An interactive React app that visualizes British Columbia wildfire incidents from a GeoJSON source on a performant Mapbox GL map. Built with resilient data-loading, clean state management, and accessible UI.

---

## ✨ Highlights

- Interactive map with markers and popups.
- Rock-solid GeoJSON loading that works in dev and production (handles direct JSON, default-wrapped modules, and hashed static asset URLs).
- Filters by year/status with immediate feedback.
- Accessible, responsive UI with clear loading and error states.
- Production-minded architecture that’s easy to extend and test.

---

## Demo

- Live: https://your-demo-url.com](https://mola73.github.io/env-health-dashboard/


---

## Tech Stack

- React 18
- react-map-gl (Mapbox GL JS)
- Vite (or CRA)
- Plain CSS 

---

## Getting Started

1) Clone and install
- git clone https://github.com/your-org/bc-wildfire-explorer.git
- cd bc-wildfire-explorer
- npm install

2) Environment variables
Create a .env.local with your token:
- VITE_MAPBOX_TOKEN=your_mapbox_access_token

If using CRA:
- REACT_APP_MAPBOX_TOKEN=your_mapbox_access_token

3) Run
- npm start

4) Build
- npm run build
- npm run preview

---

## Data

- Default dataset: ./src/data/bc-wildfires.geojson
- The app’s loader handles three cases seamlessly:
  - Direct JSON object
  - ESM default-wrapped module
  - Hashed static asset URL string (fetched at runtime)

---

## Resilient Data Loading (drop-in snippet)

```javascript
import wildfireDataJSON from './data/bc-wildfires.geojson';

useEffect(() => {
  const loadData = async () => {
    try {
      let data = wildfireDataJSON;

      if (data?.default) data = data.default;

      if (typeof data === 'string') {
        const res = await fetch(data);
        data = await res.json();
      }

      setWildfireData(data);
    } catch (e) {
      console.error('Error loading data', e);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
