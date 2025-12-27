
import { useState } from "react";
import { Bus, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import StartTripDialog from "./components/StartTripDialog";
import LiveTripView from "./components/LiveTripView";
import GeofenceDialog from "./components/GeofenceDialog";
import { StartTripFormData } from "./types/startTrip";
import { useActiveTrip } from "./hooks/useActiveTrip";

const Home = () => {
  const navigate = useNavigate();
  const [startTripOpen, setStartTripOpen] = useState(false);
  const { 
    activeTrip, 
    isLoading, 
    startTrip, 
    endTrip, 
    updateStudentStatus, 
    getTripStats 
  } = useActiveTrip();

  const handleStartTripClick = () => {
    setStartTripOpen(true);
  };

  const handleStartTrip = async (data: StartTripFormData) => {
    console.log("Trip started with data:", data);
    
    try {
      await startTrip(data);
      setStartTripOpen(false);
    } catch (error) {
      console.error("Failed to start trip:", error);
      // Here you would typically show an error toast
    }
  };

  const handleEndTrip = async () => {
    try {
      await endTrip();
    } catch (error) {
      console.error("Failed to end trip:", error);
      // Here you would typically show an error toast
    }
  };

  // If there's an active trip, show the live trip view
  if (activeTrip) {
    return (
      <>
        <LiveTripView
          activeTrip={activeTrip}
          tripStats={getTripStats()}
          onEndTrip={handleEndTrip}
          onUpdateStudentStatus={updateStudentStatus}
          isEndingTrip={isLoading}
        />
        <BottomNavigation currentPage="home" />
      </>
    );
  }

  // Default home view when no active trip
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-200 to-purple-300 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ready for Adventure?</h1>
          <p className="text-gray-600">Let's make sure everyone gets home safely!</p>
        </div>
      </div>

      {/* Main Content - Moved closer to header */}
      <div className="flex-1 px-6 pt-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-sm mx-auto animate-scale-in">
          {/* Animated Bus Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Bus className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Minder!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            No active trips right now. When you're ready to start monitoring a route, 
            tap the button below to begin your journey!
          </p>

          <Button
            onClick={handleStartTripClick}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg py-4 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            disabled={isLoading}
          >
            <Bus className="w-5 h-5 mr-2" />
            {isLoading ? 'Starting...' : 'Start a Trip'}
          </Button>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-24 left-8 w-12 h-12 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-12 w-8 h-8 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-32 left-12 w-6 h-6 bg-blue-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-48 right-8 w-10 h-10 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>

      {/* Start Trip Dialog */}
      <StartTripDialog
        open={startTripOpen}
        onClose={() => setStartTripOpen(false)}
        onStartTrip={handleStartTrip}
      />

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default Home;
