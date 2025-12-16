import { z } from "zod";

export const weighInSchema = z.object({
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((val) => parseFloat(val) > 0, "Weight must be a positive number")
    .refine(
      (val) => parseFloat(val) <= 1000,
      "Weight must be less than 1000 lbs"
    ),
  weighInDate: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => new Date(val) <= new Date(),
      "Weigh-in date cannot be in the future"
    ),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
  clerkUserId: z.string().min(1, "Invalid user ID"),
});

export type WeighInFormValues = z.infer<typeof weighInSchema>;
