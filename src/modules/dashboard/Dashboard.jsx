import { useContext } from "react";

import DashboardLayout
from "../../layouts/DashboardLayout";

import { AuthContext }
from "../../context/AuthContext";

import {
  Building2,
  ShieldCheck,
  Users,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {

  const { user } =
    useContext(AuthContext);

  // Static data for dashboard
  const stats = [
    {
      title: "Total Departments",
      value: "8",
      icon: Building2,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Roles",
      value: "12",
      icon: ShieldCheck,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Employees",
      value: "156",
      icon: Users,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Tasks",
      value: "24",
      icon: Clock,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New department created",
      details: "Marketing Department",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    {
      id: 2,
      action: "Role updated",
      details: "Manager permissions modified",
      time: "5 hours ago",
      icon: ShieldCheck,
      iconColor: "text-purple-600",
    },
    {
      id: 3,
      action: "Employee joined",
      details: "John Doe - Engineering",
      time: "1 day ago",
      icon: Users,
      iconColor: "text-blue-600",
    },
    {
      id: 4,
      action: "Department reorganized",
      details: "Sales team restructured",
      time: "2 days ago",
      icon: Building2,
      iconColor: "text-gray-600",
    },
  ];

  const topDepartments = [
    { name: "Engineering", employeeCount: 45, color: "bg-blue-500" },
    { name: "Sales", employeeCount: 32, color: "bg-green-500" },
    { name: "Marketing", employeeCount: 28, color: "bg-purple-500" },
    { name: "Human Resources", employeeCount: 18, color: "bg-orange-500" },
  ];

  return (
    <DashboardLayout>

      <div className="p-6">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,
            {" "}
            {user?.name || "Admin"}
          </h1>

          <p className="text-gray-500 mt-2">
            Dashboard overview and statistics
          </p>

        </div>

        {/* STATS CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className={stat.iconColor} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RECENT ACTIVITIES & TOP DEPARTMENTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* RECENT ACTIVITIES */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <Icon className={activity.iconColor} size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.details}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOP DEPARTMENTS */}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top Departments
            </h2>
            <div className="space-y-4">
              {topDepartments.map((dept, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {dept.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {dept.employeeCount} employees
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${dept.color} h-2 rounded-full`}
                      style={{
                        width: `${(dept.employeeCount / 45) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">156</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Active Departments</p>
                  <p className="text-2xl font-bold text-gray-800">8</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;