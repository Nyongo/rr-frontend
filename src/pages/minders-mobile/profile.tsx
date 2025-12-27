
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  LogOut,
  Edit,
  Key
} from "lucide-react";
import BottomNavigation from "./components/BottomNavigation";
import EditProfileDialog from "./components/EditProfileDialog";
import ChangePinDialog from "./components/ChangePinDialog";
import { useLogout } from "./hooks/useLogout";

const Profile = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePinOpen, setChangePinOpen] = useState(false);
  const { logout } = useLogout();

  // Mock minder data
  const [minderData, setMinderData] = useState({
    name: "Sarah Johnson",
    phone: "+254 712 345 678",
    email: "sarah.johnson@schoolbus.com",
    employeeId: "SB001",
    dateJoined: "March 15, 2023",
    status: "Active",
    avatar: "",
    address: "Nairobi, Kenya"
  });

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleSaveProfile = (name: string, phone: string) => {
    setMinderData(prev => ({
      ...prev,
      name,
      phone
    }));
  };

  const handleChangePin = () => {
    setChangePinOpen(true);
  };

  const handleSavePin = (newPin: string) => {
    // Here you would typically send the new PIN to your backend
    console.log("New PIN saved:", newPin);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditProfile}
            className="text-white hover:bg-white/20"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Profile Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            <AvatarImage src={minderData.avatar} alt={minderData.name} />
            <AvatarFallback className="bg-green-200 text-green-800 text-xl font-bold">
              {minderData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{minderData.name}</h2>
            <p className="text-green-100 mb-2">School Bus Minder</p>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Shield className="w-3 h-3 mr-1" />
              {minderData.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-4">
        {/* Personal Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Phone</span>
                </div>
                <span className="font-medium">{minderData.phone}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Email</span>
                </div>
                <span className="font-medium text-sm">{minderData.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Address</span>
                </div>
                <span className="font-medium">{minderData.address}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Date Joined</span>
                </div>
                <span className="font-medium">{minderData.dateJoined}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change PIN Button */}
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            <Button
              onClick={handleChangePin}
              variant="outline"
              className="w-full border-green-200 text-green-600 hover:bg-green-50"
            >
              <Key className="w-4 h-4 mr-2" />
              Change PIN
            </Button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="shadow-lg border-0 border-red-200">
          <CardContent className="pt-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        currentName={minderData.name}
        currentPhone={minderData.phone}
        onSave={handleSaveProfile}
      />

      <ChangePinDialog
        open={changePinOpen}
        onClose={() => setChangePinOpen(false)}
        onSave={handleSavePin}
      />

      <BottomNavigation currentPage="profile" />
    </div>
  );
};

export default Profile;
