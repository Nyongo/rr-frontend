import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PhotoUploadSection from "../forms/components/PhotoUploadSection";
import StudentBasicInfo from "../forms/components/StudentBasicInfo";
import SpecialNeedsSection from "../forms/components/SpecialNeedsSection";
import { specialNeedsOptions } from "../forms/data/studentFormData";
import { Student as StudentType } from "@/services/studentsApi";
import { useStudents } from "@/hooks/useStudents";
import { UpdateStudentRequest } from "@/services/studentsApi";

// Support both API Student type and legacy format
type Student = StudentType | {
  id: number | string;
  photo?: string | null;
  name: string;
  admissionNumber: string;
  schoolName?: string;
  school?: { id: string; name: string };
  dateOfBirth: string;
  gender: string;
  specialNeeds?: string | string[];
  medicalInformation?: string;
  medicalInfo?: string;
  rfidTagId?: string | null;
  status: string;
};

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedStudent: Student) => void;
}

// Helper function to parse student data into form format
const parseStudentToFormData = (student: Student | null) => {
  if (!student) {
    return {
      name: "",
      admissionNumber: "",
      schoolId: "",
      schoolName: "",
      dateOfBirth: null as Date | null,
      gender: "",
      specialNeeds: [] as string[],
      medicalInformation: "",
      rfidTagId: null as string | null,
      status: "Active",
    };
  }

  // Parse special needs - handle both array and string formats
  let specialNeedsArray: string[] = [];
  if ('specialNeeds' in student) {
    if (Array.isArray(student.specialNeeds)) {
      // Convert labels to IDs
      specialNeedsArray = student.specialNeeds.map(need => {
        const option = specialNeedsOptions.find(opt => opt.label === need);
        return option ? option.id : need;
      });
    } else if (typeof student.specialNeeds === 'string' && student.specialNeeds !== "None") {
      specialNeedsArray = student.specialNeeds.split(", ").map(need => {
        const option = specialNeedsOptions.find(opt => opt.label === need.trim());
        return option ? option.id : need.trim();
      });
    }
  }

  // Get school info
  const schoolId = 'school' in student && student.school ? student.school.id : "";
  const schoolName = 'school' in student && student.school 
    ? student.school.name 
    : 'schoolName' in student && student.schoolName 
      ? student.schoolName 
      : "";

  // Get medical info
  const medicalInfo = 'medicalInfo' in student && student.medicalInfo
    ? student.medicalInfo
    : 'medicalInformation' in student && student.medicalInformation
      ? student.medicalInformation
      : "";

  // Parse date of birth - handle various date formats
  let dateOfBirth: Date | null = null;
  if (student.dateOfBirth) {
    const parsedDate = new Date(student.dateOfBirth);
    if (!isNaN(parsedDate.getTime())) {
      dateOfBirth = parsedDate;
    }
  }

  return {
    name: student.name || "",
    admissionNumber: student.admissionNumber || "",
    schoolId: schoolId,
    schoolName: schoolName,
    dateOfBirth: dateOfBirth,
    gender: student.gender || "",
    specialNeeds: specialNeedsArray,
    medicalInformation: medicalInfo,
    rfidTagId: 'rfidTagId' in student ? student.rfidTagId : null,
    status: student.status || "Active",
  };
};

