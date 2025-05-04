
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
import { Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FeedbackFormProps {
  profileId: string;
  feedbackType: FeedbackType;
  onSuccess?: () => void;
}

const createFeedbackSchema = (feedbackType: FeedbackType) => {
  const baseSchema = {
    content: z.string().min(3, { message: "Feedback must be at least 3 characters" }).optional(),
    isAnonymous: z.boolean().default(false),
  };

  const inputTypeSchema = (() => {
    switch (feedbackType.input_type) {
      case 'stars':
        return { stars: z.number().min(1).max(5) };
      case 'rating':
        return { rating: z.number().min(1).max(10) };
      case 'questionnaire':
        // Dynamic schema for questionnaire based on questions
        if (feedbackType.questions && feedbackType.questions.length > 0) {
          const questionSchema: Record<string, any> = {};
          feedbackType.questions.forEach(q => {
            if (q.input_type === 'text') {
              questionSchema[q.id] = z.string().min(1, { message: "Answer required" });
            } else if (q.input_type === 'rating') {
              questionSchema[q.id] = z.number().min(1).max(10);
            } else if (q.input_type === 'stars') {
              questionSchema[q.id] = z.number().min(1).max(5);
            }
          });
          return { answers: z.object(questionSchema) };
        }
        return {};
      default: // text
        return { content: z.string().min(3, { message: "Feedback must be at least 3 characters" }) };
    }
  })();

  return z.object({ ...baseSchema, ...inputTypeSchema });
};

export function FeedbackForm({ profileId, feedbackType, onSuccess }: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const schema = createFeedbackSchema(feedbackType);
  
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      isAnonymous: false,
      stars: feedbackType.input_type === 'stars' ? 0 : undefined,
      rating: feedbackType.input_type === 'rating' ? 5 : undefined,
      answers: feedbackType.questions ? {} : undefined,
    },
  });
  
  const onSubmit = async (data: any) => {
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
      
      const feedbackData = {
        profile_id: profileId,
        type_id: feedbackType.id,
        content: data.content || "",
        sender_id: data.isAnonymous ? null : user?.id,
        is_anonymous: data.isAnonymous,
        rating: data.rating,
        stars: data.stars,
        answers: data.answers,
      };
      
      const { error } = await supabase.from("feedback").insert(feedbackData);
      
      if (error) throw error;
      
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been successfully submitted",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
      
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

  const renderInputByType = () => {
    switch (feedbackType.input_type) {
      case 'stars':
        return (
          <FormField
            control={form.control}
            name="stars"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer ${field.value >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'rating':
        return (
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between">
                    <span>1</span>
                    <span>{field.value}</span>
                    <span>10</span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'questionnaire':
        if (!feedbackType.questions || feedbackType.questions.length === 0) {
          return (
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
          );
        }

        return (
          <div className="space-y-6">
            {feedbackType.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <h4 className="font-medium">{question.question}</h4>
                {question.input_type === 'text' && (
                  <FormField
                    control={form.control}
                    name={`answers.${question.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Your answer..."
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {question.input_type === 'rating' && (
                  <FormField
                    control={form.control}
                    name={`answers.${question.id}`}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between">
                            <span>1</span>
                            <span>{field.value || 5}</span>
                            <span>10</span>
                          </div>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value || 5]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {question.input_type === 'stars' && (
                  <FormField
                    control={form.control}
                    name={`answers.${question.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`cursor-pointer ${(field.value || 0) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              onClick={() => field.onChange(star)}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        );
      default: // text
        return (
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
        );
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderInputByType()}
        
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
