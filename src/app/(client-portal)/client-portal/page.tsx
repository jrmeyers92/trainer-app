import { getWeighIns } from "@/actions/weighins/_getWeighins";
import BMIWidget from "@/components/client-portal/BMIWidget";
import WeighInChart from "@/components/client-portal/WeighInChart";
import ProgressPhotoForm from "@/components/forms/client/ProgressPhotoForm";
import WeighInForm from "@/components/forms/client/WeighInForm";
import { buttonVariants } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const page = async () => {
  const { userId } = await auth();

  const supabase = await createAdminClient();

  const { data: client } = await supabase
    .from("trainer_clients")
    .select("*")
    .eq("client_user_id", userId)
    .single();

  console.log(client);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Fetch weigh-ins on the server
  const { data: weighIns } = await getWeighIns();

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <WeighInForm clerkUserId={userId} />
          <ProgressPhotoForm clerkUserId={userId} />
        </div>
        <div>
          <Link href="/client-portal/progress" className={buttonVariants()}>
            See Progress
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeighInChart weighIns={weighIns} />
        </div>
        <div>
          <BMIWidget client={client} />
        </div>
      </div>
    </div>
  );
};

export default page;
