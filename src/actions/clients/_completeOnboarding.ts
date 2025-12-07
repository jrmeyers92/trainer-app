// actions/clients/complete-onboarding.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CompleteOnboardingParams {
  trainerId: string;
  userId: string;
  token: string | null;
  fullName: string;
  phone: string | null;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  heightFeet: number;
  heightInches: number;
  currentWeight: number;
  goalWeight: number | null;
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  primaryGoal:
    | "weight_loss"
    | "muscle_gain"
    | "maintenance"
    | "athletic_performance"
    | null;
  goalNotes: string | null;
  injuries: string | null;
  medicalConditions: string | null;
  dietaryRestrictions: string | null;
}

export async function completeClientOnboarding(
  params: CompleteOnboardingParams
) {
  try {
    const supabase = await createAdminClient();
    const clerk = await clerkClient();

    // 1. Get Clerk user's email
    const clerkUser = await clerk.users.getUser(params.userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { success: false, error: "Email not found" };
    }

    // 2. Check if this is an invited client (token provided)
    let existingClientId = null;

    if (params.token) {
      // Validate invitation token
      const { data: invitation } = await supabase
        .from("trainer_client_invitations")
        .select("id, client_id, status, expires_at")
        .eq("token", params.token)
        .eq("trainer_id", params.trainerId)
        .single();

      if (invitation) {
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
    }

    // 3. Create or update client record
    let clientId = existingClientId;

    if (existingClientId) {
      // Update existing client (from invitation)
      const { error: updateError } = await supabase
        .from("trainer_clients")
        .update({
          client_user_id: params.userId,
          full_name: params.fullName,
          phone: params.phone,
          date_of_birth: params.dateOfBirth,
          gender: params.gender,
          height_feet: params.heightFeet,
          height_inches: params.heightInches,
          current_weight_lbs: params.currentWeight,
          goal_weight_lbs: params.goalWeight,
          activity_level: params.activityLevel,
          primary_goal: params.primaryGoal,
          goal_notes: params.goalNotes,
          injuries: params.injuries,
          medical_conditions: params.medicalConditions,
          dietary_restrictions: params.dietaryRestrictions,
          portal_enabled: true,
          status: "active",
          updated_at: new Date().toISOString(),
        })
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
        .eq("trainer_id", params.trainerId)
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
          .update({
            client_user_id: params.userId,
            full_name: params.fullName,
            phone: params.phone,
            date_of_birth: params.dateOfBirth,
            gender: params.gender,
            height_feet: params.heightFeet,
            height_inches: params.heightInches,
            current_weight_lbs: params.currentWeight,
            goal_weight_lbs: params.goalWeight,
            activity_level: params.activityLevel,
            primary_goal: params.primaryGoal,
            goal_notes: params.goalNotes,
            injuries: params.injuries,
            medical_conditions: params.medicalConditions,
            dietary_restrictions: params.dietaryRestrictions,
            portal_enabled: true,
            status: "active",
            updated_at: new Date().toISOString(),
          })
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
            trainer_id: params.trainerId,
            client_user_id: params.userId,
            full_name: params.fullName,
            email: email,
            phone: params.phone,
            date_of_birth: params.dateOfBirth,
            gender: params.gender,
            height_feet: params.heightFeet,
            height_inches: params.heightInches,
            current_weight_lbs: params.currentWeight,
            goal_weight_lbs: params.goalWeight,
            activity_level: params.activityLevel,
            primary_goal: params.primaryGoal,
            goal_notes: params.goalNotes,
            injuries: params.injuries,
            medical_conditions: params.medicalConditions,
            dietary_restrictions: params.dietaryRestrictions,
            portal_enabled: true,
            status: "active",
            payment_status: "current",
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

    // 4. Update Clerk user metadata
    await clerk.users.updateUserMetadata(params.userId, {
      publicMetadata: {
        role: "client",
        clientId: clientId,
        trainerId: params.trainerId,
      },
    });

    revalidatePath("/clients");
    revalidatePath("/client/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in completeClientOnboarding:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