const EditStudentDialog = ({ student, isOpen, onClose, onSave }: EditStudentDialogProps) => {
  const { updateStudent, refetch } = useStudents();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize state - will be populated when dialog opens
  const [editedStudent, setEditedStudent] = useState({
    name: "",
    admissionNumber: "",
    schoolId: "",
    schoolName: "",
    dateOfBirth: null as Date | null,
    gender: "",
    specialNeeds: [] as string[],
    medicalInformation: "",
    rfidTagId: null as string | null,
    status: "Active",
  });

  // Update form when student changes or dialog opens
  useEffect(() => {
    if (student && isOpen) {
      const formData = parseStudentToFormData(student);
      console.log("EditStudentDialog: Populating form", {
        studentId: student.id,
        studentName: student.name,
        formData: JSON.parse(JSON.stringify(formData)), // Deep clone for logging
        isOpen
      });
      
      // Always update state to ensure form is populated
      setEditedStudent(formData);
      console.log("EditStudentDialog: State updated", formData);
      
      const photo = 'photo' in student ? (student.photo || "") : "";
      setPhotoPreview(photo);
    } else if (!isOpen) {
      // Reset form when dialog closes
      setEditedStudent({
        name: "",
        admissionNumber: "",
        schoolId: "",
        schoolName: "",
        dateOfBirth: null,
        gender: "",
        specialNeeds: [],
        medicalInformation: "",
        rfidTagId: null,
        status: "Active",
      });
      setPhotoPreview("");
    }
  }, [student?.id, isOpen]); // Use student.id to detect student changes

  // Debug: Log when editedStudent changes
  useEffect(() => {
    if (editedStudent.name) {
      console.log("EditStudentDialog: editedStudent state changed", editedStudent);
    }
  }, [editedStudent]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview("");
  };

  const handleSpecialNeedsChange = (needId: string, checked: boolean) => {
    if (checked) {
      setEditedStudent({ 
        ...editedStudent, 
        specialNeeds: [...editedStudent.specialNeeds, needId] 
      });
    } else {
      setEditedStudent({ 
        ...editedStudent, 
        specialNeeds: editedStudent.specialNeeds.filter(id => id !== needId) 
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSaving(true);

    try {
      // Convert special needs IDs to labels for API
      const specialNeedsLabels = editedStudent.specialNeeds.map((id) => {
        const option = specialNeedsOptions.find((opt) => opt.id === id);
        return option ? option.label : id;
      });

      // Prepare API update data
      const studentId = typeof student.id === 'string' ? student.id : student.id.toString();
      const updateData: UpdateStudentRequest = {
        name: editedStudent.name,
        admissionNumber: editedStudent.admissionNumber,
        dateOfBirth: editedStudent.dateOfBirth
          ? format(editedStudent.dateOfBirth, "yyyy-MM-dd")
          : "",
        gender: editedStudent.gender as "Male" | "Female",
        status: editedStudent.status || "Active",
        isActive: editedStudent.status === "Active" ? true : false,
        specialNeeds: specialNeedsLabels.length > 0 ? specialNeedsLabels : undefined,
        medicalInfo: editedStudent.medicalInformation || undefined,
        rfidTagId: editedStudent.rfidTagId || null,
        schoolId: editedStudent.schoolId || ('school' in student && student.school ? student.school.id : ""),
      };

      // Call API to update student
      await updateStudent(studentId, updateData);

      // Refetch students to get updated data
      await refetch();

      // Call legacy callback if provided
      if (onSave) {
        const updatedStudent = {
          ...student,
          name: editedStudent.name,
          admissionNumber: editedStudent.admissionNumber,
          dateOfBirth: editedStudent.dateOfBirth ? format(editedStudent.dateOfBirth, "yyyy-MM-dd") : "",
          gender: editedStudent.gender,
          specialNeeds: specialNeedsLabels.length > 0 ? specialNeedsLabels.join(", ") : "None",
          medicalInformation: editedStudent.medicalInformation,
          status: editedStudent.status,
        };
        onSave(updatedStudent);
      }

      onClose();
      
      toast({
        title: "Student Updated!",
        description: "Student details have been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update student:", error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogDescription>
            Update the student information below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4" key={`edit-form-${typeof student?.id === 'string' ? student.id : student?.id || 'new'}-${editedStudent.name || 'empty'}`}>
          <PhotoUploadSection
            photoPreview={photoPreview}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
          />

          <StudentBasicInfo
            key={`student-basic-info-${student?.id || 'new'}-${editedStudent.name || 'empty'}-${editedStudent.admissionNumber || 'empty'}`}
            newStudent={editedStudent}
            setNewStudent={setEditedStudent}
          />
          
          <SpecialNeedsSection
            specialNeeds={editedStudent.specialNeeds}
            onSpecialNeedsChange={handleSpecialNeedsChange}
          />

          <div className="space-y-2">
            <Label htmlFor="medicalInformation">Medical Information</Label>
            <Textarea
              id="medicalInformation"
              placeholder="Allergies, conditions, medications, etc. (Optional)"
              value={editedStudent.medicalInformation}
              onChange={(e) => setEditedStudent({ ...editedStudent, medicalInformation: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfidTagId">
              RFID Tag ID
            </Label>
            <Input
              id="rfidTagId"
              placeholder="Enter RFID tag ID (Optional)"
              value={editedStudent.rfidTagId || ""}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  rfidTagId: e.target.value || null,
                })
              }
            />
            <p className="text-xs text-gray-500">
              RFID tags can be assigned or updated here.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
