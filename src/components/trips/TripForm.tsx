import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRoutesData } from "@/components/routes/hooks/useRoutesData";
import { useBuses } from "@/hooks/useBuses";
import { useDrivers } from "@/hooks/useDrivers";
import { useMinders } from "@/hooks/useMinders";
import { useSchools } from "@/hooks/useSchools";
import { createTrip, updateTrip, Trip } from "@/services/tripsApi";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { useMemo } from "react";

interface TripFormProps {
  trip?: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TripForm = ({ trip, isOpen, onClose, onSuccess }: TripFormProps) => {
  const { routes, loading: routesLoading } = useRoutesData();
  const { buses, loading: busesLoading } = useBuses();
  const { drivers, loading: driversLoading } = useDrivers();
  const { minders, loading: mindersLoading } = useMinders();
  const { schools } = useSchools();

  const [formData, setFormData] = useState({
    routeId: "",
    busId: "",
    driverId: "",
    minderId: "",
    tripDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Always set tripDate to current date (cannot be changed)
    const today = new Date().toISOString().split("T")[0];

    if (trip) {
      setFormData({
        routeId: trip.routeId,
        busId: trip.busId,
        driverId: trip.driverId,
        minderId: trip.minderId,
        tripDate: trip.tripDate ? trip.tripDate.split("T")[0] : today, // Use trip date if available
      });
    } else {
      setFormData({
        routeId: "",
        busId: "",
        driverId: "",
        minderId: "",
        tripDate: today, // Always set to current date
      });
    }
  }, [trip, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.routeId ||
      !formData.busId ||
      !formData.driverId ||
      !formData.minderId
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Get students from the selected route - match by original UUID or numeric ID
    const selectedRoute = routes.find(
      (r) =>
        r._originalRouteId === formData.routeId ||
        r.id.toString() === formData.routeId
    );
    if (
      !selectedRoute ||
      !selectedRoute.students ||
      selectedRoute.students.length === 0
    ) {
      toast({
        title: "Validation Error",
        description: "The selected route has no students assigned",
        variant: "destructive",
      });
      return;
    }

    // Extract student IDs from the route
    const students = selectedRoute.students
      .filter((student) => student._originalStudentId && !student.isHidden)
      .map((student) => ({
        studentId: student._originalStudentId!,
      }));

    if (students.length === 0) {
      toast({
        title: "Validation Error",
        description: "No valid students found for the selected route",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Always use current date for tripDate
      const currentDate = new Date().toISOString().split("T")[0];

      if (trip) {
        await updateTrip(trip.id, {
          busId: formData.busId,
          driverId: formData.driverId,
          minderId: formData.minderId,
          tripDate: currentDate,
          students: students,
        });
        toast({
          title: "Trip Updated!",
          description: "The trip has been successfully updated.",
        });
      } else {
        // Use the original route UUID if available, otherwise use the formData routeId
        const routeIdToSend =
          selectedRoute._originalRouteId || formData.routeId;

        await createTrip({
          routeId: routeIdToSend,
          busId: formData.busId,
          driverId: formData.driverId,
          minderId: formData.minderId,
          tripDate: currentDate,
          students: students,
        });
        toast({
          title: "Trip Scheduled!",
          description: "The trip has been successfully scheduled.",
        });
      }

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoute = routes.find(
    (r) => r.id.toString() === formData.routeId
  );

  // Find the school ID from the school name
  const selectedSchool = useMemo(() => {
    if (!selectedRoute?.schoolName) return null;
    return schools.find((school) => school.name === selectedRoute.schoolName);
  }, [selectedRoute, schools]);

  // Filter buses, drivers, and minders by selected route's school ID
  const filteredBuses = useMemo(() => {
    if (!selectedSchool) return buses;
    return buses.filter((bus) => bus.schoolId === selectedSchool.id);
  }, [buses, selectedSchool]);

  const filteredDrivers = useMemo(() => {
    if (!selectedSchool) return drivers;
    return drivers.filter((driver) => driver.schoolId === selectedSchool.id);
  }, [drivers, selectedSchool]);

  const filteredMinders = useMemo(() => {
    if (!selectedSchool) return minders;
    return minders.filter((minder) => minder.schoolId === selectedSchool.id);
  }, [minders, selectedSchool]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-5 h-5 text-blue-600" />
            {trip ? "Edit Trip" : "Schedule New Trip"}
          </DialogTitle>
          <DialogDescription>
            {trip
              ? "Update the trip details below."
              : "Select a route and assign a bus, driver, and minder for this trip."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Route Selection */}
          <div className="space-y-2">
            <Label htmlFor="routeId">
              Route <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.routeId}
              onValueChange={(value) =>
                setFormData({ ...formData, routeId: value })
              }
              disabled={routesLoading || !!trip}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    routesLoading ? "Loading routes..." : "Select a route"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {routes
                  .filter((route) => route.status === "active")
                  .map((route) => {
                    // Use original route UUID if available, otherwise fallback to numeric ID
                    const routeIdValue =
                      route._originalRouteId || route.id.toString();
                    return (
                      <SelectItem key={route.id} value={routeIdValue}>
                        {route.routeName} - {route.schoolName} ({route.tripType}
                        )
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>

          {/* Bus Selection */}
          <div className="space-y-2">
            <Label htmlFor="busId">
              Bus <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.busId}
              onValueChange={(value) =>
                setFormData({ ...formData, busId: value })
              }
              disabled={busesLoading || !formData.routeId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !formData.routeId
                      ? "Select a route first"
                      : busesLoading
                      ? "Loading buses..."
                      : "Select a bus"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredBuses
                  .filter((bus) => bus.status === "Active")
                  .map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.registrationNumber} - {bus.make} {bus.model}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Driver Selection */}
          <div className="space-y-2">
            <Label htmlFor="driverId">
              Driver <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.driverId}
              onValueChange={(value) =>
                setFormData({ ...formData, driverId: value })
              }
              disabled={driversLoading || !formData.routeId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !formData.routeId
                      ? "Select a route first"
                      : driversLoading
                      ? "Loading drivers..."
                      : "Select a driver"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredDrivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name} - {driver.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minder Selection */}
          <div className="space-y-2">
            <Label htmlFor="minderId">
              Minder <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.minderId}
              onValueChange={(value) =>
                setFormData({ ...formData, minderId: value })
              }
              disabled={mindersLoading || !formData.routeId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !formData.routeId
                      ? "Select a route first"
                      : mindersLoading
                      ? "Loading minders..."
                      : "Select a minder"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredMinders.map((minder) => (
                  <SelectItem key={minder.id} value={minder.id}>
                    {minder.name} - {minder.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trip Date - Auto-set to current date and read-only */}
          <div className="space-y-2">
            <Label htmlFor="tripDate">
              Trip Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tripDate"
              type="date"
              value={new Date().toISOString().split("T")[0]}
              disabled
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500">
              Trip date is automatically set to today's date and cannot be
              changed
            </p>
          </div>

          {/* Students Info */}
          {formData.routeId && selectedRoute && (
            <div className="space-y-2">
              <Label>Students on Route</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {selectedRoute.students.filter((s) => !s.isHidden).length}
                  </span>{" "}
                  student(s) will be included in this trip
                </p>
                {selectedRoute.students.filter((s) => !s.isHidden).length ===
                  0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Warning: This route has no active students assigned
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? trip
                  ? "Updating..."
                  : "Scheduling..."
                : trip
                ? "Update Trip"
                : "Schedule Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TripForm;
