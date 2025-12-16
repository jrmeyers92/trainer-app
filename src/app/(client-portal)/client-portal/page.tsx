import { getWeighIns } from "@/actions/weighins/_getWeighins";
import WeighInChart from "@/components/client-portal/WeighInChart";
import WeighInForm from "@/components/forms/WeighInForm";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";

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
      <div className="flex items-center justify-between">
        <WeighInForm clerkUserId={userId} />
      </div>

      <div className="max-w-xl">
        <WeighInChart weighIns={weighIns} />
      </div>
    </div>
  );
};

export default page;
