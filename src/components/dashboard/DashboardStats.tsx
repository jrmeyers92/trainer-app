// components/dashboard/DashboardStats.tsx
import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";

interface DashboardStatsProps {
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  clientsNeedingCheckIn: number;
}

export default function DashboardStats({
  totalClients,
  activeClients,
  monthlyRevenue,
  clientsNeedingCheckIn,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      description: `${activeClients} active`,
    },
    {
      name: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      description: "From active clients",
    },
    {
      name: "Active Rate",
      value:
        totalClients > 0
          ? `${Math.round((activeClients / totalClients) * 100)}%`
          : "0%",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      description: "Client retention",
    },
    {
      name: "Need Check-in",
      value: clientsNeedingCheckIn,
      icon: AlertCircle,
      color: "bg-amber-100 text-amber-600",
      description: "This week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
