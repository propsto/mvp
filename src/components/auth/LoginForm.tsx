
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Simulate authentication
    console.log("Login attempt with:", data);
    
    // Mock successful login
    toast({
      title: "Login successful",
      description: "Redirecting to dashboard...",
    });
    
    // In a real app, you would redirect after successful login
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-props-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input 
                  type="password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="w-full bg-props-primary hover:bg-props-accent">
            Sign in
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-props-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
