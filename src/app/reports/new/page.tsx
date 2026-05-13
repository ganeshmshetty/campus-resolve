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
import { MapPin, Camera, AlertCircle, Loader2 } from "lucide-react";
import LocationPickerWrapper from "@/components/map/LocationPickerWrapper";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export default function NewReportPage() {
  const router = useRouter();
  const supabase = createClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        router.refresh();
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    let imagePath: string | undefined;
    let imageUrl: string | undefined;

    if (imageFile) {
      setIsUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(filePath, imageFile);

      setIsUploading(false);

      if (uploadError) {
        toast.error("Failed to upload image.");
        return;
      }

      // Get the public URL for storage in the DB
      const { data: urlData } = supabase.storage
        .from('report-images')
        .getPublicUrl(filePath);

      imagePath = filePath;
      imageUrl = urlData.publicUrl;
    }

    execute({ ...values, imagePath, imageUrl });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-1">Upload Photo (Optional)</h3>
                    <p className="text-xs text-muted-foreground mb-3">A clear photo helps authorities understand the severity of the issue.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Choose File</span>
                        </div>
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                    </label>
                    {imagePreview && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                            <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <h3 className="text-sm font-medium mb-1">Pin Location (Optional)</h3>
                    <p className="text-xs text-muted-foreground mb-3">Drop a pin on the map to provide exact coordinates.</p>
                </div>
                <div className="h-[300px] sm:h-[400px] w-full">
                  <LocationPickerWrapper 
                    onLocationSelect={(lat, lng) => {
                      form.setValue("latitude", lat);
                      form.setValue("longitude", lng);
                    }} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-border/40 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isExecuting || isUploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isExecuting || isUploading} className="px-8 font-medium">
                  {isExecuting || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? "Uploading Image..." : "Submitting..."}
                    </>
                  ) : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
