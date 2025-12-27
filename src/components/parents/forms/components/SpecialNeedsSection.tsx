
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { specialNeedsOptions } from "../data/studentFormData";

interface SpecialNeedsSectionProps {
  specialNeeds: string[];
  onSpecialNeedsChange: (needId: string, checked: boolean) => void;
}

const SpecialNeedsSection = ({ specialNeeds, onSpecialNeedsChange }: SpecialNeedsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Special Needs</Label>
      <div className="grid grid-cols-2 gap-3 p-4 border rounded-md">
        {specialNeedsOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={specialNeeds.includes(option.id)}
              onCheckedChange={(checked) => 
                onSpecialNeedsChange(option.id, checked as boolean)
              }
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor={option.id} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Select all applicable special needs. Leave unchecked if none apply.
      </p>
    </div>
  );
};

export default SpecialNeedsSection;
