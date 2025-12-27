import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Calendar, Bus, User, Shield, CheckCircle, Eye } from "lucide-react";
import { getTrips, deleteTrip, endTrip, Trip } from "@/services/tripsApi";
import { toast } from "@/hooks/use-toast";
import TripDetailsDialog from "./TripDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, parseISO } from "date-fns";

interface TripsListProps {
  onEditTrip: (trip: Trip) => void;
  refreshTrigger?: number; // Add refresh trigger prop
}

const TripsList = ({ onEditTrip, refreshTrigger }: TripsListProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [endTripDialogOpen, setEndTripDialogOpen] = useState(false);
  const [tripToEnd, setTripToEnd] = useState<Trip | null>(null);
  const [isEndingTrip, setIsEndingTrip] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [refreshTrigger]); // Reload when refreshTrigger changes

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips(1, 100);
      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      // For now, use empty array - in production, show error message
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;

    try {
      await deleteTrip(tripToDelete.id);
      // Refresh the trips list after deletion
      await fetchTrips();
      toast({
        title: "Trip Deleted!",
        description: "The trip has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
      setTripToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEndTrip = async () => {
    if (!tripToEnd) return;

    setIsEndingTrip(true);
    try {
      await endTrip(tripToEnd.id);
      // Refresh the trips list after ending trip
      await fetchTrips();
      toast({
        title: "Trip Completed!",
        description: "The trip has been successfully ended.",
      });
      setEndTripDialogOpen(false);
      setTripToEnd(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to end trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEndingTrip(false);
    }
  };

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

  const filteredTrips = trips.filter(
    (trip) =>
      trip.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.minder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading trips...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl">Scheduled Trips</CardTitle>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ? "No trips found" : "No trips scheduled"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Schedule your first trip to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{trip.route.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {trip.route.tripType.replace("_", " ")}
                        </p>
                      </div>
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Trip Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        {format(parseISO(trip.tripDate), "MMM dd, yyyy")}
                        {trip.scheduledStartTime && (
                          <span className="text-gray-500 ml-1">
                            at {format(parseISO(trip.scheduledStartTime), "h:mm a")}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Bus */}
                    <div className="flex items-center gap-2 text-sm">
                      <Bus className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">
                        {trip.bus.registrationNumber} - {trip.bus.make} {trip.bus.model}
                      </span>
                    </div>

                    {/* Driver */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">{trip.driver.name}</span>
                    </div>

                    {/* Minder */}
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-teal-600" />
                      <span className="text-gray-700">{trip.minder.name}</span>
                    </div>

                    {/* Students Count */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">{trip.tripStudents?.length || 0}</span> student(s) on this trip
                      </p>
                    </div>

                    {/* Notes */}
                    {trip.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600 line-clamp-2">{trip.notes}</p>
                      </div>
                    )}

                    {/* Trip Status Details */}
                    {trip.actualStartTime && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">
                          Started: {format(parseISO(trip.actualStartTime), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    )}
                    {trip.actualEndTime && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">
                          Ended: {format(parseISO(trip.actualEndTime), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrip(trip);
                          setDetailsDialogOpen(true);
                        }}
                        className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {trip.status !== "COMPLETED" && trip.status !== "CANCELLED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToEnd(trip);
                            setEndTripDialogOpen(true);
                          }}
                          className="flex-1 text-green-600 hover:bg-green-50 border-green-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          End Trip
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTrip(trip);
                        }}
                        className="flex-1"
                        disabled={trip.status === "COMPLETED" || trip.status === "CANCELLED"}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Trip Confirmation Dialog */}
      <AlertDialog open={endTripDialogOpen} onOpenChange={setEndTripDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this trip? The trip status will be marked as completed and the end time will be automatically recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isEndingTrip}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndTrip}
              disabled={isEndingTrip}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEndingTrip ? "Ending..." : "End Trip"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trip Details Dialog */}
      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedTrip(null);
        }}
      />
    </>
  );
};

export default TripsList;

