
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Users, User } from "lucide-react";

interface Student {
  id: number;
  name: string;
  photo: string;
  admissionNumber: string;
  age: number;
  gender: "Male" | "Female";
}

interface StudentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  excludeStudentIds: number[];
  onAddStudents: (students: Student[], riderType: "daily" | "occasional") => void;
}

const StudentSelectionDialog = ({ 
  isOpen, 
  onClose, 
  students, 
  excludeStudentIds, 
  onAddStudents 
}: StudentSelectionDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [riderType, setRiderType] = useState<"daily" | "occasional">("daily");

  // Filter out already added students and apply search
  const availableStudents = students
    .filter(student => !excludeStudentIds.includes(student.id))
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleStudentToggle = (student: Student, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, student]);
    } else {
      setSelectedStudents(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const handleStudentClick = (student: Student) => {
    const isSelected = selectedStudents.some(s => s.id === student.id);
    handleStudentToggle(student, !isSelected);
  };

  const handleAddStudents = () => {
    onAddStudents(selectedStudents, riderType);
    setSelectedStudents([]);
    setSearchTerm("");
    setRiderType("daily");
    onClose();
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setSearchTerm("");
    setRiderType("daily");
    onClose();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] sm:max-h-[80vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Select Students to Add
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>

          {/* Students List */}
          <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 min-h-0">
            {availableStudents.length === 0 ? (
              <div className="text-center py-8 text-sm sm:text-base text-gray-500">
                {searchTerm ? "No students match your search" : "No students available"}
              </div>
            ) : (
              availableStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleStudentClick(student)}
                >
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedStudents.some(s => s.id === student.id)}
                      onCheckedChange={(checked) => 
                        handleStudentToggle(student, checked as boolean)
                      }
                      className="flex-shrink-0 mt-1 sm:mt-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback className="bg-gray-200 text-gray-400">
                          <User className="w-5 h-5 sm:w-6 sm:h-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{student.name}</h5>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 mt-1 text-xs sm:text-sm text-gray-600">
                        <span className="truncate">
                          <span className="font-medium">Admission:</span> {student.admissionNumber}
                        </span>
                        <span className="whitespace-nowrap">
                          <span className="font-medium">Age:</span> {student.age} years
                        </span>
                        <span className="whitespace-nowrap">
                          <span className="font-medium">Gender:</span> {student.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rider Type Selection */}
          <div className="pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Rider Type</h3>
            <RadioGroup 
              value={riderType} 
              onValueChange={(value: "daily" | "occasional") => setRiderType(value)}
              className="flex flex-col sm:flex-row gap-3 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-medium text-sm sm:text-base cursor-pointer">Daily Rider</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="occasional" />
                <Label htmlFor="occasional" className="font-medium text-sm sm:text-base cursor-pointer">Occasional Rider</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-1 sm:gap-2">
                <span>Add</span>
                {selectedStudents.length > 0 && (
                  <span className="bg-blue-700 px-1.5 py-0.5 rounded text-xs sm:text-sm font-medium">
                    {selectedStudents.length}
                  </span>
                )}
                <span className="hidden sm:inline">Students as</span>
                <span className="sm:hidden">as</span>
                <span className="font-semibold">
                  {riderType === "daily" ? "Daily" : "Occasional"}
                </span>
                <span className="hidden sm:inline">Riders</span>
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSelectionDialog;
