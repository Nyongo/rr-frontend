import { useState, useEffect } from "react";
import { RouteData, StudentInRoute } from "../RoutesTab";
import {
  createRoute,
  getRoutes,
  updateRoute,
  deleteRoute,
  CreateRouteRequest,
  UpdateRouteRequest,
  RouteResponse,
} from "@/services/routesApi";
import { toast } from "@/hooks/use-toast";
import { calculateAge } from "@/lib/utils";

// Kenyan sample data with one inactive route
const sampleRoutes: RouteData[] = [
  {
    id: 1,
    routeName: "Route A - Westlands",
    schoolName: "Nairobi Primary School",
    tripType: "Morning Pickup",
    routeDescription:
      "Westlands residential area pickup route covering Parklands and Highridge",
    status: "active",
    students: [
      {
        id: 1,
        studentName: "Amina Kamau",
        admissionNumber: "STU2024001",
        age: 11,
        gender: "Female",
        expectedPickupTime: "07:30",
        fingerprintStatus: "scanned & verified",
        isHidden: false,
        riderType: "daily",
      },
      {
        id: 2,
        studentName: "David Mwangi",
        admissionNumber: "STU2024002",
        age: 9,
        gender: "Male",
        expectedPickupTime: "07:35",
        fingerprintStatus: "not scanned",
        isHidden: false,
        riderType: "daily",
      },
    ],
  },
  {
    id: 2,
    routeName: "Route B - Karen",
    schoolName: "Kileleshwa Academy",
    tripType: "Afternoon Drop Off",
    routeDescription: "Karen and Langata residential areas drop-off route",
    status: "inactive",
    students: [
      {
        id: 3,
        studentName: "Grace Njeri",
        admissionNumber: "STU2024003",
        age: 12,
        gender: "Female",
        expectedDropOffTime: "15:30",
        fingerprintStatus: "scanned & verified",
        isHidden: false,
        riderType: "daily",
      },
      {
        id: 4,
        studentName: "Samuel Ochieng",
        admissionNumber: "STU2024004",
        age: 10,
        gender: "Male",
        expectedDropOffTime: "15:45",
        fingerprintStatus: "scanned & verified",
        isHidden: true,
        riderType: "occasional",
      },
    ],
  },
  {
    id: 3,
    routeName: "Route C - Eastlands",
    schoolName: "Nairobi Primary School",
    tripType: "Morning Pickup",
    routeDescription:
      "Eastlands pickup route covering Umoja, Donholm and Pipeline estates",
    status: "active",
    students: [
      {
        id: 5,
        studentName: "Faith Wanjiku",
        admissionNumber: "STU2024005",
        age: 8,
        gender: "Female",
        expectedPickupTime: "07:25",
        fingerprintStatus: "not scanned",
        isHidden: false,
        riderType: "daily",
      },
    ],
  },
  {
    id: 4,
    routeName: "Route D - Midday Special",
    schoolName: "Kileleshwa Academy",
    tripType: "Midday Drop Off",
    routeDescription:
      "Special midday route for early dismissal covering South B and South C",
    status: "active",
    students: [
      {
        id: 6,
        studentName: "Kevin Mutua",
        admissionNumber: "STU2024006",
        age: 11,
        gender: "Male",
        expectedDropOffTime: "12:30",
        fingerprintStatus: "scanned & verified",
        isHidden: false,
        riderType: "daily",
      },
    ],
  },
  {
    id: 5,
    routeName: "Nairobi National Museum Trip",
    schoolName: "Nairobi Primary School",
    tripType: "School Trip",
    routeDescription: "Educational field trip to the Nairobi National Museum",
    tripDate: "2024-07-15",
    departureTime: "09:00",
    returnTime: "15:00",
    destinationAddress: "Nairobi National Museum, Museum Hill Road, Nairobi",
    tripDescription:
      "Educational visit to explore Kenya's rich cultural heritage and natural history exhibitions",
    status: "active",
    students: [
      {
        id: 7,
        studentName: "Priscilla Akinyi",
        admissionNumber: "STU2024007",
        age: 12,
        gender: "Female",
        fingerprintStatus: "scanned & verified",
        isHidden: false,
        riderType: "occasional",
      },
      {
        id: 8,
        studentName: "Brian Kimani",
        admissionNumber: "STU2024008",
        age: 11,
        gender: "Male",
        fingerprintStatus: "not scanned",
        isHidden: false,
        riderType: "occasional",
      },
      {
        id: 9,
        studentName: "Mercy Anyango",
        admissionNumber: "STU2024009",
        age: 10,
        gender: "Female",
        fingerprintStatus: "scanned & verified",
        isHidden: false,
        riderType: "occasional",
      },
    ],
  },
];

