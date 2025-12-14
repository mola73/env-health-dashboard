function haversineKm(lat1, lon1, lat2, lon2){
    const toRad= (x) => (x*Math.PI)/ 180;
    const R= 6371;
    const dLat= toRad(lat2 -lat1);
    const dLon= toRad(lon2 - lon1);
    const a= 
    Math.sin(dLat/2) ** 2 + 
    Math.cos (toRad(lat1)) * Math.cos(toRad(lat2))* Math.sin(dLon/2) ** 2;
    return 2* R * Math.asin(Math.sqrt(a));
}

export async function fetchNearestAqhi(lat, lng){
    //find nearby station using bboc around the user

    const delta = 1.0;
    const minLon = lng -delta;
    const minLat= lat-delta;
    const maxLon= lng+ delta;
    const maxLat = lat+ delta;

    const stationsUrl= `https://api.weather.gc.ca/collections/aqhi-stations/items?f=json` +
    `&bbox=${minLon},${minLat},${maxLon},${maxLat}&limit=200`;

    const stationsRes=await fetch(stationsUrl);

    if (!stationsRes.ok) throw new Error("AQHI station fetch failed");

const stations = await stationsRes.json();


const feats = stations?.features || [];

if(feats.length === 0){

    const fallbackRes = await fetch(
        "https://api.weather.gc.ca/collections/aqhi-stations/items?f=json&limit=500");
    
    if (!fallbackRes.ok) throw new Error("AHQI stations fallback failed");
    const fb = await fallbackRes.json();
    feats.push(...(fb?.features || []));
}

if (feats.length === 0) return null;

// pick the closes station
let best = null;
for (const f of feats){
      
    const c = f?.geometry?.coordinates; // [lon, lat]
    if (!c || c.length < 2) continue;
    const d = haversineKm(lat, lng, c[1], c[0]);

    if (!best || d < best.distanceKm) {
      best = {
        distanceKm: d,
        location_id: f?.properties?.location_id || f?.id,
        name: f?.properties?.location_name_en || f?.properties?.location_name_fr || "AQHI station",
      };
    }
  }

  if (!best?.location_id) return null;

  // 3) Fetch latest observation for that station
  const obsUrl =
    `https://api.weather.gc.ca/collections/aqhi-observations-realtime/items?f=json` +
    `&latest=true&location_id=${encodeURIComponent(best.location_id)}&limit=1`;

  const obsRes = await fetch(obsUrl);
  if (!obsRes.ok) throw new Error("AQHI observation fetch failed");
  const obs = await obsRes.json();

  const item = obs?.features?.[0];
  if (!item) return null;

  const aqhi = item?.properties?.aqhi; // number (sometimes 10+ is represented as 10 or string depending on feed)
  const when = item?.properties?.observation_datetime || null;

  return {
    aqhi,
    stationName: best.name,
    stationDistanceKm: best.distanceKm,
    observedAt: when,
  };
}

    

