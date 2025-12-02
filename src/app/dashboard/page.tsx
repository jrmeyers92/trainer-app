// app/dashboard/page.tsx
import ClientsList from "@/components/dashboard/ClientsList";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");

  const role = sessionClaims?.metadata?.role;
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

  // Redirect if not completed onboarding
  if (!onboardingComplete) {
    if (role === "trainer") {
      redirect("/onboarding/trainer");
    } else {
      redirect("/onboarding/role-selection");
    }
  }

  // Get trainer data
  const supabase = await createAdminClient();
  const { data: trainer } = await supabase
    .from("trainer_trainers")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (!trainer) {
    redirect("/onboarding/role-selection");
  }

  // Get clients
  const { data: clients } = await supabase
    .from("trainer_clients")
    .select("*")
    .eq("trainer_id", trainer.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const activeClients =
    clients?.filter((c) => c.status === "active").length || 0;
  const totalClients = clients?.length || 0;
  const monthlyRevenue =
    clients
      ?.filter((c) => c.status === "active")
      .reduce((sum, c) => sum + (c.monthly_rate || 0), 0) || 0;
  const clientsNeedingCheckIn =
    clients?.filter((c) => {
      // Logic: clients who haven't checked in this week
      // For now, just show clients who've been active for more than 7 days
      if (!c.created_at) return false;
      const daysSinceStart = Math.floor(
        (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceStart > 7;
    }).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {trainer.full_name?.split(" ")[0] || "Coach"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your clients today
              </p>
            </div>
            <Link href="/dashboard/clients/new">
              <Button size="lg" className="gap-2">
                <Plus size={20} />
                Add Client
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <DashboardStats
            totalClients={totalClients}
            activeClients={activeClients}
            monthlyRevenue={monthlyRevenue}
            clientsNeedingCheckIn={clientsNeedingCheckIn}
          />

          {/* Quick Actions */}
          <QuickActions clientCount={totalClients} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Clients List - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <ClientsList clients={clients || []} trainerId={trainer.id} />
            </div>

            {/* Recent Activity - Takes up 1 column */}
            <div className="lg:col-span-1">
              <RecentActivity clients={clients || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
