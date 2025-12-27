
export interface ActiveTrip {
  id: string;
  busRegistration: string;
  driver: string;
  route: string;
  zone: string;
  startTime: Date;
  status: 'active' | 'paused' | 'completed';
  students: ActiveTripStudent[];
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  estimatedDuration: number;
  actualDuration?: number;
}

export interface ActiveTripStudent {
  id: string;
  name: string;
  admissionNumber: string;
  status: 'pending' | 'picked-up' | 'dropped-off';
  pickupTime?: Date;
  dropoffTime?: Date;
  fingerprintVerified?: boolean; // Legacy - kept for backward compatibility
  rfidTagId?: string | null;
  entryTime?: Date;
  exitTime?: Date;
  entryLocation?: { latitude: number; longitude: number };
  exitLocation?: { latitude: number; longitude: number };
  pickupOrder: number;
  address: string;
  parentName: string;
  parentPhone: string;
  photoUrl?: string;
  age: number;
  gender: 'Male' | 'Female';
}

export interface TripStats {
  totalStudents: number;
  pickedUp: number;
  remaining: number;
  completionPercentage: number;
}
