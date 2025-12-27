import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSearchableSelect } from "./CustomSearchableSelect";

// Sample school data - replace with actual data fetching
const schoolOptions = [
  { id: 1, name: "Nairobi Primary School" },
  { id: 2, name: "Moi Educational Centre" },
  { id: 3, name: "Braeburn School" },
  { id: 4, name: "Brookhouse School" },
  { id: 5, name: "Hillcrest International School" },
  { id: 6, name: "Alliance High School" },
  { id: 7, name: "Starehe Boys Centre" },
  { id: 8, name: "Kenya High School" },
  { id: 9, name: "Pangani Girls High School" },
  { id: 10, name: "Loreto High School Limuru" },
  { id: 11, name: "Mang'u High School" },
  { id: 12, name: "St. Mary's School Nairobi" },
  { id: 13, name: "International School of Kenya" },
];

// Convert school options to format expected by SearchableSelect
const searchableSchoolOptions = schoolOptions.map(school => ({
  value: school.id.toString(),
  label: school.name
}));

// Generate year options from 2025 to 2040
const yearOptions = Array.from({ length: 16 }, (_, i) => ({
  value: (2025 + i).toString(),
  label: (2025 + i).toString(),
}));

// Term options
const termOptions = [
  { value: "Term 1", label: "Term 1" },
  { value: "Term 2", label: "Term 2" },
  { value: "Term 3", label: "Term 3" },
];

export interface TermData {
  id: number;
  schoolId: number;
  schoolName: string;
  year: string;
  term: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface TermFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (term: TermData) => void;
  existingTerm?: TermData | null;
}

const TermForm = ({ isOpen, onClose, onSave, existingTerm }: TermFormProps) => {
  const [formData, setFormData] = useState<Omit<TermData, "id" | "schoolName">>({
    schoolId: existingTerm?.schoolId || 0,
    year: existingTerm?.year || "2025",
    term: existingTerm?.term || "Term 1",
    startDate: existingTerm?.startDate || null,
    endDate: existingTerm?.endDate || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or existing term changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        schoolId: existingTerm?.schoolId || 0,
        year: existingTerm?.year || "2025",
        term: existingTerm?.term || "Term 1",
        startDate: existingTerm?.startDate || null,
        endDate: existingTerm?.endDate || null,
      });
      setErrors({});
    }
  }, [isOpen, existingTerm]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.schoolId === 0) {
      newErrors.schoolId = "Please select a school";
    }

    if (!formData.year) {
      newErrors.year = "Please select a year";
    }

    if (!formData.term) {
      newErrors.term = "Please select a term";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Please select a start date";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Please select an end date";
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Find the school name from the selected school ID
    const selectedSchool = schoolOptions.find(school => school.id === formData.schoolId);
    const schoolName = selectedSchool ? selectedSchool.name : "Unknown School";

    const termData: TermData = {
      id: existingTerm?.id || Math.floor(Math.random() * 10000), // Generate a random ID for new terms
      schoolId: formData.schoolId,
      schoolName,
      year: formData.year,
      term: formData.term,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    onSave(termData);
    onClose();
    
    toast({
      title: existingTerm ? "Term Updated!" : "Term Added!",
      description: existingTerm 
        ? "Term details have been successfully updated." 
        : "New term has been successfully added.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingTerm ? "Edit Term" : "Add New Term"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="school">School <span className="text-red-500">*</span></Label>
            <CustomSearchableSelect
              options={searchableSchoolOptions}
              value={formData.schoolId.toString()}
              onValueChange={(value) => setFormData({ ...formData, schoolId: parseInt(value) })}
              placeholder="Select a school"
              searchPlaceholder="Search schools..."
              emptyText="No school found."
              hasError={!!errors.schoolId}
            />
            {errors.schoolId && <p className="text-sm text-red-500">{errors.schoolId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
              <Select
                value={formData.year}
                onValueChange={(value) => setFormData({ ...formData, year: value })}
              >
                <SelectTrigger id="year" className={errors.year ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term <span className="text-red-500">*</span></Label>
              <Select
                value={formData.term}
                onValueChange={(value) => setFormData({ ...formData, term: value })}
              >
                <SelectTrigger id="term" className={errors.term ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.term && <p className="text-sm text-red-500">{errors.term}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
              <div className={`relative ${errors.startDate ? "border-red-500 rounded-md" : ""}`}>
                <DatePicker
                  date={formData.startDate}
                  onDateChange={(date) => setFormData({ ...formData, startDate: date || null })}
                  className="w-full"
                />
              </div>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
              <div className={`relative ${errors.endDate ? "border-red-500 rounded-md" : ""}`}>
                <DatePicker
                  date={formData.endDate}
                  onDateChange={(date) => setFormData({ ...formData, endDate: date || null })}
                  className="w-full"
                />
              </div>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              {existingTerm ? "Update Term" : "Add Term"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TermForm;