// app/(auth)/client-onboarding/page.tsx
import ClientOnboardingForm from "@/components/forms/onboarding/ClientOnboardingForm";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    trainerId?: string;
    token?: string;
  };
}

export default async function ClientOnboardingPage({
  searchParams,
}: PageProps) {
  const { userId, sessionClaims } = await auth();
  const { trainerId, token } = searchParams;

  // Check authentication
  if (!userId) redirect("/sign-in");

  // Validate required params
  if (!trainerId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Invalid Invitation
          </h1>
          <p className="text-gray-600">
            This invitation link is invalid. Please contact your trainer for a
            new invitation.
          </p>
        </div>
      </div>
    );
  }

  // Validate invitation token
  const supabase = await createAdminClient();
  const { data: invitation, error: inviteError } = await supabase
    .from("trainer_client_invitations")
    .select(
      `
      *,
      trainer:trainer_trainers!trainer_id (
        full_name,
        business_name,
        email
      )
    `
    )
    .eq("token", token)
    .eq("trainer_id", trainerId)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .single();

  if (inviteError || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Invalid or Expired Invitation
          </h1>
          <p className="text-gray-600 mb-4">
            This invitation link has expired or has already been used.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your trainer for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  // Check if already completed onboarding
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
  if (onboardingComplete) {
    redirect("/dashboard");
  }

  // Get user info from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const initialData = {
    email: user.emailAddresses[0]?.emailAddress || "",
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    trainerName: invitation.trainer.full_name || "Your Trainer",
    trainerBusinessName: invitation.trainer.business_name,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Users className="text-green-600" size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <p className="text-gray-600">
            Join{" "}
            {initialData.trainerBusinessName ||
              `${initialData.trainerName}'s Coaching`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complete your profile to get started
          </p>
        </div>

        <ClientOnboardingForm
          initialData={initialData}
          trainerId={trainerId}
          token={token}
        />
      </div>
    </div>
  );
}
