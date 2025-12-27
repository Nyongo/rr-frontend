
import { Route, Clock, MapPin } from "lucide-react";
import BottomNavigation from "./components/BottomNavigation";

const Trips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-300 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Trip History</h1>
          <p className="text-gray-600">Your journey timeline</p>
        </div>
      </div>

      {/* Main Content - Moved closer to header */}
      <div className="flex-1 px-6 pt-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-sm mx-auto animate-scale-in">
          {/* Animated Trip Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Route className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trips Yet!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your trip history will appear here once you start monitoring routes. 
            Each completed journey will be saved with all the important details!
          </p>

          <div className="mt-8 text-center">
            <div className="text-purple-600 font-semibold">Ready to start?</div>
            <div className="text-gray-500 text-sm">Head to Home and begin your first trip!</div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-24 left-8 w-10 h-10 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-12 w-6 h-6 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-32 left-12 w-8 h-8 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-48 right-8 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-pulse"></div>

      <BottomNavigation currentPage="trips" />
    </div>
  );
};

export default Trips;
