
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
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Students to Add
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>

          {/* Students List */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-96">
            {availableStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No students match your search" : "No students available"}
              </div>
            ) : (
              availableStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleStudentClick(student)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Checkbox
                      checked={selectedStudents.some(s => s.id === student.id)}
                      onCheckedChange={(checked) => 
                        handleStudentToggle(student, checked as boolean)
                      }
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback className="bg-gray-200 text-gray-400">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 text-lg">{student.name}</h5>
                      <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600">
                        <span>
                          <span className="font-medium">Admission:</span> {student.admissionNumber}
                        </span>
                        <span>
                          <span className="font-medium">Age:</span> {student.age} years
                        </span>
                        <span>
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
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-2">Rider Type</h3>
            <RadioGroup 
              value={riderType} 
              onValueChange={(value: "daily" | "occasional") => setRiderType(value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-medium">Daily Rider</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="occasional" />
                <Label htmlFor="occasional" className="font-medium">Occasional Rider</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add {selectedStudents.length > 0 && `(${selectedStudents.length})`} Students as {riderType === "daily" ? "Daily" : "Occasional"} Riders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSelectionDialog;
