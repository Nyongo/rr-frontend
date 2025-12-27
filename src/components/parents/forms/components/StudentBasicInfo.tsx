import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DateSelect } from "@/components/ui/date-select";
import { useSchools } from "@/hooks/useSchools";

interface StudentData {
  name: string;
  admissionNumber: string;
  schoolName: string;
  schoolId?: string;
  dateOfBirth: Date | null;
  gender: string;
  specialNeeds: string[];
  medicalInformation: string;
  rfidTagId?: string | null;
  status: string;
}

interface StudentBasicInfoProps {
  newStudent: StudentData;
  setNewStudent: (student: StudentData) => void;
}

const StudentBasicInfo = ({
  newStudent,
  setNewStudent,
}: StudentBasicInfoProps) => {
  const { schools, loading: schoolsLoading } = useSchools();

  // Debug: Log when props change
  React.useEffect(() => {
    if (newStudent.name) {
      console.log("StudentBasicInfo: Received newStudent props", {
        name: newStudent.name,
        admissionNumber: newStudent.admissionNumber,
        schoolId: newStudent.schoolId,
        gender: newStudent.gender,
        dateOfBirth: newStudent.dateOfBirth,
      });
    }
  }, [newStudent.name, newStudent.admissionNumber, newStudent.schoolId, newStudent.gender, newStudent.dateOfBirth]);

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="studentName">
          Student Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="studentName"
          placeholder="Enter student's full name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admissionNumber">
          Admission Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="admissionNumber"
          placeholder="e.g., STU2024001"
          value={newStudent.admissionNumber}
          onChange={(e) =>
            setNewStudent({ ...newStudent, admissionNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolId">
          School Name <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={schoolOptions}
          value={newStudent.schoolId || ""}
          onValueChange={(value) => {
            const selectedSchool = schools.find(
              (school) => school.id === value
            );
            setNewStudent({
              ...newStudent,
              schoolId: value,
              schoolName: selectedSchool?.name || "",
            });
          }}
          placeholder={
            schoolsLoading ? "Loading schools..." : "Select a school"
          }
          searchPlaceholder="Search schools..."
          emptyText="No school found."
          disabled={schoolsLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <DateSelect
          value={newStudent.dateOfBirth}
          onChange={(date) =>
            setNewStudent({ ...newStudent, dateOfBirth: date })
          }
          minYear={1900}
          maxYear={new Date().getFullYear() - 2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">
          Gender <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newStudent.gender}
          onValueChange={(value) =>
            setNewStudent({ ...newStudent, gender: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={newStudent.status}
          onValueChange={(value) =>
            setNewStudent({ ...newStudent, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudentBasicInfo;
