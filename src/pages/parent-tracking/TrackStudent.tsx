import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bus,
  MapPin,
  Clock,
  User,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Navigation,
  Calendar,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { getTripsByStudent, getTripByTrackingToken, Trip, TripStudent, TrackingResponse, TrackingLocation } from "@/services/tripsApi";
import TripLocationTracker from "@/components/trips/TripLocationTracker";
import { getStudentById, Student } from "@/services/studentsApi";
import { useStudentTrackingWebSocket } from "@/hooks/useStudentTrackingWebSocket";
import TripLocationMap from "@/components/trips/TripLocationMap";

const TrackStudent = () => {
  const { trackingToken } = useParams<{ trackingToken?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [admissionNumber, setAdmissionNumber] = useState(
    searchParams.get("admissionNumber") || ""
  );
  const [studentId, setStudentId] = useState(searchParams.get("studentId") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [tripStudent, setTripStudent] = useState<TripStudent | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingResponse["data"] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<TrackingLocation | null>(null);
  const [locationHistory, setLocationHistory] = useState<TrackingLocation[]>([]);

  // Use refs to prevent unnecessary re-renders
  const locationHistoryRef = useRef<TrackingLocation[]>([]);
  const lastLocationUpdateRef = useRef<number>(0);
  const updateThrottleMs = 1000; // Update at most once per second

  // WebSocket connection for real-time tracking (when tracking token is available)
  const {
    currentLocation: wsCurrentLocation,
    isConnected: wsConnected,
    isSubscribed: wsSubscribed,
    error: wsError,
    reconnect: wsReconnect,
    subscriptionData: wsSubscriptionData,
  } = useStudentTrackingWebSocket({
    trackingToken: trackingToken || null,
    enabled: !!trackingToken && activeTrip?.status === "IN_PROGRESS",
    onLocationUpdate: (location) => {
      // Throttle updates to prevent too frequent re-renders
      const now = Date.now();
      if (now - lastLocationUpdateRef.current < updateThrottleMs) {
        return; // Skip this update if too soon
      }
      lastLocationUpdateRef.current = now;

      // Update current location from WebSocket
      const trackingLocation: TrackingLocation = {
        id: locationHistoryRef.current.length + 1,
        tripId: activeTrip?.id || "",
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
        speed: location.speed,
        heading: location.heading,
        accuracy: location.accuracy,
      };
      
      // Update state with functional updates to avoid dependency issues
      setCurrentLocation((prev) => {
        // Only update if location actually changed
        if (prev && 
            prev.latitude === trackingLocation.latitude && 
            prev.longitude === trackingLocation.longitude) {
          return prev;
        }
        return trackingLocation;
      });
      
      // Add to history using ref to avoid re-renders
      locationHistoryRef.current = [...locationHistoryRef.current, trackingLocation];
      // Update state less frequently - only every 5 updates or every 5 seconds
      if (locationHistoryRef.current.length % 5 === 0) {
        setLocationHistory([...locationHistoryRef.current]);
      }
    },
    onSubscriptionConfirmed: (data) => {
      // Update pickup/dropoff status from subscription data
      if (tripStudent) {
        const updatedTripStudent = {
          ...tripStudent,
          pickupStatus: data.pickupStatus,
          dropoffStatus: data.dropoffStatus,
        };
        setTripStudent(updatedTripStudent);
      }
    },
  });

  // Sync ref with state when locationHistory changes from API
  useEffect(() => {
    if (trackingData?.locationHistory && trackingData.locationHistory.length > 0) {
      locationHistoryRef.current = trackingData.locationHistory;
      setLocationHistory(trackingData.locationHistory);
    }
  }, [trackingData?.locationHistory]);

  // Use WebSocket location if available, otherwise use API location
  // Memoize to prevent unnecessary re-renders
  const displayLocation = useMemo(() => {
    return wsCurrentLocation || currentLocation || trackingData?.currentLocation;
  }, [wsCurrentLocation, currentLocation, trackingData?.currentLocation]);
  
  const displayLocationHistory = useMemo(() => {
    return locationHistory.length > 0 ? locationHistory : (trackingData?.locationHistory || []);
  }, [locationHistory, trackingData?.locationHistory]);

  // Load student and trip if tracking token is in URL (from email link)
  useEffect(() => {
    if (trackingToken) {
      const loadByToken = async () => {
        setLoading(true);
        setError(null);
        setActiveTrip(null);
        setStudent(null);
        setTripStudent(null);

        try {
          const response = await getTripByTrackingToken(trackingToken);
          
          if (response.success && response.data) {
            // Store the tracking data
            setTrackingData(response.data);
            
            // Map the response to our existing state structures
            // Convert TrackingTrip to Trip format
            const tripData: Trip = {
              id: response.data.trip.id,
              routeId: response.data.trip.route.id,
              busId: response.data.trip.bus.id,
              driverId: response.data.trip.driver.id,
              minderId: null,
              tripDate: response.data.trip.tripDate,
              scheduledStartTime: null,
              actualStartTime: null,
              scheduledEndTime: null,
              actualEndTime: null,
              status: response.data.trip.status,
              notes: null,
              startLocation: null,
              endLocation: null,
              startGps: null,
              endGps: null,
              isActive: true,
              createdAt: "",
              updatedAt: "",
              createdById: null,
              lastUpdatedById: null,
              route: {
                id: response.data.trip.route.id,
                name: response.data.trip.route.name,
                tripType: response.data.trip.route.tripType,
              },
              bus: {
                id: response.data.trip.bus.id,
                registrationNumber: response.data.trip.bus.registrationNumber,
                make: response.data.trip.bus.make,
                model: response.data.trip.bus.model,
              },
              driver: {
                id: response.data.trip.driver.id,
                name: response.data.trip.driver.name,
                phoneNumber: response.data.trip.driver.phoneNumber,
                pin: "",
              },
              minder: null,
              tripStudents: [],
            };
            setActiveTrip(tripData);
            
            // Create a TripStudent-like object from the tracking data
            const tripStudentData: TripStudent = {
              id: "",
              tripId: response.data.trip.id,
              studentId: response.data.student.id,
              pickupStatus: response.data.pickupStatus,
              dropoffStatus: response.data.dropoffStatus,
              scheduledPickupTime: null,
              actualPickupTime: response.data.actualPickupTime,
              scheduledDropoffTime: null,
              actualDropoffTime: response.data.actualDropoffTime,
              pickupLocation: response.data.pickupLocation,
              dropoffLocation: response.data.dropoffLocation,
              pickupGps: null,
              dropoffGps: null,
              notes: null,
              isActive: true,
              createdAt: "",
              updatedAt: "",
              student: {
                id: response.data.student.id,
                name: response.data.student.name,
                admissionNumber: response.data.student.admissionNumber,
              },
            };
            setTripStudent(tripStudentData);
            
            // Set student data
            const studentData: Student = {
              id: response.data.student.id,
              name: response.data.student.name,
              admissionNumber: response.data.student.admissionNumber,
              dateOfBirth: "",
              gender: "Male",
              status: "Active",
              isActive: true,
              specialNeeds: [],
              medicalInfo: "",
              schoolId: "",
              parentId: "",
              createdAt: "",
              updatedAt: "",
              createdById: null,
              lastUpdatedById: null,
              school: {
                id: "",
                name: "",
                customerId: 0,
              },
              parent: {
                id: "",
                name: "",
                parentType: "",
                phoneNumber: "",
                schoolId: "",
                status: "",
                isActive: true,
                createdAt: "",
                updatedAt: "",
                createdById: null,
                lastUpdatedById: null,
                school: {
                  id: "",
                  name: "",
                  customerId: 0,
                },
              },
            };
            setStudent(studentData);
            
            // Set location data
            setCurrentLocation(response.data.currentLocation);
            setLocationHistory(response.data.locationHistory || []);
          }
        } catch (err) {
          console.error("Error fetching trip data by token:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load tracking information. The tracking link may be invalid or expired."
          );
        } finally {
          setLoading(false);
        }
      };

      loadByToken();
      return;
    }

    // Fallback to query parameter-based search
    const admissionNum = searchParams.get("admissionNumber");
    const studId = searchParams.get("studentId");

    if (admissionNum || studId) {
      setAdmissionNumber(admissionNum || "");
      setStudentId(studId || "");
      // Call handleSearch directly with the values
      const search = async () => {
        setLoading(true);
        setError(null);
        setActiveTrip(null);
        setStudent(null);
        setTripStudent(null);

        try {
          const tripsResponse = await getTripsByStudent(studId || undefined, admissionNum || undefined);
          const trips = tripsResponse.data || [];

          const inProgressTrip = trips.find((t) => t.status === "IN_PROGRESS");
          const scheduledTrip = trips.find((t) => t.status === "SCHEDULED");
          const completedTrip = trips.find((t) => t.status === "COMPLETED");

          const selectedTrip = inProgressTrip || scheduledTrip || completedTrip;

          if (!selectedTrip) {
            setError("No active or recent trip found for this student");
            setLoading(false);
            return;
          }

          setActiveTrip(selectedTrip);

          const studentInTrip = selectedTrip.tripStudents?.find(
            (ts) =>
              ts.student.admissionNumber === admissionNum ||
              ts.studentId === studId
          );

          if (studentInTrip) {
            setTripStudent(studentInTrip);
            try {
              const studentResponse = await getStudentById(studentInTrip.studentId);
              if (studentResponse.success && studentResponse.data) {
                setStudent(studentResponse.data);
              }
            } catch (err) {
              console.error("Error fetching student details:", err);
            }
          }
        } catch (err) {
          console.error("Error fetching trip data:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load tracking information. Please check the admission number and try again."
          );
        } finally {
          setLoading(false);
        }
      };

      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingToken, searchParams]);

  const handleSearch = async (admNum?: string, studId?: string) => {
    const admNumber = admNum || admissionNumber;
    const studIdValue = studId || studentId;

    if (!admNumber && !studIdValue) {
      setError("Please enter a student admission number or ID");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveTrip(null);
    setStudent(null);
    setTripStudent(null);

    try {
      // First, try to get student by admission number if provided
      let studentData: Student | null = null;
      if (admNumber) {
        try {
          // Try to find student by admission number
          // Note: This assumes there's an endpoint or we search through trips
          // For now, we'll get trips and extract student info from there
        } catch (err) {
          console.error("Error fetching student:", err);
        }
      }

      // Get trips for the student
      const tripsResponse = await getTripsByStudent(studIdValue, admNumber);
      const trips = tripsResponse.data || [];

      // Find active trip (IN_PROGRESS or most recent SCHEDULED)
      const inProgressTrip = trips.find((t) => t.status === "IN_PROGRESS");
      const scheduledTrip = trips.find((t) => t.status === "SCHEDULED");
      const completedTrip = trips.find((t) => t.status === "COMPLETED");

      const selectedTrip = inProgressTrip || scheduledTrip || completedTrip;

      if (!selectedTrip) {
        setError("No active or recent trip found for this student");
        setLoading(false);
        return;
      }

      setActiveTrip(selectedTrip);

      // Find the student in the trip
      const studentInTrip = selectedTrip.tripStudents?.find(
        (ts) =>
          ts.student.admissionNumber === admNumber ||
          ts.studentId === studIdValue
      );

      if (studentInTrip) {
        setTripStudent(studentInTrip);
        // Try to get full student details
        try {
          const studentResponse = await getStudentById(studentInTrip.studentId);
          if (studentResponse.success && studentResponse.data) {
            setStudent(studentResponse.data);
          }
        } catch (err) {
          console.error("Error fetching student details:", err);
        }
      }

      // Update URL params
      const newParams = new URLSearchParams();
      if (admNumber) newParams.set("admissionNumber", admNumber);
      if (studIdValue) newParams.set("studentId", studIdValue);
      setSearchParams(newParams);
    } catch (err) {
      console.error("Error fetching trip data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tracking information. Please check the admission number and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { label: "Scheduled", variant: "secondary" as const },
      IN_PROGRESS: { label: "In Progress", variant: "default" as const },
      COMPLETED: { label: "Completed", variant: "outline" as const },
      CANCELLED: { label: "Cancelled", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Track Your Child
          </h1>
          <p className="text-gray-600">
            Enter your child's admission number to track their bus journey
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Enter the admission number to start tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter admission number (e.g., STUD001)"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => handleSearch()}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Trip Information */}
        {activeTrip && tripStudent && (
          <div className="space-y-6">
            {/* Student Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="text-lg font-semibold">
                      {tripStudent.student.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Number</p>
                    <p className="text-lg font-semibold">
                      {tripStudent.student.admissionNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bus className="w-5 h-5" />
                    Trip Details
                  </span>
                  {getStatusBadge(activeTrip.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trip Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Trip Date</p>
                      <p className="font-medium">
                        {format(parseISO(activeTrip.tripDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{activeTrip.route.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Bus className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Bus</p>
                      <p className="font-medium">
                        {activeTrip.bus.registrationNumber} - {activeTrip.bus.make}{" "}
                        {activeTrip.bus.model}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-medium">{activeTrip.driver.name}</p>
                    </div>
                  </div>

                  {activeTrip.minder && (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Minder</p>
                        <p className="font-medium">{activeTrip.minder.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pickup/Dropoff Status */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Pickup Status
                        </span>
                        {tripStudent.pickupStatus === "PICKED_UP" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <Badge
                        variant={
                          tripStudent.pickupStatus === "PICKED_UP"
                            ? "default"
                            : "secondary"
                        }
                        className="mb-2"
                      >
                        {tripStudent.pickupStatus === "PICKED_UP"
                          ? "Picked Up"
                          : "Not Picked Up"}
                      </Badge>
                      {tripStudent.actualPickupTime && (
                        <p className="text-xs text-gray-600">
                          {format(
                            parseISO(tripStudent.actualPickupTime),
                            "h:mm a"
                          )}
                        </p>
                      )}
                      {tripStudent.pickupLocation && (
                        <p className="text-xs text-gray-600 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {tripStudent.pickupLocation}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Dropoff Status
                        </span>
                        {tripStudent.dropoffStatus === "DROPPED_OFF" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <Badge
                        variant={
                          tripStudent.dropoffStatus === "DROPPED_OFF"
                            ? "default"
                            : "secondary"
                        }
                        className="mb-2"
                      >
                        {tripStudent.dropoffStatus === "DROPPED_OFF"
                          ? "Dropped Off"
                          : "Not Dropped Off"}
                      </Badge>
                      {tripStudent.actualDropoffTime && (
                        <p className="text-xs text-gray-600">
                          {format(
                            parseISO(tripStudent.actualDropoffTime),
                            "h:mm a"
                          )}
                        </p>
                      )}
                      {tripStudent.dropoffLocation && (
                        <p className="text-xs text-gray-600 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {tripStudent.dropoffLocation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Location Tracker */}
            {activeTrip.status === "IN_PROGRESS" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Live Location Tracking
                      </CardTitle>
                      <CardDescription>
                        Real-time location of the bus during the trip
                      </CardDescription>
                    </div>
                    {/* WebSocket Connection Status */}
                    {trackingToken && (
                      <div className="flex items-center gap-2">
                        {wsConnected && wsSubscribed ? (
                          <>
                            <Wifi className="w-4 h-4 text-green-600" />
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Live
                            </Badge>
                          </>
                        ) : wsConnected ? (
                          <>
                            <Wifi className="w-4 h-4 text-yellow-600" />
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Connecting...
                            </Badge>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-4 h-4 text-red-600" />
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Offline
                            </Badge>
                            {wsError && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={wsReconnect}
                                className="h-7 text-xs"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Reconnect
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Use WebSocket location if available, otherwise fall back to TripLocationTracker */}
                  {trackingToken && displayLocation ? (
                    <TripLocationMap
                      latitude={displayLocation.latitude}
                      longitude={displayLocation.longitude}
                      heading={displayLocation.heading}
                      speed={displayLocation.speed}
                      locationHistory={displayLocationHistory.map((loc) => ({
                        id: loc.id,
                        tripId: loc.tripId,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        timestamp: loc.timestamp,
                        speed: loc.speed,
                        heading: loc.heading,
                        accuracy: loc.accuracy,
                      }))}
                    />
                  ) : (
                    <TripLocationTracker
                      tripId={activeTrip.id}
                      tripStatus={activeTrip.status}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Completed Trip Message */}
            {activeTrip.status === "COMPLETED" && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-lg font-semibold text-gray-900">
                      Trip Completed
                    </p>
                    <p className="text-gray-600">
                      This trip has been completed. Location tracking is no
                      longer available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStudent;
