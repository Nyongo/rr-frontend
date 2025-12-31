import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trip } from "@/services/tripsApi";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Bus,
  User,
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import TripLocationTracker from "./TripLocationTracker";

interface TripDetailsDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripDetailsDialog = ({ trip, isOpen, onClose }: TripDetailsDialogProps) => {
  if (!trip) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPickupStatusColor = (status: string) => {
    return status === "PICKED_UP"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getDropoffStatusColor = (status: string) => {
    return status === "DROPPED_OFF"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calendar className="w-6 h-6 text-blue-600" />
            Trip Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Trip Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{trip.route.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {trip.route.tripType.replace("_", " ")}
              </p>
            </div>
            <Badge className={getStatusColor(trip.status)}>
              {trip.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Trip Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trip Date */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Trip Date</p>
                <p className="text-sm font-medium text-gray-800">
                  {format(parseISO(trip.tripDate), "EEEE, MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            {/* Scheduled Start Time */}
            {trip.scheduledStartTime && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Scheduled Start</p>
                  <p className="text-sm font-medium text-gray-800">
                    {format(parseISO(trip.scheduledStartTime), "h:mm a")}
                  </p>
                </div>
              </div>
            )}

            {/* Actual Start Time */}
            {trip.actualStartTime && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Actual Start</p>
                  <p className="text-sm font-medium text-gray-800">
                    {format(parseISO(trip.actualStartTime), "MMM dd, h:mm a")}
                  </p>
                </div>
              </div>
            )}

            {/* Actual End Time */}
            {trip.actualEndTime && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Actual End</p>
                  <p className="text-sm font-medium text-gray-800">
                    {format(parseISO(trip.actualEndTime), "MMM dd, h:mm a")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bus, Driver, and Minder Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bus */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Bus</h4>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {trip.bus.registrationNumber}
              </p>
              <p className="text-xs text-gray-600">
                {trip.bus.make} {trip.bus.model}
              </p>
            </div>

            {/* Driver */}
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Driver</h4>
              </div>
              <p className="text-sm font-medium text-gray-800">{trip.driver.name}</p>
              <p className="text-xs text-gray-600">{trip.driver.phoneNumber}</p>
            </div>

            {/* Minder */}
            <div className="p-4 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-teal-600" />
                <h4 className="font-semibold text-gray-800">Minder</h4>
              </div>
              {trip.minder ? (
                <>
                  <p className="text-sm font-medium text-gray-800">{trip.minder.name}</p>
                  <p className="text-xs text-gray-600">{trip.minder.phoneNumber}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No minder assigned</p>
              )}
            </div>
          </div>

          {/* Real-time Location Tracking */}
          <TripLocationTracker tripId={trip.id} tripStatus={trip.status} />

          {/* Location Information */}
          {(trip.startLocation || trip.endLocation || trip.startGps || trip.endGps) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                Start/End Location Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.startLocation && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Start Location</p>
                    <p className="text-sm text-gray-800">{trip.startLocation}</p>
                    {trip.startGps && (
                      <p className="text-xs text-gray-600 mt-1">
                        GPS: {trip.startGps.latitude.toFixed(6)}, {trip.startGps.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
                {trip.endLocation && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">End Location</p>
                    <p className="text-sm text-gray-800">{trip.endLocation}</p>
                    {trip.endGps && (
                      <p className="text-xs text-gray-600 mt-1">
                        GPS: {trip.endGps.latitude.toFixed(6)}, {trip.endGps.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {trip.notes && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
              <p className="text-sm text-gray-700">{trip.notes}</p>
            </div>
          )}

          {/* Students List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Students on Trip ({trip.tripStudents?.length || 0})
            </h4>
            {trip.tripStudents && trip.tripStudents.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trip.tripStudents.map((tripStudent) => (
                  <div
                    key={tripStudent.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {tripStudent.student.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {tripStudent.student.admissionNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPickupStatusColor(tripStudent.pickupStatus)}>
                          {tripStudent.pickupStatus === "PICKED_UP" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {tripStudent.pickupStatus.replace("_", " ")}
                        </Badge>
                        <Badge className={getDropoffStatusColor(tripStudent.dropoffStatus)}>
                          {tripStudent.dropoffStatus === "DROPPED_OFF" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {tripStudent.dropoffStatus.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    {(tripStudent.actualPickupTime || tripStudent.actualDropoffTime) && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {tripStudent.actualPickupTime && (
                            <div>
                              <span className="text-gray-500">Picked up: </span>
                              <span className="text-gray-700">
                                {format(parseISO(tripStudent.actualPickupTime), "h:mm a")}
                              </span>
                            </div>
                          )}
                          {tripStudent.actualDropoffTime && (
                            <div>
                              <span className="text-gray-500">Dropped off: </span>
                              <span className="text-gray-700">
                                {format(parseISO(tripStudent.actualDropoffTime), "h:mm a")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">No students assigned to this trip</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;

