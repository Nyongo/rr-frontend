import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Plus, UserPlus } from "lucide-react";
import { RouteData, StudentInRoute } from "../RoutesTab";
import StudentRouteList from "../StudentRouteList";
import StudentSelectionDialog from "./StudentSelectionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addStudentsToRoute as addStudentsToRouteAPI,
  removeStudentFromRoute,
  getRouteStudents,
  BulkStudentsRequest,
  RouteStudentDetail,
} from "@/services/routesApi";
import { toast } from "@/hooks/use-toast";
import { calculateAge } from "@/lib/utils";

interface RouteStudentsSectionProps {
  formData: Partial<RouteData>;
  onFormDataChange: (data: Partial<RouteData>) => void;
  mockStudents: Array<{
    id: number;
    name: string;
    photo: string;
    admissionNumber: string;
    age: number;
    gender: "Male" | "Female";
    _originalStudentId?: string;
  }>;
  routeId?: string; // Optional route ID for existing routes
}

/**
 * RouteStudentsSection Component
 *
 * 🔥 EXTERNAL API BEHAVIOR:
 * - When routeId exists (editing existing route): Makes EXTERNAL API calls for all operations
 * - When routeId is undefined (creating new route): Only updates local form state
 *
 * APIs Used:
 * - GET /routes/{routeId}/students?riderType=DAILY - for loading daily riders tab
 * - GET /routes/{routeId}/students?riderType=OCCASIONAL - for loading occasional riders tab
 * - POST /routes/{routeId}/students/bulk - for adding students
 * - DELETE /routes/{routeId}/students/{studentId} - for removing students
 *
 * 📊 TAB BEHAVIOR & EVENTS:
 * - DEFAULT TAB: Always defaults to "daily" tab first
 * - MOUNT BEHAVIOR: On component mount, automatically loads DAILY riders if routeId exists
 * - TAB CHANGE EVENTS: handleTabChange() listens to tab switches and loads data accordingly
 * - CACHING: Once data is loaded for a tab, it's cached (no re-fetch on tab switch)
 * - COUNTS: Tab badges show real-time counts from API data
 *
 * 🔄 EVENT FLOW:
 * 1. Component mounts → activeTab = "daily" → loads DAILY data
 * 2. User clicks "Occasional" → handleTabChange("occasional") → loads OCCASIONAL data
 * 3. User clicks "Daily" → handleTabChange("daily") → uses cached DAILY data
 */
