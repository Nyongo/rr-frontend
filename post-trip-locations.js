/**
 * Script to POST GPS coordinates to the API for a trip
 * Trip ID: 28b18231-d743-4d4a-96a9-cf8dbd43169d
 * Route: 360 Apartments Phase 1 to JKIA
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tripId = "28b18231-d743-4d4a-96a9-cf8dbd43169d";

// Try to read from .env file or use default
let API_BASE_URL = "http://localhost:3000";
try {
  const envFile = join(__dirname, '.env');
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf8');
    const match = envContent.match(/VITE_API_BASE_URL=(.+)/);
    if (match) {
      API_BASE_URL = match[1].trim();
    }
  }
} catch (e) {
  // Use default
  console.log(`⚠️ Could not read .env file, using default API URL: ${API_BASE_URL}`);
}

const API_URL = `${API_BASE_URL}/academic-suite/trips/${tripId}/location`;

// Trip location data - generate timestamps starting from now
const now = new Date();
const tripLocations = [
  {
    tripId: tripId,
    latitude: -1.329409,
    longitude: 36.92507,
    timestamp: new Date(now.getTime() + 0 * 60 * 1000).toISOString(), // Start
    speed: 0,
    heading: 12,
    accuracy: 5.4,
  },
  {
    tripId: tripId,
    latitude: -1.327336,
    longitude: 36.925517,
    timestamp: new Date(now.getTime() + 2 * 60 * 1000).toISOString(), // +2 minutes
    speed: 72.4,
    heading: 11,
    accuracy: 8.4,
  },
  {
    tripId: tripId,
    latitude: -1.32536,
    longitude: 36.925888,
    timestamp: new Date(now.getTime() + 4 * 60 * 1000).toISOString(), // +4 minutes
    speed: 45.9,
    heading: 16,
    accuracy: 9.1,
  },
  {
    tripId: tripId,
    latitude: -1.323452,
    longitude: 36.926641,
    timestamp: new Date(now.getTime() + 6 * 60 * 1000).toISOString(), // +6 minutes
    speed: 43.2,
    heading: 15,
    accuracy: 9.5,
  },
  {
    tripId: tripId,
    latitude: -1.3192,
    longitude: 36.9275,
    timestamp: new Date(now.getTime() + 8 * 60 * 1000).toISOString(), // +8 minutes
    speed: 25.8,
    heading: 11,
    accuracy: 9.6,
  },
];

/**
 * POST a single location point to the API
 */
async function postLocation(location) {
  try {
    console.log(`📤 Posting location: ${location.latitude}, ${location.longitude} at ${location.timestamp}`);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.response?.message || `HTTP ${response.status}`);
    }

    console.log(`✅ Success: ${JSON.stringify(result, null, 2)}\n`);
    return result;
  } catch (error) {
    console.error(`❌ Error posting location: ${error.message}\n`);
    throw error;
  }
}

/**
 * Post all locations sequentially
 */
async function postAllLocations() {
  console.log(`\n🚀 Posting ${tripLocations.length} location points for trip ${tripId}`);
  console.log(`📍 API URL: ${API_URL}\n`);

  const results = [];
  
  for (let i = 0; i < tripLocations.length; i++) {
    const location = tripLocations[i];
    console.log(`\n[${i + 1}/${tripLocations.length}]`);
    
    try {
      const result = await postLocation(location);
      results.push({ success: true, index: i + 1, data: result });
      
      // Small delay between requests to avoid rate limiting
      if (i < tripLocations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      results.push({ success: false, index: i + 1, error: error.message });
      console.error(`Failed to post location ${i + 1}, continuing...\n`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Summary:");
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`   ✅ Successful: ${successful}/${tripLocations.length}`);
  console.log(`   ❌ Failed: ${failed}/${tripLocations.length}`);
  console.log("=".repeat(60) + "\n");

  return results;
}

// Run the script
postAllLocations()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
