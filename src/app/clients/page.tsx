// app/(dashboard)/clients/page.tsx
import ClientsTable from "@/components/clients/ClientsTable";
import ClientsStats from "@/components/clients/ClientStats";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createAdminClient();

  // Get trainer info
  const { data: trainer } = await supabase
    .from("trainer_trainers")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (!trainer) {
    redirect("/onboarding");
  }

  // Get all clients
  const { data: clients, error } = await supabase
    .from("trainer_clients")
    .select("*")
    .eq("trainer_id", trainer.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error);
  }

  // Calculate stats
  const totalClients = clients?.length || 0;
  const activeClients =
    clients?.filter((c) => c.status === "active").length || 0;
  const trialClients = clients?.filter((c) => c.status === "trial").length || 0;
  const monthlyRevenue =
    clients
      ?.filter((c) => c.status === "active" && c.monthly_rate)
      .reduce((sum, c) => sum + (c.monthly_rate || 0), 0) || 0;

  return (
    <div className="space-y-8 container mx-auto my-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600 mt-1">
            Manage your client roster and track their progress
          </p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <ClientsStats
        totalClients={totalClients}
        activeClients={activeClients}
        trialClients={trialClients}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Clients</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {clients && clients.length > 0 ? (
          <ClientsTable clients={clients} />
        ) : (
          <div className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first client to begin tracking their
                fitness journey
              </p>
              <Link href="/clients/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
