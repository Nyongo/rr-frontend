
import { Bus, Driver, Route, Zone } from '../types/startTrip';

export const mockBuses: Bus[] = [
  { id: '1', registration: 'KCA 123A', model: 'Toyota Hiace', capacity: 14, status: 'active' },
  { id: '2', registration: 'KBZ 456B', model: 'Nissan Matatu', capacity: 25, status: 'active' },
  { id: '3', registration: 'KAA 789C', model: 'Isuzu NPR', capacity: 33, status: 'active' },
  { id: '4', registration: 'KCB 012D', model: 'Toyota Coaster', capacity: 29, status: 'active' },
];

export const mockDrivers: Driver[] = [
  { id: '1', name: 'John Kamau', licenseNumber: 'DL001234', phone: '+254 712 345 678', status: 'active' },
  { id: '2', name: 'Mary Wanjiku', licenseNumber: 'DL005678', phone: '+254 723 456 789', status: 'active' },
  { id: '3', name: 'Peter Mwangi', licenseNumber: 'DL009012', phone: '+254 734 567 890', status: 'active' },
  { id: '4', name: 'Grace Akinyi', licenseNumber: 'DL003456', phone: '+254 745 678 901', status: 'active' },
];

export const mockRoutes: Route[] = [
  { id: '1', name: 'Westlands - Karen Route', description: 'Main route covering Westlands to Karen', estimatedDuration: 45, status: 'active' },
  { id: '2', name: 'CBD - Kileleshwa Route', description: 'City center to Kileleshwa residential area', estimatedDuration: 35, status: 'active' },
  { id: '3', name: 'Parklands - Lavington Route', description: 'Parklands to Lavington via Museum Hill', estimatedDuration: 40, status: 'active' },
  { id: '4', name: 'Eastlands - CBD Route', description: 'Eastlands residential to city center', estimatedDuration: 50, status: 'active' },
];

export const mockZones: Zone[] = [
  { id: '1', name: 'Westlands Zone A', routeId: '1' },
  { id: '2', name: 'Karen Zone B', routeId: '1' },
  { id: '3', name: 'CBD Central', routeId: '2' },
  { id: '4', name: 'Kileleshwa North', routeId: '2' },
  { id: '5', name: 'Kileleshwa South', routeId: '2' },
  { id: '6', name: 'Parklands East', routeId: '3' },
  { id: '7', name: 'Museum Hill', routeId: '3' },
  { id: '8', name: 'Lavington West', routeId: '3' },
  { id: '9', name: 'Eastlands Zone 1', routeId: '4' },
  { id: '10', name: 'Eastlands Zone 2', routeId: '4' },
];

// Re-export student data for convenience
export { mockStudents } from './studentData';