// Utility function to convert API response to RouteData format
const convertApiToRouteData = (apiRoute: RouteResponse): RouteData => {
  const tripTypeMap = {
    MORNING_PICKUP: "Morning Pickup" as const,
    EVENING_DROPOFF: "Evening Drop Off" as const,
    FIELD_TRIP: "Field Trip" as const,
    EXTRA_CURRICULUM: "Extra Curriculum" as const,
    EMERGENCY: "Emergency" as const,
  };

  // Convert routeStudents to StudentInRoute format
  const students: StudentInRoute[] = apiRoute.routeStudents
    ? apiRoute.routeStudents.map((routeStudent) => {
        // Calculate age from dateOfBirth if available
        let age = 0;
        if (routeStudent.student.dateOfBirth) {
          age = calculateAge(routeStudent.student.dateOfBirth);
          // Log for debugging if age is 0 but dateOfBirth exists
          if (age === 0) {
            console.warn("Age calculation returned 0 for dateOfBirth:", routeStudent.student.dateOfBirth);
          }
        }
        
        // Use gender from API or default
        const gender = (routeStudent.student.gender as "Male" | "Female") || "Male";
        
        return {
          id: parseInt(routeStudent.studentId.replace(/\D/g, "")) || Math.floor(Math.random() * 10000),
          photo: routeStudent.student.photo || undefined,
          studentName: routeStudent.student.name,
          admissionNumber: routeStudent.student.admissionNumber,
          age: age,
          gender: gender,
          fingerprintStatus: "not scanned" as const,
          isHidden: !routeStudent.isActive,
          riderType: routeStudent.riderType.toLowerCase() as "daily" | "occasional",
          _originalStudentId: routeStudent.studentId,
          parentName: routeStudent.student.parent?.name,
          parentPhone: routeStudent.student.parent?.phoneNumber,
          dateOfBirth: routeStudent.student.dateOfBirth,
        };
      })
    : [];

  // Log minder data for debugging
  if (apiRoute.minderId && !apiRoute.minder) {
    console.warn("⚠️ Route has minderId but minder object is missing:", {
      routeId: apiRoute.id,
      minderId: apiRoute.minderId,
    });
  }

  return {
    id: parseInt(apiRoute.id) || 0,
    _originalRouteId: apiRoute.id, // Preserve the original UUID
    routeName: apiRoute.name,
    schoolName: apiRoute.school.name,
    tripType: tripTypeMap[apiRoute.tripType] || "Morning Pickup",
    routeDescription: apiRoute.description,
    status: apiRoute.status === "Active" ? "active" : "inactive",
    busId: apiRoute.busId || null,
    driverId: apiRoute.driverId || null,
    minderId: apiRoute.minderId || null,
    bus: apiRoute.bus || null,
    driver: apiRoute.driver || null,
    minder: apiRoute.minder || null,
    students: students,
  };
};

