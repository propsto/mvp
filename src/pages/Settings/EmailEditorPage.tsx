
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { UserEmail } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50).nullable().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailEditorPage: React.FC = () => {
  const { emailId } = useParams<{ emailId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailData, setEmailData] = useState<UserEmail | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      display_name: '',
      bio: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    const fetchEmailProfile = async () => {
      if (!user || !emailId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_emails')
          .select('*')
          .eq('id', emailId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (!data) {
          toast({
            title: 'Profile not found',
            description: 'The requested email profile could not be found.',
            variant: 'destructive',
          });
          navigate('/settings/emails');
          return;
        }
        
        setEmailData(data);
        form.reset({
          email: data.email,
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      } catch (error: any) {
        toast({
          title: 'Error fetching email profile',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/settings/emails');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmailProfile();
  }, [emailId, user, toast, navigate, form]);

  const onSubmit = async (data: EmailFormValues) => {
    if (!user || !emailId) return;
    
    try {
      setSubmitting(true);
      
      // Check if email already exists (and it's not this one)
      if (emailData && data.email !== emailData.email) {
        const { data: existingEmail } = await supabase
          .from('user_emails')
          .select('*')
          .eq('email', data.email)
          .maybeSingle();
          
        if (existingEmail) {
          toast({
            title: 'Email already exists',
            description: 'This email is already in use.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Update email profile
      const { error } = await supabase
        .from('user_emails')
        .update({
          email: data.email,
          display_name: data.display_name || null,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null,
        })
        .eq('id', emailId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'The email profile has been successfully updated.',
      });
      
      // Refresh data
      const { data: updatedData } = await supabase
        .from('user_emails')
        .select('*')
        .eq('id', emailId)
        .maybeSingle();
        
      if (updatedData) setEmailData(updatedData);
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/settings/emails')} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Email Profile</h1>
            <p className="text-muted-foreground">
              Customize how this email profile appears to others
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your email profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="john.doe@example.com" />
                        </FormControl>
                        <FormDescription>
                          This email will create a unique profile URL: {window.location.origin}/{field.value}
                        </FormDescription>
                        <FormMessage />
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
                            placeholder="John at Acme Corp" 
                            onChange={(e) => field.onChange(e.target.value || null)} 
                          />
                        </FormControl>
                        <FormDescription>
                          How this profile will appear to others
                        </FormDescription>
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
                            placeholder="Share a brief description about this profile context" 
                            onChange={(e) => field.onChange(e.target.value || null)} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide some context about this profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ''} 
                            placeholder="https://example.com/avatar.png" 
                            onChange={(e) => field.onChange(e.target.value || null)} 
                          />
                        </FormControl>
                        <FormDescription>
                          Link to an image for this profile (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmailEditorPage;
