
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Fingerprint, Check } from "lucide-react";
import { ActiveTripStudent } from "../types/activeTrip";

interface ActiveTripStudentCardProps {
  student: ActiveTripStudent;
  index: number;
  onStatusUpdate: (studentId: string, status: 'picked-up' | 'dropped-off', verified?: boolean) => void;
  showPickupButton?: boolean;
}

const ActiveTripStudentCard = ({ 
  student, 
  index, 
  onStatusUpdate, 
  showPickupButton = true 
}: ActiveTripStudentCardProps) => {
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

  const getStatusBadge = () => {
    switch (student.status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
      case 'picked-up':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Picked Up</Badge>;
      case 'dropped-off':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Dropped Off</Badge>;
      default:
        return null;
    }
  };

  const handleDropoffClick = () => {
    onStatusUpdate(student.id, 'dropped-off', student.fingerprintVerified);
  };

  // Get child face placeholder based on gender and index for variety
  const getChildPlaceholder = () => {
    // Using Unsplash child face photos as placeholders
    const childFaces = [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1547348391-4b37b0c4b67a?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519457431-44c20689c0c6?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&h=150&fit=crop&crop=face',
    ];
    return childFaces[index % childFaces.length];
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden relative transition-all duration-200 ${
      student.status === 'picked-up' ? 'border-green-200' : 
      student.status === 'dropped-off' ? 'border-blue-200' : 
      'border-gray-100'
    }`}>
      {/* Pickup Order Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg ${
          student.status === 'picked-up' ? 'bg-green-500' :
          student.status === 'dropped-off' ? 'bg-blue-500' :
          'bg-orange-500'
        }`}>
          {index + 1}
        </div>
      </div>

      {/* Square Profile Picture */}
      <div className="w-full aspect-square bg-gray-50 relative p-4 flex items-center justify-center">
        <Avatar className="w-full h-full rounded-2xl shadow-lg">
          <AvatarImage 
            src={student.photoUrl || getChildPlaceholder()} 
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
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
          {student.fingerprintVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              <Fingerprint className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          {getStatusBadge()}
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
            <span className="text-gray-900 text-base leading-relaxed">{student.address}</span>
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

      {/* Action Buttons - Only show for picked up students (drop off) */}
      {student.status === 'picked-up' && (
        <div className="mt-6 pt-6 border-t border-gray-100 px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Picked up at {student.pickupTime?.toLocaleTimeString()}
            </div>
            <Button
              onClick={handleDropoffClick}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold px-4 py-2"
            >
              Drop Off
            </Button>
          </div>
        </div>
      )}

      {student.status === 'dropped-off' && (
        <div className="mt-6 pt-6 border-t border-gray-100 px-6 pb-6">
          <div className="text-sm text-gray-600 flex items-center">
            <Check className="w-4 h-4 mr-2 text-blue-500" />
            Dropped off at {student.dropoffTime?.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTripStudentCard;
