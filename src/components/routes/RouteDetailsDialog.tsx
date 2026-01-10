
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Users, Route, User, Bus, Phone, Shield, Radio } from "lucide-react";
import { RouteData } from "./RoutesTab";
import RFIDTrackingDashboard from "./RFIDTrackingDashboard";
import EntryExitLogs from "./EntryExitLogs";

interface RouteDetailsDialogProps {
  route: RouteData | null;
  isOpen: boolean;
  onClose: () => void;
}

const RouteDetailsDialog = ({ route, isOpen, onClose }: RouteDetailsDialogProps) => {
  if (!route) return null;

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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4 sm:pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-800">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Route className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="truncate">{route.routeName}</span>
              </DialogTitle>
              <p className="text-sm sm:text-base text-gray-600 mt-2 truncate">{route.schoolName}</p>
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-3">
                <Badge className={getTripTypeColor(route.tripType)}>
                  {route.tripType}
                </Badge>
                <Badge className={getStatusColor(route.status)}>
                  {route.status}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">RFID Tracking</span>
              <span className="sm:hidden">RFID</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">Entry/Exit Logs</span>
              <span className="sm:hidden">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 pt-6">
          {/* Route Description */}
          {route.routeDescription && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{route.routeDescription}</p>
            </div>
          )}

          {/* Bus, Driver, and Minder Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Bus Information */}
            {route.bus && (
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bus className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-800 text-lg">Assigned Bus</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Registration Number</p>
                    <p className="text-lg font-bold text-purple-900">{route.bus.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Make & Model</p>
                    <p className="text-purple-800">{route.bus.make} {route.bus.model}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Information */}
            {route.driver && (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-orange-800 text-lg">Assigned Driver</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Driver Name</p>
                    <p className="text-lg font-bold text-orange-900">{route.driver.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <p className="text-orange-800">{route.driver.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Minder Information */}
            {route.minder && (
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-teal-800 text-lg">Assigned Minder</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-teal-700">Minder Name</p>
                    <p className="text-lg font-bold text-teal-900">{route.minder.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    <p className="text-teal-800">{route.minder.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* School Trip Details */}
          {route.tripType === "School Trip" && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-4 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Trip Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {route.tripDate && (
                  <div className="flex items-center space-x-3 text-green-800">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Trip Date</p>
                      <p className="text-sm">{new Date(route.tripDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {route.destinationAddress && (
                  <div className="flex items-center space-x-3 text-green-800">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm">{route.destinationAddress}</p>
                    </div>
                  </div>
                )}
                {(route.departureTime || route.returnTime) && (
                  <div className="flex items-center space-x-3 text-green-800 md:col-span-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Timing</p>
                      <p className="text-sm">
                        {route.departureTime && `Departure: ${route.departureTime}`}
                        {route.departureTime && route.returnTime && " • "}
                        {route.returnTime && `Return: ${route.returnTime}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {route.tripDescription && (
                <div className="mt-4 p-3 bg-white/60 rounded-lg">
                  <p className="text-green-700 text-sm">{route.tripDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* Students List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 text-lg">
                Students on Route ({route.students?.length || 0})
              </h4>
            </div>
            
            {route.students && route.students.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
                {route.students.map((student, index) => (
                  <div key={student.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0 w-full">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-400 w-4 sm:w-6">
                          {index + 1}.
                        </span>
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={student.photo} />
                          <AvatarFallback className="bg-gray-200 text-gray-400">
                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h5 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{student.studentName}</h5>
                          {student.riderType && (
                            <Badge className={`text-xs ${
                              student.riderType === "daily" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {student.riderType === "daily" ? "Daily" : "Occasional"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 mt-1 text-xs sm:text-sm text-gray-600">
                          <span className="truncate">
                            <span className="font-medium">Admission:</span> {student.admissionNumber}
                          </span>
                          {(student.age > 0 || student.dateOfBirth) && (
                          <span className="whitespace-nowrap">
                              <span className="font-medium">Age:</span> {student.age > 0 ? `${student.age} ${student.age === 1 ? 'year' : 'years'}` : 'N/A'}
                          </span>
                          )}
                          {student.gender && (
                          <span className="whitespace-nowrap">
                            <span className="font-medium">Gender:</span> {student.gender}
                          </span>
                          )}
                        </div>
                        {(student.parentName || student.parentPhone) && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 mt-2 text-xs text-gray-500">
                            {student.parentName && (
                              <span className="truncate">
                                <span className="font-medium">Parent:</span> {student.parentName}
                              </span>
                            )}
                            {student.parentPhone && (
                              <span className="truncate sm:whitespace-nowrap">
                                <span className="font-medium">Phone:</span> {student.parentPhone}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h5 className="font-medium text-gray-700 mb-2">No students assigned</h5>
                <p className="text-sm text-gray-500">This route doesn't have any students assigned yet</p>
              </div>
            )}
          </div>
          </TabsContent>

          <TabsContent value="tracking" className="pt-6">
            <RFIDTrackingDashboard route={route} busId={route.busId || null} />
          </TabsContent>

          <TabsContent value="logs" className="pt-6">
            <EntryExitLogs routeId={route._originalRouteId || route.id.toString()} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetailsDialog;
