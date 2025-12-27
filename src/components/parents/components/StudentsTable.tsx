import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, Edit, Trash2, Loader2, Radio } from "lucide-react";
import AssignRFIDTagDialog from "@/components/rfid/AssignRFIDTagDialog";
import { Student as StudentType } from "@/services/studentsApi";
import { useStudents } from "@/hooks/useStudents";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditStudentDialog from "./EditStudentDialog";

// Support both API Student type and legacy format for backward compatibility
type Student = StudentType | {
  id: number | string;
  photo?: string | null;
  name: string;
  admissionNumber: string;
  schoolName?: string;
  school?: { name: string };
  dateOfBirth: string;
  gender: string;
  specialNeeds?: string | string[];
  medicalInformation?: string;
  medicalInfo?: string;
  rfidTagId?: string | null;
  status: string;
};

interface StudentsTableProps {
  students: Student[];
  loading?: boolean;
}

const StudentsTable = ({
  students: initialStudents,
  loading = false,
}: StudentsTableProps) => {
  const [students, setStudents] = useState(initialStudents);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [rfidDialogOpen, setRfidDialogOpen] = useState(false);
  const [selectedStudentForRFID, setSelectedStudentForRFID] = useState<StudentType | null>(null);
  const { refetch: refetchStudents } = useStudents();

  // Update local state when props change
  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const getStatusBadge = (status: string) => {
    const variant = status === "Active" ? "success" : "danger";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getRFIDBadge = (rfidTagId: string | null | undefined) => {
    if (!rfidTagId) {
      return <Badge variant="secondary">Not Assigned</Badge>;
    }
    return (
      <Badge variant="success" className="font-mono text-xs">
        <Radio className="w-3 h-3 mr-1" />
        {rfidTagId}
      </Badge>
    );
  };

  const getStudentPhoto = (student: Student) => {
    // Handle API Student type with photo field
    if ('photo' in student) {
      return student.photo || null;
    }
    return null;
  };

  const getSchoolName = (student: Student): string => {
    // Handle API Student type with nested school object
    if ('school' in student && student.school) {
      return student.school.name;
    }
    // Handle legacy format with schoolName
    if ('schoolName' in student && student.schoolName) {
      return student.schoolName;
    }
    return "Unknown School";
  };

  const getSpecialNeeds = (student: Student): string => {
    // Handle API Student type with array
    if ('specialNeeds' in student) {
      if (Array.isArray(student.specialNeeds)) {
        return student.specialNeeds.length > 0 
          ? student.specialNeeds.join(", ") 
          : "None";
      }
      if (typeof student.specialNeeds === 'string') {
        return student.specialNeeds || "None";
      }
    }
    return "None";
  };

  const getMedicalInfo = (student: Student): string => {
    // Handle API Student type with medicalInfo field
    if ('medicalInfo' in student && student.medicalInfo) {
      return student.medicalInfo;
    }
    // Handle legacy format with medicalInformation
    if ('medicalInformation' in student && student.medicalInformation) {
      return student.medicalInformation;
    }
    return "None";
  };

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    // Refetch students after edit
    await refetchStudents();
    // Close the dialog
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleRFIDAssignSuccess = async () => {
    // Refetch students after RFID assignment
    await refetchStudents();
    setRfidDialogOpen(false);
    setSelectedStudentForRFID(null);
  };

  const handleDelete = (studentId: number | string) => {
    setStudents(students.filter((student) => student.id !== studentId));
    console.log("Delete student:", studentId);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.admissionNumber
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      getSchoolName(student).toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Student table columns
  const studentColumns: Column<any>[] = [
    {
      key: "nameWithPhoto",
      label: "Student Name",
      sortable: true,
      render: (_, student) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 rounded-md">
            {getStudentPhoto(student) ? (
              <AvatarImage src={getStudentPhoto(student)} alt={student.name} />
            ) : null}
            <AvatarFallback>
              <User className="w-4 h-4 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{student.name}</span>
        </div>
      ),
    },
    {
      key: "admissionNumber",
      label: "Admission Number",
      sortable: true,
    },
    {
      key: "schoolName",
      label: "School Name",
      sortable: true,
      render: (_, student) => getSchoolName(student),
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      sortable: true,
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
    },
    {
      key: "rfidTag",
      label: "RFID Tag",
      render: (_, student) => {
        // Try to get RFID from the student object
        const rfidTagId = (student as any).rfidTagId;
        return getRFIDBadge(rfidTagId);
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, student) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Convert student to StudentType for RFID dialog
              // Convert student to StudentType for RFID dialog
              const studentForRFID: StudentType = {
                id: typeof student.id === 'string' ? student.id : student.id.toString(),
                name: student.name,
                admissionNumber: student.admissionNumber,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender as "Male" | "Female",
                status: student.status,
                isActive: student.status === "Active",
                specialNeeds: Array.isArray(student.specialNeeds) 
                  ? student.specialNeeds 
                  : typeof student.specialNeeds === 'string' && student.specialNeeds 
                    ? [student.specialNeeds] 
                    : [],
                medicalInfo: getMedicalInfo(student),
                schoolId: 'school' in student && student.school ? student.school.id : "",
                parentId: 'parent' in student && student.parent ? student.parent.id : "",
                createdAt: 'createdAt' in student ? student.createdAt : "",
                updatedAt: 'updatedAt' in student ? student.updatedAt : "",
                createdById: 'createdById' in student ? student.createdById : null,
                lastUpdatedById: 'lastUpdatedById' in student ? student.lastUpdatedById : null,
                school: 'school' in student && student.school 
                  ? { ...student.school, customerId: (student.school as any).customerId || 0 }
                  : { id: "", name: getSchoolName(student), customerId: 0 },
                parent: 'parent' in student && student.parent 
                  ? student.parent 
                  : { id: "", name: "", parentType: "", phoneNumber: "", schoolId: "", status: "", isActive: true, createdAt: "", updatedAt: "", createdById: null, lastUpdatedById: null, school: { id: "", name: "", customerId: 0 } },
                rfidTagId: 'rfidTagId' in student ? student.rfidTagId : null,
                rfidTagAssignedAt: 'rfidTagAssignedAt' in student ? student.rfidTagAssignedAt : null,
                photo: 'photo' in student ? student.photo : undefined,
              };
              setSelectedStudentForRFID(studentForRFID);
              setRfidDialogOpen(true);
            }}
            title="Assign RFID Tag"
          >
            <Radio className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEdit(student, e)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  {student.name}'s record and remove their data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  // Show loading spinner if loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar positioned above the table */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search students by name, admission number, or school..."
          value={studentSearchTerm}
          onChange={(e) => setStudentSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table without horizontal scroll */}
      <EnhancedTable
        data={filteredStudents}
        columns={studentColumns}
        onRowClick={handleRowClick}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showPageSizeSelector: true,
        }}
      />

      {/* View Student Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Student Details
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Header Section with Photo and Basic Info */}
              <div className="flex items-start space-x-6 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg rounded-xl">
                  {getStudentPhoto(selectedStudent) ? (
                    <AvatarImage
                      src={getStudentPhoto(selectedStudent)}
                      alt={selectedStudent.name}
                    />
                  ) : null}
                  <AvatarFallback className="bg-gray-200">
                    <User className="w-10 h-10 text-gray-500" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedStudent.name}
                  </h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {selectedStudent.admissionNumber}
                    </span>
                    {getStatusBadge(selectedStudent.status)}
                  </div>
                  <p className="text-gray-600 text-lg">
                    {getSchoolName(selectedStudent)}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Personal Information
                  </label>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">
                        Date of Birth
                      </span>
                      <p className="text-gray-800 font-medium">
                        {selectedStudent.dateOfBirth}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Gender</span>
                      <p className="text-gray-800 font-medium">
                        {selectedStudent.gender}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Security Information
                  </label>
                  <div>
                    <span className="text-sm text-gray-500">
                      RFID Tag Status
                    </span>
                    <div className="mt-1">
                      {getRFIDBadge((selectedStudent as any).rfidTagId)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Needs Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                  Special Needs
                </label>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-800">
                    {getSpecialNeeds(selectedStudent)}
                  </p>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                  Medical Information
                </label>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-800">
                    {getMedicalInfo(selectedStudent)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditSave}
      />

      {/* RFID Tag Assignment Dialog */}
      <AssignRFIDTagDialog
        open={rfidDialogOpen}
        onOpenChange={setRfidDialogOpen}
        student={selectedStudentForRFID}
        onSuccess={handleRFIDAssignSuccess}
      />
    </div>
  );
};

export default StudentsTable;
