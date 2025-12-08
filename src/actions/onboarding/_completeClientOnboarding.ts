// app/(auth)/client-onboarding/_actions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  clientOnboardingSchema,
  ClientOnboardingValues,
} from "@/lib/validations/clientOnboardingSchema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

type ClientOnboardingResponse = {
  success: boolean;
  error?: string;
  validationErrors?: z.ZodIssue[];
};

export async function completeClientOnboarding(
  data: ClientOnboardingValues
): Promise<ClientOnboardingResponse> {
  try {
    // Validate form data
    const validatedData = clientOnboardingSchema.parse(data);

    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const supabase = await createAdminClient();

    // Verify invitation is still valid
    const { data: invitation, error: inviteError } = await supabase
      .from("trainer_client_invitations")
      .select("*")
      .eq("token", validatedData.token)
      .eq("trainer_id", validatedData.trainerId)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .single();

    if (inviteError || !invitation) {
      return {
        success: false,
        error: "Invalid or expired invitation",
      };
    }

    // Get user email from Clerk
    const clerkClientInstance = await clerkClient();
    const user = await clerkClientInstance.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return {
        success: false,
        error: "User email not found",
      };
    }

    // Verify email matches invitation
    if (userEmail !== invitation.email) {
      return {
        success: false,
        error: "Email doesn't match invitation",
      };
    }

    // Update the existing client record with onboarding data
    const { error: updateError } = await supabase
      .from("trainer_clients")
      .update({
        clerk_user_id: userId,
        full_name: validatedData.fullName,
        phone: validatedData.phone || null,
        goals: validatedData.goals,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitation.client_id);

    if (updateError) {
      console.error("Error updating client:", updateError);
      return {
        success: false,
        error: "Failed to update client profile",
      };
    }

    // Mark invitation as accepted
    const { error: acceptError } = await supabase
      .from("trainer_client_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitation.id);

    if (acceptError) {
      console.error("Error accepting invitation:", acceptError);
      // Don't fail the whole process if this fails
    }

    // Update Clerk metadata to set role and mark onboarding as complete
    await clerkClientInstance.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "client",
        onboardingComplete: true,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.issues,
      };
    }

    console.error("Error completing client onboarding:", error);
    return {
      success: false,
      error: "Failed to complete onboarding. Please try again.",
    };
  }
}
