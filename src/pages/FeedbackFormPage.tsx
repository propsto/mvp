
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile, FeedbackType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { ArrowLeft } from 'lucide-react';

const FeedbackFormPage = () => {
  const { identifier, feedbackType } = useParams<{ identifier: string, feedbackType: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [feedbackTypeData, setFeedbackTypeData] = useState<FeedbackType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!identifier || !feedbackType) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First check if this is a username-based lookup
        let { data: profileData, error: usernameError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', identifier)
          .maybeSingle();
          
        // If no profile found by username, try as email
        if (!profileData && !usernameError) {
          // Check if this is an email in user_emails table
          const { data: emailData, error: emailError } = await supabase
            .from('user_emails')
            .select('*')
            .eq('email', identifier)
            .maybeSingle();
            
          if (emailError) throw emailError;
          
          if (emailData) {
            // Fetch the associated profile
            const { data: associatedProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', emailData.user_id)
              .maybeSingle();
              
            if (profileError) throw profileError;
            
            if (associatedProfile) {
              profileData = {
                ...associatedProfile,
                // Override with email-specific info if available
                display_name: emailData.display_name || associatedProfile.display_name,
                bio: emailData.bio || associatedProfile.bio,
                avatar_url: emailData.avatar_url || associatedProfile.avatar_url
              };
            }
          }
        }
        
        if (!profileData) {
          setError('Profile not found');
          setLoading(false);
          return;
        }
        
        setProfile(profileData as Profile);
        
        // Fetch the specific feedback type
        const { data: feedbackTypes, error: typesError } = await supabase
          .from('feedback_types')
          .select('*')
          .eq('profile_id', profileData.id)
          .eq('name', feedbackType)
          .eq('is_active', true);
          
        if (typesError) throw typesError;
        
        if (!feedbackTypes || feedbackTypes.length === 0) {
          setError('Feedback type not found');
          setLoading(false);
          return;
        }
        
        // Set input_type default if not present
        const feedbackTypeWithInputType = {
          ...feedbackTypes[0],
          input_type: feedbackTypes[0].input_type || 'text'
        };
        
        setFeedbackTypeData(feedbackTypeWithInputType as FeedbackType);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [identifier, feedbackType]);
  
  const getInitials = () => {
    if (!profile) return 'NA';
    if (profile.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    }
    return profile.username.substring(0, 2).toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-props-primary"></div>
      </div>
    );
  }
  
  if (error || !profile || !feedbackTypeData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Data not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The feedback type you're looking for doesn't exist or is not available.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to={`/${identifier}`} className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to profile
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-props-primary text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{feedbackTypeData.name}</CardTitle>
              <CardDescription>
                for {profile.display_name || profile.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          {feedbackTypeData.description && (
            <p className="text-muted-foreground mb-4">{feedbackTypeData.description}</p>
          )}
          <FeedbackForm 
            profileId={profile.id} 
            feedbackType={feedbackTypeData} 
            onSuccess={() => {
              // Success handling
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackFormPage;
