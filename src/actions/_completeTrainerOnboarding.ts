// app/(auth)/onboarding/trainer/_actions.ts
"use server";

import {
  trainerOnboardingSchema,
  TrainerOnboardingValues,
} from "@/lib/schemas/trainer-onboarding";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

type TrainerOnboardingResponse = {
  success: boolean;
  error?: string;
  validationErrors?: z.ZodError["errors"];
};

export async function completeTrainerOnboarding(
  data: TrainerOnboardingValues
): Promise<TrainerOnboardingResponse> {
  try {
    // Validate form data
    const validatedData = trainerOnboardingSchema.parse(data);

    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const supabase = await createAdminClient();

    // Get existing trainer record (should exist from role selection)
    const { data: existingTrainer, error: fetchError } = await supabase
      .from("trainer_trainers")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (fetchError || !existingTrainer) {
      return {
        success: false,
        error: "Trainer profile not found. Please contact support.",
      };
    }

    // Update trainer record with onboarding data
    const { error: updateError } = await supabase
      .from("trainer_trainers")
      .update({
        full_name: validatedData.fullName,
        business_name: validatedData.businessName || null,
        phone: validatedData.phone || null,
        bio: validatedData.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", userId);

    if (updateError) {
      console.error("Error updating trainer:", updateError);
      return {
        success: false,
        error: "Failed to update trainer profile",
      };
    }

    // Update Clerk metadata to mark onboarding as complete
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "trainer",
        onboardingComplete: true,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error("Error completing trainer onboarding:", error);
    return {
      success: false,
      error: "Failed to complete onboarding. Please try again.",
    };
  }
}
