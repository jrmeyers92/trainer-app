"use server";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface AddWeighInParams {
  weight: number;
  weighInDate: string;
  notes: string | null;
  clerkUserId: string;
}

export async function addWeighIn(params: AddWeighInParams) {
  console.log("🚀 addWeighIn called with params:", params);

  try {
    const { userId } = await auth();
    console.log("👤 Auth userId:", userId);

    if (!userId) {
      console.log("❌ No userId found");
      return { success: false, error: "Not authenticated" };
    }

    if (userId !== params.clerkUserId) {
      console.log("❌ UserId mismatch", {
        userId,
        paramsClerkUserId: params.clerkUserId,
      });
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createAdminClient();
    console.log("✅ Supabase client created");

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from("trainer_clients")
      .select("id, client_user_id")
      .eq("client_user_id", userId)
      .single();

    console.log("🔍 Client lookup result:", { client, clientError });

    if (!client || clientError) {
      console.error("❌ Client lookup error:", clientError);
      return { success: false, error: "Client not found" };
    }

    console.log("✅ Client found:", client);

    // Insert new weigh-in
    const insertData = {
      weight: params.weight,
      weigh_in_date: params.weighInDate,
      notes: params.notes,
      clerk_user_id: params.clerkUserId,
    };

    console.log("📝 Attempting to insert:", insertData);

    const { data: newWeighIn, error: insertError } = await supabase
      .from("trainer_weigh_in")
      .insert(insertData)
      .select()
      .single();

    console.log("💾 Insert result:", { newWeighIn, insertError });

    if (insertError) {
      console.error("❌ Error inserting weigh-in:", insertError);
      return { success: false, error: "Failed to record weigh-in" };
    }

    console.log("✅ Weigh-in created successfully:", newWeighIn);

    revalidatePath("/dashboard/weigh-ins");

    return {
      success: true,
      weighInId: newWeighIn.id,
    };
  } catch (error) {
    console.error("💥 Unexpected error in addWeighIn:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
