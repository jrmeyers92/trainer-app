// components/forms/RoleSelectionForm.tsx
"use client";

import { setRole } from "@/actions/_onboarding";
import { useSession } from "@clerk/nextjs";
import { Dumbbell, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RoleSelectionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const handleSubmit = async (role: "trainer" | "client") => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("role", role);

      const result = await setRole(formData);

      // Reload session to get updated metadata
      await session?.reload();

      if (result.success) {
        toast.success("Role selected successfully!");

        if (result.data?.role === "trainer") {
          router.push("/onboarding/trainer");
        } else if (result.data?.role === "client") {
          router.push("/dashboard");
        }
      } else {
        toast.error("Role selection failed", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error submitting role:", error);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => handleSubmit("client")}
        disabled={isSubmitting}
        className="group relative py-6 px-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <User className="text-blue-600 group-hover:text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">I&apos;m a Client</h3>
            <p className="text-sm text-gray-600">
              My trainer uses this platform and I want to access my workout
              programs
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => handleSubmit("trainer")}
        disabled={isSubmitting}
        className="group relative py-6 px-6 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
            <Dumbbell
              className="text-green-600 group-hover:text-white"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">I&apos;m a Trainer</h3>
            <p className="text-sm text-gray-600">
              I want to manage my clients and build training programs
            </p>
          </div>
        </div>
      </button>

      {isSubmitting && (
        <div className="text-center text-sm text-gray-500">
          Setting up your account...
        </div>
      )}
    </div>
  );
}
