
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GraduationCap } from "lucide-react";
import { Parent } from "../types";

interface ParentsStatsProps {
  parents: Parent[];
  totalStudents?: number;
}

export const ParentsStats = ({ parents, totalStudents: providedTotalStudents }: ParentsStatsProps) => {
  const activeParents = parents.filter(p => p.status === "Active").length;
  const inactiveParents = parents.filter(p => p.status === "Inactive").length;
  
  // Use provided totalStudents if available, otherwise calculate from parents
  const totalStudents = providedTotalStudents !== undefined 
    ? providedTotalStudents 
    : parents.reduce((sum, parent) => {
        const count = parent.studentsCount || 0;
        return sum + (isNaN(count) ? 0 : count);
      }, 0);

  const stats = [
    {
      title: "Total Parents",
      value: parents.length,
      description: "Registered accounts",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Parents", 
      value: activeParents,
      description: "Currently active",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Inactive Parents",
      value: inactiveParents,
      description: "Currently inactive",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Total Students",
      value: totalStudents,
      description: "Enrolled students",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
