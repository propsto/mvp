
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FeedbackType } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

interface FeedbackFormProps {
  profileId: string;
  feedbackType: FeedbackType;
}

const feedbackSchema = z.object({
  content: z.string().min(3, { message: "Feedback must be at least 3 characters" }),
  isAnonymous: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm({ profileId, feedbackType }: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
      isAnonymous: false,
    },
  });
  
  const onSubmit = async (data: FeedbackFormValues) => {
    if (!user && !data.isAnonymous) {
      toast({
        title: "Authentication required",
        description: "Please log in to provide non-anonymous feedback",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from("feedback").insert({
        profile_id: profileId,
        type_id: feedbackType.id,
        content: data.content,
        sender_id: data.isAnonymous ? null : user?.id,
        is_anonymous: data.isAnonymous,
      });
      
      if (error) throw error;
      
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been successfully submitted",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder={`Write your ${feedbackType.name} feedback here...`}
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Submit anonymously</span>
                  <p className="text-xs text-muted-foreground">
                    {user ? "Your identity will not be shared with the recipient" : "You must be logged in to submit non-anonymous feedback"}
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
}

export default FeedbackForm;
