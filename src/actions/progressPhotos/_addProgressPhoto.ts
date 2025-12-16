"use server";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface AddProgressPhotoParams {
  photo: File;
  photoDate: string;
  notes: string | null;
  clerkUserId: string;
}

export async function addProgressPhoto(params: AddProgressPhotoParams) {
  console.log("🚀 addProgressPhoto called with params:", {
    ...params,
    photo: `${params.photo.name} (${params.photo.size} bytes)`,
  });

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

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from("trainer_clients")
      .select("id, client_user_id")
      .eq("client_user_id", userId)
      .single();

    if (!client || clientError) {
      console.error("❌ Client lookup error:", clientError);
      return { success: false, error: "Client not found" };
    }

    // Upload photo to Supabase Storage
    const fileExt = params.photo.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log("📤 Uploading file:", fileName);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("trainer-app") // Just the bucket name
      .upload(`progress-photos/${fileName}`, params.photo, {
        // Folder in the path
        contentType: params.photo.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Error uploading photo:", uploadError);
      return { success: false, error: "Failed to upload photo" };
    }

    console.log("✅ Photo uploaded successfully:", uploadData);

    // Get public URL for the uploaded photo
    const { data: urlData } = supabase.storage
      .from("progress-photos")
      .getPublicUrl(fileName);

    const photoUrl = urlData.publicUrl;
    console.log("🔗 Photo URL:", photoUrl);

    // Insert progress photo record
    const insertData = {
      photo_date: params.photoDate,
      photo_url: photoUrl,
      notes: params.notes,
      clerk_user_id: params.clerkUserId,
    };

    console.log("📝 Attempting to insert:", insertData);

    const { data: newProgressPhoto, error: insertError } = await supabase
      .from("trainer_progress_photo")
      .insert(insertData)
      .select()
      .single();

    console.log("💾 Insert result:", { newProgressPhoto, insertError });

    if (insertError) {
      console.error("❌ Error inserting progress photo:", insertError);

      // Clean up uploaded file if database insert fails
      await supabase.storage.from("progress-photos").remove([fileName]);

      return { success: false, error: "Failed to record progress photo" };
    }

    console.log("✅ Progress photo created successfully:", newProgressPhoto);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");
    revalidatePath("/dashboard/progress-photos");

    return {
      success: true,
      progressPhotoId: newProgressPhoto.id,
      photoUrl: photoUrl,
    };
  } catch (error) {
    console.error("💥 Unexpected error in addProgressPhoto:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
