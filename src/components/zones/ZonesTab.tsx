import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import ZonesList from "./ZonesList";
import ZoneDialog from "./ZoneDialog";
import { ZoneActivationDialog } from "./ZoneActivationDialog";
import { ZoneDeactivationDialog } from "./ZoneDeactivationDialog";

export interface Zone {
  id: number;
  zoneName: string;
  geofence: {
    center: { lat: number; lng: number };
    radius: number; // in meters
    coordinates?: { lat: number; lng: number }[]; // for polygon geofences
  };
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

const ZonesTab = () => {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 1,
      zoneName: "Downtown School Zone",
      geofence: {
        center: { lat: 40.7128, lng: -74.0060 },
        radius: 500,
      },
      status: "active",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z",
    },
    {
      id: 2,
      zoneName: "Residential Area North",
      geofence: {
        center: { lat: 40.7589, lng: -73.9851 },
        radius: 800,
      },
      status: "inactive",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-25T14:15:00Z",
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] = useState(false);
  const [zoneToToggle, setZoneToToggle] = useState<Zone | null>(null);

  const handleCreateZone = () => {
    setEditingZone(null);
    setIsDialogOpen(true);
  };

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setIsDialogOpen(true);
  };

  const handleSaveZone = (zoneData: Omit<Zone, "id" | "createdAt" | "updatedAt">) => {
    if (editingZone) {
      // Update existing zone
      setZones(prev => prev.map(zone => 
        zone.id === editingZone.id 
          ? { ...zone, ...zoneData, updatedAt: new Date().toISOString() }
          : zone
      ));
    } else {
      // Create new zone
      const newZone: Zone = {
        id: Math.max(0, ...zones.map(z => z.id)) + 1,
        ...zoneData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setZones(prev => [...prev, newZone]);
    }
    setIsDialogOpen(false);
    setEditingZone(null);
  };

  const handleDeleteZone = (zoneId: number) => {
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingZone(null);
  };

  const handleStatusToggle = (zone: Zone) => {
    setZoneToToggle(zone);
    if (zone.status === "active") {
      setIsDeactivationDialogOpen(true);
    } else {
      setIsActivationDialogOpen(true);
    }
  };

  const confirmStatusToggle = () => {
    if (zoneToToggle) {
      const newStatus = zoneToToggle.status === "active" ? "inactive" : "active";
      setZones(prev => prev.map(zone => 
        zone.id === zoneToToggle.id 
          ? { ...zone, status: newStatus, updatedAt: new Date().toISOString() }
          : zone
      ));
      setIsActivationDialogOpen(false);
      setIsDeactivationDialogOpen(false);
      setZoneToToggle(null);
    }
  };

  const cancelStatusToggle = () => {
    setIsActivationDialogOpen(false);
    setIsDeactivationDialogOpen(false);
    setZoneToToggle(null);
  };

  const filteredZones = zones.filter(zone =>
    zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with title and subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Zones
          </h2>
          <p className="text-gray-600 mt-1">Manage pickup zones and geofenced areas</p>
        </div>
        <Button 
          onClick={handleCreateZone}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search zones by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
      </div>
      
      <ZonesList 
        zones={filteredZones}
        onEditZone={handleEditZone}
        onDeleteZone={handleDeleteZone}
      />

      <ZoneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        zone={editingZone}
        onSave={handleSaveZone}
        onCancel={handleCloseDialog}
      />

      <ZoneActivationDialog
        isOpen={isActivationDialogOpen}
        zoneName={zoneToToggle?.zoneName || ""}
        onConfirm={confirmStatusToggle}
        onClose={cancelStatusToggle}
      />

      <ZoneDeactivationDialog
        isOpen={isDeactivationDialogOpen}
        zoneName={zoneToToggle?.zoneName || ""}
        onConfirm={confirmStatusToggle}
        onClose={cancelStatusToggle}
      />
    </div>
  );
};

export default ZonesTab;
