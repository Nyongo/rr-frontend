
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, User, Phone } from "lucide-react";
import { Student } from "../types/startTrip";
import { mockStudents } from "../data/studentData";

interface StudentListProps {
  selectedZone: string;
  selectedRoute: string;
}

const StudentList = ({ selectedZone, selectedRoute }: StudentListProps) => {
  // Filter students by selected route only - zone should not affect the list
  const filteredStudents = mockStudents
    .filter(student => 
      student.routeId === selectedRoute && 
      student.status === 'active'
    )
    .sort((a, b) => a.pickupOrder - b.pickupOrder);

  console.log('StudentList filtering:', {
    selectedRoute,
    selectedZone,
    totalStudents: mockStudents.length,
    filteredCount: filteredStudents.length,
    filteredStudents: filteredStudents.map(s => ({ id: s.id, name: s.name, routeId: s.routeId, zoneId: s.zoneId }))
  });

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

  // Get child face placeholder based on gender and index for variety
  const getChildPlaceholder = (index: number) => {
    const childFaces = [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1547348391-4b37b0c4b67a?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519457431-44c20689c0c6?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop&crop=face',
    ];
    return childFaces[index % childFaces.length];
  };

  if (filteredStudents.length === 0) {
    return (
      <Card className="shadow-lg border-0 animate-in slide-in-from-top-2 duration-300">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No students found for this route</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 animate-in slide-in-from-top-2 duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Students to Pick Up
        </CardTitle>
        
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <MapPin className="w-3 h-3 mr-1" />
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </Badge>
          <span className="text-gray-500">Pickup order shown</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
            >
              {/* Pickup Order Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Square Profile Picture */}
              <div className="w-full aspect-square bg-gray-50 relative p-4 flex items-center justify-center">
                <Avatar className="w-full h-full rounded-2xl shadow-lg">
                  <AvatarImage 
                    src={student.photoUrl || getChildPlaceholder(index)} 
                    alt={student.name}
                    className="object-cover w-full h-full rounded-2xl" 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-4xl rounded-2xl w-full h-full">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Student Details */}
              <div className="p-6">
                {/* Student Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {student.name}
                </h3>

                {/* Status Badge */}
                <div className="flex justify-center mb-6">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2 text-sm font-medium">
                    Pending
                  </Badge>
                </div>

                {/* Student Details */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-600 font-medium text-base">Admission:</span>
                    <span className="text-gray-900 font-bold text-base">{student.admissionNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-600 font-medium text-base">Age:</span>
                    <span className="text-gray-900 font-bold text-base">{student.age} years</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium text-base">Gender:</span>
                    <Badge variant="secondary" className={`text-sm font-semibold px-3 py-1 ${getGenderColor(student.gender)}`}>
                      {student.gender}
                    </Badge>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <span className="text-gray-700 font-semibold text-base">Address</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-gray-900 text-base leading-relaxed">{student.address || 'Address not provided'}</span>
                  </div>
                </div>

                {/* Parent Contact Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <Phone className="w-5 h-5 text-gray-600 mt-1" />
                    <span className="text-gray-700 font-semibold text-base">Parent Contact</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <div className="text-gray-900 font-semibold text-base">{student.parentName}</div>
                    <div className="text-gray-900 font-bold text-base">{student.parentPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentList;
