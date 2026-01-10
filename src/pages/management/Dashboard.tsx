
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Bus, Users, GraduationCap, TrendingUp, Route, Calendar, Building } from "lucide-react";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import { useAuth } from "@/contexts/AuthContext";
import { useSchools } from "@/hooks/useSchools";
import { useRoutesData } from "@/components/routes/hooks/useRoutesData";
import { getTrips } from "@/services/tripsApi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStudentsBySchoolId } from "@/services/studentsApi";

const Dashboard = () => {
  const { user } = useAuth();
  const { schools, loading: schoolsLoading } = useSchools();
  const { routes, loading: routesLoading } = useRoutesData();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);
  const [studentsLoadingCount, setStudentsLoadingCount] = useState(false);

  const isCustomer = user?.role.name.toLowerCase() === "customer";

  useEffect(() => {
    if (isCustomer) {
      // Fetch trips for customer dashboard
      const fetchTrips = async () => {
        try {
          setTripsLoading(true);
          const response = await getTrips(1, 100);
          setTrips(response.data || []);
        } catch (error) {
          console.error("Failed to fetch trips:", error);
          setTrips([]);
        } finally {
          setTripsLoading(false);
        }
      };
      fetchTrips();
    }
  }, [isCustomer]);

  // Filter data by customer if user is a customer
  // For now, we'll show all data - in production, filter by customerId
  const customerSchools = isCustomer ? schools : schools;
  const customerRoutes = isCustomer ? routes : routes;
  const customerTrips = isCustomer ? trips : [];

  // Fetch total students count for customer
  useEffect(() => {
    if (isCustomer && customerSchools.length > 0) {
      const fetchStudentsCount = async () => {
        try {
          setStudentsLoadingCount(true);
          let totalCount = 0;
          
          // Fetch students count for each school using pagination info
          for (const school of customerSchools) {
            try {
              // Fetch first page to get pagination info with totalItems
              const response = await getStudentsBySchoolId(school.id, 1, 1);
              if (response && response.pagination) {
                totalCount += response.pagination.totalItems || 0;
              }
            } catch (error) {
              console.error(`Failed to fetch students count for school ${school.id}:`, error);
            }
          }
          
          setTotalStudentsCount(totalCount);
        } catch (error) {
          console.error("Failed to fetch students count:", error);
          setTotalStudentsCount(0);
        } finally {
          setStudentsLoadingCount(false);
        }
      };
      
      fetchStudentsCount();
    } else if (!isCustomer) {
      // Reset count when not a customer
      setTotalStudentsCount(0);
    }
  }, [isCustomer, customerSchools]);

  const activeTrips = customerTrips.filter(
    (trip) => trip.status === "SCHEDULED" || trip.status === "IN_PROGRESS"
  ).length;

  const completedTrips = customerTrips.filter(
    (trip) => trip.status === "COMPLETED"
  ).length;
  // Stats for school users
  const schoolStats = [
    {
      title: "Total Schools",
      value: "12",
      description: "Active institutions",
      icon: School,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Fleet Vehicles",
      value: "48",
      description: "Buses in service",
      icon: Bus,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Students",
      value: "2,847",
      description: "Enrolled students",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Parent Accounts",
      value: "1,924",
      description: "Registered parents",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Stats for customer users
  const customerStats = [
    {
      title: "Total Schools",
      value: customerSchools.length.toString(),
      description: "Schools under management",
      icon: School,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Students",
      value: studentsLoadingCount ? "..." : totalStudentsCount.toLocaleString(),
      description: "Students across all schools",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Active Routes",
      value: customerRoutes.filter((r) => r.status === "active").length.toString(),
      description: "Active bus routes",
      icon: Route,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Scheduled Trips",
      value: activeTrips.toString(),
      description: "Trips scheduled today",
      icon: Calendar,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const stats = isCustomer ? customerStats : schoolStats;

  // Recent activity for school users
  const schoolActivity = [
    { action: "New school registered", time: "2 hours ago", type: "school" },
    { action: "Bus BUS-001 scheduled for maintenance", time: "4 hours ago", type: "fleet" },
    { action: "15 new students enrolled", time: "1 day ago", type: "student" },
    { action: "Parent imported student data", time: "2 days ago", type: "parent" },
  ];

  // Recent activity for customer users
  const customerActivity = [
    ...(customerTrips.length > 0
      ? [
          {
            action: `Trip "${customerTrips[0]?.route?.name}" completed`,
            time: "1 hour ago",
            type: "trip",
          },
        ]
      : []),
    ...(customerRoutes.length > 0
      ? [
          {
            action: `New route "${customerRoutes[0]?.routeName}" created`,
            time: "3 hours ago",
            type: "route",
          },
        ]
      : []),
    ...(customerSchools.length > 0
      ? [
          {
            action: `School "${customerSchools[0]?.name}" added`,
            time: "1 day ago",
            type: "school",
          },
        ]
      : []),
    { action: "System update completed", time: "2 days ago", type: "system" },
  ].slice(0, 4);

  const recentActivity = isCustomer ? customerActivity : schoolActivity;

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            {isCustomer ? `Welcome back, ${user?.name || "Customer"}!` : "Welcome to RocketRoll!"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {isCustomer
              ? "Manage your schools and monitor transportation operations."
              : "Your all-in-one school management platform."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customer-specific sections */}
        {isCustomer && (
          <>
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Quick Actions</CardTitle>
                <CardDescription>Common tasks and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50"
                    onClick={() => navigate("/schools")}
                  >
                    <School className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">Schools</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50"
                    onClick={() => navigate("/routes-zones")}
                  >
                    <Route className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium">Routes</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50"
                    onClick={() => navigate("/school-trips")}
                  >
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Trips</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50"
                    onClick={() => navigate("/fleet-crew")}
                  >
                    <Bus className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-medium">Fleet</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Schools */}
            {customerSchools.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Your Schools</CardTitle>
                      <CardDescription>Schools under your management</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("/schools")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customerSchools.slice(0, 6).map((school) => (
                      <Card
                        key={school.id}
                        className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate("/schools")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <School className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">{school.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">ID: {school.id}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {customerSchools.length === 0 && (
                    <div className="text-center py-8">
                      <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No schools found</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/schools")}
                      >
                        Add Your First School
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Onboarding Checklist - Only for school users */}
        {!isCustomer && (
          <div className="grid grid-cols-1 gap-6">
            <OnboardingChecklist />
          </div>
        )}

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {activity.type === "school" && <School className="w-4 h-4 text-blue-600" />}
                    {activity.type === "fleet" && <Bus className="w-4 h-4 text-green-600" />}
                    {activity.type === "student" && <GraduationCap className="w-4 h-4 text-purple-600" />}
                    {activity.type === "parent" && <Users className="w-4 h-4 text-orange-600" />}
                    {activity.type === "trip" && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === "route" && <Route className="w-4 h-4 text-green-600" />}
                    {activity.type === "system" && <TrendingUp className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
