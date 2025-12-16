import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const progressPhotoSchema = z.object({
  photo: z
    .instanceof(File, { message: "Photo is required" })
    .refine((file) => file.size > 0, "Photo is required") // Add this line
    .refine((file) => file.size <= MAX_FILE_SIZE, "Image must be less than 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    ),
  photoDate: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => new Date(val) <= new Date(),
      "Photo date cannot be in the future"
    ),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
  clerkUserId: z.string().min(1, "Invalid user ID"),
});

export type ProgressPhotoFormValues = z.infer<typeof progressPhotoSchema>;
