import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { RouteData } from "../RoutesTab";

interface RouteBasicInfoFormProps {
  formData: Partial<RouteData>;
  onFormDataChange: (data: Partial<RouteData>) => void;
  schoolOptions: { value: string; label: string; id: string }[];
  onSchoolChange: (schoolName: string) => void;
  schoolsLoading: boolean;
  busOptions: { value: string; label: string }[];
  busesLoading: boolean;
  driverOptions: { value: string; label: string }[];
  driversLoading: boolean;
  minderOptions: { value: string; label: string }[];
  mindersLoading: boolean;
}

const RouteBasicInfoForm = ({
  formData,
  onFormDataChange,
  schoolOptions,
  onSchoolChange,
  schoolsLoading,
  busOptions = [],
  busesLoading,
  driverOptions = [],
  driversLoading,
  minderOptions = [],
  mindersLoading,
}: RouteBasicInfoFormProps) => {
  const updateFormData = (updates: Partial<RouteData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const isFieldTrip = formData.tripType === "Field Trip";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="routeName">Route Name *</Label>
          <Input
            id="routeName"
            value={formData.routeName}
            onChange={(e) => updateFormData({ routeName: e.target.value })}
            placeholder="e.g., Route A - Downtown"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name *</Label>
          <SearchableSelect
            options={schoolOptions}
            value={formData.schoolName}
            onValueChange={onSchoolChange}
            placeholder={
              schoolsLoading
                ? "Loading schools..."
                : "Search and select a school"
            }
            searchPlaceholder="Search schools..."
            emptyText={
              schoolsLoading ? "Loading schools..." : "No school found."
            }
            disabled={schoolsLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tripType">Trip Type *</Label>
          <Select
            value={formData.tripType}
            onValueChange={(value: any) => updateFormData({ tripType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning Pickup">Morning Pickup</SelectItem>
              <SelectItem value="Evening Drop Off">Evening Drop Off</SelectItem>
              <SelectItem value="Field Trip">Field Trip</SelectItem>
              <SelectItem value="Extra Curriculum">Extra Curriculum</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => updateFormData({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="busId">Bus (Optional)</Label>
          <Select
            value={formData.busId || "none"}
            onValueChange={(value: string) =>
              updateFormData({ busId: value === "none" ? null : value })
            }
            disabled={busesLoading || busOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  busesLoading
                    ? "Loading buses..."
                    : busOptions.length === 0
                    ? "No buses available for selected school"
                    : "Select a bus (optional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {busOptions.map((bus) => (
                <SelectItem key={bus.value} value={bus.value}>
                  {bus.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {busOptions.length === 0 && formData.schoolName && !busesLoading && (
            <p className="text-xs text-gray-500 mt-1">
              No active buses available for the selected school.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverId">Driver (Optional)</Label>
          <Select
            value={formData.driverId || "none"}
            onValueChange={(value: string) =>
              updateFormData({ driverId: value === "none" ? null : value })
            }
            disabled={driversLoading || driverOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  driversLoading
                    ? "Loading drivers..."
                    : driverOptions.length === 0
                    ? "No drivers available for selected school"
                    : "Select a driver (optional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {driverOptions.map((driver) => (
                <SelectItem key={driver.value} value={driver.value}>
                  {driver.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {driverOptions.length === 0 && formData.schoolName && !driversLoading && (
            <p className="text-xs text-gray-500 mt-1">
              No drivers available for the selected school.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minderId">Minder (Optional)</Label>
          <Select
            value={formData.minderId || "none"}
            onValueChange={(value: string) =>
              updateFormData({ minderId: value === "none" ? null : value })
            }
            disabled={mindersLoading || minderOptions.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  mindersLoading
                    ? "Loading minders..."
                    : minderOptions.length === 0
                    ? "No minders available for selected school"
                    : "Select a minder (optional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {minderOptions.map((minder) => (
                <SelectItem key={minder.value} value={minder.value}>
                  {minder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {minderOptions.length === 0 && formData.schoolName && !mindersLoading && (
            <p className="text-xs text-gray-500 mt-1">
              No minders available for the selected school.
            </p>
          )}
        </div>
      </div>

      {!isFieldTrip && (
        <div className="space-y-2">
          <Label htmlFor="routeDescription">Route Description</Label>
          <Input
            id="routeDescription"
            value={formData.routeDescription}
            onChange={(e) =>
              updateFormData({ routeDescription: e.target.value })
            }
            placeholder="Optional description of the route"
          />
        </div>
      )}
    </>
  );
};

export default RouteBasicInfoForm;
