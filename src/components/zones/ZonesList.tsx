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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {zones.map((zone) => (
        <Card 
          key={zone.id} 
          className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${
            zone.status === "inactive" ? "opacity-60 bg-gray-50" : "bg-white"
          }`}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  zone.status === "inactive" ? "bg-gray-100" : "bg-blue-100"
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    zone.status === "inactive" ? "text-gray-500" : "text-blue-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-lg truncate ${
                    zone.status === "inactive" ? "text-gray-500" : "text-gray-800"
                  }`}>
                    {zone.zoneName}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={zone.status === "active" ? "default" : "secondary"}
                      className={zone.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {zone.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditZone(zone)}
                  title="Edit zone"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDeleteZone(zone.id)}
                  title="Delete zone"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Zone Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className={`flex items-center space-x-2 ${
                zone.status === "inactive" ? "text-gray-500" : ""
              }`}>
                <Map className="w-4 h-4" />
                <span>Radius: {zone.geofence.radius}m</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                zone.status === "inactive" ? "text-gray-500" : ""
              }`}>
                <span className="font-medium">Center:</span>
                <span>
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
