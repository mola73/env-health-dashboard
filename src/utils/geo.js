// utils/geo.js
export async function geocodePostalCode(postalCode, mapboxToken) {
  const pc = postalCode.trim().toUpperCase();

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(pc)}.json` +
    `?country=CA&types=postcode&proximity=-123.1207,49.2827&access_token=${mapboxToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) throw new Error("Postal code not found");

  const [lng, lat] = feature.center;
  return { lat, lng, place_name: feature.place_name };
}
