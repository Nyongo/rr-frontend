import { useState, useEffect, ReactNode } from 'react';
import { ActiveTripContext } from './ActiveTripContext';
import { ActiveTrip, ActiveTripStudent, TripStats } from '../types/activeTrip';
import { StartTripFormData } from '../types/startTrip';
import { mockStudents } from '../data/studentData';

interface ActiveTripProviderProps {
  children: ReactNode;
}

export const ActiveTripProvider = ({ children }: ActiveTripProviderProps) => {
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('ActiveTripProvider: Provider initialized');

  // Load active trip from localStorage on mount
  useEffect(() => {
    const savedTrip = localStorage.getItem('activeTrip');
    if (savedTrip) {
      try {
        const trip = JSON.parse(savedTrip);
        // Convert date strings back to Date objects
        trip.startTime = new Date(trip.startTime);
        if (trip.currentLocation?.timestamp) {
          trip.currentLocation.timestamp = new Date(trip.currentLocation.timestamp);
        }
        trip.students.forEach((student: ActiveTripStudent) => {
          if (student.pickupTime) student.pickupTime = new Date(student.pickupTime);
          if (student.dropoffTime) student.dropoffTime = new Date(student.dropoffTime);
        });
        setActiveTrip(trip);
        console.log('ActiveTrip context: Loaded trip from localStorage:', trip.id);
      } catch (error) {
        console.error('ActiveTrip context: Failed to load active trip:', error);
        localStorage.removeItem('activeTrip');
      }
    }
  }, []);

  // Save active trip to localStorage whenever it changes
  useEffect(() => {
    if (activeTrip) {
      localStorage.setItem('activeTrip', JSON.stringify(activeTrip));
      console.log('ActiveTrip context: Saved trip to localStorage:', activeTrip.id);
    } else {
      localStorage.removeItem('activeTrip');
      console.log('ActiveTrip context: Removed trip from localStorage');
    }
  }, [activeTrip]);

  const startTrip = async (formData: StartTripFormData): Promise<void> => {
    console.log('ActiveTrip context: Starting trip...');
    setIsLoading(true);
    
    try {
      // Filter students for this route
      const routeStudents = mockStudents
        .filter(student => 
          student.routeId === formData.route && 
          student.status === 'active'
        )
        .sort((a, b) => a.pickupOrder - b.pickupOrder);

      // Convert to ActiveTripStudent format
      const tripStudents: ActiveTripStudent[] = routeStudents.map(student => ({
        id: student.id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        status: 'pending',
        pickupOrder: student.pickupOrder,
        address: student.address,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        photoUrl: student.photoUrl,
        age: student.age,
        gender: student.gender
      }));

      const newTrip: ActiveTrip = {
        id: `trip-${Date.now()}`,
        busRegistration: formData.busRegistration,
        driver: formData.driver,
        route: formData.route,
        zone: formData.zone,
        startTime: new Date(),
        status: 'active',
        students: tripStudents,
        estimatedDuration: 45,
        currentLocation: {
          latitude: -1.2921,
          longitude: 36.8219,
          timestamp: new Date()
        }
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveTrip(newTrip);
      console.log('ActiveTrip context: Trip started successfully:', newTrip.id);
    } catch (error) {
      console.error('ActiveTrip context: Failed to start trip:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const endTrip = async (): Promise<void> => {
    if (!activeTrip) return;

    console.log('ActiveTrip context: Ending trip...');
    setIsLoading(true);
    
    try {
      // Simulate API call to end trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const actualDuration = Math.floor((Date.now() - activeTrip.startTime.getTime()) / (1000 * 60));
      
      const completedTrip = {
        ...activeTrip,
        status: 'completed' as const,
        actualDuration
      };

      console.log('ActiveTrip context: Trip ended:', completedTrip.id);
      
      setActiveTrip(null);
    } catch (error) {
      console.error('ActiveTrip context: Failed to end trip:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudentStatus = (studentId: string, status: 'picked-up' | 'dropped-off', fingerprintVerified: boolean = false): void => {
    if (!activeTrip) return;

    console.log(`ActiveTrip context: Updating student ${studentId} status to ${status}`);

    setActiveTrip(prev => {
      if (!prev) return prev;

      const updatedStudents = prev.students.map(student => {
        if (student.id === studentId) {
          const now = new Date();
          return {
            ...student,
            status,
            fingerprintVerified,
            ...(status === 'picked-up' && { pickupTime: now }),
            ...(status === 'dropped-off' && { dropoffTime: now })
          };
        }
        return student;
      });

      return {
        ...prev,
        students: updatedStudents
      };
    });
  };

  const updateLocation = (latitude: number, longitude: number): void => {
    if (!activeTrip) return;

    setActiveTrip(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      };
    });
  };

  const getTripStats = (): TripStats => {
    if (!activeTrip) {
      return {
        totalStudents: 0,
        pickedUp: 0,
        remaining: 0,
        completionPercentage: 0
      };
    }

    const totalStudents = activeTrip.students.length;
    const pickedUp = activeTrip.students.filter(s => s.status === 'picked-up' || s.status === 'dropped-off').length;
    const remaining = totalStudents - pickedUp;
    const completionPercentage = totalStudents > 0 ? (pickedUp / totalStudents) * 100 : 0;

    return {
      totalStudents,
      pickedUp,
      remaining,
      completionPercentage
    };
  };

  const value = {
    activeTrip,
    isLoading,
    startTrip,
    endTrip,
    updateStudentStatus,
    updateLocation,
    getTripStats
  };

  console.log('ActiveTripProvider: Providing context value');

  return (
    <ActiveTripContext.Provider value={value}>
      {children}
    </ActiveTripContext.Provider>
  );
};