const RouteStudentsSection = ({
  formData,
  onFormDataChange,
  mockStudents,
  routeId,
}: RouteStudentsSectionProps) => {
  // 🚨 CRITICAL DEBUG: Verify routeId is being received correctly
  console.log(
    "🔍 RouteStudentsSection received routeId:",
    routeId,
    "type:",
    typeof routeId,
    "exists:",
    !!routeId
  );
  console.log("🔍 RouteStudentsSection received props:", {
    formData: !!formData,
    mockStudents: mockStudents?.length || 0,
    routeId,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingStudents, setIsAddingStudents] = useState(false);
  const [isRemovingStudent, setIsRemovingStudent] = useState(false);
  const [loadingDailyRiders, setLoadingDailyRiders] = useState(false);
  const [loadingOccasionalRiders, setLoadingOccasionalRiders] = useState(false);
  const [dailyRidersFromAPI, setDailyRidersFromAPI] = useState<
    StudentInRoute[]
  >([]);
  const [occasionalRidersFromAPI, setOccasionalRidersFromAPI] = useState<
    StudentInRoute[]
  >([]);

  const isPickupRoute = formData.tripType === "Morning Pickup";
  const isDropOffRoute =
    formData.tripType === "Midday Drop Off" ||
    formData.tripType === "Afternoon Drop Off";

  const updateFormData = useCallback(
    (updates: Partial<RouteData>) => {
      onFormDataChange({ ...formData, ...updates });
    },
    [formData, onFormDataChange]
  );

  // Convert API route student format to UI StudentInRoute format
  const convertRouteStudentDetailToStudentInRoute = useCallback(
    (routeStudent: RouteStudentDetail): StudentInRoute => {
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
        expectedPickupTime: isPickupRoute ? "07:30" : undefined,
        expectedDropOffTime:
          formData.tripType === "Midday Drop Off" ||
          formData.tripType === "Afternoon Drop Off"
            ? "15:30"
            : undefined,
        fingerprintStatus: "not scanned",
        isHidden: false,
        riderType: routeStudent.riderType.toLowerCase() as
          | "daily"
          | "occasional",
        // Store the actual student UUID for API operations
        _originalStudentId: routeStudent.studentId,
        parentName: routeStudent.student.parent?.name,
        parentPhone: routeStudent.student.parent?.phoneNumber,
        dateOfBirth: routeStudent.student.dateOfBirth,
      };
    },
    [formData.tripType, isPickupRoute]
  );

  // Load filtered students by rider type from API
  const loadFilteredStudents = useCallback(
    async (riderType: "DAILY" | "OCCASIONAL") => {
      if (!routeId) return; // Only load for existing routes

      const isDaily = riderType === "DAILY";
      const setLoading = isDaily
        ? setLoadingDailyRiders
        : setLoadingOccasionalRiders;
      const setStudents = isDaily
        ? setDailyRidersFromAPI
        : setOccasionalRidersFromAPI;

      console.log(
        `🚀 Making FILTERED API call: GET /routes/${routeId}/students?riderType=${riderType}`
      );
      setLoading(true);

      try {
        // 🔥 FILTERED API CALL with riderType parameter
        const response = await getRouteStudents(routeId, riderType);
        console.log(`📥 API Response for ${riderType} filter:`, response);

        if (response.success) {
          const convertedStudents = response.data.map(
            convertRouteStudentDetailToStudentInRoute
          );
          setStudents(convertedStudents);
          console.log(
            `✅ Successfully loaded ${convertedStudents.length} ${riderType} riders via FILTERED API call`
          );
        }
      } catch (error) {
        console.error(`❌ Failed to load ${riderType} riders:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${riderType.toLowerCase()} riders`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [routeId, convertRouteStudentDetailToStudentInRoute]
  );

  const addStudentsToRoute = useCallback(
    async (
      students: Array<{
        id: number;
        name: string;
        photo: string;
        admissionNumber: string;
        age: number;
        gender: "Male" | "Female";
        _originalStudentId?: string;
      }>,
      riderType: "daily" | "occasional"
    ) => {
      // If we have a routeId, call the EXTERNAL API to add students to the route
      if (routeId) {
        console.log(
          `🚀 Making EXTERNAL API call to add ${students.length} students to route ${routeId}`
        );
        setIsAddingStudents(true);

        try {
          const bulkRequest: BulkStudentsRequest = {
            students: students.map((student) => ({
              studentId: student._originalStudentId || student.id.toString(), // Use UUID if available
              riderType: riderType.toUpperCase() as "DAILY" | "OCCASIONAL", // Convert to uppercase for API
            })),
          };

          console.log("📤 Sending bulk request to API:", bulkRequest);

          // 🔥 EXTERNAL API CALL - Adding students to route
          const response = await addStudentsToRouteAPI(routeId, bulkRequest);

          console.log("📥 API Response received:", response);

          if (response.success) {
            // Create local student objects for immediate UI update
            const newStudents: StudentInRoute[] = students.map((student) => {
              // Ensure _originalStudentId is always set - it's required for API calls
              const originalStudentId = student._originalStudentId || student.id.toString();
              if (!originalStudentId) {
                console.error("⚠️ Student missing both _originalStudentId and id:", student);
                throw new Error(`Student ${student.name} is missing a valid ID`);
              }
              
              return {
              id: student.id,
              photo: student.photo,
              studentName: student.name,
              admissionNumber: student.admissionNumber,
              age: student.age,
              gender: student.gender,
              expectedPickupTime: isPickupRoute ? "07:30" : undefined,
              expectedDropOffTime: isDropOffRoute ? "15:30" : undefined,
              fingerprintStatus: "not scanned",
              isHidden: false,
              riderType: riderType,
                _originalStudentId: originalStudentId, // Always ensure we have a valid ID
              };
            });

            updateFormData({
              students: [...(formData.students || []), ...newStudents],
            });

            // Update the API-loaded data as well to keep tabs in sync
            if (riderType === "daily") {
              setDailyRidersFromAPI((prev) => [...prev, ...newStudents]);
            } else {
              setOccasionalRidersFromAPI((prev) => [...prev, ...newStudents]);
            }

            // Show success message
            console.log(
              `✅ Successfully added ${response.data.totalSuccessful} students via EXTERNAL API`
            );
            toast({
              title: "✅ API Success",
              description: `${response.data.totalSuccessful} student(s) added to route via external API!`,
            });

            // Show any failures if they occurred
            if (response.data.totalFailed > 0) {
              console.log(
                `⚠️ ${response.data.totalFailed} students failed to add via API`
              );
              toast({
                title: "⚠️ Partial API Success",
                description: `${response.data.totalFailed} student(s) could not be added via API. Please check if they are already on this route.`,
                variant: "destructive",
              });
            }
          } else {
            console.error(
              "❌ API call failed - response not successful:",
              response
            );
            toast({
              title: "❌ API Error",
              description: "External API call failed to add students to route",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(
            "❌ EXTERNAL API ERROR - Failed to add students to route:",
            error
          );
          toast({
            title: "❌ External API Error",
            description:
              error instanceof Error
                ? `API Error: ${error.message}`
                : "Failed to add students to route via external API",
            variant: "destructive",
          });
        } finally {
          setIsAddingStudents(false);
        }
      } else {
        console.log(
          "📋 Local state update only - no EXTERNAL API call (new route without routeId)"
        );
        // For new routes (no routeId), just update local form state
        const newStudents: StudentInRoute[] = students.map((student) => {
          // Ensure _originalStudentId is always set - it's required for API calls
          const originalStudentId = student._originalStudentId || student.id.toString();
          if (!originalStudentId) {
            console.error("⚠️ Student missing both _originalStudentId and id:", student);
            throw new Error(`Student ${student.name} is missing a valid ID`);
          }
          
          return {
          id: student.id,
          photo: student.photo,
          studentName: student.name,
          admissionNumber: student.admissionNumber,
          age: student.age,
          gender: student.gender,
          expectedPickupTime: isPickupRoute ? "07:30" : undefined,
          expectedDropOffTime: isDropOffRoute ? "15:30" : undefined,
          fingerprintStatus: "not scanned",
          isHidden: false, // Ensure new students are not hidden by default
          riderType: riderType, // Set the rider type (daily or occasional)
            _originalStudentId: originalStudentId, // Always ensure we have a valid ID
          };
        });

        updateFormData({
          students: [...(formData.students || []), ...newStudents],
        });
      }
    },
    [formData.students, isPickupRoute, isDropOffRoute, updateFormData, routeId]
  );

  const removeStudentFromRouteHandler = useCallback(
    async (studentToRemove: StudentInRoute) => {
      // If we have a routeId, call the EXTERNAL API to remove the student from the route
      if (routeId) {
        console.log(
          `🚀 Making EXTERNAL API call to remove student ${studentToRemove.studentName} from route ${routeId}`
        );
        setIsRemovingStudent(true);

        try {
          // Use the original student UUID if available, otherwise convert the numeric ID
          const studentIdToRemove =
            studentToRemove._originalStudentId || studentToRemove.id.toString();

          console.log(
            "📤 Sending remove request to API for student ID:",
            studentIdToRemove
          );

          // 🔥 EXTERNAL API CALL - Removing student from route
          const response = await removeStudentFromRoute(
            routeId,
            studentIdToRemove
          );

          console.log("📥 Remove API Response received:", response);

          if (response.success && response.data.count > 0) {
            // Remove student from local state
            const updatedStudents = (formData.students || []).filter(
              (student) => student.id !== studentToRemove.id
            );
            updateFormData({
              students: updatedStudents,
            });

            // Update the API-loaded data as well to keep tabs in sync
            if (studentToRemove.riderType === "daily") {
              setDailyRidersFromAPI((prev) =>
                prev.filter((s) => s.id !== studentToRemove.id)
              );
            } else {
              setOccasionalRidersFromAPI((prev) =>
                prev.filter((s) => s.id !== studentToRemove.id)
              );
            }

            // Show success message
            console.log(
              `✅ Successfully removed student ${studentToRemove.studentName} via EXTERNAL API`
            );
            toast({
              title: "✅ API Success",
              description: `${studentToRemove.studentName} has been removed from the route via external API.`,
            });
          } else {
            console.error(
              "❌ API call failed - student could not be removed:",
              response
            );
            toast({
              title: "❌ API Error",
              description:
                "Student could not be removed from the route via external API.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(
            "❌ EXTERNAL API ERROR - Failed to remove student from route:",
            error
          );
          toast({
            title: "❌ External API Error",
            description:
              error instanceof Error
                ? `API Error: ${error.message}`
                : "Failed to remove student from route via external API",
            variant: "destructive",
          });
        } finally {
          setIsRemovingStudent(false);
        }
      } else {
        console.log(
          "📋 Local state update only - no EXTERNAL API call for removal (new route without routeId)"
        );
        // For new routes (no routeId), just update local form state
        const updatedStudents = (formData.students || []).filter(
          (student) => student.id !== studentToRemove.id
        );
        updateFormData({
          students: updatedStudents,
        });
      }
    },
    [formData.students, updateFormData, routeId]
  );

  const updateStudentsOrder = useCallback(
    (newStudents: StudentInRoute[]) => {
      console.log("updateStudentsOrder called with:", newStudents);
      updateFormData({
        students: newStudents,
      });
    },
    [updateFormData]
  );

  const getExcludedStudentIds = useCallback(() => {
    return formData.students?.map((s) => s.id) || [];
  }, [formData.students]);

  // Use API-loaded data when available (for existing routes), otherwise filter from local state
  const dailyRiders = routeId
    ? dailyRidersFromAPI
    : (formData.students || []).filter(
        (student) => student.riderType === "daily"
      );

  const occasionalRiders = routeId
    ? occasionalRidersFromAPI
    : (formData.students || []).filter(
        (student) => student.riderType === "occasional"
      );

  // Always default to 'daily' tab first, then we'll load data and adjust if needed
  const [activeTab, setActiveTab] = useState<string>("daily");

  // Handle tab changes and load data accordingly
  // 🔥 USES FILTERED API CALLS:
  // - Daily tab: GET /routes/{id}/students?riderType=DAILY
  // - Occasional tab: GET /routes/{id}/students?riderType=OCCASIONAL
  const handleTabChange = useCallback(
    (newTab: string) => {
      console.log(`🔄 Tab changed to: ${newTab}`);
      setActiveTab(newTab);

      if (routeId) {
        if (newTab === "daily") {
          console.log(
            `📊 Daily tab selected - Current daily riders: ${dailyRidersFromAPI.length}`
          );
          if (dailyRidersFromAPI.length === 0) {
            console.log("🚀 Loading DAILY riders from API");
            loadFilteredStudents("DAILY"); // 🔥 API: ?riderType=DAILY
          } else {
            console.log("✅ Daily riders already loaded, using cached data");
          }
        } else if (newTab === "occasional") {
          console.log(
            `📊 Occasional tab selected - Current occasional riders: ${occasionalRidersFromAPI.length}`
          );
          if (occasionalRidersFromAPI.length === 0) {
            console.log("🚀 Loading OCCASIONAL riders from API");
            loadFilteredStudents("OCCASIONAL"); // 🔥 API: ?riderType=OCCASIONAL
          } else {
            console.log(
              "✅ Occasional riders already loaded, using cached data"
            );
          }
        }
      } else {
        console.log("📋 No routeId - using local form data only");
      }
    },
    [
      routeId,
      dailyRidersFromAPI.length,
      occasionalRidersFromAPI.length,
      loadFilteredStudents,
    ]
  );

  // Load initial data for the default tab (DAILY) when component mounts
  // 🔥 USES FILTERED API CALLS on component mount - ALWAYS loads DAILY first
  useEffect(() => {
    console.log(
      `🏗️ RouteStudentsSection mounted - routeId: ${routeId}, activeTab: ${activeTab}`
    );
    if (routeId) {
      console.log(
        "🚀 Component mounted with routeId - Loading DAILY riders by default for route:",
        routeId
      );
      // Always load DAILY riders first since we default to daily tab
      loadFilteredStudents("DAILY"); // 🔥 API: GET /routes/{id}/students?riderType=DAILY
    } else {
      console.log(
        "📋 Component mounted without routeId - using local form data only"
      );
    }
  }, [routeId, loadFilteredStudents]); // Removed activeTab dependency to avoid re-running

  // Debug: Log state changes
  useEffect(() => {
    console.log(
      `📊 State update - Daily: ${dailyRidersFromAPI.length}, Occasional: ${occasionalRidersFromAPI.length}, Active Tab: ${activeTab}`
    );
  }, [dailyRidersFromAPI.length, occasionalRidersFromAPI.length, activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Students on Route
        </h3>
        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          variant="outline"
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={isAddingStudents || isRemovingStudent}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isAddingStudents ? "Adding Students..." : "Add Students"}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            Daily Riders{" "}
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {routeId ? dailyRidersFromAPI.length : dailyRiders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="occasional" className="flex items-center gap-2">
            Occasional Riders{" "}
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {routeId
                ? occasionalRidersFromAPI.length
                : occasionalRiders.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          {loadingDailyRiders ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
              <p className="text-gray-600">Loading daily riders...</p>
              <p className="text-sm text-gray-500">
                🔥 API Call: GET /routes/{routeId}/students?riderType=DAILY
              </p>
            </div>
          ) : dailyRiders.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                No daily riders added to this route yet
              </p>
              <p className="text-sm text-gray-500">
                Use the "Add Students" button above to add daily riders
              </p>
            </div>
          ) : (
            <StudentRouteList
              students={dailyRiders}
              onUpdateStudents={(newStudents) => {
                // Preserve the rider type when updating
                const updatedStudents = [...(formData.students || [])];
                // Remove all daily riders
                const nonDailyRiders = updatedStudents.filter(
                  (student) => student.riderType !== "daily"
                );
                // Add back the updated daily riders
                updateFormData({
                  students: [...nonDailyRiders, ...newStudents],
                });
              }}
              onRemoveStudent={removeStudentFromRouteHandler}
              isPickupRoute={isPickupRoute}
              isDropOffRoute={isDropOffRoute}
              key={`daily-list-${dailyRiders.length}`}
            />
          )}
        </TabsContent>

        <TabsContent value="occasional" className="mt-0">
          {loadingOccasionalRiders ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
              <p className="text-gray-600">Loading occasional riders...</p>
              <p className="text-sm text-gray-500">
                🔥 API Call: GET /routes/{routeId}/students?riderType=OCCASIONAL
              </p>
            </div>
          ) : occasionalRiders.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                No occasional riders added to this route yet
              </p>
              <p className="text-sm text-gray-500">
                Use the "Add Students" button above to add occasional riders
              </p>
            </div>
          ) : (
            <StudentRouteList
              students={occasionalRiders}
              onUpdateStudents={(newStudents) => {
                // Preserve the rider type when updating
                const updatedStudents = [...(formData.students || [])];
                // Remove all occasional riders
                const nonOccasionalRiders = updatedStudents.filter(
                  (student) => student.riderType !== "occasional"
                );
                // Add back the updated occasional riders
                updateFormData({
                  students: [...nonOccasionalRiders, ...newStudents],
                });
              }}
              onRemoveStudent={removeStudentFromRouteHandler}
              isPickupRoute={isPickupRoute}
              isDropOffRoute={isDropOffRoute}
              key={`occasional-list-${occasionalRiders.length}`}
            />
          )}
        </TabsContent>
      </Tabs>

      <StudentSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        students={mockStudents}
        excludeStudentIds={getExcludedStudentIds()}
        onAddStudents={addStudentsToRoute}
      />
    </div>
  );
};

export default RouteStudentsSection;
