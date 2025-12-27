
import { useActiveTripContext } from '../context/ActiveTripContext';

export const useActiveTrip = () => {
  console.log('useActiveTrip: Hook called');
  const context = useActiveTripContext();
  console.log('useActiveTrip: Context received:', !!context);
  return context;
};
