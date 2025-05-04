
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

const profileSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores and hyphens" }),
  display_name: z.string().min(2, { message: "Display name must be at least 2 characters" }).max(50, { message: "Display name is too long" }).nullable().optional(),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SettingsPage = () => {
  const { profile, updateProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and public presence
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Your username will be used for your public profile URL: props.to/{field.value}
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[100px]" 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <h3 className="font-medium">Additional Settings</h3>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/settings/feedback-types">
                  Feedback Types
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/settings/emails">
                  Email Profiles
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
