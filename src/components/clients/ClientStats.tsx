// components/clients/ClientsStats.tsx
import { DollarSign, UserCheck, UserPlus, Users } from "lucide-react";

interface ClientsStatsProps {
  totalClients: number;
  activeClients: number;
  trialClients: number;
  monthlyRevenue: number;
}

export default function ClientsStats({
  totalClients,
  activeClients,
  trialClients,
  monthlyRevenue,
}: ClientsStatsProps) {
  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Clients",
      value: activeClients,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Trial Clients",
      value: trialClients,
      icon: UserPlus,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Monthly Revenue",
      value: `$${monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
