// app/(auth)/onboarding/_actions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import { Roles } from "@/lib/types/global.t";
import { auth, clerkClient } from "@clerk/nextjs/server";

type RoleSelectionResponse = {
  success: boolean;
  error?: string;
  data?: {
    role: Roles;
  };
};

export async function setRole(
  formData: FormData
): Promise<RoleSelectionResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const role = formData.get("role") as Roles;

    if (!role || (role !== "client" && role !== "trainer")) {
      return {
        success: false,
        error: "Invalid role",
      };
    }

    const client = await clerkClient();

    // If trainer, create trainer record in Supabase
    if (role === "trainer") {
      const supabase = await createAdminClient();

      // Get user email from Clerk
      const user = await client.users.getUser(userId);

      // Check if trainer already exists
      const { data: existingTrainer } = await supabase
        .from("trainer_trainers")
        .select("id")
        .eq("clerk_user_id", userId)
        .single();

      if (!existingTrainer) {
        // Create trainer record
        const { error: insertError } = await supabase
          .from("trainer_trainers")
          .insert({
            clerk_user_id: userId,
            email: user.emailAddresses[0]?.emailAddress || "",
            full_name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
            subscription_plan: "free",
            subscription_status: "trialing",
            trial_ends_at: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000
            ).toISOString(), // 14 days from now
          });

        if (insertError) {
          console.error("Error creating trainer:", insertError);
          return {
            success: false,
            error: "Failed to create trainer account",
          };
        }
      }
    }

    // Update Clerk metadata
    const updateOnboarding = role === "client" ? true : false;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
        onboardingComplete: updateOnboarding,
      },
    });

    return {
      success: true,
      data: { role },
    };
  } catch (error) {
    console.error("Error setting role:", error);
    return {
      success: false,
      error: "Failed to set role. Please try again.",
    };
  }
}
