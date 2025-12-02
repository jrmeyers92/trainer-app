import { z } from "zod";

export const trainerOnboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().optional(),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(500, "Bio must be less than 500 characters"),
});

export type TrainerOnboardingValues = z.infer<typeof trainerOnboardingSchema>;
