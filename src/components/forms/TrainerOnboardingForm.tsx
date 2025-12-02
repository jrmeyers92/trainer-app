// components/forms/TrainerOnboardingForm.tsx
"use client";

import { completeTrainerOnboarding } from "@/actions/_completeTrainerOnboarding";
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
  trainerOnboardingSchema,
  TrainerOnboardingValues,
} from "@/lib/schemas/trainer-onboarding";
import { useSession } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TrainerOnboardingFormProps {
  initialData: {
    email: string;
    fullName?: string;
  };
}

export default function TrainerOnboardingForm({
  initialData,
}: TrainerOnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const form = useForm<TrainerOnboardingValues>({
    resolver: zodResolver(trainerOnboardingSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      businessName: "",
      phone: "",
      bio: "",
    },
  });

  async function onSubmit(values: TrainerOnboardingValues) {
    setIsSubmitting(true);

    try {
      const result = await completeTrainerOnboarding(values);

      if (result.success) {
        toast.success("Profile completed!", {
          description: "Welcome to FitFlow! Let's get started.",
        });

        // Reload session to get updated metadata
        await session?.reload();

        // Redirect to dashboard
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
                Your name as you'd like clients to see it
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Elite Fitness Coaching" {...field} />
              </FormControl>
              <FormDescription>
                If you have a business name, enter it here
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
              <FormDescription>How clients can reach you</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About You *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell potential clients about your experience, certifications, training philosophy, and what makes you unique..."
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/500 characters (minimum 20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-2">What's next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Add your first client</li>
            <li>• Create workout programs</li>
            <li>• Build nutrition plans</li>
            <li>• Customize your public site (coming soon)</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Setting up your account..." : "Complete Setup"}
        </Button>
      </form>
    </Form>
  );
}
