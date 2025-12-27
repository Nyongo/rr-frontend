
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Zone } from "./ZonesTab";
import { ZoneActivationDialog } from "./ZoneActivationDialog";
import { ZoneDeactivationDialog } from "./ZoneDeactivationDialog";
import GeofenceMap from "./components/GeofenceMap";

interface ZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone?: Zone | null;
  onSave: (zoneData: Omit<Zone, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const ZoneDialog = ({ open, onOpenChange, zone, onSave, onCancel }: ZoneDialogProps) => {
  const [formData, setFormData] = useState({
    zoneName: "",
    geofence: {
      center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
      radius: 500,
    },
    status: "active" as "active" | "inactive",
  });

  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<typeof formData | null>(null);

  useEffect(() => {
    if (zone) {
      setFormData({
        zoneName: zone.zoneName,
        geofence: zone.geofence,
        status: zone.status,
      });
    } else {
      setFormData({
        zoneName: "",
        geofence: {
          center: { lat: 40.7128, lng: -74.0060 },
          radius: 500,
        },
        status: "active",
      });
    }
  }, [zone, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if status changed and editing an existing zone
    if (zone && zone.status !== formData.status) {
      setPendingFormData(formData);
      if (formData.status === "active") {
        setIsActivationDialogOpen(true);
      } else {
        setIsDeactivationDialogOpen(true);
      }
      return;
    }

    // No status change or new zone, save directly
    onSave(formData);
  };

  const handleStatusConfirm = () => {
    if (pendingFormData) {
      onSave(pendingFormData);
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

  const handleGeofenceChange = (center: { lat: number; lng: number }, radius: number) => {
    setFormData(prev => ({
      ...prev,
      geofence: { center, radius }
    }));
  };

  const isValid = formData.zoneName.trim() !== "";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {zone ? "Edit Zone" : "Add New Zone"}
            </DialogTitle>
            <DialogDescription>
              {zone ? "Update the zone information and geofence settings." : "Create a new zone with geofence boundaries for pickup areas."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zoneName" className="text-sm font-medium text-gray-700">
                Zone Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zoneName"
                value={formData.zoneName}
                onChange={(e) => setFormData(prev => ({ ...prev, zoneName: e.target.value }))}
                placeholder="Enter zone name"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "active" | "inactive") => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Geofence Radius <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={formData.geofence.radius}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    geofence: { ...prev.geofence, radius: parseInt(e.target.value) || 500 }
                  }))}
                  placeholder="500"
                  min="50"
                  max="5000"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-500">meters</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Geofence Area
              </Label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <GeofenceMap
                  center={formData.geofence.center}
                  radius={formData.geofence.radius}
                  onGeofenceChange={handleGeofenceChange}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={!isValid}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              >
                {zone ? "Update Zone" : "Add Zone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ZoneActivationDialog
        isOpen={isActivationDialogOpen}
        zoneName={formData.zoneName}
        onConfirm={handleStatusConfirm}
        onClose={handleStatusCancel}
      />

      <ZoneDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        zoneName={formData.zoneName}
        onConfirm={handleStatusConfirm}
        onClose={handleStatusCancel}
      />
    </>
  );
};

export default ZoneDialog;
