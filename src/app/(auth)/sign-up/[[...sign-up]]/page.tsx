// app/sign-up/[[...sign-up]]/page.tsx
import { getTrainerInfo } from "@/actions/clients/_get-trainer-info";
import { SignUp } from "@clerk/nextjs";

interface PageProps {
  searchParams: {
    trainerId?: string;
    token?: string;
  };
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { trainerId, token } = await searchParams;

  let trainerInfo = null;
  let isClientSignup = false;

  // If trainerId is provided, this is a client signup
  if (trainerId) {
    isClientSignup = true;
    trainerInfo = await getTrainerInfo(trainerId);
  }

  // Build redirect URL based on signup type
  let redirectUrl: string;

  if (isClientSignup) {
    // Client signup - go to client onboarding
    const redirectParams = new URLSearchParams();
    redirectParams.set("trainerId", trainerId!);
    if (token) redirectParams.set("token", token);
    redirectUrl = `/onboarding/client?${redirectParams.toString()}`;
  } else {
    // Trainer signup - go to role selection
    redirectUrl = "/onboarding/role-selection";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {trainerInfo && (
          <div className="mb-6 text-center bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">
              Join{" "}
              {trainerInfo.businessName || `${trainerInfo.fullName}'s Coaching`}
            </h2>
            <p className="text-gray-600 text-sm">
              Create your account to access your personalized fitness portal
            </p>
          </div>
        )}

        {!trainerInfo && (
          <div className="mb-6 text-center bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">Create Your Account</h2>
            <p className="text-gray-600 text-sm">
              Get started with your fitness coaching business
            </p>
          </div>
        )}

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl={redirectUrl}
        />
      </div>
    </div>
  );
}
