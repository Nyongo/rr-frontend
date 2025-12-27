import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  EnhancedTabs,
  EnhancedTabsContent,
  EnhancedTabsList,
  EnhancedTabsTrigger,
} from "@/components/ui/enhanced-tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, GraduationCap } from "lucide-react";
import StudentForm from "@/components/parents/forms/StudentForm";
import AddressForm from "@/components/parents/forms/AddressForm";
import StudentsTable from "@/components/parents/components/StudentsTable";
import AddressesList from "@/components/parents/components/AddressesList";
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/services/studentsApi";
import { useParents } from "@/hooks/useParents";
import { Parent } from "@/services/parentsApi";
import { useAddresses } from "@/hooks/useAddresses";
import { Address } from "@/services/addressesApi";

const ParentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");

  // Use the students API hook
  const {
    students,
    loading: studentsLoading,
    fetchStudentsByParent,
  } = useStudents();

  // Use the parents API hook
  const { fetchSingleParent } = useParents();
  const [currentParent, setCurrentParent] = useState<Parent | null>(null);
  const [parentLoading, setParentLoading] = useState(true);

  // Use the addresses API hook
  const {
    addresses,
    loading: addressesLoading,
    fetchAddressesByParent,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();

  // Use real parent data from API, fallback to mock data if loading
  const parent = currentParent || {
    id: id || "",
    name: "Loading...",
    parentType: "Unknown",
    email: "Loading...",
    phoneNumber: "Loading...",
    status: "Loading",
    school: { name: "Loading..." },
  };

  // Fetch parent, students, and addresses when component mounts or parent ID changes
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setParentLoading(true);
          // Fetch parent details
          const parentData = await fetchSingleParent(id);
          setCurrentParent(parentData);

          // Fetch students for this parent
          await fetchStudentsByParent(id);

          // Fetch addresses for this parent
          await fetchAddressesByParent(id);
        } catch (error) {
          console.error(
            "Failed to fetch parent, students, or addresses:",
            error
          );
        } finally {
          setParentLoading(false);
        }
      };

      fetchData();
    }
  }, [id, fetchStudentsByParent, fetchSingleParent, fetchAddressesByParent]); // Functions are now properly memoized

  const handleAddAddress = async (address: any) => {
    try {
      // Convert form data to API format
      const apiData = {
        addressType: address.type || address.addressType,
        location: address.location,
        longitude: parseFloat(address.longitude) || 0,
        latitude: parseFloat(address.latitude) || 0,
        status: address.status || "Active",
        isPrimary: address.isPrimary || false,
        parentId: id || "",
      };

      await addAddress(apiData);

      // Refresh addresses list
      if (id) {
        await fetchAddressesByParent(id);
      }
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  const handleAddStudent = (student: any) => {
    // Refresh students list after adding a new student
    if (id) {
      fetchStudentsByParent(id);
    }
  };

  const handleUpdateAddress = async (updatedAddress: any) => {
    try {
      // Convert form data to API format
      const apiData = {
        addressType: updatedAddress.type || updatedAddress.addressType,
        location: updatedAddress.location,
        longitude: parseFloat(updatedAddress.longitude) || 0,
        latitude: parseFloat(updatedAddress.latitude) || 0,
        status: updatedAddress.status || "Active",
        isPrimary: updatedAddress.isPrimary || false,
      };

      await updateAddress(updatedAddress.id, apiData);

      // Refresh addresses list
      if (id) {
        await fetchAddressesByParent(id);
      }
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);

      // Refresh addresses list
      if (id) {
        await fetchAddressesByParent(id);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "Active" ? "success" : "danger";
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/parents-students")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Parents</span>
          </Button>
        </div>

        {/* Parent Details - Table Style */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Parent Information
            </h2>
          </div>
          <div className="p-6">
            {parentLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Loading parent information...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Parent Name
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {parent.name}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Parent Type
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {parent.parentType}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Phone
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {parent.phoneNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {parent.email}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Students
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {students.length}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    School
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">
                    {parent.school?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">
                    Status
                  </Label>
                  <div className="mt-1">{getStatusBadge(parent.status)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="space-y-6">
          <EnhancedTabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <EnhancedTabsList className="grid-cols-2">
                <EnhancedTabsTrigger
                  value="students"
                  className="flex items-center space-x-2"
                  useCustomGreen={true}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Students</span>
                </EnhancedTabsTrigger>
                <EnhancedTabsTrigger
                  value="addresses"
                  className="flex items-center space-x-2"
                  useCustomGreen={true}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Addresses</span>
                </EnhancedTabsTrigger>
              </EnhancedTabsList>

              {activeTab === "students" && (
                <StudentForm
                  onAddStudent={handleAddStudent}
                  students={students}
                  parentId={id}
                />
              )}

              {activeTab === "addresses" && (
                <AddressForm
                  onAddAddress={handleAddAddress}
                  addresses={addresses}
                />
              )}
            </div>

            <EnhancedTabsContent value="students" className="space-y-4">
              <StudentsTable
                students={students}
                loading={studentsLoading}
              />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="addresses" className="space-y-0">
              <AddressesList
                addresses={addresses}
                onUpdateAddress={handleUpdateAddress}
                onDeleteAddress={handleDeleteAddress}
              />
            </EnhancedTabsContent>
          </EnhancedTabs>
        </div>
      </div>
    </Layout>
  );
};

export default ParentDetails;
