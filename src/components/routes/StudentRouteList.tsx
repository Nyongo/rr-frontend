import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, User, Eye, EyeOff } from "lucide-react";
import { StudentInRoute } from "./RoutesTab";
import StudentHideWarningDialog from "./StudentHideWarningDialog";
import StudentDeleteWarningDialog from "./StudentDeleteWarningDialog";

interface StudentRouteListProps {
  students: StudentInRoute[];
  onUpdateStudents: (students: StudentInRoute[]) => void;
  onRemoveStudent?: (student: StudentInRoute) => void;
  isPickupRoute: boolean;
  isDropOffRoute: boolean;
}

const StudentRouteList = ({
  students,
  onUpdateStudents,
  onRemoveStudent,
  isPickupRoute,
  isDropOffRoute,
}: StudentRouteListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hideDialogOpen, setHideDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToToggle, setStudentToToggle] = useState<{
    index: number;
    student: StudentInRoute;
    isHiding: boolean;
  } | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<{
    index: number;
    student: StudentInRoute;
  } | null>(null);

  console.log("StudentRouteList rendered with students:", students);
  console.log("hideDialogOpen:", hideDialogOpen);
  console.log("studentToToggle:", studentToToggle);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newStudents = [...students];
    const draggedStudent = newStudents[draggedIndex];

    // Remove the dragged student
    newStudents.splice(draggedIndex, 1);

    // Insert at new position
    newStudents.splice(dropIndex, 0, draggedStudent);

    onUpdateStudents(newStudents);
    setDraggedIndex(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const student = students[index];
    setStudentToDelete({ index, student });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (studentToDelete) {
      if (onRemoveStudent) {
        // Use the API remove handler if provided
        onRemoveStudent(studentToDelete.student);
      } else {
        // Fallback to local state update only
        const newStudents = students.filter(
          (_, i) => i !== studentToDelete.index
        );
        onUpdateStudents(newStudents);
      }
    }
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const cancelDeleteStudent = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleToggleHide = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleToggleHide called with index:", index);
    const student = students[index];
    const isHiding = !student.isHidden;

    console.log("Student:", student);
    console.log("isHiding:", isHiding);

    setStudentToToggle({ index, student, isHiding });
    setHideDialogOpen(true);

    console.log("Dialog should open now");
  };

  const confirmToggleHide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("confirmToggleHide called");
    if (studentToToggle) {
      const newStudents = [...students];
      newStudents[studentToToggle.index] = {
        ...newStudents[studentToToggle.index],
        isHidden: studentToToggle.isHiding,
      };
      console.log("Updating students with new state:", newStudents);
      onUpdateStudents(newStudents);
    }

    setHideDialogOpen(false);
    setStudentToToggle(null);
  };

  const cancelToggleHide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("cancelToggleHide called");
    setHideDialogOpen(false);
    setStudentToToggle(null);
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No students added to this route yet</p>
        <p className="text-sm text-gray-500">
          Use the "Add Students" button above to add students
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student, index) => (
        <div
          key={student.id}
          className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all ${
            student.isHidden ? "opacity-50 bg-gray-50 border-gray-300" : ""
          }`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <div className="flex items-center space-x-4 flex-1">
            <GripVertical
              className={`w-5 h-5 cursor-move ${
                student.isHidden ? "text-gray-300" : "text-gray-400"
              }`}
            />

            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.photo} />
                <AvatarFallback
                  className={`${
                    student.isHidden
                      ? "bg-gray-100 text-gray-300"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h5
                className={`font-semibold text-lg ${
                  student.isHidden ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {student.studentName}
                {student.isHidden && (
                  <span className="ml-2 text-sm text-gray-400">(Hidden)</span>
                )}
              </h5>
              <div className="flex items-center gap-2 mb-1">
                {student.riderType && (
                  <Badge className={
                    student.riderType === "daily" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }>
                    {student.riderType === "daily" ? "Daily" : "Occasional"}
                  </Badge>
                )}
              </div>
              <div
                className={`flex items-center space-x-6 mt-1 text-sm ${
                  student.isHidden ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>
                  <span className="font-medium">Admission:</span>{" "}
                  {student.admissionNumber}
                </span>
                {(student.age > 0 || student.dateOfBirth) && (
                <span>
                    <span className="font-medium">Age:</span> {student.age > 0 ? `${student.age} ${student.age === 1 ? 'year' : 'years'}` : 'N/A'}
                </span>
                )}
                {student.gender && (
                <span>
                  <span className="font-medium">Gender:</span> {student.gender}
                </span>
                )}
              </div>
              {(student.parentName || student.parentPhone) && (
                <div
                  className={`flex items-center space-x-6 mt-2 text-xs ${
                    student.isHidden ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {student.parentName && (
                    <span>
                      <span className="font-medium">Parent:</span> {student.parentName}
                    </span>
                  )}
                  {student.parentPhone && (
                    <span>
                      <span className="font-medium">Phone:</span> {student.parentPhone}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                console.log(
                  "Hide/Show button clicked for student:",
                  student.studentName
                );
                handleToggleHide(e, index);
              }}
              className={`${
                student.isHidden
                  ? "text-green-600 hover:bg-green-50 border-green-200"
                  : "text-amber-600 hover:bg-amber-50 border-amber-200"
              }`}
              title={
                student.isHidden
                  ? "Show student on route"
                  : "Hide student from route"
              }
            >
              {student.isHidden ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleDeleteClick(e, index)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="text-sm text-gray-500 mt-2">
        Drag and drop to reorder students in pickup/drop-off sequence
      </div>

      <StudentHideWarningDialog
        isOpen={hideDialogOpen}
        studentName={studentToToggle?.student.studentName || ""}
        isHiding={studentToToggle?.isHiding || false}
        onConfirm={confirmToggleHide}
        onCancel={cancelToggleHide}
      />

      <StudentDeleteWarningDialog
        isOpen={deleteDialogOpen}
        studentName={studentToDelete?.student.studentName || ""}
        onConfirm={confirmDeleteStudent}
        onCancel={cancelDeleteStudent}
      />
    </div>
  );
};

export default StudentRouteList;
