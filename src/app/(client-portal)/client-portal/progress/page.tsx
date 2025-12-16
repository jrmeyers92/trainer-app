import ProgressCompareClient from "@/components/client-portal/ProgressCompareClient";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ProgressPhoto {
  id: number;
  photo_date: string;
  photo_url: string;
  notes: string | null;
}

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createAdminClient();
  // Fetch all progress photos for the user
  const { data: photos, error } = await supabase
    .from("trainer_progress_photo")
    .select("id, photo_date, photo_url, notes")
    .eq("clerk_user_id", userId)
    .order("photo_date", { ascending: false });

  if (error) {
    console.error("Error fetching progress photos:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading progress photos</p>
      </div>
    );
  }

  return <ProgressCompareClient photos={photos || []} />;
};

export default page;
