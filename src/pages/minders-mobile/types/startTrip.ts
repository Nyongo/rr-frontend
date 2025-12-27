
export interface StartTripFormData {
  busRegistration: string;
  driver: string;
  route: string;
  zone: string;
}

export interface Zone {
  id: string;
  name: string;
  routeId: string;
}

export interface ActiveTrip {
  id: string;
  busRegistration: string;
  driver: string;
  route: string;
  zone: string;
  startTime: Date;
  status: 'active' | 'paused' | 'completed';
}

export interface Bus {
  id: string;
  registration: string;
  model: string;
  capacity: number;
  status: 'active' | 'inactive';
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  status: 'active' | 'inactive';
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  age: number;
  gender: 'Male' | 'Female';
  photoUrl?: string;
  zoneId: string;
  routeId: string;
  pickupOrder: number;
  address: string;
  parentName: string;
  parentPhone: string;
  status: 'active' | 'inactive';
}
