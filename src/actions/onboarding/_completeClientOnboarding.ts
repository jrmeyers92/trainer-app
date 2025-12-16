// actions/onboarding/_completeClientOnboarding.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import { ClientOnboardingValues } from "@/lib/validations/clientOnboardingSchema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function completeClientOnboarding(values: ClientOnboardingValues) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createAdminClient();
    const clerk = await clerkClient();

    // 1. Get Clerk user's email
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { success: false, error: "Email not found" };
    }

    // 2. Check if this is an invited client (token provided)
    let existingClientId = null;

    if (values.token) {
      // Validate invitation token
      const { data: invitation } = await supabase
        .from("trainer_client_invitations")
        .select("id, client_id, status, expires_at")
        .eq("token", values.token)
        .eq("trainer_id", values.trainerId)
        .single();

      if (!invitation) {
        return { success: false, error: "Invalid invitation" };
      }

      if (invitation.status !== "pending") {
        return { success: false, error: "Invitation already used" };
      }

      if (new Date(invitation.expires_at) < new Date()) {
        return { success: false, error: "Invitation expired" };
      }

      existingClientId = invitation.client_id;

      // Mark invitation as accepted
      await supabase
        .from("trainer_client_invitations")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);
    }

    // 3. Prepare update data
    const updateData = {
      client_user_id: userId,
      full_name: values.fullName,
      phone: values.phone || null,
      date_of_birth: values.dateOfBirth || null,
      gender: values.gender || null,
      height_feet: values.heightFeet ? parseInt(values.heightFeet) : null,
      height_inches: values.heightInches ? parseInt(values.heightInches) : null,
      current_weight_lbs: values.currentWeight
        ? parseFloat(values.currentWeight)
        : null,
      starting_weight: values.currentWeight
        ? parseFloat(values.currentWeight)
        : null,
      goal_weight_lbs: values.goalWeight ? parseFloat(values.goalWeight) : null,
      activity_level: values.activityLevel || null,
      primary_goal: values.primaryGoal || null,
      goal_notes: values.goals, // Map 'goals' to 'goal_notes'
      injuries: values.injuries || null,
      medical_conditions: values.medicalConditions || null,
      dietary_restrictions: values.dietaryRestrictions || null,
      portal_enabled: true,
      status: "active" as const,
      updated_at: new Date().toISOString(),
    };

    // 4. Create or update client record
    let clientId = existingClientId;

    if (existingClientId) {
      // Update existing client (from invitation)
      const { error: updateError } = await supabase
        .from("trainer_clients")
        .update(updateData)
        .eq("id", existingClientId);

      if (updateError) {
        console.error("Error updating client:", updateError);
        return { success: false, error: "Failed to update profile" };
      }
    } else {
      // Check if client already exists with this email
      const { data: existingClient } = await supabase
        .from("trainer_clients")
        .select("id, client_user_id")
        .eq("trainer_id", values.trainerId)
        .eq("email", email)
        .single();

      if (existingClient?.client_user_id) {
        return {
          success: false,
          error: "You're already registered with this trainer",
        };
      }

      if (existingClient) {
        // Update existing client record (created without user_id)
        clientId = existingClient.id;

        const { error: updateError } = await supabase
          .from("trainer_clients")
          .update(updateData)
          .eq("id", existingClient.id);

        if (updateError) {
          console.error("Error updating client:", updateError);
          return { success: false, error: "Failed to update profile" };
        }
      } else {
        // Create new client record
        const { data: newClient, error: insertError } = await supabase
          .from("trainer_clients")
          .insert({
            trainer_id: values.trainerId,
            email: email,
            ...updateData,
            payment_status: "current" as const,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Error creating client:", insertError);
          return { success: false, error: "Failed to create profile" };
        }

        clientId = newClient.id;
      }
    }

    // 5. Update Clerk user metadata
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "client",
        onboardingComplete: true,
        clientId: clientId,
        trainerId: values.trainerId,
      },
    });

    revalidatePath("/clients");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in completeClientOnboarding:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
