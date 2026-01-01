/**
 * Script to generate GPS coordinates for a trip from 360 Apartments Phase 1 to JKIA
 * Trip ID: 28b18231-d743-4d4a-96a9-cf8dbd43169d
 * 
 * Generates points approximately every 2 minutes along the route
 */

const tripId = "28b18231-d743-4d4a-96a9-cf8dbd43169d";

// Starting point: 360 Apartments Phase 1, Syokimau
const startPoint = {
  latitude: -1.329409,
  longitude: 36.92507,
  name: "360 Apartments Phase 1"
};

// Destination: JKIA (Jomo Kenyatta International Airport)
const endPoint = {
  latitude: -1.3192,
  longitude: 36.9275,
  name: "JKIA"
};

/**
 * Calculate distance between two points using Haversine formula (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Generate intermediate points along the route
 * Using linear interpolation with some realistic variation
 */
function generateRoutePoints(start, end, numPoints) {
  const points = [];
  
  // Always include start point
  points.push({
    latitude: start.latitude,
    longitude: start.longitude,
    timestamp: new Date().toISOString(),
  });

  // Generate intermediate points
  for (let i = 1; i < numPoints - 1; i++) {
    const ratio = i / numPoints;
    
    // Linear interpolation with slight variation to simulate road curvature
    const lat = start.latitude + (end.latitude - start.latitude) * ratio;
    const lon = start.longitude + (end.longitude - start.longitude) * ratio;
    
    // Add small random variation (within ~50 meters) to simulate actual road path
    const latVariation = (Math.random() - 0.5) * 0.0005; // ~50m
    const lonVariation = (Math.random() - 0.5) * 0.0005;
    
    // Calculate timestamp (every 2 minutes = 120 seconds)
    const minutesSinceStart = ratio * ((numPoints - 1) * 2);
    const timestamp = new Date(Date.now() + minutesSinceStart * 60 * 1000);
    
    points.push({
      latitude: lat + latVariation,
      longitude: lon + lonVariation,
      timestamp: timestamp.toISOString(),
    });
  }

  // Always include end point
  points.push({
    latitude: end.latitude,
    longitude: end.longitude,
    timestamp: new Date(Date.now() + (numPoints - 1) * 2 * 60 * 1000).toISOString(),
  });

  return points;
}

/**
 * Calculate heading (direction) between two points in degrees
 */
function calculateHeading(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let heading = Math.atan2(y, x);
  heading = (heading * 180) / Math.PI;
  heading = (heading + 360) % 360;
  
  return Math.round(heading);
}

/**
 * Calculate speed based on distance and time
 */
function calculateSpeed(distanceKm, timeMinutes) {
  if (timeMinutes === 0) return 0;
  const timeHours = timeMinutes / 60;
  return Math.round((distanceKm / timeHours) * 10) / 10; // Round to 1 decimal
}

// Calculate distance and estimate number of points
const totalDistance = calculateDistance(
  startPoint.latitude,
  startPoint.longitude,
  endPoint.latitude,
  endPoint.longitude
);

console.log(`\n📍 Route Information:`);
console.log(`   From: ${startPoint.name}`);
console.log(`   To: ${endPoint.name}`);
console.log(`   Distance: ${totalDistance.toFixed(2)} km`);
console.log(`   Trip ID: ${tripId}\n`);

// Estimate number of points (every 2 minutes, assuming 60 km/h average speed)
// For short trips, generate at least 5-10 points for good visualization
const estimatedTripDurationMinutes = Math.max(5, (totalDistance / 60) * 60); // At least 5 minutes
const numPoints = Math.max(5, Math.ceil(estimatedTripDurationMinutes / 2));

console.log(`   Estimated points: ${numPoints} (every ~2 minutes)\n`);

// Generate points
const routePoints = generateRoutePoints(startPoint, endPoint, numPoints);

// Generate trip location data with realistic values
const tripLocations = [];
let startTime = new Date("2025-01-01T08:00:00.000Z"); // Start at 8:00 AM

routePoints.forEach((point, index) => {
  let speed = 0;
  let heading = 0;
  let accuracy = 5 + Math.random() * 5; // Accuracy between 5-10 meters
  
  if (index === 0) {
    // First point: starting, no speed
    speed = 0;
    heading = calculateHeading(
      point.latitude,
      point.longitude,
      routePoints[index + 1].latitude,
      routePoints[index + 1].longitude
    );
  } else if (index === routePoints.length - 1) {
    // Last point: arriving, slowing down
    speed = 10 + Math.random() * 20; // 10-30 km/h
    heading = calculateHeading(
      routePoints[index - 1].latitude,
      routePoints[index - 1].longitude,
      point.latitude,
      point.longitude
    );
  } else {
    // Intermediate points: normal driving speed
    const prevPoint = routePoints[index - 1];
    const nextPoint = routePoints[index + 1];
    const segmentDistance = calculateDistance(
      prevPoint.latitude,
      prevPoint.longitude,
      point.latitude,
      point.longitude
    );
    speed = 40 + Math.random() * 40; // 40-80 km/h (typical city driving)
    heading = calculateHeading(
      prevPoint.latitude,
      prevPoint.longitude,
      nextPoint.latitude,
      nextPoint.longitude
    );
  }

  // Calculate timestamp (every 2 minutes)
  const timestamp = new Date(startTime.getTime() + index * 2 * 60 * 1000);

  tripLocations.push({
    tripId: tripId,
    latitude: parseFloat(point.latitude.toFixed(6)),
    longitude: parseFloat(point.longitude.toFixed(6)),
    timestamp: timestamp.toISOString(),
    speed: parseFloat(speed.toFixed(1)),
    heading: heading,
    accuracy: parseFloat(accuracy.toFixed(1)),
  });
});

// Output as JSON
console.log("📦 Generated Trip Locations (JSON format for API):\n");
console.log(JSON.stringify(tripLocations, null, 2));

// Also output as curl commands for easy API testing
const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
console.log("\n\n🔧 Sample curl commands to POST each location:\n");
console.log(`# Post all location points (run each command):\n`);
tripLocations.forEach((location, index) => {
  console.log(`# Point ${index + 1}/${tripLocations.length}`);
  console.log(`curl -X POST "${apiBaseUrl}/academic-suite/trips/${tripId}/location" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '${JSON.stringify(location)}'`);
  console.log('');
});

console.log("\n✅ Total points generated:", tripLocations.length);
console.log("   Timestamp range:", tripLocations[0].timestamp, "to", tripLocations[tripLocations.length - 1].timestamp);
console.log("\n💡 Tip: Save the JSON array above to a file and use it with your backend API\n");

