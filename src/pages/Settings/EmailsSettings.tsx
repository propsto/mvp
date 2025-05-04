
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { UserEmail } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Trash, Check, Mail, Copy } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50).nullable().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').nullable().optional(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailSettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [userEmails, setUserEmails] = useState<UserEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmEmailId, setDeleteConfirmEmailId] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      display_name: '',
      bio: '',
    },
  });

  useEffect(() => {
    const fetchUserEmails = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_emails')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setUserEmails(data);
      } catch (error: any) {
        toast({
          title: 'Error fetching email profiles',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserEmails();
  }, [user, toast]);

  const onSubmitNewEmail = async (data: EmailFormValues) => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      // Check if email already exists
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
      
      // Insert new email
      const { error } = await supabase
        .from('user_emails')
        .insert({
          user_id: user.id,
          email: data.email,
          display_name: data.display_name || null,
          bio: data.bio || null,
          is_primary: userEmails.length === 0,
        });
        
      if (error) throw error;
      
      toast({
        title: 'Email profile added',
        description: 'The email profile has been successfully added.',
      });
      
      // Refresh user emails
      const { data: newData } = await supabase
        .from('user_emails')
        .select('*')
        .eq('user_id', user.id);
        
      if (newData) setUserEmails(newData);
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error adding email profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (emailId: string) => {
    if (!user) return;
    
    try {
      // First, set all emails to not primary
      await supabase
        .from('user_emails')
        .update({ is_primary: false })
        .eq('user_id', user.id);
        
      // Then set the selected email to primary
      await supabase
        .from('user_emails')
        .update({ is_primary: true })
        .eq('id', emailId);
        
      toast({
        title: 'Primary email updated',
        description: 'Your primary email profile has been updated.',
      });
      
      // Refresh user emails
      const { data } = await supabase
        .from('user_emails')
        .select('*')
        .eq('user_id', user.id);
        
      if (data) setUserEmails(data);
    } catch (error: any) {
      toast({
        title: 'Error updating primary email',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_emails')
        .delete()
        .eq('id', emailId);
        
      if (error) throw error;
      
      toast({
        title: 'Email profile deleted',
        description: 'The email profile has been successfully deleted.',
      });
      
      // Refresh user emails
      const { data } = await supabase
        .from('user_emails')
        .select('*')
        .eq('user_id', user.id);
        
      if (data) {
        setUserEmails(data);
        
        // If there's no primary email and we have emails, set the first one as primary
        if (data.length > 0 && !data.some(email => email.is_primary)) {
          await supabase
            .from('user_emails')
            .update({ is_primary: true })
            .eq('id', data[0].id);
            
          // Refresh again
          const { data: updatedData } = await supabase
            .from('user_emails')
            .select('*')
            .eq('user_id', user.id);
            
          if (updatedData) setUserEmails(updatedData);
        }
      }
      
      setDeleteConfirmEmailId(null);
    } catch (error: any) {
      toast({
        title: 'Error deleting email profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyProfileLink = (email: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${email}`);
    toast({
      title: 'Link copied',
      description: 'Profile link copied to clipboard.',
    });
  };

  const getInitials = (email: UserEmail) => {
    if (email.display_name) {
      return email.display_name.substring(0, 2).toUpperCase();
    }
    return email.email.substring(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Email Profiles</h1>
          <p className="text-muted-foreground">
            Manage your email profiles that can be used for collecting different types of feedback
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Email Profile
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {userEmails.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium">No email profiles</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add email profiles to collect feedback from different contexts
                  </p>
                  <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    Add Email Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              userEmails.map((email) => (
                <Card key={email.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-props-primary text-white">
                            {getInitials(email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {email.display_name || email.email}
                            {email.is_primary && (
                              <Badge className="ml-2 bg-props-primary">Primary</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{email.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyProfileLink(email.email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {!email.is_primary && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleSetPrimary(email.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Set Primary
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => setDeleteConfirmEmailId(email.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {email.bio && <p className="text-sm text-muted-foreground">{email.bio}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `/settings/email/${email.id}`}
                    >
                      Edit Profile
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Add Email Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email Profile</DialogTitle>
            <DialogDescription>
              Add an email address that can be used as an alternative profile for collecting feedback
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewEmail)} className="space-y-4">
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
                      This email will create a unique profile URL
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
                        {...field} 
                        value={field.value || ''} 
                        placeholder="Share a brief description about this profile context" 
                        onChange={(e) => field.onChange(e.target.value || null)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Email Profile'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmEmailId} onOpenChange={() => setDeleteConfirmEmailId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Email Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this email profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmEmailId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmEmailId && handleDeleteEmail(deleteConfirmEmailId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmailSettingsPage;
