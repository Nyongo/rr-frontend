import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { changeUserPassword, updateUserProfile } from "@/services/usersApi";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Use auth context data or fallback to mock data
  const [generalInfo, setGeneralInfo] = useState({
    fullName: user?.name || "Admin User",
    email: user?.email || "admin@schoolhub.com",
    phone: user?.phoneNumber || "",
  });

  const handleGeneralInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !user?.token) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingProfile(true);

      const response = await updateUserProfile(
        user.id,
        {
          name: generalInfo.fullName,
          phoneNumber: generalInfo.phone,
        },
        user.token
      );

      // Update the user data in the auth context
      if (response.data) {
        updateUser({
          ...user,
          name: response.data.name,
          phoneNumber: response.data.phoneNumber,
        });
      }

      toast({
        title: "Profile Updated!",
        description: "Your general information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  }) => {
    if (!user?.id || !user?.token) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      await changeUserPassword(
        {
          id: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          repeatNewPassword: passwordData.repeatNewPassword,
        },
        user.token
      );

      toast({
        title: "Password Changed!",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and security settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralInfoSave} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={generalInfo.fullName}
                      onChange={(e) =>
                        setGeneralInfo({
                          ...generalInfo,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={generalInfo.email}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={generalInfo.phone}
                      onChange={(e) =>
                        setGeneralInfo({
                          ...generalInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <div className="flex justify-center">
            <ChangePasswordForm
              onSubmit={handlePasswordChange}
              isLoading={isChangingPassword}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
