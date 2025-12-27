import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  School,
  Search,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Globe,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SchoolDeactivationDialog } from "@/components/schools/forms/SchoolDeactivationDialog";
import { SchoolActivationDialog } from "@/components/schools/forms/SchoolActivationDialog";
import { SchoolForm } from "@/components/schools/forms/SchoolForm";
import {
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
  School as SchoolType,
} from "@/services/schoolApi";

interface SchoolData {
  id: string;
  name: string;
  schoolId: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  postalAddress: string | null;
  county: string | null;
  region: string | null;
  schoolType: string | null;
  status: string;
  principalName: string | null;
  principalPhone: string | null;
  principalEmail: string | null;
  totalStudents: number | null;
  totalTeachers: number | null;
  registrationNumber: string | null;
  establishmentDate: string | null;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  locationPin: string | null;
  sslId: string | null;
  customerId: number;
  logo: string | null;
  latitude: string | null;
  longitude: string | null;
  url: string | null;
}

const Schools = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] =
    useState(false);
  const [isActivationDialogOpen, setIsActivationDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolToDeactivate, setSchoolToDeactivate] =
    useState<SchoolData | null>(null);
  const [schoolToActivate, setSchoolToActivate] = useState<SchoolData | null>(
    null
  );

  // Load schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await getSchools();
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to load schools:", error);
      toast({
        title: "Error",
        description: "Failed to load schools. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = async (data: any) => {
    try {
      const schoolData = {
        name: data.schoolName,
        customerId: data.customerId,
        url: data.schoolUrl,
        address: data.schoolAddress,
        longitude: data.longitude || "0",
        latitude: data.latitude || "0",
        principalName: data.principalName,
        principalEmail: data.principalEmail,
        principalPhone: data.principalPhone,
        phoneNumber: data.phoneNumber,
        email: data.emailAddress,
        isActive: data.status === "active",
        logo: data.schoolLogo,
      };

      const response = await createSchool(schoolData);
      setSchools([...schools, response.data]);
      toast({
        title: "School Added!",
        description: `${data.schoolName} has been successfully registered.`,
      });
    } catch (error) {
      console.error("Failed to add school:", error);
      toast({
        title: "Error",
        description: `Failed to add school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditSchool = async (data: any) => {
    try {
      const schoolData = {
        name: data.schoolName,
        customerId: data.customerId,
        url: data.schoolUrl,
        address: data.schoolAddress,
        longitude: data.longitude || "0",
        latitude: data.latitude || "0",
        principalName: data.principalName,
        principalEmail: data.principalEmail,
        principalPhone: data.principalPhone,
        phoneNumber: data.phoneNumber,
        email: data.emailAddress,
        isActive: data.status === "active",
        logo: data.schoolLogo,
      };

      // Check if status is being changed to Inactive
      const currentSchool = schools.find((s) => s.id === data.id);
      if (!schoolData.isActive && currentSchool?.isActive) {
        setSchoolToDeactivate({ ...currentSchool, ...schoolData });
        setIsDeactivationDialogOpen(true);
        return;
      }

      // Check if status is being changed to Active
      if (schoolData.isActive && !currentSchool?.isActive) {
        setSchoolToActivate({ ...currentSchool, ...schoolData });
        setIsActivationDialogOpen(true);
        return;
      }

      // Normal update for other changes
      const response = await updateSchool(data.id, schoolData);
      setSchools(
        schools.map((school) =>
          school.id === data.id ? response.data : school
        )
      );
      toast({
        title: "School Updated!",
        description: `${schoolData.name} has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update school:", error);
      toast({
        title: "Error",
        description: `Failed to update school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeactivationConfirm = async () => {
    if (!schoolToDeactivate) return;

    try {
      const schoolData = {
        name: schoolToDeactivate.name,
        customerId: schoolToDeactivate.customerId,
        url: schoolToDeactivate.url,
        address: schoolToDeactivate.address,
        longitude: schoolToDeactivate.longitude,
        latitude: schoolToDeactivate.latitude,
        principalName: schoolToDeactivate.principalName,
        principalEmail: schoolToDeactivate.principalEmail,
        principalPhone: schoolToDeactivate.principalPhone,
        phoneNumber: schoolToDeactivate.phoneNumber,
        email: schoolToDeactivate.email,
        isActive: false,
        logo: schoolToDeactivate.logo,
      };

      const response = await updateSchool(schoolToDeactivate.id, schoolData);
      setSchools(
        schools.map((school) =>
          school.id === schoolToDeactivate.id ? response.data : school
        )
      );

      setSchoolToDeactivate(null);
      setIsDeactivationDialogOpen(false);
    } catch (error) {
      console.error("Failed to deactivate school:", error);
      toast({
        title: "Error",
        description: `Failed to deactivate school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleActivationConfirm = async () => {
    if (!schoolToActivate) return;

    try {
      const schoolData = {
        name: schoolToActivate.name,
        customerId: schoolToActivate.customerId,
        url: schoolToActivate.url,
        address: schoolToActivate.address,
        longitude: schoolToActivate.longitude,
        latitude: schoolToActivate.latitude,
        principalName: schoolToActivate.principalName,
        principalEmail: schoolToActivate.principalEmail,
        principalPhone: schoolToActivate.principalPhone,
        phoneNumber: schoolToActivate.phoneNumber,
        email: schoolToActivate.email,
        isActive: true,
        logo: schoolToActivate.logo,
      };

      const response = await updateSchool(schoolToActivate.id, schoolData);
      setSchools(
        schools.map((school) =>
          school.id === schoolToActivate.id ? response.data : school
        )
      );

      setSchoolToActivate(null);
      setIsActivationDialogOpen(false);
    } catch (error) {
      console.error("Failed to activate school:", error);
      toast({
        title: "Error",
        description: `Failed to activate school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      await deleteSchool(schoolId);
      const schoolToDelete = schools.find((school) => school.id === schoolId);
      setSchools(schools.filter((school) => school.id !== schoolId));
      toast({
        title: "School Deleted!",
        description: `${schoolToDelete?.name} has been removed from the system.`,
      });
    } catch (error) {
      console.error("Failed to delete school:", error);
      toast({
        title: "Error",
        description: `Failed to delete school: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.principalName &&
        school.principalName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Convert SchoolData to the format expected by SchoolForm
  const convertSchoolForEdit = (school: SchoolData) => ({
    id: school.id,
    schoolLogo: school.logo || "",
    name: school.name,
    customerId: school.customerId,
    schoolUrl: school.url || "",
    address: school.address || "",
    longitude: school.longitude || "",
    latitude: school.latitude || "",
    principalName: school.principalName || "",
    principalEmail: school.principalEmail || "",
    principalPhone: school.principalPhone || "",
    email: school.email || "",
    phone: school.phoneNumber || "",
    status: school.isActive ? "active" : "inactive",
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <School className="w-8 h-8 text-blue-600" />
              Schools
            </h1>
            <p className="text-gray-600 mt-1">
              Register and manage all your schools
            </p>
          </div>

          <SchoolForm onSubmit={handleAddSchool} />
        </div>

        {/* Deactivation Dialog */}
        <SchoolDeactivationDialog
          isOpen={isDeactivationDialogOpen}
          onClose={() => {
            setIsDeactivationDialogOpen(false);
            setSchoolToDeactivate(null);
          }}
          schoolName={schoolToDeactivate?.name || ""}
          onConfirm={handleDeactivationConfirm}
        />

        {/* Activation Dialog */}
        <SchoolActivationDialog
          isOpen={isActivationDialogOpen}
          onClose={() => {
            setIsActivationDialogOpen(false);
            setSchoolToActivate(null);
          }}
          schoolName={schoolToActivate?.name || ""}
          onConfirm={handleActivationConfirm}
        />

        {/* Schools Section */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search schools by name or principal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading schools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchools.map((school) => (
                <Card
                  key={school.id}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all relative ${
                    !school.isActive
                      ? "opacity-60 bg-gray-50 border-l-4 border-l-gray-400"
                      : "bg-white border-l-4 border-l-green-500"
                  }`}
                >
                  {/* Fixed Edit/Delete buttons at top right */}
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <SchoolForm
                      school={convertSchoolForEdit(school)}
                      onSubmit={handleEditSchool}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete School</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{school.name}"?
                            This action cannot be undone and will permanently
                            remove the school from your system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSchool(school.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-start space-y-3">
                      {/* Logo with placeholder - left aligned */}
                      <div
                        className={`w-16 h-16 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 ${
                          !school.isActive ? "bg-gray-200" : "bg-gray-100"
                        }`}
                      >
                        {school.logo ? (
                          <img
                            src={school.logo}
                            alt={`${school.name} logo`}
                            className={`w-full h-full object-cover ${
                              !school.isActive ? "grayscale" : ""
                            }`}
                          />
                        ) : (
                          <School
                            className={`w-8 h-8 ${
                              !school.isActive
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>

                      {/* School name and status - left aligned */}
                      <div className="flex-1">
                        <CardTitle
                          className={`text-xl ${
                            !school.isActive ? "text-gray-600" : "text-gray-800"
                          }`}
                        >
                          {school.name}
                        </CardTitle>
                        {/* Status badge */}
                        <Badge
                          variant={school.isActive ? "default" : "secondary"}
                          className={`mt-2 ${
                            school.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                              : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                          }`}
                        >
                          {school.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {school.url && (
                      <div
                        className={`flex items-center space-x-2 ${
                          !school.isActive ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">{school.url}</span>
                      </div>
                    )}
                    {school.address && (
                      <div
                        className={`flex items-center space-x-2 ${
                          !school.isActive ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{school.address}</span>
                      </div>
                    )}
                    {school.phoneNumber && (
                      <div
                        className={`flex items-center space-x-2 ${
                          !school.isActive ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{school.phoneNumber}</span>
                      </div>
                    )}
                    {school.email && (
                      <div
                        className={`flex items-center space-x-2 ${
                          !school.isActive ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{school.email}</span>
                      </div>
                    )}
                    {school.principalName && (
                      <div
                        className={`flex items-center space-x-2 ${
                          !school.isActive ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">
                          Principal: {school.principalName}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No schools found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start by adding your first school"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Schools;
