
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const feedbackSchema = z.object({
  profileId: z.string().min(1, "Profile is required"),
  content: z.string().min(10, "Feedback must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5).optional(),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(false),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSuccess?: () => void;
  profiles?: Array<{ id: string; name: string }>;
  initialProfileId?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onSuccess,
  profiles = [], // In a real app, this would come from an API
  initialProfileId
}) => {
  const { toast } = useToast();
  
  // Mock profiles if none provided
  const mockProfiles = profiles.length ? profiles : [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alex Johnson" },
  ];
  
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      profileId: initialProfileId || "",
      content: "",
      rating: undefined,
      isAnonymous: false,
      isPublic: false,
    },
  });
  
  const onSubmit = (data: FeedbackFormData) => {
    // Simulate sending feedback
    console.log("Feedback submitted:", data);
    
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been successfully recorded.",
    });
    
    form.reset();
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="profileId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="" disabled>Select a profile</option>
                  {mockProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts..."
                  className="min-h-[120px] resize-y"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="1-5"
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={e => {
                    const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Submit anonymously</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Your name will not be shown with this feedback
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Make public</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Allow the recipient to publish this feedback publicly
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">Submit feedback</Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
