// src/lib/roles.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Roles } from "./types/global.t";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export const hasCompletedOnboarding = async () => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.onboardingComplete === true;
};

export const getUserRole = async (): Promise<Roles | undefined> => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role as Roles | undefined;
};

// New helper function to set user role during onboarding
export const setUserRole = async (
  role: Roles,
  onboardingComplete: boolean = false
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
      onboardingComplete,
    },
  });
};
