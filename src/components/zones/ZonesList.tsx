import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Map } from "lucide-react";
import { Zone } from "./ZonesTab";

interface ZonesListProps {
  zones: Zone[];
  onEditZone: (zone: Zone) => void;
  onDeleteZone: (zoneId: number) => void;
}

const ZonesList = ({ zones, onEditZone, onDeleteZone }: ZonesListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (zones.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No zones found</h3>
        <p className="text-gray-600">
          Create your first zone to start managing geofenced areas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {zones.map((zone) => (
        <Card 
          key={zone.id} 
          className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${
            zone.status === "inactive" ? "opacity-60 bg-gray-50" : "bg-white"
          }`}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  zone.status === "inactive" ? "bg-gray-100" : "bg-blue-100"
                }`}>
                  <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    zone.status === "inactive" ? "text-gray-500" : "text-blue-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-base sm:text-lg truncate ${
                    zone.status === "inactive" ? "text-gray-500" : "text-gray-800"
                  }`}>
                    {zone.zoneName}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={zone.status === "active" ? "default" : "secondary"}
                      className={`text-xs ${zone.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {zone.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditZone(zone)}
                  title="Edit zone"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Edit</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 text-red-600 hover:bg-red-50"
                  onClick={() => onDeleteZone(zone.id)}
                  title="Delete zone"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Zone Details */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className={`flex items-start sm:items-center space-x-2 ${
                zone.status === "inactive" ? "text-gray-500" : ""
              }`}>
                <Map className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="break-words">Radius: {zone.geofence.radius}m</span>
              </div>
              <div className={`flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 ${
                zone.status === "inactive" ? "text-gray-500" : ""
              }`}>
                <span className="font-medium">Center:</span>
                <span className="break-all sm:break-normal font-mono text-xs">
                  {zone.geofence.center.lat.toFixed(4)}, {zone.geofence.center.lng.toFixed(4)}
                </span>
              </div>
              <div className={`text-xs ${
                zone.status === "inactive" ? "text-gray-400" : "text-gray-500"
              }`}>
                Created: {formatDate(zone.createdAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ZonesList;
