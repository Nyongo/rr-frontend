import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RouteData, StudentInRoute } from "./RoutesTab";
import { RouteActivationDialog } from "./RouteActivationDialog";
import { RouteDeactivationDialog } from "./RouteDeactivationDialog";
import RouteBasicInfoForm from "./forms/RouteBasicInfoForm";
import SchoolTripDetailsForm from "./forms/SchoolTripDetailsForm";
import RouteStudentsSection from "./forms/RouteStudentsSection";
import RouteFormButtons from "./forms/RouteFormButtons";
import { useSchools } from "@/hooks/useSchools";
import { useStudents } from "@/hooks/useStudents";
import { useBuses } from "@/hooks/useBuses";
import { useDrivers } from "@/hooks/useDrivers";
import { useMinders } from "@/hooks/useMinders";
import { Student } from "@/services/studentsApi";
import { getRouteStudents, RouteStudentDetail } from "@/services/routesApi";
import { calculateAge } from "@/lib/utils";

interface RouteFormProps {
  onSubmit: (route: RouteData, schoolId: string) => void;
  onCancel: () => void;
  editingRoute?: RouteData | null;
}

const RouteForm = ({ onSubmit, onCancel, editingRoute }: RouteFormProps) => {
  const { schools, loading: schoolsLoading } = useSchools();
  const { fetchStudentsBySchool } = useStudents();
  const { buses, loading: busesLoading } = useBuses();
  const { drivers, loading: driversLoading } = useDrivers();
  const { minders, loading: mindersLoading } = useMinders();

  // Debug: Log the editingRoute to see what we're working with
  console.log("🏗️ RouteForm rendered - editingRoute:", editingRoute);
  console.log(
    "🔍 RouteForm - editingRoute.id:",
    editingRoute?.id,
    "type:",
    typeof editingRoute?.id
  );

  const [formData, setFormData] = useState<Partial<RouteData>>({
    routeName: editingRoute?.routeName || "",
    schoolName: editingRoute?.schoolName || "",
    tripType: editingRoute?.tripType || "Morning Pickup",
    routeDescription: editingRoute?.routeDescription || "",
    tripDate: editingRoute?.tripDate || "",
    status: editingRoute?.status || "active",
    busId: editingRoute?.busId || null,
    driverId: editingRoute?.driverId || null,
    minderId: editingRoute?.minderId || null,
    students: editingRoute?.students
      ? editingRoute.students.map((student) => ({
          ...student,
          riderType: student.riderType || "daily", // Set default rider type if not present
        }))
      : [],
    departureTime: editingRoute?.departureTime || "",
    returnTime: editingRoute?.returnTime || "",
    destinationAddress: editingRoute?.destinationAddress || "",
    tripDescription: editingRoute?.tripDescription || "",
  });

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingRouteStudents, setLoadingRouteStudents] = useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] =
    useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<Partial<RouteData> | null>(null);

  // Convert API route student format to UI StudentInRoute format
  const convertRouteStudentDetailToStudentInRoute = (
    routeStudent: RouteStudentDetail
  ): StudentInRoute => {
    // Calculate age from dateOfBirth if available
    const age = routeStudent.student.dateOfBirth
      ? calculateAge(routeStudent.student.dateOfBirth)
      : 0;
    
    // Use gender from API or default
    const gender = (routeStudent.student.gender as "Male" | "Female") || "Male";

    return {
      id:
        parseInt(routeStudent.studentId.replace(/\D/g, "")) ||
        Math.floor(Math.random() * 10000), // Convert UUID to number for UI compatibility
      photo: routeStudent.student.photo || undefined,
      studentName: routeStudent.student.name,
      admissionNumber: routeStudent.student.admissionNumber,
      age: age,
      gender: gender,
      expectedPickupTime:
        formData.tripType === "Morning Pickup" ? "07:30" : undefined,
      expectedDropOffTime:
        formData.tripType === "Midday Drop Off" ||
        formData.tripType === "Afternoon Drop Off"
          ? "15:30"
          : undefined,
      fingerprintStatus: "not scanned",
      isHidden: false,
      riderType: routeStudent.riderType.toLowerCase() as "daily" | "occasional",
      // Store the actual student UUID for API operations
      _originalStudentId: routeStudent.studentId,
      parentName: routeStudent.student.parent?.name,
      parentPhone: routeStudent.student.parent?.phoneNumber,
      dateOfBirth: routeStudent.student.dateOfBirth,
    };
  };

  // Create school options from real school data
  const schoolOptions = useMemo(() => {
    return schools.map((school) => ({
      value: school.name,
      label: school.name,
      id: school.id,
    }));
  }, [schools]);

  // Filter buses by selected school and create bus options
  const busOptions = useMemo(() => {
    if (!selectedSchoolId) return [];
    
    // Get active buses for the selected school
    const schoolBuses = buses.filter(
      (bus) => bus.schoolId === selectedSchoolId && bus.isActive
    );
    
    // If editing and there's an assigned bus, include it even if it doesn't match filters
    if (editingRoute?.busId) {
      const assignedBus = buses.find((bus) => bus.id === editingRoute.busId);
      if (assignedBus && !schoolBuses.find((b) => b.id === assignedBus.id)) {
        schoolBuses.push(assignedBus);
      }
    }
    
    return schoolBuses.map((bus) => ({
      value: bus.id,
      label: `${bus.registrationNumber} - ${bus.make} ${bus.model} (${bus.seatsCapacity} seats)`,
    }));
  }, [buses, selectedSchoolId, editingRoute]);

  // Filter drivers by selected school and create driver options
  const driverOptions = useMemo(() => {
    if (!selectedSchoolId) return [];
    
    // Get drivers for the selected school (assuming drivers have schoolId)
    const schoolDrivers = drivers.filter(
      (driver) => driver.schoolId === selectedSchoolId
    );
    
    // If editing and there's an assigned driver, include it even if it doesn't match filters
    if (editingRoute?.driverId) {
      const assignedDriver = drivers.find((driver) => driver.id === editingRoute.driverId);
      if (assignedDriver && !schoolDrivers.find((d) => d.id === assignedDriver.id)) {
        schoolDrivers.push(assignedDriver);
      }
    }
    
    return schoolDrivers.map((driver) => ({
      value: driver.id,
      label: `${driver.name} - ${driver.phoneNumber}`,
    }));
  }, [drivers, selectedSchoolId, editingRoute]);

  // Filter minders by selected school and create minder options
  const minderOptions = useMemo(() => {
    if (!selectedSchoolId) return [];
    
    // Get minders for the selected school
    const schoolMinders = minders.filter(
      (minder) => minder.schoolId === selectedSchoolId
    );
    
    // If editing and there's an assigned minder, include it even if it doesn't match filters
    if (editingRoute?.minderId) {
      const assignedMinder = minders.find((minder) => minder.id === editingRoute.minderId);
      if (assignedMinder && !schoolMinders.find((m) => m.id === assignedMinder.id)) {
        schoolMinders.push(assignedMinder);
      }
    }
    
    return schoolMinders.map((minder) => ({
      value: minder.id,
      label: `${minder.name} - ${minder.phoneNumber}`,
    }));
  }, [minders, selectedSchoolId, editingRoute]);

  // Find school ID for the currently selected school
  useEffect(() => {
    if (formData.schoolName && schools.length > 0) {
      const selectedSchool = schools.find(
        (school) => school.name === formData.schoolName
      );
      if (selectedSchool && selectedSchool.id !== selectedSchoolId) {
        setSelectedSchoolId(selectedSchool.id);
      }
    }
  }, [formData.schoolName, schools, selectedSchoolId]);

  // Fetch students when school changes
  useEffect(() => {
    const fetchStudentsForSchool = async () => {
      if (selectedSchoolId) {
        setLoadingStudents(true);
        try {
          const students = await fetchStudentsBySchool(selectedSchoolId);
          setSchoolStudents(students);
        } catch (error) {
          console.error("Failed to fetch students for school:", error);
          setSchoolStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      } else {
        setSchoolStudents([]);
      }
    };

    fetchStudentsForSchool();
  }, [selectedSchoolId, fetchStudentsBySchool]);

  // Load existing students when editing a route
  useEffect(() => {
    const loadRouteStudents = async () => {
      // Use the original UUID from API, not the numeric ID
      const routeId = editingRoute?._originalRouteId;
      if (editingRoute && routeId) {
        setLoadingRouteStudents(true);
        try {
          // Load all students (both daily and occasional) initially
          // The RouteStudentsSection will handle filtered loading by tab
          console.log("🔄 Loading route students with routeId:", routeId);
          const response = await getRouteStudents(routeId);
          if (response.success) {
            const convertedStudents = response.data.map(
              convertRouteStudentDetailToStudentInRoute
            );

            // Update form data with loaded students
            setFormData((prev) => ({
              ...prev,
              students: convertedStudents,
            }));
          }
        } catch (error) {
          console.error("Failed to load route students:", error);
          toast({
            title: "Error",
            description: "Failed to load existing students for this route",
            variant: "destructive",
          });
        } finally {
          setLoadingRouteStudents(false);
        }
      }
    };

    loadRouteStudents();
  }, [editingRoute]);

  // Convert API students to the format expected by StudentSelectionDialog
  const availableStudents = useMemo(() => {
    return schoolStudents.map((student) => {
      // Calculate age from date of birth
      const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };

      return {
        id:
          parseInt(student.id.replace(/\D/g, "")) ||
          Math.floor(Math.random() * 10000), // Convert UUID to number for compatibility
        name: student.name,
        photo: student.photo || "",
        admissionNumber: student.admissionNumber,
        age: calculateAge(student.dateOfBirth),
        gender: student.gender,
        _originalStudentId: student.id, // Store the original UUID for API operations
      };
    });
  }, [schoolStudents]);

  // Handle school selection change
  const handleSchoolChange = (schoolName: string) => {
    setFormData({ ...formData, schoolName });
    // The useEffect will handle fetching students for the new school
  };

  const isSchoolTrip = formData.tripType === "School Trip";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we're in a dialog interaction before proceeding
    const isInDialogInteraction = document.querySelector('[role="dialog"]');
    if (isInDialogInteraction) {
      console.log("Dialog interaction detected, preventing form submission");
      return;
    }

    if (!formData.routeName || !formData.schoolName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate that schoolId is available
    if (!selectedSchoolId) {
      toast({
        title: "Error",
        description: "Please select a valid school.",
        variant: "destructive",
      });
      return;
    }

    if (isSchoolTrip && (!formData.tripDate || !formData.destinationAddress)) {
      toast({
        title: "Error",
        description:
          "Please fill in trip date and destination for school trips.",
        variant: "destructive",
      });
      return;
    }

    // Check if status changed and editing an existing route
    if (editingRoute && editingRoute.status !== formData.status) {
      setPendingFormData(formData);
      if (formData.status === "active") {
        setIsActivationDialogOpen(true);
      } else {
        setIsDeactivationDialogOpen(true);
      }
      return;
    }

    // No status change or new route, submit directly
    onSubmit(formData as RouteData, selectedSchoolId);
    toast({
      title: "Success",
      description: `Route ${
        editingRoute ? "updated" : "created"
      } successfully!`,
    });
  };

  const handleStatusConfirm = () => {
    if (pendingFormData && selectedSchoolId) {
      onSubmit(pendingFormData as RouteData, selectedSchoolId);
      toast({
        title: "Success",
        description: `Route ${
          editingRoute ? "updated" : "created"
        } successfully!`,
      });
    }
    setIsActivationDialogOpen(false);
    setIsDeactivationDialogOpen(false);
    setPendingFormData(null);
  };

  const handleStatusCancel = () => {
    setIsActivationDialogOpen(false);
    setIsDeactivationDialogOpen(false);
    setPendingFormData(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={onCancel} className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-auto sm:px-3">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl font-bold">
                {editingRoute ? "Edit Route" : "Create New Route"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Set up route details and add students
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <RouteBasicInfoForm
              formData={formData}
              onFormDataChange={setFormData}
              schoolOptions={schoolOptions}
              onSchoolChange={handleSchoolChange}
              schoolsLoading={schoolsLoading}
              busOptions={busOptions}
              busesLoading={busesLoading}
              driverOptions={driverOptions}
              driversLoading={driversLoading}
              minderOptions={minderOptions}
              mindersLoading={mindersLoading}
            />

            <SchoolTripDetailsForm
              formData={formData}
              onFormDataChange={setFormData}
            />

            <RouteStudentsSection
              formData={formData}
              onFormDataChange={setFormData}
              mockStudents={availableStudents}
              routeId={(() => {
                // Use the original UUID from API, not the numeric ID
                const routeId = editingRoute?._originalRouteId || undefined;
                console.log(
                  "🎯 Passing routeId (UUID) to RouteStudentsSection:",
                  routeId,
                  "from editingRoute:",
                  editingRoute
                );
                return routeId;
              })()}
            />

            <RouteFormButtons onCancel={onCancel} editingRoute={editingRoute} />
          </form>
        </CardContent>
      </Card>

      <RouteActivationDialog
        isOpen={isActivationDialogOpen}
        routeName={formData.routeName || ""}
        onConfirm={handleStatusConfirm}
        onClose={handleStatusCancel}
      />

      <RouteDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        routeName={formData.routeName || ""}
        onConfirm={handleStatusConfirm}
        onClose={handleStatusCancel}
      />
    </div>
  );
};

export default RouteForm;
