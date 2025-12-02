// components/dashboard/RecentActivity.tsx
import { Client } from "@/lib/types/database-helpers";
import { Clock } from "lucide-react";

interface RecentActivityProps {
  clients: Client[];
}

export default function RecentActivity({ clients }: RecentActivityProps) {
  // Generate activity feed from clients
  const activities = clients
    .slice(0, 5)
    .map((client) => ({
      id: client.id,
      type: "client_added",
      clientName: client.full_name,
      timestamp: client.created_at || new Date().toISOString(),
      description: "New client added",
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500 text-sm">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p>No activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Clock size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-sm text-gray-600">{activity.clientName}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
