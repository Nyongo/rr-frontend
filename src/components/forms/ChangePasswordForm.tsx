import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";

interface ChangePasswordFormProps {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  }) => void;
  isLoading?: boolean;
}

export const ChangePasswordForm = ({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    repeat: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "currentPassword":
        if (!value.trim()) {
          newErrors.currentPassword = "Current password is required";
        } else {
          delete newErrors.currentPassword;
        }
        break;

      case "newPassword":
        if (!value.trim()) {
          newErrors.newPassword = "New password is required";
        } else if (value.length < 6) {
          newErrors.newPassword = "New password must be at least 6 characters";
        } else if (
          formData.currentPassword &&
          value === formData.currentPassword
        ) {
          newErrors.newPassword =
            "New password must be different from current password";
        } else {
          delete newErrors.newPassword;
        }
        break;

      case "repeatNewPassword":
        if (!value.trim()) {
          newErrors.repeatNewPassword = "Please confirm your new password";
        } else if (formData.newPassword && value !== formData.newPassword) {
          newErrors.repeatNewPassword = "Passwords do not match";
        } else {
          delete newErrors.repeatNewPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field in real-time
    validateField(name, value);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Re-validate fields when dependencies change
  useEffect(() => {
    // Re-validate newPassword when currentPassword changes
    if (formData.newPassword) {
      validateField("newPassword", formData.newPassword);
    }
  }, [formData.currentPassword]);

  useEffect(() => {
    // Re-validate repeatNewPassword when newPassword changes
    if (formData.repeatNewPassword) {
      validateField("repeatNewPassword", formData.repeatNewPassword);
    }
  }, [formData.newPassword]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!formData.repeatNewPassword.trim()) {
      newErrors.repeatNewPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      newErrors.repeatNewPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      onSubmit(formData);
    } else {
      // Run validation to show any errors
      validateForm();
    }
  };

  const isFormValid =
    formData.currentPassword.trim() &&
    formData.newPassword.trim() &&
    formData.repeatNewPassword.trim() &&
    formData.newPassword === formData.repeatNewPassword &&
    formData.newPassword.length >= 6 &&
    formData.currentPassword !== formData.newPassword;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className={`mt-1 pr-10 ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`mt-1 pr-10 ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
            {!errors.newPassword && formData.newPassword && (
              <div className="mt-1">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 w-8 rounded ${
                          formData.newPassword.length >= level * 1.5
                            ? formData.newPassword.length >= 6
                              ? "bg-green-500"
                              : "bg-yellow-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.newPassword.length < 6
                      ? "Weak"
                      : formData.newPassword.length < 8
                      ? "Medium"
                      : "Strong"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
            )}
            {!formData.newPassword && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Repeat New Password */}
          <div>
            <Label htmlFor="repeatNewPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="repeatNewPassword"
                name="repeatNewPassword"
                type={showPasswords.repeat ? "text" : "password"}
                value={formData.repeatNewPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`mt-1 pr-10 ${
                  errors.repeatNewPassword ? "border-red-500" : ""
                }`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("repeat")}
              >
                {showPasswords.repeat ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.repeatNewPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.repeatNewPassword}
              </p>
            )}
            {!errors.repeatNewPassword &&
              formData.repeatNewPassword &&
              formData.newPassword === formData.repeatNewPassword && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Passwords match
                </p>
              )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full ${
              isFormValid
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
