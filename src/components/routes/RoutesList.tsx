import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, Calendar, MapPin, Clock, Copy, Bus, User, Shield } from "lucide-react";
import { RouteData } from "./RoutesTab";

interface RoutesListProps {
  routes: RouteData[];
  onEdit: (route: RouteData) => void;
  onDuplicate: (route: RouteData) => void;
  onDelete: (routeId: number) => void;
  onCardClick: (route: RouteData) => void;
}

const RoutesList = ({ routes, onEdit, onDuplicate, onDelete, onCardClick }: RoutesListProps) => {
  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No routes found</h3>
        <p className="text-gray-600">Start by creating your first bus route</p>
      </div>
    );
  }

  const getTripTypeColor = (tripType: string) => {
    switch (tripType) {
      case "Morning Pickup": return "bg-amber-100 text-amber-800";
      case "Midday Drop Off": return "bg-indigo-100 text-indigo-800";
      case "Afternoon Drop Off": return "bg-pink-100 text-pink-800";
      case "School Trip": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {routes.map((route) => (
        <Card 
          key={route.id} 
          className={`border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
            route.status === "inactive" ? "opacity-60 bg-gray-50" : ""
          }`}
          onClick={() => onCardClick(route)}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className={`text-lg sm:text-xl truncate ${route.status === "inactive" ? "text-gray-500" : "text-gray-800"}`}>
                  {route.routeName}
                </CardTitle>
                <CardDescription className={`truncate ${route.status === "inactive" ? "text-gray-400" : "text-gray-600"}`}>
                  {route.schoolName}
                </CardDescription>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-semibold ${getTripTypeColor(route.tripType)}`}>
                    {route.tripType}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 sm:space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(route)}
                  title="Edit route"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Edit</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDuplicate(route)}
                  title="Duplicate route"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 text-blue-600 hover:bg-blue-50"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Copy</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(route.id)}
                  title="Delete route"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {route.routeDescription && (
              <div className={`text-sm ${route.status === "inactive" ? "text-gray-400" : "text-gray-600"}`}>
                {route.routeDescription}
              </div>
            )}

            {route.tripType === "School Trip" && (
              <div className={`p-3 rounded-lg border ${
                route.status === "inactive" 
                  ? "bg-gray-100 border-gray-200" 
                  : "bg-green-50 border-green-200"
              }`}>
                <div className="space-y-2">
                  {route.tripDate && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      route.status === "inactive" ? "text-gray-500" : "text-green-800"
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>Trip Date: {new Date(route.tripDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {route.destinationAddress && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      route.status === "inactive" ? "text-gray-500" : "text-green-800"
                    }`}>
                      <MapPin className="w-4 h-4" />
                      <span>{route.destinationAddress}</span>
                    </div>
                  )}
                  {(route.departureTime || route.returnTime) && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      route.status === "inactive" ? "text-gray-500" : "text-green-800"
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>
                        {route.departureTime && `Departure: ${route.departureTime}`}
                        {route.departureTime && route.returnTime && " • "}
                        {route.returnTime && `Return: ${route.returnTime}`}
                      </span>
                    </div>
                  )}
                  {route.tripDescription && (
                    <div className={`text-sm mt-2 ${
                      route.status === "inactive" ? "text-gray-500" : "text-green-700"
                    }`}>
                      {route.tripDescription}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bus Information */}
            {route.bus && (
              <div className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg ${
                route.status === "inactive" 
                  ? "bg-gray-100" 
                  : "bg-purple-50"
              }`}>
                <Bus className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${route.status === "inactive" ? "text-gray-500" : "text-purple-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-medium truncate ${
                    route.status === "inactive" ? "text-gray-500" : "text-purple-800"
                  }`}>
                    {route.bus.registrationNumber}
                  </div>
                  <div className={`text-xs truncate ${
                    route.status === "inactive" ? "text-gray-400" : "text-purple-600"
                  }`}>
                    {route.bus.make} {route.bus.model}
                  </div>
                </div>
              </div>
            )}

            {/* Driver Information */}
            {route.driver && (
              <div className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg ${
                route.status === "inactive" 
                  ? "bg-gray-100" 
                  : "bg-orange-50"
              }`}>
                <User className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${route.status === "inactive" ? "text-gray-500" : "text-orange-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-medium truncate ${
                    route.status === "inactive" ? "text-gray-500" : "text-orange-800"
                  }`}>
                    {route.driver.name}
                  </div>
                  <div className={`text-xs truncate ${
                    route.status === "inactive" ? "text-gray-400" : "text-orange-600"
                  }`}>
                    {route.driver.phoneNumber}
                  </div>
                </div>
              </div>
            )}

            {/* Minder Information */}
            {route.minder && (
              <div className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg ${
                route.status === "inactive" 
                  ? "bg-gray-100" 
                  : "bg-teal-50"
              }`}>
                <Shield className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${route.status === "inactive" ? "text-gray-500" : "text-teal-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-medium truncate ${
                    route.status === "inactive" ? "text-gray-500" : "text-teal-800"
                  }`}>
                    {route.minder.name}
                  </div>
                  <div className={`text-xs truncate ${
                    route.status === "inactive" ? "text-gray-400" : "text-teal-600"
                  }`}>
                    {route.minder.phoneNumber}
                  </div>
                </div>
              </div>
            )}

            {/* Students Count */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              route.status === "inactive" 
                ? "bg-gray-100" 
                : "bg-blue-50"
            }`}>
              <div className="flex items-center space-x-2">
                <Users className={`w-4 h-4 ${route.status === "inactive" ? "text-gray-500" : "text-blue-600"}`} />
                <span className={`text-sm font-medium ${
                  route.status === "inactive" ? "text-gray-500" : "text-blue-800"
                }`}>
                  Students on Route
                </span>
              </div>
              <span className={`text-lg font-bold ${
                route.status === "inactive" ? "text-gray-500" : "text-blue-600"
              }`}>
                {route.students?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoutesList;
