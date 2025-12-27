
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MobileSelect from "./MobileSelect";
import GeofenceDialog from "./GeofenceDialog";
import { Bus, Route, User, MapPin, AlertCircle } from "lucide-react";
import { StartTripFormData } from "../types/startTrip";
import { mockBuses, mockDrivers, mockRoutes, mockZones } from "../data/tripData";
import StudentList from "./StudentList";

interface StartTripDialogProps {
  open: boolean;
  onClose: () => void;
  onStartTrip: (data: StartTripFormData) => void;
}

const StartTripDialog = ({ open, onClose, onStartTrip }: StartTripDialogProps) => {
  const [formData, setFormData] = useState<StartTripFormData>({
    busRegistration: "",
    driver: "",
    route: "",
    zone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<StartTripFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<StartTripFormData> = {};
    
    if (!formData.busRegistration) newErrors.busRegistration = "Bus registration is required";
    if (!formData.driver) newErrors.driver = "Driver selection is required";
    if (!formData.route) newErrors.route = "Route selection is required";
    if (!formData.zone) newErrors.zone = "Zone selection is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartTrip = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onStartTrip(formData);
      setIsLoading(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      busRegistration: "",
      driver: "",
      route: "",
      zone: "",
    });
    setErrors({});
    onClose();
  };

  const isFormValid = formData.busRegistration && formData.driver && formData.route && formData.zone;

  // Prepare options for MobileSelect components
  const busOptions = mockBuses.map(bus => ({
    value: bus.id,
    label: `${bus.registration} - ${bus.model}`
  }));

  const driverOptions = mockDrivers.map(driver => ({
    value: driver.id,
    label: `${driver.name} - ${driver.licenseNumber}`
  }));

  const routeOptions = mockRoutes.map(route => ({
    value: route.id,
    label: `${route.name} (${route.estimatedDuration}min)`
  }));

  const zoneOptions = mockZones.map(zone => ({
    value: zone.id,
    label: zone.name
  }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="h-full max-h-none w-full max-w-none p-0 m-0 rounded-none flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            Start New Trip
          </DialogTitle>
          <p className="text-green-100 text-center mt-2">
            Fill in the trip details to begin monitoring
          </p>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
          <div className="p-6 space-y-6 pb-32">
            {/* Bus Registration */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-green-600" />
                    Bus Registration
                  </label>
                  <MobileSelect
                    options={busOptions}
                    value={formData.busRegistration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, busRegistration: value }))}
                    placeholder="Select bus..."
                    searchPlaceholder="Search by registration or model..."
                    emptyText="No buses found"
                    className={errors.busRegistration ? "border-red-500" : ""}
                    icon={Bus}
                    label="Bus"
                  />
                  {errors.busRegistration && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.busRegistration}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Driver Selection */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Driver
                  </label>
                  <MobileSelect
                    options={driverOptions}
                    value={formData.driver}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, driver: value }))}
                    placeholder="Select driver..."
                    searchPlaceholder="Search by name or license..."
                    emptyText="No drivers found"
                    className={errors.driver ? "border-red-500" : ""}
                    icon={User}
                    label="Driver"
                  />
                  {errors.driver && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.driver}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Route Selection */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Route className="w-5 h-5 text-green-600" />
                    Route
                  </label>
                  <MobileSelect
                    options={routeOptions}
                    value={formData.route}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, route: value }))}
                    placeholder="Select route..."
                    searchPlaceholder="Search routes..."
                    emptyText="No routes found"
                    className={errors.route ? "border-red-500" : ""}
                    icon={Route}
                    label="Route"
                  />
                  {errors.route && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.route}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Zone Selection - Always visible */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Zone
                  </label>
                  <MobileSelect
                    options={zoneOptions}
                    value={formData.zone}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, zone: value }))}
                    placeholder="Select zone..."
                    searchPlaceholder="Search zones..."
                    emptyText="No zones found"
                    className={errors.zone ? "border-red-500" : ""}
                    icon={MapPin}
                    label="Zone"
                  />
                  {errors.zone && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.zone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Student List - Show when Route is selected */}
            {formData.route && (
              <StudentList 
                selectedRoute={formData.route}
                selectedZone={formData.zone}
              />
            )}
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
          <div className="space-y-3">
            <Button
              onClick={handleStartTrip}
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg py-4 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Starting Trip...
                </div>
              ) : (
                <>
                  <Bus className="w-5 h-5 mr-2" />
                  Start Trip
                </>
              )}
            </Button>
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full py-3 text-gray-600 border-gray-300"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartTripDialog;
