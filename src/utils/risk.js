// utils/risk.js
import * as turf from "@turf/turf";

/**
 * wildfireGeoJson: FeatureCollection (Point OR Polygon/MultiPolygon)
 * user: { lat, lng }
 */
export function findNearestFire(wildfireGeoJson, user) {
  const userPt = turf.point([user.lng, user.lat]);

  let best = null;

  for (const f of wildfireGeoJson.features || []) {
    // If polygon, use its centroid; if point, use point directly
    const geomType = f.geometry?.type;
    let targetPt;

    if (geomType === "Point") {
      targetPt = turf.point(f.geometry.coordinates);
    } else if (geomType === "Polygon" || geomType === "MultiPolygon") {
      targetPt = turf.centroid(f);
    } else {
      continue;
    }

    const km = turf.distance(userPt, targetPt, { units: "kilometers" });

    if (!best || km < best.distanceKm) {
      best = {
        distanceKm: km,
        feature: f,
      };
    }
  }

  return best; // { distanceKm, feature } or null
}

export function scoreWildfireRisk({ distanceKm, status, size }) {
  const s = (status || "").toLowerCase();

  // Fires that are already out are always low risk
  if (s === "out") {
    return { level: "LOW", reason: "Fire is out" };
  }

  switch (true) {

    // ----------------------------
    // EXTREME RISK
    // ----------------------------
    case distanceKm <= 10 && size > 5000:
      return {
        level: "EXTREME",
        reason: "Very close, very large fire"
      };

    // ----------------------------
    // HIGH RISK
    // ----------------------------
    case distanceKm <= 10 && size > 1000:
      return {
        level: "HIGH",
        reason: "Very close, large fire"
      };

    case distanceKm <= 25 && size > 5000:
      return {
        level: "HIGH",
        reason: "Large fire within 25 km"
      };

    case distanceKm <= 25 && size > 100:
      return {
        level: "HIGH",
        reason: "Active fire nearby"
      };

    // ----------------------------
    // MODERATE RISK
    // ----------------------------
    case distanceKm <= 50 && size > 5000:
      return {
        level: "MODERATE",
        reason: "Large fire within 50 km"
      };

    case distanceKm <= 25:
      return {
        level: "MODERATE",
        reason: "Fire within 25 km"
      };

    // ----------------------------
    // LOW RISK
    // ----------------------------
    default:
      return {
        level: "LOW",
        reason: "More than 50 km away or small fire"
      };
  }


}

export function aqhiToRisk(aqhi) {
  const v = Number(aqhi);
  if (!Number.isFinite(v)) return { level: "UNKNOWN", score: 0, reason: "AQHI unavailable" };

  if (v <= 3)  return { level: "LOW",      score: 1, reason: `AQHI ${v} (Low)` };
  if (v <= 6)  return { level: "MODERATE", score: 2, reason: `AQHI ${v} (Moderate)` };
  if (v <= 10) return { level: "HIGH",     score: 3, reason: `AQHI ${v} (High)` };

  return { level: "EXTREME", score: 4, reason: `AQHI ${v} (Very High)` };
}

function levelToScore(level) {
  switch ((level || "").toUpperCase()) {
    case "EXTREME": return 4;
    case "HIGH": return 3;
    case "MODERATE": return 2;
    case "LOW": return 1;
    default: return 0;
  }
}

function scoreToLevel(score) {
  switch (score) {
    case 4: return "EXTREME";
    case 3: return "HIGH";
    case 2: return "MODERATE";
    case 1: return "LOW";
    default: return "UNKNOWN";
  }
}

export function combineWildfireAndAqhi({ wildfireRisk, aqhiRisk }) {
  const w = levelToScore(wildfireRisk?.level);
  const a = aqhiRisk?.score ?? 0;

  // Base: take the worse of the two
  let combined = Math.max(w, a);

  // Synergy bump: wildfire is high AND air is high => bump one level (max EXTREME)
  if (w >= 3 && a >= 3) combined = Math.min(4, combined + 1);

  return {
    level: scoreToLevel(combined),
    reason: `Wildfire: ${wildfireRisk?.level ?? "UNKNOWN"}, Air: ${aqhiRisk?.level ?? "UNKNOWN"}`,
  };
}

