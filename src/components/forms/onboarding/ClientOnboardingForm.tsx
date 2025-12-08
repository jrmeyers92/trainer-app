// components/forms/onboarding/ClientOnboardingForm.tsx
"use client";

import { completeClientOnboarding } from "@/actions/onboarding/_completeClientOnboarding";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  clientOnboardingSchema,
  ClientOnboardingValues,
} from "@/lib/validations/clientOnboardingSchema";
import { useSession } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClientOnboardingFormProps {
  initialData: {
    email: string;
    fullName?: string;
    trainerName: string;
    trainerBusinessName?: string;
  };
  trainerId: string;
  token: string;
}

export default function ClientOnboardingForm({
  initialData,
  trainerId,
  token,
}: ClientOnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const form = useForm<ClientOnboardingValues>({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      phone: "",
      goals: "",
      trainerId,
      token,
    },
  });

  async function onSubmit(values: ClientOnboardingValues) {
    setIsSubmitting(true);

    try {
      const result = await completeClientOnboarding(values);

      if (result.success) {
        toast.success("Welcome aboard!", {
          description: `You're now connected with ${initialData.trainerBusinessName || initialData.trainerName}`,
        });

        // Reload session to get updated metadata
        await session?.reload();

        // Redirect to client dashboard
        router.push("/dashboard");
      } else {
        toast.error("Onboarding failed", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormDescription>
                Your name as your trainer will see it
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>How your trainer can reach you</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Fitness Goals *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are your fitness goals? Any injuries or limitations your trainer should know about?"
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {(field.value || "").length}/500 characters (minimum 10)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-2">What&apos;s next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Access your personalized workout programs</li>
            <li>• View your nutrition plans</li>
            <li>• Track your progress</li>
            <li>• Communicate with your trainer</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Completing setup..." : "Complete Setup"}
        </Button>
      </form>
    </Form>
  );
}
