"use client";

// import { addWeighIn } from "@/actions/weighins/_addWeighIn";
import { addWeighIn } from "@/actions/weighins/_addWeighIn";
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
import { weighInSchema } from "@/lib/validations/weighInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type WeighInFormValues = z.infer<typeof weighInSchema>;

interface WeighInFormProps {
  clerkUserId: string;
  onSuccess?: () => void;
}

const WeighInForm = ({ clerkUserId, onSuccess }: WeighInFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WeighInFormValues>({
    resolver: zodResolver(weighInSchema),
    defaultValues: {
      weight: "",
      weighInDate: new Date().toISOString().split("T")[0],
      notes: "",
      clerkUserId,
    },
  });

  async function onSubmit(values: WeighInFormValues) {
    console.log("Form submitted with values:", values); // Add this

    setIsSubmitting(true);

    try {
      const result = await addWeighIn({
        weight: parseFloat(values.weight),
        weighInDate: values.weighInDate,
        notes: values.notes || null,
        clerkUserId: values.clerkUserId,
      });
      if (result.success) {
        toast.success("Weigh-in recorded!", {
          description: `${values.weight} lbs on ${values.weighInDate}`,
        });
        form.reset();
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error("Failed to record weigh-in", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error adding weigh-in:", error);
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
        <Button variant="outline">Add weigh-in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Weigh-in</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (lbs) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="180.5"
                        {...field}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        lbs
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weighInDate"
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
                      placeholder="Any notes about this weigh-in..."
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
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Recording..." : "Record Weigh-in"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WeighInForm;
