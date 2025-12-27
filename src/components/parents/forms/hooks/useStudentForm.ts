import { useState } from "react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { specialNeedsOptions } from "../data/studentFormData";
import { StudentFormData } from "../../types/studentTypes";
import { CreateStudentRequest } from "@/services/studentsApi";
import { useStudents } from "@/hooks/useStudents";

interface Student {
  id: number;
  photo: string;
  name: string;
  admissionNumber: string;
  schoolName: string;
  dateOfBirth: string;
  gender: string;
  specialNeeds: string;
  medicalInformation: string;
  fingerprint: string;
  status: string;
}

interface UseStudentFormProps {
  onAddStudent: (student: Student) => void;
  students: Student[];
  onClose: () => void;
  parentId?: string;
  schoolId?: string;
}

export const useStudentForm = ({
  onAddStudent,
  students,
  onClose,
  parentId,
  schoolId,
}: UseStudentFormProps) => {
  const { addStudent } = useStudents();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    admissionNumber: "",
    schoolName: "",
    schoolId: "",
    dateOfBirth: null as Date | null,
    gender: "",
    specialNeeds: [] as string[],
    medicalInformation: "",
    rfidTagId: null as string | null,
    status: "Active",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleSpecialNeedsChange = (needId: string, checked: boolean) => {
    if (checked) {
      setNewStudent({
        ...newStudent,
        specialNeeds: [...newStudent.specialNeeds, needId],
      });
    } else {
      setNewStudent({
        ...newStudent,
        specialNeeds: newStudent.specialNeeds.filter((id) => id !== needId),
      });
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert special needs IDs to labels for API
      const specialNeedsLabels = newStudent.specialNeeds.map((id) => {
        const option = specialNeedsOptions.find((opt) => opt.id === id);
        return option ? option.label : id;
      });

      // Prepare API data
      const apiData: CreateStudentRequest = {
        name: newStudent.name,
        admissionNumber: newStudent.admissionNumber,
        dateOfBirth: newStudent.dateOfBirth
          ? format(newStudent.dateOfBirth, "yyyy-MM-dd")
          : "",
        gender: newStudent.gender as "Male" | "Female",
        status: newStudent.status || "Active",
        isActive: newStudent.status === "Active" ? true : false,
        specialNeeds: specialNeedsLabels.length > 0 ? specialNeedsLabels : undefined,
        medicalInfo: newStudent.medicalInformation || undefined,
        rfidTagId: newStudent.rfidTagId || null,
        schoolId:
          newStudent.schoolId ||
          schoolId ||
          "567431ac-cab3-41e5-b0ca-ee4de0953661", // Use selected school ID
        parentId: parentId || "b0e52e90-70b0-4607-ac8c-9c2630af58af", // Default parent ID
      };

      // Call API to create student
      await addStudent(apiData);

      // Create legacy student object for backward compatibility
      const student = {
        id: `temp-${Date.now()}`,
        photo: photoPreview || "",
        ...newStudent,
        dateOfBirth: newStudent.dateOfBirth
          ? format(newStudent.dateOfBirth, "yyyy-MM-dd")
          : "",
        specialNeeds:
          specialNeedsLabels.length > 0
            ? specialNeedsLabels.join(", ")
            : "None",
        status: newStudent.status,
      };

      // Call the legacy callback for UI updates
      onAddStudent(student);

      // Reset form
      setNewStudent({
        name: "",
        admissionNumber: "",
        schoolName: "",
        schoolId: "",
        dateOfBirth: null,
        gender: "",
        specialNeeds: [],
        medicalInformation: "",
        rfidTagId: null,
        status: "Active",
      });
      setPhotoFile(null);
      setPhotoPreview("");
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to add student:", error);
    }
  };

  return {
    photoFile,
    photoPreview,
    newStudent,
    setNewStudent,
    handlePhotoUpload,
    removePhoto,
    handleSpecialNeedsChange,
    handleAddStudent,
  };
};
