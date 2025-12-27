
export interface GeofenceResult {
  isWithinGeofence: boolean;
  distance?: number;
  accuracy?: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Zone {
  id: string;
  name: string;
  coordinates: LocationCoordinates[];
  radius?: number;
}

class GeofenceService {
  private async getCurrentPosition(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        options
      );
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private isPointInPolygon(point: LocationCoordinates, polygon: LocationCoordinates[]): boolean {
    const x = point.latitude, y = point.longitude;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude, yi = polygon[i].longitude;
      const xj = polygon[j].latitude, yj = polygon[j].longitude;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  async checkGeofence(zoneId: string): Promise<GeofenceResult> {
    try {
      console.log('Checking geofence for zone:', zoneId);
      
      // Get current location
      const currentLocation = await this.getCurrentPosition();
      console.log('Current location:', currentLocation);

      // Mock zone data - in real app, this would come from API
      const mockZones: Zone[] = [
        {
          id: 'zone-1',
          name: 'Downtown Zone',
          coordinates: [
            { latitude: -1.2921, longitude: 36.8219 },
            { latitude: -1.2921, longitude: 36.8319 },
            { latitude: -1.2821, longitude: 36.8319 },
            { latitude: -1.2821, longitude: 36.8219 }
          ]
        },
        {
          id: 'zone-2',
          name: 'Westlands Zone',
          coordinates: [
            { latitude: -1.2676, longitude: 36.8108 },
            { latitude: -1.2676, longitude: 36.8208 },
            { latitude: -1.2576, longitude: 36.8208 },
            { latitude: -1.2576, longitude: 36.8108 }
          ]
        }
      ];

      const zone = mockZones.find(z => z.id === zoneId);
      if (!zone) {
        throw new Error('Zone not found');
      }

      // Check if current location is within the zone polygon
      const isWithinGeofence = this.isPointInPolygon(currentLocation, zone.coordinates);
      
      // Calculate distance to zone center for reference
      const zoneCenter = {
        latitude: zone.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / zone.coordinates.length,
        longitude: zone.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / zone.coordinates.length
      };
      
      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        zoneCenter.latitude,
        zoneCenter.longitude
      );

      console.log('Geofence result:', { isWithinGeofence, distance, accuracy: currentLocation.accuracy });

      return {
        isWithinGeofence,
        distance,
        accuracy: currentLocation.accuracy
      };
    } catch (error) {
      console.error('Geofence check failed:', error);
      throw error;
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      if (!navigator.geolocation) {
        return false;
      }

      // Try to get location to trigger permission request
      await this.getCurrentPosition();
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      return false;
    }
  }
}

export const geofenceService = new GeofenceService();
