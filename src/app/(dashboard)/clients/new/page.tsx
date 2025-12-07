import NewClientForm from "@/components/forms/onboarding/NewClientForm";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewClientPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get trainer info
  const supabase = await createAdminClient();
  const { data: trainer } = await supabase
    .from("trainer_trainers")
    .select("id, subscription_plan")
    .eq("clerk_user_id", userId)
    .single();

  if (!trainer) {
    redirect("/onboarding");
  }

  // Check client limit based on subscription
  const { count: clientCount } = await supabase
    .from("trainer_clients")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", trainer.id)
    .eq("status", "active");

  const clientLimits = {
    free: 3,
    pro: 15,
    business: 999999,
  };

  const limit =
    clientLimits[trainer.subscription_plan as keyof typeof clientLimits] || 3;
  const hasReachedLimit = (clientCount || 0) >= limit;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Client</h1>
        <p className="text-gray-600">
          Create a new client profile and send them an invitation to join their
          portal
        </p>
      </div>

      {hasReachedLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-900 mb-1">
            Client Limit Reached
          </h3>
          <p className="text-sm text-amber-800">
            You&apos;ve reached your limit of {limit} active clients on the{" "}
            {trainer.subscription_plan} plan. Upgrade your plan to add more
            clients.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <NewClientForm trainerId={trainer.id} canAddClient={!hasReachedLimit} />
      </div>
    </div>
  );
}
