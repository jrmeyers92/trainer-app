import { Apple, Dumbbell, FileText, Users } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  clientCount: number;
}

export default function QuickActions({ clientCount }: QuickActionsProps) {
  const actions = [
    {
      name: "Add Client",
      description: "Onboard a new client",
      icon: Users,
      href: "/clients/new",
      color: "bg-blue-600 hover:bg-blue-700",
      show: true,
    },
    {
      name: "Create Workout",
      description: "Build a training program",
      icon: Dumbbell,
      href: "/dashboard/programs/new",
      color: "bg-green-600 hover:bg-green-700",
      show: clientCount > 0,
    },
    {
      name: "Nutrition Plan",
      description: "Design a meal plan",
      icon: Apple,
      href: "/dashboard/nutrition/new",
      color: "bg-orange-600 hover:bg-orange-700",
      show: clientCount > 0,
    },
    {
      name: "View Reports",
      description: "Client progress analytics",
      icon: FileText,
      href: "/dashboard/reports",
      color: "bg-purple-600 hover:bg-purple-700",
      show: clientCount > 0,
    },
  ];

  const visibleActions = actions.filter((action) => action.show);

  if (visibleActions.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleActions.map((action) => (
          <Link key={action.name} href={action.href}>
            <div className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
              <div
                className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
              >
                <action.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.name}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
