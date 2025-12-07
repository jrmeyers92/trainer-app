// src/app/(auth)/onboarding/role-selection/page.tsx

import RoleSelectionForm from "@/components/forms/onboarding/RoleSelctionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RoleSelectionPage() {
  const { userId, sessionClaims } = await auth();

  // If user is not authenticated, redirect to sign-in
  if (!userId) redirect("/sign-in");

  const role = sessionClaims?.metadata?.role;
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

  // If user has a role and completed onboarding, redirect appropriately
  if (role === "client" && onboardingComplete) {
    redirect("/dashboard");
  } else if (role === "trainer" && onboardingComplete) {
    redirect("/dashboard");
  } else if (role === "admin") {
    redirect("/admin");
  }

  // Show role selection if no role is set
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Welcome to FitFlow!</h1>
      <p className="mb-4">Please select how you want to use our platform:</p>
      <RoleSelectionForm />
    </div>
  );
}
