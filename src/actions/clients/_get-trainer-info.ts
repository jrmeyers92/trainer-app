// actions/clients/get-trainer-info.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";

export async function getTrainerInfo(trainerId: string) {
  try {
    const supabase = await createAdminClient();

    const { data: trainer, error } = await supabase
      .from("trainer_trainers")
      .select("id, full_name, business_name, email")
      .eq("id", trainerId)
      .single();

    if (error || !trainer) {
      return null;
    }

    return {
      id: trainer.id,
      fullName: trainer.full_name,
      businessName: trainer.business_name,
      email: trainer.email,
    };
  } catch (error) {
    console.error("Error fetching trainer info:", error);
    return null;
  }
}
