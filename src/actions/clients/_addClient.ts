"use server";
import { sendClientInvitation } from "@/lib/email/send-client-invitation";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { createInvitation } from "@/lib/utils/invite-tokens";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface AddNewClientParams {
  trainerId: string;
  fullName: string;
  email: string;
  phone: string | null;
  leadSource: string | null;
  primaryGoal: string | null;
  goalNotes: string | null;
  monthlyRate: number | null;
  sendInvite: boolean;
}

export async function addClient(params: AddNewClientParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createAdminClient();

    // Verify trainer ownership and get trainer details
    const { data: trainer } = await supabase
      .from("trainer_trainers")
      .select("id, full_name, email, business_name")
      .eq("clerk_user_id", userId)
      .eq("id", params.trainerId)
      .single();

    if (!trainer) {
      return { success: false, error: "Trainer not found" };
    }

    // Check if email already exists for this trainer
    const { data: existingClient } = await supabase
      .from("trainer_clients")
      .select("id")
      .eq("trainer_id", params.trainerId)
      .eq("email", params.email)
      .single();

    if (existingClient) {
      return {
        success: false,
        error: "A client with this email already exists",
      };
    }

    // Insert new client
    const { data: newClient, error: insertError } = await supabase
      .from("trainer_clients")
      .insert({
        trainer_id: params.trainerId,
        full_name: params.fullName,
        email: params.email,
        phone: params.phone,
        lead_source: params.leadSource,
        primary_goal: params.primaryGoal,
        goal_notes: params.goalNotes,
        monthly_rate: params.monthlyRate,
        status: "active",
        payment_status: "current",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting client:", insertError);
      return { success: false, error: "Failed to create client" };
    }

    // Send invitation email if requested
    if (params.sendInvite) {
      try {
        // Create invitation record
        const invitation = await createInvitation(
          newClient.id,
          params.trainerId,
          params.email
        );

        // Send email
        const emailResult = await sendClientInvitation({
          to: params.email,
          clientName: params.fullName,
          trainerName: trainer.full_name || "Your Trainer",
          trainerEmail: trainer.email,
          trainerBusinessName: trainer.business_name || undefined,
          inviteToken: invitation.token,
        });

        if (!emailResult.success) {
          console.error("Failed to send invitation email:", emailResult.error);
          // Don't fail the whole operation if email fails
          return {
            success: true,
            clientId: newClient.id,
            warning:
              "Client created but invitation email failed to send. You can resend it later.",
          };
        }
      } catch (error) {
        console.error("Error sending invitation:", error);
        return {
          success: true,
          clientId: newClient.id,
          warning:
            "Client created but invitation email failed to send. You can resend it later.",
        };
      }
    }

    revalidatePath("/clients");

    return {
      success: true,
      clientId: newClient.id,
    };
  } catch (error) {
    console.error("Error in addClient:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
