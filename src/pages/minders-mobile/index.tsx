
import { ActiveTripProvider } from './context/ActiveTripProvider';
import { Outlet } from 'react-router-dom';

const MindersMobile = () => {
  console.log('MindersMobile: Component rendered');
  
  return (
    <ActiveTripProvider>
      <div className="min-h-screen bg-gray-100">
        <Outlet />
      </div>
    </ActiveTripProvider>
  );
};

export default MindersMobile;