// Utility function to convert RouteData to API request format for creating routes
const convertRouteDataToApi = (
  routeData: RouteData,
  schoolId: string
): CreateRouteRequest => {
  const tripTypeMap = {
    "Morning Pickup": "MORNING_PICKUP" as const,
    "Evening Drop Off": "EVENING_DROPOFF" as const,
    "Field Trip": "FIELD_TRIP" as const,
    "Extra Curriculum": "EXTRA_CURRICULUM" as const,
    "Emergency": "EMERGENCY" as const,
  };

  // Separate students into simple array and those with rider types
  // Filter out students without valid _originalStudentId and log warnings
  const studentsWithIds = routeData.students
    ? routeData.students.filter((student) => {
        const hasValidId = 
          student._originalStudentId && 
          typeof student._originalStudentId === "string" &&
          student._originalStudentId.trim() !== "";
        if (!hasValidId) {
          console.warn("⚠️ Student missing valid _originalStudentId, skipping:", {
            studentName: student.studentName,
            admissionNumber: student.admissionNumber,
            _originalStudentId: student._originalStudentId,
          });
        }
        return hasValidId;
      })
    : [];

  // All students should have riderType, so put them all in studentsWithRiderType
  // If a student doesn't have riderType, default to DAILY
  const studentsWithRiderType = studentsWithIds.map((student) => {
    const studentId = student._originalStudentId!.trim();
    if (!studentId) {
      throw new Error(`Student ${student.studentName} has empty _originalStudentId`);
    }
  return {
      studentId: studentId,
      riderType: (student.riderType?.toUpperCase() || "DAILY") as "DAILY" | "OCCASIONAL",
    };
  });

  // Simple student IDs array - not used if all students have riderType
  // But kept for backward compatibility
  const simpleStudents: string[] = [];

  const payload: CreateRouteRequest = {
    name: routeData.routeName,
    schoolId: schoolId,
    tripType: tripTypeMap[routeData.tripType] || "MORNING_PICKUP",
    busId: routeData.busId || null,
    driverId: routeData.driverId || null,
    minderId: routeData.minderId || null,
  };

  // Only include description and status if they have values
  if (routeData.routeDescription) {
    payload.description = routeData.routeDescription;
  }
  if (routeData.status) {
    payload.status = routeData.status === "active" ? "Active" : "Inactive";
  }

  // Add students arrays only if they have values
  if (simpleStudents.length > 0) {
    payload.students = simpleStudents;
  }
  if (studentsWithRiderType.length > 0) {
    // Validate all student IDs before adding
    const validatedStudents = studentsWithRiderType.filter((student) => {
      const isValid = student.studentId && typeof student.studentId === "string" && student.studentId.trim() !== "";
      if (!isValid) {
        console.error("⚠️ Invalid student in studentsWithRiderType:", student);
      }
      return isValid;
    });
    
    if (validatedStudents.length > 0) {
      payload.studentsWithRiderType = validatedStudents.map((student) => ({
        studentId: student.studentId.trim(),
        riderType: student.riderType,
      }));
    }
  }

  // Log the final payload for debugging
  console.log("📤 Route creation payload:", JSON.stringify(payload, null, 2));

  return payload;
};

