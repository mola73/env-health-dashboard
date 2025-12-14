// components/RiskChecker.jsx
import { useState } from "react";
import { geocodePostalCode } from "./utils/geo.js";
import { findNearestFire, scoreWildfireRisk } from "./utils/risk.js";
import { fetchNearestAqhi } from "./utils/air"; 
import { aqhiToRisk, combineWildfireAndAqhi } from "./utils/risk"; 


export default function RiskChecker({ mapboxToken, wildfireGeoJson, mapRef }) {
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  async function onCheck() {
  setErr("");
  setResult(null);
  setLoading(true);

  try {
    const user = await geocodePostalCode(postalCode, mapboxToken);

    if (mapRef?.current) {
      mapRef.current.flyTo({ center: [user.lng, user.lat], zoom: 9 });
    }

    const nearest = findNearestFire(wildfireGeoJson, user);

    if (!nearest) {
      setResult({
        user,
        message: "No fires found in the dataset right now.",
        aqhi: null,
        overall: { level: "LOW", reason: "No nearby fires found" }
      });
      return;
    }

    const props = nearest.feature.properties || {};
    const fireName = props.GEOGRAPHIC_DESCRIPTION || props.INCIDENT_NAME || "Unnamed Fire";
    const status = props.FIRE_STATUS || "Unknown";
    const size = props.CURRENT_SIZE || 0;

    // Wildfire risk
    const wildfireRisk = scoreWildfireRisk({
      distanceKm: nearest.distanceKm,
      status,
      size
    });

    // AQHI risk
    const aqhiData = await fetchNearestAqhi(user.lat, user.lng);
    const aqhiRisk = aqhiToRisk(aqhiData?.aqhi);

    // Combined
    const overall = combineWildfireAndAqhi({ wildfireRisk, aqhiRisk });

    setResult({
      user,
      nearest: {
        name: fireName,
        status,
        distanceKm: nearest.distanceKm,
        size
      },
      wildfireRisk,
      aqhi: aqhiData ? { ...aqhiData, ...aqhiRisk } : { ...aqhiRisk },
      overall
    });

  } catch (e) {
    setErr(e?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}


  return (
    <div style={{ background: "white", padding: 16, borderRadius: 12, maxWidth: 420 }}>
      <h3 style={{ marginTop: 0 }}>🔥 Risk Checker</h3>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Enter BC postal code (e.g., V2N 4Z9)"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          onClick={onCheck}
          disabled={loading || !postalCode.trim()}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {result && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Location: {result.user.place_name || `${result.user.lat.toFixed(3)}, ${result.user.lng.toFixed(3)}`}
          </div>

          {result.message ? (
            <p style={{ marginBottom: 0 }}>{result.message}</p>
          ) : (
            <>
              <h4 style={{ margin: "10px 0 6px" }}>
 Overall Risk: <span>{result?.overall?.level ?? "N/A"}</span>

</h4>

<div style={{ fontSize: 14 }}>
  AQHI: <b>{result.aqhi?.aqhi ?? "N/A"}</b> ({result.aqhi?.level ?? "UNKNOWN"})
  <br />
  AQHI Station: {result.aqhi?.stationName ?? "N/A"} ({result.aqhi?.stationDistanceKm?.toFixed?.(1) ?? "?"} km)
  <br /><br />

 Nearest fire: <b>{result?.nearest?.name ?? "N/A"}</b>

  <br />
  Status: {result.nearest.status}
  <br />
  Distance: {result.nearest.distanceKm.toFixed(1)} km
  <br />
 Combined Reason: {result?.overall?.reason ?? "N/A"}

</div>

            </>
          )}
        </div>
      )}
    </div>
  );
}
