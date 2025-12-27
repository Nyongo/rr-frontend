
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, UserCheck } from "lucide-react";
import { Bus as BusType, Driver, Minder } from "../types";

interface FleetStatsProps {
  buses: BusType[];
  drivers: Driver[];
  minders: Minder[];
}

export const FleetStats = ({ buses, drivers, minders }: FleetStatsProps) => {
  const stats = [
    {
      title: "Total Buses",
      value: buses.length,
      description: "Fleet vehicles",
      icon: Bus,
      color: "from-blue-500 to-cyan-500",
      active: buses.filter(bus => bus.status === "Active").length,
      inactive: buses.filter(bus => bus.status === "Inactive").length,
    },
    {
      title: "Total Drivers",
      value: drivers.length,
      description: "Licensed drivers",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      active: drivers.filter(driver => driver.status === "Active").length,
      inactive: drivers.filter(driver => driver.status === "Inactive").length,
    },
    {
      title: "Total Minders",
      value: minders.length,
      description: "Student supervisors",
      icon: UserCheck,
      color: "from-purple-500 to-pink-500",
      active: minders.filter(minder => minder.status === "Active").length,
      inactive: minders.filter(minder => minder.status === "Inactive").length,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              <div className="flex justify-between mt-3 text-xs">
                <span className="text-green-600">Active: {stat.active}</span>
                <span className="text-red-600">Inactive: {stat.inactive}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
