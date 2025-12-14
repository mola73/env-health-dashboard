
# 🌲🔥 BC Wildfire & Air Quality Risk Explorer

An interactive **React + Mapbox** web application that visualizes **British Columbia wildfire incidents** and computes **location-based health risk** by combining **wildfire proximity** with **Air Quality Health Index (AQHI)** data.

Built for environmental health analysis, spatial reasoning, and public-facing risk communication.

---

## ✨ Highlights

* **Interactive Mapbox GL map** with wildfire markers and detailed popups
* **Postal-code–based risk checker** (BC)
* **Combined health risk score** using:

  * 🔥 Wildfire distance, size, and status
  * 🌫️ Real-time AQHI from Environment & Climate Change Canada
* **Automatic nearest-station AQHI lookup**
* **Resilient GeoJSON loading** (works in dev + production builds)
* **Year-based wildfire filtering**
* **Clear, accessible UI** with loading and error handling
* Designed for **environmental health & geography coursework**

---

## 🌐 Live Demo

👉 **Live App:**
[Wildfire Explorer](https://mola73.github.io/env-health-dashboard/)

---

## 🧠 How Risk Is Calculated

### 🔥 Wildfire Risk Factors

* Distance from user location
* Fire size (hectares)
* Fire status (active vs out)

### 🌫️ Air Quality Risk (AQHI)

* Nearest AQHI monitoring station
* Real-time AQHI value
* Official AQHI categories:

  * 1–3: Low
  * 4–6: Moderate
  * 7–10: High
  * 10+: Very High

### 🧮 Combined Risk Logic

* Uses the **higher** of wildfire or AQHI risk
* Escalates risk if **both wildfire and air quality are high**
* Outputs a clear **LOW / MODERATE / HIGH / EXTREME** health risk level

---

## 🧱 Tech Stack

* **React 18**
* **react-map-gl** (Mapbox GL JS)
* **Mapbox Geocoding API**
* **ECCC GeoMet AQHI API**
* **@turf/turf** (spatial distance calculations)
* CRA (Create React App)
* Plain CSS / inline styles

---

## 🚀 Getting Started

### 1) Clone & Install

```bash
git clone https://github.com/mola73/env-health-dashboard.git
cd env-health-dashboard
npm install
```

### 2) Environment Variables

Create a `.env.local` file:

```env
REACT_APP_MAPBOX_TOKEN=your_mapbox_access_token
```

> For Vite:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

---

### 3) Run Locally

```bash
npm start
```

### 4) Build for Production

```bash
npm run build
npm run preview
```

---

## 📊 Data Sources

### 🔥 Wildfires

* BC Wildfire Service GeoJSON
* Default dataset:

```text
src/data/bc-wildfires.geojson
```

### 🌫️ Air Quality (AQHI)

* Environment & Climate Change Canada (GeoMet API)
* Nearest AQHI station selected dynamically at runtime

---

## 🧩 Resilient GeoJSON Loading (Production-Safe)

The app safely handles:

* Direct JSON imports
* ESM default-wrapped modules
* Hashed static asset URLs (GitHub Pages / Vite builds)

```js
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
      console.error('Error loading wildfire data', e);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

---

## 🧪 Example Use Case

> “How risky is it to live near Prince George during wildfire season?”

1. Enter a BC postal code
2. App:

   * Locates the user
   * Finds nearest wildfire
   * Finds nearest AQHI station
3. Returns:

   * AQHI value + category
   * Fire distance & status
   * **Combined health risk score**
   * Plain-language explanation

---

## 🔮 Future Improvements

* 🔄 Expand wildfire visualization to **other Canadian provinces**
* 🌬️ Smoke dispersion modeling & wind-based plume visualization
* 📈 Time-series AQHI + wildfire trend charts
* 🏥 Integration of additional health indicators (e.g., asthma risk zones)
* 🧭 Indigenous territory & rural accessibility overlays

---

## 📚 Academic Context

Built for:

* **Health Geography**
* **Environmental Hazards**
* **Climate Change & Place-Based Health**
* **GIS & Spatial Risk Communication**

---

