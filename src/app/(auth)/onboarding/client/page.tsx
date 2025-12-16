// app/onboarding/client/page.tsx
import ClientOnboardingForm from "@/components/forms/onboarding/ClientOnboardingForm";
import { getUserRole, hasCompletedOnboarding } from "@/lib/roles";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { InvitationWithTrainer } from "@/lib/types/database-helpers";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    trainerId?: string;
    token?: string;
  }>;
}

export default async function ClientOnboardingPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const { trainerId, token } = params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already completed onboarding
  const onboardingComplete = await hasCompletedOnboarding();
  if (onboardingComplete) {
    redirect("/dashboard");
  }

  if (!trainerId || !token) {
    redirect("/onboarding/role-selection");
  }

  const supabase = await createAdminClient();
  const clerk = await clerkClient();

  // Validate invitation
  const { data: invitation, error: invitationError } = await supabase
    .from("trainer_client_invitations")
    .select(
      `
      id,
      client_id,
      email,
      status,
      expires_at,
      trainer:trainer_trainers!trainer_client_invitations_trainer_id_fkey (
        id,
        full_name,
        business_name
      )
    `
    )
    .eq("token", token)
    .eq("trainer_id", trainerId)
    .single();

  if (invitationError || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation link is invalid. Please contact your trainer for a
            new invitation.
          </p>
        </div>
      </div>
    );
  }

  // Check if invitation is valid
  if (invitation.status !== "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid or Expired Invitation
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation link has expired or has already been used. Please
            contact your trainer for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invitation Expired
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation link has expired. Please contact your trainer for a
            new invitation.
          </p>
        </div>
      </div>
    );
  }

  // Get client data
  const { data: clientData } = await supabase
    .from("trainer_clients")
    .select("full_name, email, phone, primary_goal, goal_notes")
    .eq("id", invitation.client_id)
    .single();

  // Get current user role
  const currentRole = await getUserRole();

  // Set role to "client" if not already set
  // This is critical - ensures middleware doesn't redirect them away
  if (!currentRole) {
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "client",
        onboardingComplete: false,
      },
    });
  }

  const typedInvitation = invitation as InvitationWithTrainer;
  const trainerInfo = typedInvitation.trainer[0];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome to{" "}
            {trainerInfo.business_name || `${trainerInfo.full_name}'s Coaching`}
            !
          </h1>
          <p className="text-gray-600">
            Complete your profile to get started with your personalized fitness
            journey
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ClientOnboardingForm
            initialData={{
              email: invitation.email,
              fullName: clientData?.full_name ?? undefined,
              phone: clientData?.phone ?? undefined,
              primaryGoal: clientData?.primary_goal ?? undefined,
              goalNotes: clientData?.goal_notes ?? undefined,
              trainerName: trainerInfo.full_name ?? "Your Trainer",
              trainerBusinessName: trainerInfo.business_name ?? undefined,
            }}
            trainerId={trainerId}
            token={token}
          />
        </div>
      </div>
    </div>
  );
}
