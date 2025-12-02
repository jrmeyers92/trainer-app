// components/forms/NewClientForm.tsx
"use client";

import { addClient } from "@/actions/clients/_addClient";
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
import { newClientSchema } from "@/lib/validations/clientOnboardingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type NewClientFormValues = z.infer<typeof newClientSchema>;

interface NewClientFormProps {
  trainerId: string;
  canAddClient: boolean;
}

export default function NewClientForm({
  trainerId,
  canAddClient,
}: NewClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<NewClientFormValues>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      leadSource: "",
      primaryGoal: undefined,
      goalNotes: "",
      monthlyRate: "",
      sendInvite: true,
    },
  });

  async function onSubmit(values: NewClientFormValues) {
    if (!canAddClient) {
      toast.error("Cannot add client", {
        description:
          "You've reached your client limit. Please upgrade your plan.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addClient({
        trainerId,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        leadSource: values.leadSource || null,
        primaryGoal: values.primaryGoal || null,
        goalNotes: values.goalNotes || null,
        monthlyRate: values.monthlyRate ? parseFloat(values.monthlyRate) : null,
        sendInvite: values.sendInvite ?? true, // Use nullish coalescing to default to true
      });

      if (result.success) {
        toast.success("Client added!", {
          description: values.sendInvite
            ? `Invitation sent to ${values.email}`
            : "Client profile created successfully",
        });
        router.push("/clients");
      } else {
        toast.error("Failed to add client", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error adding client:", error);
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
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={!canAddClient}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    disabled={!canAddClient}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll send an invitation to this email if enabled below
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
                  <Input
                    placeholder="(555) 123-4567"
                    {...field}
                    disabled={!canAddClient}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leadSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did they find you? (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instagram, referral, website, etc."
                    {...field}
                    disabled={!canAddClient}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Goals & Training */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Goals & Training
          </h2>

          <FormField
            control={form.control}
            name="primaryGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Goal (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!canAddClient}
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
            name="goalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific goals, preferences, or notes..."
                    className="h-24 resize-none"
                    {...field}
                    disabled={!canAddClient}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Billing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Billing</h2>

          <FormField
            control={form.control}
            name="monthlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rate (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      {...field}
                      disabled={!canAddClient}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  You can set this up later in the client&apos;s profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Invitation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.watch("sendInvite") ?? true}
              onChange={(e) => form.setValue("sendInvite", e.target.checked)}
              className="mt-1"
              disabled={!canAddClient}
            />
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Send Client Portal Invitation
              </h3>
              <p className="text-sm text-gray-600">
                We&apos;ll send an email to{" "}
                {form.watch("email") || "the client"} with a link to set up
                their account and access their personalized portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/clients")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || !canAddClient}
          >
            {isSubmitting ? "Adding Client..." : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
