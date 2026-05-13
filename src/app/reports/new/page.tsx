"use client";

import { useAction } from "next-safe-action/hooks";
import { createReportAction } from "@/app/reports/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MapPin, Camera, AlertCircle } from "lucide-react";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "waste",
    "water",
    "roads",
    "streetlights",
    "drainage",
    "sanitation",
    "safety",
    "other",
  ]),
  address: z.string().min(5, "Address is required"),
});

export default function NewReportPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      address: "",
    },
  });

  const { execute, isExecuting } = useAction(createReportAction, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
      } else if (data?.success) {
        toast.success("Report submitted successfully!");
        router.push("/dashboard");
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof reportSchema>) {
    execute(values);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Report an Issue
        </h1>
        <p className="text-muted-foreground">
          Help us improve the campus by reporting infrastructure or safety concerns.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Issue Details
          </CardTitle>
          <CardDescription>
            Provide clear and accurate information to help authorities resolve the issue faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Broken streetlight near library" {...field} />
                      </FormControl>
                      <FormDescription>
                        A short, descriptive summary of the problem.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="waste">Waste & Trash</SelectItem>
                          <SelectItem value="water">Water Leak/Supply</SelectItem>
                          <SelectItem value="roads">Roads & Pathways</SelectItem>
                          <SelectItem value="streetlights">Streetlights</SelectItem>
                          <SelectItem value="drainage">Drainage</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="safety">Safety Hazard</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location / Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="e.g., North Block, Gate 2" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide any additional details that might help..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Placeholder for future Map integration */}
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center flex flex-col items-center justify-center text-muted-foreground mt-4">
                <MapPin className="h-8 w-8 mb-2 opacity-50" />
                <p className="font-medium text-sm">Interactive Map (Coming soon)</p>
                <p className="text-xs">You'll be able to drop a pin to provide exact GPS coordinates.</p>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-border/40 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isExecuting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isExecuting} className="px-8 font-medium">
                  {isExecuting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
