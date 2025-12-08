import { z } from "zod";

export const newClientSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  leadSource: z.string().optional(),
  primaryGoal: z
    .enum(["weight_loss", "muscle_gain", "maintenance", "athletic_performance"])
    .optional(),
  goalNotes: z.string().optional(),
  monthlyRate: z.string().optional(),
  sendInvite: z.boolean().optional(),
});

export const clientOnboardingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
  goals: z
    .string()
    .min(10, "Please provide at least 10 characters about your goals")
    .max(500, "Goals must be less than 500 characters"),
  trainerId: z.string().uuid("Invalid trainer ID"),
  token: z.string().min(1, "Invalid invitation token"),
});

export type ClientOnboardingValues = z.infer<typeof clientOnboardingSchema>;
