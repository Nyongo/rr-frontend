import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EnhancedTabs,
  EnhancedTabsContent,
  EnhancedTabsList,
  EnhancedTabsTrigger,
} from "@/components/ui/enhanced-tabs";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import {
  Bus,
  Search,
  Plus,
  Import,
  Upload,
  Download,
  Users,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  FormItem,
  Bus as BusType,
  Driver,
  Minder,
} from "@/components/fleet/types";
import { useFleetData } from "@/components/fleet/hooks/useFleetData";
import { useBuses } from "@/hooks/useBuses";
import { useDrivers } from "@/hooks/useDrivers";
import { useMinders } from "@/hooks/useMinders";
import { createBusColumns } from "@/components/fleet/table-configs/busColumns";
import { createDriverColumns } from "@/components/fleet/table-configs/driverColumns";
import { createMinderColumns } from "@/components/fleet/table-configs/minderColumns";
import { BusForm } from "@/components/fleet/forms/BusForm";
import { PersonForm } from "@/components/fleet/forms/PersonForm";
import { FleetStats } from "@/components/fleet/components/FleetStats";
import {
  generateBusCSVTemplate,
  generateDriverCSVTemplate,
  generateMinderCSVTemplate,
  downloadCSV,
} from "@/components/utils/csvTemplates";
import { BusDeactivationDialog } from "@/components/fleet/forms/BusDeactivationDialog";
import { BusActivationDialog } from "@/components/fleet/forms/BusActivationDialog";
import { DriverDeactivationDialog } from "@/components/fleet/forms/DriverDeactivationDialog";
import { DriverActivationDialog } from "@/components/fleet/forms/DriverActivationDialog";
import { MinderDeactivationDialog } from "@/components/fleet/forms/MinderDeactivationDialog";
import { MinderActivationDialog } from "@/components/fleet/forms/MinderActivationDialog";

