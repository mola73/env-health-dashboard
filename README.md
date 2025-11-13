BC Wildfire Explorer
An interactive React app that visualizes British Columbia wildfire incidents from a GeoJSON source on a performant Mapbox GL map. Built with resilient data-loading, clean state management, and accessible UI.

✨ Highlights
Interactive map with markers and popups.
Rock-solid GeoJSON loading that works in dev and production (handles direct JSON, default-wrapped modules, and hashed static asset URLs).
Filters by year/status with immediate feedback.
Accessible, responsive UI with clear loading and error states.
Production-minded architecture that’s easy to extend and test.
Demo
Live: https://your-demo-url.com
Loom walkthrough: https://your-loom-link.com
Screenshots: add /docs/screenshots here
Tech Stack
React 18
react-map-gl (Mapbox GL JS)
Vite (or CRA)
Plain CSS (swap for Tailwind if preferred)
Getting Started
Clone and install
git clone https://github.com/your-org/bc-wildfire-explorer.git

cd bc-wildfire-explorer

npm install

Environment variables
Create a .env.local with your token:

VITE_MAPBOX_TOKEN=your_mapbox_access_token
If using CRA:

REACT_APP_MAPBOX_TOKEN=your_mapbox_access_token
Run
npm run dev
Build
npm run build

npm run preview

Data
Default dataset: ./src/data/bc-wildfires.geojson
The app’s loader handles three cases seamlessly:
Direct JSON object
ESM default-wrapped module
Hashed static asset URL string (fetched at runtime)
Resilient Data Loading (drop-in snippet)
javascript


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
Features
Map interactions:

Click markers to view fire details (status, cause, size, link).
Popups positioned by feature geometry.
Filters:

Year (e.g., All, 2023, 2024, 2025).
Easy to extend for status/cause/region.
UX:

Clear loading and error states.
Keyboard-focusable controls.
Performance:

Lean render path, memoized derived lists where needed.
Project Structure
src/
components/
MapView.jsx
FireMarker.jsx
Filters.jsx
data/
bc-wildfires.geojson
hooks/
useWildfireData.js
styles/
map.css
App.jsx
main.jsx
public/
favicon.svg
GeoJSON Contract
type: FeatureCollection
features: Feature[]
Feature.properties (commonly used):
FIRE_NUMBER
FIRE_YEAR
FIRE_STATUS
FIRE_CAUSE
CURRENT_SIZE
FIRE_URL
Feature.geometry:
type: "Point"
coordinates: [longitude, latitude]
Extensibility Ideas
Clustering and heatmaps for density.
Charts: causes, size distribution, time series.
Public health overlays: air quality, proximity to communities.
Schema validation (e.g., zod) for data safety.
Offline caching with a service worker.
Troubleshooting
No markers:

Check console for features length.
Verify token and dataset path.
Map blank:

Confirm Mapbox token is set and valid.
Prod build shows 0 features:

Ensure the hashed asset path is fetched (the loader handles this if imported).
Security and Privacy
No PII processed.
Mapbox token is environment-scoped.
External links rendered safely (noopener, noreferrer).
License and Attribution
MIT License (add LICENSE file).
Data courtesy of Province of BC wildfire datasets.
Map tiles via Mapbox.
Author
Your Name (@your-handle)
Portfolio: https://your-portfolio.com
LinkedIn: https://linkedin.com/in/your-handle
Reviewer Notes
See the data loader for production resilience.
Inspect filter logic for clarity and testability.
Try the map interactions for UX polish.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
