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
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  heightFeet: z
    .string()
    .optional()
    .refine(
      (val) => !val || (parseInt(val) >= 0 && parseInt(val) <= 8),
      "Height must be between 0-8 feet"
    ),
  heightInches: z
    .string()
    .optional()
    .refine(
      (val) => !val || (parseInt(val) >= 0 && parseInt(val) <= 11),
      "Inches must be between 0-11"
    ),
  currentWeight: z
    .string()
    .optional()
    .refine(
      (val) => !val || parseFloat(val) > 0,
      "Weight must be a positive number"
    ),
  goalWeight: z
    .string()
    .optional()
    .refine(
      (val) => !val || parseFloat(val) > 0,
      "Weight must be a positive number"
    ),
  activityLevel: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  primaryGoal: z
    .enum(["weight_loss", "muscle_gain", "maintenance", "athletic_performance"])
    .optional(),
  goals: z
    .string()
    .min(10, "Please provide at least 10 characters about your goals")
    .max(500, "Goals must be less than 500 characters"),
  injuries: z.string().max(1000).optional(),
  medicalConditions: z.string().max(1000).optional(),
  dietaryRestrictions: z.string().max(1000).optional(),
  trainerId: z.string().uuid("Invalid trainer ID"),
  token: z.string().min(1, "Invalid invitation token"),
});

export type ClientOnboardingValues = z.infer<typeof clientOnboardingSchema>;
