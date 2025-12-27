
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Clock, Users, Navigation, Square, Bus, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActiveTrip, TripStats } from "../types/activeTrip";
import ActiveTripStudentCard from "./ActiveTripStudentCard";

interface LiveTripViewProps {
  activeTrip: ActiveTrip;
  tripStats: TripStats;
  onEndTrip: () => void;
  onUpdateStudentStatus: (studentId: string, status: 'picked-up' | 'dropped-off', verified?: boolean) => void;
  isEndingTrip: boolean;
}

const LiveTripView = ({ 
  activeTrip, 
  tripStats, 
  onEndTrip, 
  onUpdateStudentStatus,
  isEndingTrip 
}: LiveTripViewProps) => {
  const navigate = useNavigate();
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleEndTrip = () => {
    setShowEndTripDialog(false);
    onEndTrip();
  };

  const handleScanStudent = () => {
    navigate('/minders-mobile/scan');
  };

  const pendingStudents = activeTrip.students.filter(s => s.status === 'pending');
  const pickedUpStudents = activeTrip.students.filter(s => s.status === 'picked-up');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-200 to-purple-300 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-b-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Active Trip</h1>
              <p className="text-gray-600 text-sm">{activeTrip.busRegistration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              LIVE
            </Badge>
            
            {/* End Trip Button - moved to header */}
            <AlertDialog open={showEndTripDialog} onOpenChange={setShowEndTripDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={isEndingTrip}
                >
                  <Square className="w-4 h-4 mr-1" />
                  End
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Trip Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to end this trip? This will stop location tracking and complete the trip for all students.
                    {tripStats.remaining > 0 && (
                      <span className="block mt-2 text-orange-600 font-medium">
                        Warning: {tripStats.remaining} student{tripStats.remaining !== 1 ? 's' : ''} have not been picked up yet.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndTrip} className="bg-red-500 hover:bg-red-600">
                    {isEndingTrip ? 'Ending...' : 'End Trip'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{tripStats.pickedUp}</div>
            <div className="text-xs text-gray-600">Picked Up</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{tripStats.remaining}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(tripStats.completionPercentage)}%</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${tripStats.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Scan Student Button - prominent placement */}
      {pendingStudents.length > 0 && (
        <div className="px-6 mb-6">
          <Button
            onClick={handleScanStudent}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Scan className="w-6 h-6 mr-3" />
            Scan Student ({pendingStudents.length} remaining)
          </Button>
        </div>
      )}

      {/* Trip Details */}
      <div className="px-6 flex-1 space-y-6 pb-24">
        {/* Live Map Placeholder */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Live Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="text-center z-10">
                <Navigation className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-600 font-medium">GPS Tracking Active</p>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {activeTrip.currentLocation?.timestamp.toLocaleTimeString() || 'Unknown'}
                </p>
              </div>
              {/* Mock GPS indicator */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Info */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatDuration(activeTrip.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{activeTrip.students.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{activeTrip.route}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Zone:</span>
                <span className="font-medium">{activeTrip.zone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Students */}
        {pendingStudents.length > 0 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Students to Pick Up ({pendingStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {pendingStudents.map((student, index) => (
                  <ActiveTripStudentCard
                    key={student.id}
                    student={student}
                    index={index}
                    onStatusUpdate={onUpdateStudentStatus}
                    showPickupButton={false}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Picked Up Students */}
        {pickedUpStudents.length > 0 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                Picked Up Students ({pickedUpStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {pickedUpStudents.map((student, index) => (
                  <ActiveTripStudentCard
                    key={student.id}
                    student={student}
                    index={index}
                    onStatusUpdate={onUpdateStudentStatus}
                    showPickupButton={false}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveTripView;
