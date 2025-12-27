import {
  GraduationCap,
  School,
  Bus,
  Users,
  LogOut,
  User,
  Route,
  ChevronDown,
  FileText,
  Building,
  Activity,
  UserCheck,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const schoolMenuItems = [
  { path: "/dashboard", label: "Dashboard", icon: GraduationCap },
  { path: "/schools", label: "Schools", icon: School },
  { path: "/fleet-crew", label: "Fleet & Crew", icon: Bus },
  { path: "/routes-zones", label: "Routes & Zones", icon: Route },
  { path: "/school-trips", label: "School Trips", icon: Calendar },
  { path: "/terms-invoices", label: "Terms & Invoices", icon: FileText },
  { path: "/parents-students", label: "Parents & Students", icon: Users },
  { path: "/users", label: "Users", icon: User },
];

const adminMenuItems = [
  { path: "/admin/SystemTelemetry", label: "System Telemetry", icon: Activity },
  { path: "/admin/Customers", label: "Customers", icon: Building },
  { path: "/admin/Subscriptions", label: "Subscriptions", icon: CreditCard },
  { path: "/admin/Users", label: "Users", icon: UserCheck },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate and show success message even if API call fails
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                RocketRoll
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                Academic Suite
              </span>
            </div>
          </div>
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {(() => {
          // Show different menu based on user role
          if (!user) return null;

          const userRole = user.role.name.toLowerCase();

          if (userRole === "admin") {
            // Admin menu for admin users
            return (
              <SidebarGroup>
                <SidebarGroupLabel>Admin Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              to={item.path}
                              className="flex items-center space-x-2"
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          } else if (userRole === "customer") {
            // School management menu for customer users
            return (
              <SidebarGroup>
                <SidebarGroupLabel>School Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {schoolMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              to={item.path}
                              className="flex items-center space-x-2"
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          } else {
            return (
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  {/* <SidebarMenu>
                    {schoolMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              to={item.path}
                              className="flex items-center space-x-2"
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu> */}
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
        })()}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-sidebar-foreground/70" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
