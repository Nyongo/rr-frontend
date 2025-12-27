
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { RouteData } from "../RoutesTab";

interface SchoolTripDetailsFormProps {
  formData: Partial<RouteData>;
  onFormDataChange: (data: Partial<RouteData>) => void;
}

const SchoolTripDetailsForm = ({ formData, onFormDataChange }: SchoolTripDetailsFormProps) => {
  const updateFormData = (updates: Partial<RouteData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const handleTripDateChange = (date: Date | undefined) => {
    updateFormData({
      tripDate: date ? date.toISOString().split('T')[0] : "",
    });
  };

  const getTripDate = () => {
    return formData.tripDate ? new Date(formData.tripDate) : undefined;
  };

  if (formData.tripType !== "Field Trip") {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800">School Trip Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tripDate">Trip Date *</Label>
          <DatePicker
            date={getTripDate()}
            onDateChange={handleTripDateChange}
            placeholder="Select trip date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destinationAddress">Destination Address *</Label>
          <Input
            id="destinationAddress"
            value={formData.destinationAddress}
            onChange={(e) => updateFormData({ destinationAddress: e.target.value })}
            placeholder="e.g., National Museum, City Center"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureTime">Departure Time</Label>
          <TimePicker
            time={formData.departureTime}
            onTimeChange={(time) => updateFormData({ departureTime: time })}
            placeholder="Select departure time"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="returnTime">Return Time</Label>
          <TimePicker
            time={formData.returnTime}
            onTimeChange={(time) => updateFormData({ returnTime: time })}
            placeholder="Select return time"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tripDescription">Trip Description</Label>
        <Input
          id="tripDescription"
          value={formData.tripDescription}
          onChange={(e) => updateFormData({ tripDescription: e.target.value })}
          placeholder="Describe the purpose and activities of this trip"
        />
      </div>
    </div>
  );
};

export default SchoolTripDetailsForm;
