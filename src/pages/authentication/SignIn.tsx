import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { GraduationCap, Users, School, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/authApi";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ email: identifier, password });

      if (response.response.code === 200) {
        // Store user data and token
        authLogin(response.data);

        // Navigate based on user role
        const role = response.data.role.name.toLowerCase();
        let redirectTo = "/dashboard";

        if (role === "admin") {
          redirectTo = "/admin/SystemTelemetry";
        }
        // Customer and school users both go to dashboard

        navigate(redirectTo);

        toast({
          title: "Signed in successfully",
          description: `Welcome, ${response.data.name}!`,
        });
      } else {
        throw new Error(response.response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Authentication failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-60">
        <GraduationCap size={48} />
      </div>
      <div className="absolute top-20 right-20 text-green-400 opacity-60">
        <School size={40} />
      </div>
      <div className="absolute bottom-20 left-20 text-pink-400 opacity-60">
        <Users size={44} />
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to your school management dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-700 font-medium">
                Email / Phone Number
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 transition-colors"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 transition-colors"
                required
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/reset-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            {/* Sample accounts hidden for now
            <div className="text-xs text-gray-500 mb-2">
              <p>Sample Accounts:</p>
              <p>- School: teacher@school.edu / 123456</p>
              <p>- Admin: admin@rocketroll.solutions / 123456</p>
            </div>
            */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
