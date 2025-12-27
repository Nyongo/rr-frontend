import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useStudentForm } from "./hooks/useStudentForm";
import PhotoUploadSection from "./components/PhotoUploadSection";
import StudentBasicInfo from "./components/StudentBasicInfo";
import SpecialNeedsSection from "./components/SpecialNeedsSection";

interface Student {
  id: string;
  photo?: string;
  name: string;
  admissionNumber: string;
  schoolName: string;
  dateOfBirth: string;
  gender: string;
  specialNeeds: string;
  medicalInformation: string;
  status: string;
}

interface StudentFormProps {
  onAddStudent: (student: Student) => void;
  students: Student[];
  parentId?: string;
  schoolId?: string;
}

const StudentForm = ({
  onAddStudent,
  students,
  parentId,
  schoolId,
}: StudentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    photoPreview,
    newStudent,
    setNewStudent,
    handlePhotoUpload,
    removePhoto,
    handleSpecialNeedsChange,
    handleAddStudent,
  } = useStudentForm({
    onAddStudent,
    students,
    onClose: () => setIsOpen(false),
    parentId,
    schoolId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Add a new student for this parent. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddStudent} className="space-y-4">
          <PhotoUploadSection
            photoPreview={photoPreview}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
          />

          <StudentBasicInfo
            newStudent={newStudent}
            setNewStudent={setNewStudent}
          />

          <SpecialNeedsSection
            specialNeeds={newStudent.specialNeeds}
            onSpecialNeedsChange={handleSpecialNeedsChange}
          />

          <div className="space-y-2">
            <Label htmlFor="medicalInformation">
              Medical Information
            </Label>
            <Textarea
              id="medicalInformation"
              placeholder="Allergies, conditions, medications, etc. (Optional)"
              value={newStudent.medicalInformation}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  medicalInformation: e.target.value,
                })
              }
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
              value={newStudent.rfidTagId || ""}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  rfidTagId: e.target.value || null,
                })
              }
            />
            <p className="text-xs text-gray-500">
              RFID tags can be assigned later through the student management interface.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            Add Student
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
