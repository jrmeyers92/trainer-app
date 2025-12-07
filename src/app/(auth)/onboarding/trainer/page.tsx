// app/(auth)/onboarding/trainer/page.tsx
import TrainerOnboardingForm from "@/components/forms/onboarding/TrainerOnboardingForm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TrainerOnboardingPage() {
  const { userId, sessionClaims } = await auth();

  // Check authentication
  if (!userId) redirect("/sign-in");

  // Check if user has trainer role
  const role = sessionClaims?.metadata?.role;
  if (role !== "trainer") {
    redirect("/onboarding/role-selection");
  }

  // Check if already completed onboarding
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
  if (onboardingComplete) {
    redirect("/dashboard");
  }

  // Get user info from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const initialData = {
    email: user.emailAddresses[0]?.emailAddress || "",
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Dumbbell className="text-blue-600" size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to FitFlow!</h1>
          <p className="text-gray-600">
            Let&apos;s set up your coaching profile
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You&apos;re on a{" "}
            <span className="font-semibold">14-day free trial</span> of our Pro
            plan
          </p>
        </div>

        <TrainerOnboardingForm initialData={initialData} />
      </div>
    </div>
  );
}
