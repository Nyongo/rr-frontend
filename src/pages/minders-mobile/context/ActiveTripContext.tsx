
import { createContext, useContext } from 'react';
import { ActiveTrip, TripStats } from '../types/activeTrip';
import { StartTripFormData } from '../types/startTrip';

interface ActiveTripContextType {
  activeTrip: ActiveTrip | null;
  isLoading: boolean;
  startTrip: (formData: StartTripFormData) => Promise<void>;
  endTrip: () => Promise<void>;
  updateStudentStatus: (studentId: string, status: 'picked-up' | 'dropped-off', fingerprintVerified?: boolean) => void;
  updateLocation: (latitude: number, longitude: number) => void;
  getTripStats: () => TripStats;
}

export const ActiveTripContext = createContext<ActiveTripContextType | undefined>(undefined);

export const useActiveTripContext = () => {
  console.log('useActiveTripContext: Hook called');
  const context = useContext(ActiveTripContext);
  console.log('useActiveTripContext: Context value:', !!context);
  if (context === undefined) {
    console.error('useActiveTripContext: Context is undefined - component not wrapped with ActiveTripProvider');
    throw new Error('useActiveTripContext must be used within an ActiveTripProvider');
  }
  return context;
};
