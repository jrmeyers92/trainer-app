"use client";

import { addProgressPhoto } from "@/actions/progressPhotos/_addProgressPhoto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { progressPhotoSchema } from "@/lib/validations/progressPhotoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type ProgressPhotoFormValues = z.infer<typeof progressPhotoSchema>;

interface ProgressPhotoFormProps {
  clerkUserId: string;
  onSuccess?: () => void;
}

const ProgressPhotoForm = ({
  clerkUserId,
  onSuccess,
}: ProgressPhotoFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProgressPhotoFormValues>({
    resolver: zodResolver(progressPhotoSchema),
    defaultValues: {
      photoDate: new Date().toISOString().split("T")[0],
      notes: "",
      clerkUserId,
      photo: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload a JPEG, PNG, WebP, or GIF image",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File too large", {
          description: "Image must be less than 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      form.setValue("photo", file);
    }
  };

  const removeImage = () => {
    form.setValue("photo", null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  async function onSubmit(values: ProgressPhotoFormValues) {
    if (!values.photo) {
      toast.error("Photo required", {
        description: "Please upload a progress photo",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addProgressPhoto({
        photo: values.photo,
        photoDate: values.photoDate,
        notes: values.notes || null,
        clerkUserId: values.clerkUserId,
      });

      if (result.success) {
        toast.success("Progress photo uploaded!", {
          description: `Photo from ${values.photoDate}`,
        });
        form.reset();
        setImagePreview(null);
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error("Failed to upload progress photo", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error adding progress photo:", error);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add progress photo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Progress Photo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photo"
              /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Progress Photo *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Progress photo preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-12 h-12 mb-4 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-400">
                                PNG, JPG, WebP or GIF (MAX. 5MB)
                              </p>
                            </div>
                            <Input
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              onChange={handleImageChange}
                              {...fieldProps}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a photo to track your progress
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Cannot be in the future</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How are you feeling? Any observations..."
                      className="h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setImagePreview(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !imagePreview}>
                {isSubmitting ? "Uploading..." : "Upload Photo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressPhotoForm;
