import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SignIn from "./pages/authentication/SignIn";
import ResetPassword from "./pages/authentication/ResetPassword";
import Dashboard from "./pages/management/Dashboard";
import Schools from "./pages/management/Schools";
import FleetCrew from "./pages/management/FleetCrew";
import ParentsStudents from "./pages/management/ParentsStudents";
import ParentDetails from "./pages/management/ParentDetails";
import RoutesZones from "./pages/management/RoutesZones";
import SchoolTrips from "./pages/management/SchoolTrips";
import TermsInvoices from "./pages/management/TermsInvoices";
import Users from "./pages/management/Users";
import Profile from "./pages/management/Profile";
import AdminDashboard from "./pages/admin";
import SystemTelemetry from "./pages/admin/SystemTelemetry";
import Customers from "./pages/admin/Customers";
import Subscriptions from "./pages/admin/Subscriptions";
import AdminUsers from "./pages/admin/Users";
import MindersMobile from "./pages/minders-mobile";
import MindersMobileHome from "./pages/minders-mobile/home";
import MindersMobileScan from "./pages/minders-mobile/scan";
import MindersMobileTrips from "./pages/minders-mobile/trips";
import MindersMobileProfile from "./pages/minders-mobile/profile";
import MindersMobileResetPin from "./pages/minders-mobile/reset-pin";
import Website from "./pages/website";
import TrackStudent from "./pages/parent-tracking/TrackStudent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Interface for the user object (legacy - keeping for backward compatibility)
interface LegacyUser {
  email: string;
  role: "school" | "admin";
  name?: string;
  id?: number;
}

// Protected route component
const ProtectedRoute = ({
  children,
  allowedRoles = ["school", "admin", "customer"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Not logged in, redirect to login page with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = user.role.name.toLowerCase();
  if (!allowedRoles.includes(userRole)) {
    // User doesn't have the required role
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin/SystemTelemetry" replace />;
    } else if (userRole === "customer") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  // Check if user is already logged in
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Any initialization logic if needed
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/" element={<SignIn />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Management Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schools"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <Schools />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fleet-crew"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <FleetCrew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parents-students"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <ParentsStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent-details/:id"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <ParentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routes-zones"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <RoutesZones />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school-trips"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <SchoolTrips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/terms-invoices"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <TermsInvoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["school", "customer"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/SystemTelemetry" replace />}
              />
              <Route
                path="/admin/SystemTelemetry"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SystemTelemetry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/Customers"
                element={
                  <ProtectedRoute allowedRoles={["admin", "customer"]}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/Subscriptions"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Subscriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/Users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Mobile App Routes - Properly nested under MindersMobile provider */}
              <Route path="/minders-mobile" element={<MindersMobile />}>
                <Route
                  index
                  element={<Navigate to="/minders-mobile/home" replace />}
                />
                <Route path="home" element={<MindersMobileHome />} />
                <Route path="scan" element={<MindersMobileScan />} />
                <Route path="trips" element={<MindersMobileTrips />} />
                <Route path="profile" element={<MindersMobileProfile />} />
                <Route path="reset-pin" element={<MindersMobileResetPin />} />
              </Route>

              {/* Website Routes */}
              <Route path="/website" element={<Website />} />

              {/* Parent Tracking Route - Unauthenticated */}
              <Route path="/track/:trackingToken" element={<TrackStudent />} />
              <Route path="/track" element={<TrackStudent />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