export const useRoutesData = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter routes based on search term
  const filteredRoutes = routes.filter(
    (route) =>
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.tripType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (route.routeDescription &&
        route.routeDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRoutes(1, 100); // Fetch all routes
      const convertedRoutes = response.data.map(convertApiToRouteData);
      
      // Log minder data for debugging
      const routesWithMinders = convertedRoutes.filter((route) => route.minder);
      if (routesWithMinders.length > 0) {
        console.log("📋 Routes with minders:", routesWithMinders.map((r) => ({
          routeName: r.routeName,
          minder: r.minder,
        })));
      }
      
      setRoutes(convertedRoutes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch routes");
      console.error("Failed to fetch routes:", err);
      // Fallback to sample data on error
      setRoutes(sampleRoutes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (
    routeData: RouteData,
    editingRoute: RouteData | null,
    schoolId: string
  ) => {
    try {
      if (editingRoute) {
        // Update existing route - use UpdateRouteRequest format
        const updatePayload: UpdateRouteRequest = {};

        // Handle busId
        if (routeData.busId !== editingRoute.busId) {
          updatePayload.busId = routeData.busId || null;
        }

        // Handle driverId
        if (routeData.driverId !== editingRoute.driverId) {
          updatePayload.driverId = routeData.driverId || null;
        }

        // Handle minderId
        if (routeData.minderId !== editingRoute.minderId) {
          updatePayload.minderId = routeData.minderId || null;
        }

        // Compare students to determine what to add/remove
        // Create a map of old students by their ID for easy lookup
        const oldStudentMap = new Map(
          editingRoute.students
            .filter((s) => s._originalStudentId)
            .map((s) => [s._originalStudentId!, s])
        );
        
        const newStudentMap = new Map(
          routeData.students
            .filter((s) => s._originalStudentId)
            .map((s) => [s._originalStudentId!, s])
        );

        // Students to add (in new but not in old) - use studentsWithRiderType to include rider type
        const studentsToAdd: Array<{ studentId: string; riderType: "DAILY" | "OCCASIONAL" }> = [];
        for (const [studentId, student] of newStudentMap) {
          if (!oldStudentMap.has(studentId)) {
            const riderType = (student.riderType?.toUpperCase() || "DAILY") as "DAILY" | "OCCASIONAL";
            studentsToAdd.push({
              studentId: studentId.trim(),
              riderType,
            });
          }
        }
        
        if (studentsToAdd.length > 0) {
          updatePayload.studentsWithRiderType = studentsToAdd;
        }

        // Students to remove (in old but not in new)
        const studentsToRemove = Array.from(oldStudentMap.keys()).filter(
          (id) => !newStudentMap.has(id)
        );
        if (studentsToRemove.length > 0) {
          updatePayload.studentsToRemove = studentsToRemove.map((id) => id.trim());
        }
        
        // Also check for students whose rider type changed
        // If a student exists in both but rider type changed, we need to update it
        const studentsWithRiderTypeChange: Array<{ studentId: string; riderType: "DAILY" | "OCCASIONAL" }> = [];
        for (const [studentId, newStudent] of newStudentMap) {
          if (oldStudentMap.has(studentId)) {
            const oldStudent = oldStudentMap.get(studentId)!;
            const oldRiderType = (oldStudent.riderType?.toUpperCase() || "DAILY") as "DAILY" | "OCCASIONAL";
            const newRiderType = (newStudent.riderType?.toUpperCase() || "DAILY") as "DAILY" | "OCCASIONAL";
            
            if (oldRiderType !== newRiderType) {
              studentsWithRiderTypeChange.push({
                studentId: studentId.trim(),
                riderType: newRiderType,
              });
            }
          }
        }
        
        // If there are rider type changes, merge them with the new students
        if (studentsWithRiderTypeChange.length > 0) {
          if (!updatePayload.studentsWithRiderType) {
            updatePayload.studentsWithRiderType = [];
          }
          // Merge with existing students to add (avoid duplicates)
          const existingIds = new Set(updatePayload.studentsWithRiderType.map(s => s.studentId));
          studentsWithRiderTypeChange.forEach(student => {
            if (!existingIds.has(student.studentId)) {
              updatePayload.studentsWithRiderType!.push(student);
            }
          });
        }

        // Only send update if there are changes
        if (Object.keys(updatePayload).length > 0) {
          // Use the original UUID from API, not the numeric ID
          const routeId = editingRoute._originalRouteId;
          console.log("🔄 Updating route - editingRoute:", editingRoute);
          console.log("🔄 Route ID (UUID):", routeId);
          console.log("🔄 Route update payload:", JSON.stringify(updatePayload, null, 2));
          
          if (!routeId || routeId.trim() === "") {
            throw new Error(`Invalid route ID. Cannot update route without a valid UUID. Route ID: ${editingRoute.id}, Original ID: ${routeId}`);
          }
          
          const response = await updateRoute(
            routeId,
            updatePayload
          );
        const updatedRoute = convertApiToRouteData(response.data);
        setRoutes(
          routes.map((route) =>
            route.id === editingRoute.id ? updatedRoute : route
          )
        );
        toast({
          title: "Success",
          description: "Route updated successfully!",
        });
      } else {
          toast({
            title: "Info",
            description: "No changes to update.",
          });
        }
      } else {
        // Create new route - use CreateRouteRequest format
        const apiRouteData = convertRouteDataToApi(routeData, schoolId);
        const response = await createRoute(apiRouteData);
        const newRoute = convertApiToRouteData(response.data);
        setRoutes([...routes, newRoute]);
        toast({
          title: "Success",
          description: "Route created successfully!",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save route";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err; // Re-throw to handle in the form
    }
  };

  const handleDuplicateRoute = (route: RouteData) => {
    const duplicatedRoute = {
      ...route,
      id: Math.max(...routes.map((r) => r.id), 0) + 1,
      routeName: `${route.routeName} (Copy)`,
      status: "inactive" as const,
      students: route.students.map((student) => ({
        ...student,
        fingerprintStatus: "not scanned" as const,
        isHidden: false,
      })),
    };
    setRoutes([...routes, duplicatedRoute]);
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      // Find the route to get the original UUID
      const routeToDelete = routes.find((route) => route.id === routeId);
      if (!routeToDelete) {
        throw new Error("Route not found");
      }
      
      // Use the original UUID from API, not the numeric ID
      const originalRouteId = routeToDelete._originalRouteId;
      
      if (!originalRouteId || originalRouteId.trim() === "") {
        throw new Error(`Invalid route ID. Cannot delete route without a valid UUID. Route ID: ${routeId}, Original ID: ${originalRouteId}`);
      }
      
      await deleteRoute(originalRouteId);
      setRoutes(routes.filter((route) => route.id !== routeId));
      toast({
        title: "Success",
        description: "Route deleted successfully!",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete route";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    routes,
    filteredRoutes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleAddRoute,
    handleDuplicateRoute,
    handleDeleteRoute,
    refetch: fetchRoutes,
  };
};
