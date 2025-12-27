
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User } from "lucide-react";
import { Student } from "../types/startTrip";

interface StudentCardProps {
  student: Student;
  index: number;
}

const StudentCard = ({ student, index }: StudentCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const getGenderColor = (gender: string) => {
    return gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {/* Pickup Order Badge */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
        </div>

        {/* Student Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={student.photoUrl} alt={student.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
            {getInitials(student.name)}
          </AvatarFallback>
        </Avatar>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
            <Badge variant="secondary" className={`text-xs ${getGenderColor(student.gender)}`}>
              {student.gender}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {student.admissionNumber}
            </span>
            <span>Age {student.age}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{student.address}</span>
          </div>
        </div>
      </div>

      {/* Parent Contact */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">{student.parentName}</span>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{student.parentPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
