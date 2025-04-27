
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    // Simulate sending password reset email
    console.log("Password reset requested for:", data.email);
    
    toast({
      title: "Reset link sent",
      description: "If an account exists with that email, you will receive a password reset link.",
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>
            If an account exists with that email, we've sent a password reset link.
            Please check your inbox.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Link to="/auth/login" className="text-props-primary hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="w-full bg-props-primary hover:bg-props-accent">
            Send reset link
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/auth/login" className="text-props-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
