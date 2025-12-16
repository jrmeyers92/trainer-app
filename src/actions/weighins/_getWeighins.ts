// actions/weighins/_getWeighIns.ts
"use server";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";

export async function getWeighIns() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated", data: [] };
    }

    const supabase = await createAdminClient();

    // Fetch all weigh-ins for the user, ordered by date
    const { data: weighIns, error } = await supabase
      .from("trainer_weigh_in")
      .select("id, weight, weigh_in_date, notes, created_at")
      .eq("clerk_user_id", userId)
      .order("weigh_in_date", { ascending: true });

    if (error) {
      console.error("Error fetching weigh-ins:", error);
      return { success: false, error: "Failed to fetch weigh-ins", data: [] };
    }

    return {
      success: true,
      data: weighIns || [],
    };
  } catch (error) {
    console.error("Error in getWeighIns:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      data: [],
    };
  }
}
