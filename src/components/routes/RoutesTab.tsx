import { useState } from "react";
import RouteForm from "./RouteForm";
import RoutesList from "./RoutesList";
import RouteDetailsDialog from "./RouteDetailsDialog";
import RouteDeleteDialog from "./RouteDeleteDialog";
import { RouteActivationDialog } from "./RouteActivationDialog";
import { RouteDeactivationDialog } from "./RouteDeactivationDialog";
import RoutesHeader from "./components/RoutesHeader";
import RoutesSearch from "./components/RoutesSearch";
import { useRoutesData } from "./hooks/useRoutesData";
import { useSchools } from "@/hooks/useSchools";

export interface RouteData {
  id: number;
  _originalRouteId?: string; // Store the original UUID from API
  routeName: string;
  schoolName: string;
  tripType:
    | "Morning Pickup"
    | "Evening Drop Off"
    | "Field Trip"
    | "Extra Curriculum"
    | "Emergency";
  routeDescription?: string;
  tripDate?: string;
  status: "active" | "inactive";
  students: StudentInRoute[];
  busId?: string | null;
  driverId?: string | null;
  minderId?: string | null;
  // Additional route information
  bus?: {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
  } | null;
  driver?: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  } | null;
  minder?: {
    id: string;
    name: string;
    phoneNumber: string;
    pin: string;
  } | null;
  // Field Trip specific fields
  departureTime?: string;
  returnTime?: string;
  destinationAddress?: string;
  tripDescription?: string;
}

export interface StudentInRoute {
  id: number;
  photo?: string;
  studentName: string;
  admissionNumber: string;
  age: number;
  gender: "Male" | "Female";
  expectedPickupTime?: string;
  expectedDropOffTime?: string;
  fingerprintStatus: "scanned & verified" | "not scanned"; // Legacy - kept for backward compatibility
  rfidStatus?: "scanned" | "not scanned";
  rfidTagId?: string | null;
  isHidden: boolean; // Make this required, not optional
  riderType: "daily" | "occasional"; // Type of rider - daily or occasional
  _originalStudentId?: string; // Store original UUID for API operations
  parentName?: string; // Parent name if available
  parentPhone?: string; // Parent phone if available
  dateOfBirth?: string; // Date of birth if available
}

const RoutesTab = () => {
  const {
    filteredRoutes,
    loading: routesLoading,
    error: routesError,
    searchTerm,
    setSearchTerm,
    handleAddRoute,
    handleDuplicateRoute,
    handleDeleteRoute,
  } = useRoutesData();

  const { schools, loading: schoolsLoading } = useSchools();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<RouteData | null>(null);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] =
    useState(false);
  const [routeToToggle, setRouteToToggle] = useState<RouteData | null>(null);

  const onAddRoute = async (routeData: RouteData, schoolId: string) => {
    try {
      await handleAddRoute(routeData, editingRoute, schoolId);
      setEditingRoute(null);
      setIsFormOpen(false);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Failed to save route:", error);
    }
  };

  const handleEditRoute = (route: RouteData) => {
    setEditingRoute(route);
    setIsFormOpen(true);
  };

  const onDeleteRoute = (routeId: number) => {
    const route = filteredRoutes.find((r) => r.id === routeId);
    if (route) {
      setRouteToDelete(route);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleStatusToggle = (route: RouteData) => {
    setRouteToToggle(route);
    if (route.status === "active") {
      setIsDeactivationDialogOpen(true);
    } else {
      setIsActivationDialogOpen(true);
    }
  };

  const confirmStatusToggle = () => {
    if (routeToToggle) {
      // Here you would typically update the route status in your data
      console.log(`Route ${routeToToggle.routeName} status toggled`);
      setIsActivationDialogOpen(false);
      setIsDeactivationDialogOpen(false);
      setRouteToToggle(null);
    }
  };

  const cancelStatusToggle = () => {
    setIsActivationDialogOpen(false);
    setIsDeactivationDialogOpen(false);
    setRouteToToggle(null);
  };

  const confirmDeleteRoute = () => {
    if (routeToDelete) {
      handleDeleteRoute(routeToDelete.id);
      setIsDeleteDialogOpen(false);
      setRouteToDelete(null);
    }
  };

  const cancelDeleteRoute = () => {
    setIsDeleteDialogOpen(false);
    setRouteToDelete(null);
  };

  const handleCardClick = (route: RouteData) => {
    setSelectedRoute(route);
    setIsDetailsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingRoute(null);
  };

  if (isFormOpen) {
    return (
      <RouteForm
        onSubmit={onAddRoute}
        onCancel={handleCancel}
        editingRoute={editingRoute}
        schools={schools}
        schoolsLoading={schoolsLoading}
      />
    );
  }

  if (routesLoading) {
    return (
      <div className="space-y-6">
        <RoutesHeader onAddRoute={() => setIsFormOpen(true)} />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading routes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (routesError) {
    return (
      <div className="space-y-6">
        <RoutesHeader onAddRoute={() => setIsFormOpen(true)} />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading routes</p>
            <p className="text-gray-600 text-sm">{routesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoutesHeader onAddRoute={() => setIsFormOpen(true)} />

      <RoutesSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <RoutesList
        routes={filteredRoutes}
        onEdit={handleEditRoute}
        onDuplicate={handleDuplicateRoute}
        onDelete={onDeleteRoute}
        onCardClick={handleCardClick}
      />

      <RouteDetailsDialog
        route={selectedRoute}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />

      <RouteDeleteDialog
        isOpen={isDeleteDialogOpen}
        routeName={routeToDelete?.routeName || ""}
        onConfirm={confirmDeleteRoute}
        onCancel={cancelDeleteRoute}
      />

      <RouteActivationDialog
        isOpen={isActivationDialogOpen}
        routeName={routeToToggle?.routeName || ""}
        onConfirm={confirmStatusToggle}
        onClose={cancelStatusToggle}
      />

      <RouteDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        routeName={routeToToggle?.routeName || ""}
        onConfirm={confirmStatusToggle}
        onClose={cancelStatusToggle}
      />
    </div>
  );
};

export default RoutesTab;
