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
