// actions/_addNewClient.ts
"use server";
import { createAdminClient } from "@/lib/supabase/clients/admin";
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

export async function addNewClient(params: AddNewClientParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createAdminClient();

    // Verify trainer ownership
    const { data: trainer } = await supabase
      .from("trainer_trainers")
      .select("id")
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

    // TODO: Send invitation email if sendInvite is true
    // This would integrate with your email service (Resend, SendGrid, etc.)
    if (params.sendInvite) {
      // Example invitation logic:
      // const inviteToken = await generateInviteToken(newClient.id);
      // await sendInvitationEmail({
      //   to: params.email,
      //   clientName: params.fullName,
      //   inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/client/accept-invite?token=${inviteToken}`
      // });

      console.log("TODO: Send invitation email to:", params.email);
    }

    revalidatePath("/clients");

    return {
      success: true,
      clientId: newClient.id,
    };
  } catch (error) {
    console.error("Error in addNewClient:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
