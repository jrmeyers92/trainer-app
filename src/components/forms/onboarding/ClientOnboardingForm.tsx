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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    phone?: string;
    primaryGoal?: string;
    goalNotes?: string;
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
      phone: initialData.phone || "",
      dateOfBirth: "",
      gender: undefined,
      heightFeet: "",
      heightInches: "",
      currentWeight: "",
      goalWeight: "",
      activityLevel: undefined,
      primaryGoal: initialData.primaryGoal || undefined,
      goals: initialData.goalNotes || "",
      injuries: "",
      medicalConditions: "",
      dietaryRestrictions: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Basic Information
          </h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Physical Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Physical Stats
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heightFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height - Feet (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      min="0"
                      max="8"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heightInches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height - Inches (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      min="0"
                      max="11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Weight (lbs) (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="150"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Weight (lbs) (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="145"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Activity & Goals */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Activity & Goals
          </h2>

          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Level (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sedentary (little to no exercise)
                    </SelectItem>
                    <SelectItem value="lightly_active">
                      Lightly Active (1-3 days/week)
                    </SelectItem>
                    <SelectItem value="moderately_active">
                      Moderately Active (3-5 days/week)
                    </SelectItem>
                    <SelectItem value="very_active">
                      Very Active (6-7 days/week)
                    </SelectItem>
                    <SelectItem value="extremely_active">
                      Extremely Active (athlete/physical job)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Goal (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="athletic_performance">
                      Athletic Performance
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    placeholder="What are your fitness goals? What would you like to achieve?"
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
        </div>

        {/* Health Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Health Information
          </h2>

          <FormField
            control={form.control}
            name="injuries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Injuries or Limitations (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any current or past injuries your trainer should know about..."
                    className="h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicalConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Conditions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any medical conditions your trainer should be aware of..."
                    className="h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any allergies, dietary preferences, or restrictions..."
                    className="h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
