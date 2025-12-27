
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Plus, Minus } from "lucide-react";

interface GeofenceMapProps {
  center: { lat: number; lng: number };
  radius: number;
  onGeofenceChange: (center: { lat: number; lng: number }, radius: number) => void;
}

const GeofenceMap = ({ center, radius, onGeofenceChange }: GeofenceMapProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock search locations
  const mockLocations = [
    { name: "Central Park, NY", lat: 40.7829, lng: -73.9654 },
    { name: "Times Square, NY", lat: 40.7580, lng: -73.9855 },
    { name: "Brooklyn Bridge, NY", lat: 40.7061, lng: -73.9969 },
    { name: "Statue of Liberty, NY", lat: 40.6892, lng: -74.0445 },
    { name: "Empire State Building, NY", lat: 40.7484, lng: -73.9857 },
  ];

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified calculation)
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // This is a simplified conversion - in a real implementation you'd use proper map projection
    const lng = center.lng + ((x - mapWidth / 2) / mapWidth) * (360 / Math.pow(2, zoom));
    const lat = center.lat - ((y - mapHeight / 2) / mapHeight) * (180 / Math.pow(2, zoom));
    
    onGeofenceChange({ lat, lng }, radius);
  };

  const handleSearch = (location: { lat: number; lng: number }) => {
    onGeofenceChange(location, radius);
    setSearchQuery("");
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
        
        {/* Search Results */}
        {searchQuery && filteredLocations.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                onClick={() => handleSearch(location)}
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{location.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-80 bg-gradient-to-br from-green-100 to-blue-100 border border-gray-300 rounded-lg cursor-crosshair relative overflow-hidden"
          onClick={handleMapClick}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Center Pin */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full z-10"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <MapPin className="w-6 h-6 text-red-600 drop-shadow-sm" />
          </div>

          {/* Geofence Circle */}
          <div
            className="absolute border-2 border-blue-500 border-dashed rounded-full bg-blue-500 bg-opacity-10"
            style={{
              left: '50%',
              top: '50%',
              width: `${Math.min(radius / 5, 150)}px`,
              height: `${Math.min(radius / 5, 150)}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              className="bg-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              className="bg-white shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {/* Coordinates Display */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded text-xs text-gray-600">
            {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
          </div>

          {/* Zoom Level */}
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded text-xs text-gray-600">
            Zoom: {zoom}
          </div>
        </div>

        {/* Map Instructions */}
        <p className="text-xs text-gray-500 mt-2">
          Click on the map to set the center of your geofence area. Use the search bar to find specific locations.
        </p>
      </div>
    </div>
  );
};

export default GeofenceMap;