const FleetCrew = () => {
  const [activeTab, setActiveTab] = useState("buses");
  const [busSearchTerm, setBusSearchTerm] = useState("");
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [minderSearchTerm, setMinderSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isBusDeactivationDialogOpen, setIsBusDeactivationDialogOpen] =
    useState(false);
  const [isBusActivationDialogOpen, setIsBusActivationDialogOpen] =
    useState(false);
  const [isDriverDeactivationDialogOpen, setIsDriverDeactivationDialogOpen] =
    useState(false);
  const [isDriverActivationDialogOpen, setIsDriverActivationDialogOpen] =
    useState(false);
  const [isMinderDeactivationDialogOpen, setIsMinderDeactivationDialogOpen] =
    useState(false);
  const [isMinderActivationDialogOpen, setIsMinderActivationDialogOpen] =
    useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [busToDeactivate, setBusToDeactivate] = useState<BusType | null>(null);
  const [busToActivate, setBusToActivate] = useState<BusType | null>(null);
  const [driverToDeactivate, setDriverToDeactivate] = useState<Driver | null>(
    null
  );
  const [driverToActivate, setDriverToActivate] = useState<Driver | null>(null);
  const [minderToDeactivate, setMinderToDeactivate] = useState<Minder | null>(
    null
  );
  const [minderToActivate, setMinderToActivate] = useState<Minder | null>(null);

  const {
    buses,
    loading: busesLoading,
    addBus,
    updateBus,
    deleteBus: removeBus,
    toggleBusStatus,
  } = useBuses();

  const {
    drivers,
    loading: driversLoading,
    addDriver,
    updateDriver,
    deleteDriver: removeDriver,
  } = useDrivers();

  const {
    minders,
    loading: mindersLoading,
    addMinder,
    updateMinder,
    deleteMinder: removeMinder,
    toggleMinderStatus,
  } = useMinders();

  const [newItem, setNewItem] = useState<FormItem>({
    registrationNumber: "",
    schoolName: "",
    make: "",
    model: "",
    seatsCapacity: "",
    type: "",
    status: "Active",
    name: "",
    phone: "",
    photo: "",
    pin: "",
  });

  const resetForm = () => {
    setNewItem({
      registrationNumber: "",
      schoolName: "",
      make: "",
      model: "",
      seatsCapacity: "",
      type: "",
      status: "Active",
      name: "",
      phone: "",
      photo: "",
      pin: "",
    });
  };

  const handleAddDialogOpen = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === "buses") {
        // For buses, we need to convert the form data to API format
        const busData = {
          registrationNumber: newItem.registrationNumber,
          schoolId: newItem.schoolId || "567431ac-cab3-41e5-b0ca-ee4de0953661", // Use selected school ID
          make: newItem.make,
          model: newItem.model,
          seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
          type: newItem.type,
          status: newItem.status,
          isActive: newItem.status === "Active" ? "true" : "false",
        };
        await addBus(busData);
      } else if (activeTab === "drivers") {
        // For drivers, we need to convert the form data to API format
        const driverData = {
          name: newItem.name,
          phoneNumber: newItem.phone,
          schoolId: newItem.schoolId || "567431ac-cab3-41e5-b0ca-ee4de0953661",
        };
        await addDriver(driverData);
      } else if (activeTab === "minders") {
        // For minders, we need to convert the form data to API format
        const minderData = {
          name: newItem.name,
          phoneNumber: newItem.phone,
          schoolId: newItem.schoolId || "567431ac-cab3-41e5-b0ca-ee4de0953661", // Use selected school ID
          status: newItem.status || "Active",
          isActive: newItem.status === "Active" ? true : false,
          pin: newItem.pin || "1234", // Default pin if not provided
        };
        await addMinder(minderData);
      }

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to add item:", error);
    }
  };

  const handleEditItem = (item: BusType | Driver | Minder) => {
    setEditingItem(item);
    setNewItem({
      registrationNumber: (item as BusType).registrationNumber || "",
      schoolName:
        (item as BusType).school?.name ||
        (item as Driver).school?.name ||
        (item as Minder).schoolName ||
        "",
      schoolId: (item as BusType).schoolId || (item as Driver).schoolId || "",
      make: (item as BusType).make || "",
      model: (item as BusType).model || "",
      seatsCapacity: (item as BusType).seatsCapacity?.toString() || "",
      type: (item as BusType).type || "",
      status: item.status || "Active",
      name: (item as Driver | Minder).name || "",
      phone: (item as Driver).phoneNumber || (item as Minder).phoneNumber || "",
      photo: (item as Driver).photo || (item as Minder).photo || "",
      pin: (item as Driver).pin || (item as Minder).pin || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === "buses" && editingItem) {
        // Check if status is being changed to Inactive for buses
        if (newItem.status === "Inactive" && editingItem.status === "Active") {
          setBusToDeactivate({
            ...editingItem,
            ...newItem,
            seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
          });
          setIsBusDeactivationDialogOpen(true);
          return;
        }

        // Check if status is being changed to Active for buses
        if (newItem.status === "Active" && editingItem.status === "Inactive") {
          setBusToActivate({
            ...editingItem,
            ...newItem,
            seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
          });
          setIsBusActivationDialogOpen(true);
          return;
        }

        // For buses, we need to convert the form data to API format
        const busData = {
          registrationNumber: newItem.registrationNumber,
          schoolId:
            newItem.schoolId ||
            (editingItem as BusType).schoolId ||
            "567431ac-cab3-41e5-b0ca-ee4de0953661",
          make: newItem.make,
          model: newItem.model,
          seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
          type: newItem.type,
          status: newItem.status,
          isActive: newItem.status === "Active" ? "true" : "false",
        };
        await updateBus(editingItem.id, busData);
      } else if (activeTab === "drivers" && editingItem) {
        // For drivers, we need to convert the form data to API format
        const driverData = {
          name: newItem.name,
          phoneNumber: newItem.phone,
          schoolId:
            newItem.schoolId ||
            (editingItem as Driver).schoolId ||
            "567431ac-cab3-41e5-b0ca-ee4de0953661",
        };
        await updateDriver(editingItem.id, driverData);
      } else if (activeTab === "minders" && editingItem) {
        // Check if status is being changed to Inactive for minders
        if (newItem.status === "Inactive" && editingItem.status === "Active") {
          setMinderToDeactivate({
            ...editingItem,
            ...newItem,
          });
          setIsMinderDeactivationDialogOpen(true);
          return;
        }

        // Check if status is being changed to Active for minders
        if (newItem.status === "Active" && editingItem.status === "Inactive") {
          setMinderToActivate({
            ...editingItem,
            ...newItem,
          });
          setIsMinderActivationDialogOpen(true);
          return;
        }

        // For minders, we need to convert the form data to API format
        const minderData = {
          name: newItem.name,
          phoneNumber: newItem.phone,
          schoolId:
            newItem.schoolId ||
            (editingItem as Minder).schoolId ||
            "567431ac-cab3-41e5-b0ca-ee4de0953661",
          status: newItem.status || "Active",
          isActive: newItem.status === "Active" ? true : false,
          pin: newItem.pin || (editingItem as Minder).pin || "1234",
        };
        await updateMinder(editingItem.id, minderData);
      }

      toast({
        title: "Item Updated!",
        description: "Successfully updated in the system.",
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to update item:", error);
    }
  };

  const handleBusDeactivationConfirm = async () => {
    if (!busToDeactivate || !editingItem) return;

    try {
      const busData = {
        registrationNumber: newItem.registrationNumber,
        schoolId:
          newItem.schoolId ||
          (editingItem as BusType).schoolId ||
          "567431ac-cab3-41e5-b0ca-ee4de0953661",
        make: newItem.make,
        model: newItem.model,
        seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
        type: newItem.type,
        status: "Inactive",
        isActive: "false",
      };
      await updateBus(editingItem.id, busData);
    } catch (error) {
      console.error("Failed to deactivate bus:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setBusToDeactivate(null);
    setIsBusDeactivationDialogOpen(false);
    resetForm();
  };

  const handleBusActivationConfirm = async () => {
    if (!busToActivate || !editingItem) return;

    try {
      const busData = {
        registrationNumber: newItem.registrationNumber,
        schoolId:
          newItem.schoolId ||
          (editingItem as BusType).schoolId ||
          "567431ac-cab3-41e5-b0ca-ee4de0953661",
        make: newItem.make,
        model: newItem.model,
        seatsCapacity: parseInt(newItem.seatsCapacity) || 0,
        type: newItem.type,
        status: "Active",
        isActive: "true",
      };
      await updateBus(editingItem.id, busData);
    } catch (error) {
      console.error("Failed to activate bus:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setBusToActivate(null);
    setIsBusActivationDialogOpen(false);
    resetForm();
  };

  const handleDriverDeactivationConfirm = async () => {
    if (!driverToDeactivate || !editingItem) return;

    try {
      const driverData = {
        name: newItem.name,
        phoneNumber: newItem.phone,
        schoolId:
          newItem.schoolId ||
          (editingItem as Driver).schoolId ||
          "567431ac-cab3-41e5-b0ca-ee4de0953661",
      };
      await updateDriver(editingItem.id, driverData);
    } catch (error) {
      console.error("Failed to deactivate driver:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setDriverToDeactivate(null);
    setIsDriverDeactivationDialogOpen(false);
    resetForm();
  };

  const handleDriverActivationConfirm = async () => {
    if (!driverToActivate || !editingItem) return;

    try {
      const driverData = {
        name: newItem.name,
        phoneNumber: newItem.phone,
        schoolId:
          newItem.schoolId ||
          (editingItem as Driver).schoolId ||
          "567431ac-cab3-41e5-b0ca-ee4de0953661",
      };
      await updateDriver(editingItem.id, driverData);
    } catch (error) {
      console.error("Failed to activate driver:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setDriverToActivate(null);
    setIsDriverActivationDialogOpen(false);
    resetForm();
  };

  const handleMinderDeactivationConfirm = async () => {
    if (!minderToDeactivate || !editingItem) return;

    try {
      await toggleMinderStatus(editingItem.id, false);
    } catch (error) {
      console.error("Failed to deactivate minder:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setMinderToDeactivate(null);
    setIsMinderDeactivationDialogOpen(false);
    resetForm();
  };

  const handleMinderActivationConfirm = async () => {
    if (!minderToActivate || !editingItem) return;

    try {
      await toggleMinderStatus(editingItem.id, true);
    } catch (error) {
      console.error("Failed to activate minder:", error);
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setMinderToActivate(null);
    setIsMinderActivationDialogOpen(false);
    resetForm();
  };

  const handleDeleteItem = async (item: BusType | Driver | Minder) => {
    try {
      if (activeTab === "buses") {
        await removeBus(String(item.id));
      } else if (activeTab === "drivers") {
        await removeDriver(String(item.id));
      } else if (activeTab === "minders") {
        await removeMinder(String(item.id));
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to delete item:", error);
    }
  };

  const handleImport = () => {
    toast({
      title: "Import Started!",
      description: `${
        activeTab === "buses"
          ? "Bus"
          : activeTab === "drivers"
          ? "Driver"
          : "Minder"
      } data import is being processed.`,
    });
    setIsImportDialogOpen(false);
  };

  const handleDownloadTemplate = () => {
    let content = "";
    let filename = "";

    if (activeTab === "buses") {
      content = generateBusCSVTemplate();
      filename = "bus_template.csv";
    } else if (activeTab === "drivers") {
      content = generateDriverCSVTemplate();
      filename = "driver_template.csv";
    } else if (activeTab === "minders") {
      content = generateMinderCSVTemplate();
      filename = "minder_template.csv";
    }

    downloadCSV(content, filename);
    toast({
      title: "Template Downloaded!",
      description: `${
        activeTab === "buses"
          ? "Bus"
          : activeTab === "drivers"
          ? "Driver"
          : "Minder"
      } CSV template has been downloaded.`,
    });
  };

  const filteredBuses = buses.filter(
    (bus) =>
      bus.registrationNumber
        .toLowerCase()
        .includes(busSearchTerm.toLowerCase()) ||
      (bus.school?.name &&
        bus.school.name.toLowerCase().includes(busSearchTerm.toLowerCase())) ||
      bus.make.toLowerCase().includes(busSearchTerm.toLowerCase()) ||
      bus.model.toLowerCase().includes(busSearchTerm.toLowerCase()) ||
      bus.type.toLowerCase().includes(busSearchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
      driver.phoneNumber
        .toLowerCase()
        .includes(driverSearchTerm.toLowerCase()) ||
      (driver.school?.name &&
        driver.school.name
          .toLowerCase()
          .includes(driverSearchTerm.toLowerCase())) ||
      driver.pin.toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  const filteredMinders = minders.filter(
    (minder) =>
      minder.name.toLowerCase().includes(minderSearchTerm.toLowerCase()) ||
      minder.phoneNumber
        .toLowerCase()
        .includes(minderSearchTerm.toLowerCase()) ||
      (minder.school?.name &&
        minder.school.name
          .toLowerCase()
          .includes(minderSearchTerm.toLowerCase())) ||
      minder.pin.toLowerCase().includes(minderSearchTerm.toLowerCase())
  );

  const busColumns = createBusColumns(handleEditItem, handleDeleteItem);
  const driverColumns = createDriverColumns(handleEditItem, handleDeleteItem);
  const minderColumns = createMinderColumns(handleEditItem, handleDeleteItem);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Simplified Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bus className="w-8 h-8 text-green-600" />
              Fleet & Crew
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your buses, drivers, and minders
            </p>
          </div>
        </div>

        {/* Fleet Stats */}
        <FleetStats buses={buses} drivers={drivers} minders={minders} />

        {/* Enhanced Tabs */}
        <EnhancedTabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <EnhancedTabsList className="grid-cols-3">
            <EnhancedTabsTrigger value="buses" useCustomGreen={true}>
              <Bus className="w-4 h-4 mr-2" />
              Buses
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="drivers" useCustomGreen={true}>
              <User className="w-4 h-4 mr-2" />
              Drivers
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="minders" useCustomGreen={true}>
              <Users className="w-4 h-4 mr-2" />
              Minders
            </EnhancedTabsTrigger>
          </EnhancedTabsList>

          <EnhancedTabsContent value="buses" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Buses</h2>
                <p className="text-gray-600">
                  Manage your school buses and their details
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={isImportDialogOpen}
                  onOpenChange={setIsImportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Import className="w-4 h-4 mr-2" />
                      Import Buses
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Bus Data</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file containing bus information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Need a template?
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTemplate}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Template
                        </Button>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drop your CSV file here or click to browse
                        </p>
                        <Button variant="outline">Choose File</Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>
                          CSV should include: Registration Number, School Name,
                          Make, Model, Seats Capacity, Type, Status
                        </p>
                      </div>
                      <Button
                        onClick={handleImport}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        Import Data
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                      onClick={handleAddDialogOpen}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Bus
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Bus</DialogTitle>
                      <DialogDescription>
                        Add a new bus to your fleet.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <BusForm newItem={newItem} setNewItem={setNewItem} />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        Add Bus
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search buses by registration, school, make, model, or type..."
                value={busSearchTerm}
                onChange={(e) => setBusSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {busesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading buses...</p>
              </div>
            ) : (
              <EnhancedTable
                data={filteredBuses}
                columns={busColumns}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  showPageSizeSelector: true,
                }}
              />
            )}
          </EnhancedTabsContent>

          <EnhancedTabsContent value="drivers" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Drivers</h2>
                <p className="text-gray-600">
                  Manage your bus drivers and their information
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={isImportDialogOpen}
                  onOpenChange={setIsImportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Import className="w-4 h-4 mr-2" />
                      Import Drivers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Driver Data</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file containing driver information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Need a template?
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTemplate}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Template
                        </Button>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drop your CSV file here or click to browse
                        </p>
                        <Button variant="outline">Choose File</Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>
                          CSV should include: Name, Phone, School Name, Status
                        </p>
                      </div>
                      <Button
                        onClick={handleImport}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        Import Data
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                      onClick={handleAddDialogOpen}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Driver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Driver</DialogTitle>
                      <DialogDescription>
                        Add a new driver to your fleet.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <PersonForm
                        type="driver"
                        newItem={newItem}
                        setNewItem={setNewItem}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        Add Driver
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search drivers by name, phone, or school..."
                value={driverSearchTerm}
                onChange={(e) => setDriverSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {driversLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading drivers...</p>
              </div>
            ) : (
              <EnhancedTable
                data={filteredDrivers}
                columns={driverColumns}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  showPageSizeSelector: true,
                }}
              />
            )}
          </EnhancedTabsContent>

          <EnhancedTabsContent value="minders" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Minders</h2>
                <p className="text-gray-600">
                  Manage your bus minders and their information
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={isImportDialogOpen}
                  onOpenChange={setIsImportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Import className="w-4 h-4 mr-2" />
                      Import Minders
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Minder Data</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file containing minder information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Need a template?
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadTemplate}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Template
                        </Button>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drop your CSV file here or click to browse
                        </p>
                        <Button variant="outline">Choose File</Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>
                          CSV should include: Name, Phone, School Name, Status
                        </p>
                      </div>
                      <Button
                        onClick={handleImport}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        Import Data
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                      onClick={handleAddDialogOpen}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Minder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Minder</DialogTitle>
                      <DialogDescription>
                        Add a new minder to your fleet.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <PersonForm
                        type="minder"
                        newItem={newItem}
                        setNewItem={setNewItem}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        Add Minder
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search minders by name, phone, or school..."
                value={minderSearchTerm}
                onChange={(e) => setMinderSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {mindersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading minders...</p>
              </div>
            ) : (
              <EnhancedTable
                data={filteredMinders}
                columns={minderColumns}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  showPageSizeSelector: true,
                }}
              />
            )}
          </EnhancedTabsContent>
        </EnhancedTabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Edit{" "}
                {activeTab === "buses"
                  ? "Bus"
                  : activeTab === "drivers"
                  ? "Driver"
                  : "Minder"}
              </DialogTitle>
              <DialogDescription>
                Update the{" "}
                {activeTab === "buses"
                  ? "bus"
                  : activeTab === "drivers"
                  ? "driver"
                  : "minder"}{" "}
                information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              {activeTab === "buses" && (
                <BusForm newItem={newItem} setNewItem={setNewItem} />
              )}

              {(activeTab === "drivers" || activeTab === "minders") && (
                <PersonForm
                  type={activeTab === "drivers" ? "driver" : "minder"}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  isEditing={true}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Update{" "}
                {activeTab === "buses"
                  ? "Bus"
                  : activeTab === "drivers"
                  ? "Driver"
                  : "Minder"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bus Deactivation Dialog */}
        <BusDeactivationDialog
          isOpen={isBusDeactivationDialogOpen}
          onClose={() => {
            setIsBusDeactivationDialogOpen(false);
            setBusToDeactivate(null);
          }}
          busRegistration={busToDeactivate?.registrationNumber || ""}
          onConfirm={handleBusDeactivationConfirm}
        />

        {/* Bus Activation Dialog */}
        <BusActivationDialog
          isOpen={isBusActivationDialogOpen}
          onClose={() => {
            setIsBusActivationDialogOpen(false);
            setBusToActivate(null);
          }}
          busRegistration={busToActivate?.registrationNumber || ""}
          onConfirm={handleBusActivationConfirm}
        />

        {/* Driver Deactivation Dialog */}
        <DriverDeactivationDialog
          isOpen={isDriverDeactivationDialogOpen}
          onClose={() => {
            setIsDriverDeactivationDialogOpen(false);
            setDriverToDeactivate(null);
          }}
          driverName={driverToDeactivate?.name || ""}
          onConfirm={handleDriverDeactivationConfirm}
        />

        {/* Driver Activation Dialog */}
        <DriverActivationDialog
          isOpen={isDriverActivationDialogOpen}
          onClose={() => {
            setIsDriverActivationDialogOpen(false);
            setDriverToActivate(null);
          }}
          driverName={driverToActivate?.name || ""}
          onConfirm={handleDriverActivationConfirm}
        />

        {/* Minder Deactivation Dialog */}
        <MinderDeactivationDialog
          isOpen={isMinderDeactivationDialogOpen}
          onClose={() => {
            setIsMinderDeactivationDialogOpen(false);
            setMinderToDeactivate(null);
          }}
          minderName={minderToDeactivate?.name || ""}
          onConfirm={handleMinderDeactivationConfirm}
        />

        {/* Minder Activation Dialog */}
        <MinderActivationDialog
          isOpen={isMinderActivationDialogOpen}
          onClose={() => {
            setIsMinderActivationDialogOpen(false);
            setMinderToActivate(null);
          }}
          minderName={minderToActivate?.name || ""}
          onConfirm={handleMinderActivationConfirm}
        />
      </div>
    </Layout>
  );
};

export default FleetCrew;
