
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile, FeedbackType, UserEmail } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import FeedbackTypeCard from "@/components/feedback/FeedbackTypeCard";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackType[]>([]);
  const [userEmails, setUserEmails] = useState<UserEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isCurrentUser = user && profileData && user.id === profileData.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Try username first
        let { data: profileByUsername, error: usernameError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();
        
        // If no profile found by username, try as email
        if (!profileByUsername && !usernameError) {
          const { data: profileByEmail, error: emailError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", username)
            .maybeSingle();
            
          if (emailError) throw emailError;
          profileByUsername = profileByEmail;
        }
        
        if (usernameError) throw usernameError;
        
        if (!profileByUsername) {
          // Check user_emails table for this identifier
          const { data: userEmailData, error: userEmailError } = await supabase
            .from("user_emails")
            .select("*")
            .eq("email", username)
            .maybeSingle();
            
          if (userEmailError) throw userEmailError;
          
          if (userEmailData) {
            // Now fetch the profile associated with this user_id
            const { data: associatedProfile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userEmailData.user_id)
              .maybeSingle();
              
            if (profileError) throw profileError;
            
            if (associatedProfile) {
              // Use the profile associated with this email
              profileByUsername = associatedProfile;
              
              // Also set the custom display name and bio if available from the email
              if (userEmailData.display_name) {
                profileByUsername.display_name = userEmailData.display_name;
              }
              if (userEmailData.bio) {
                profileByUsername.bio = userEmailData.bio;
              }
              if (userEmailData.avatar_url) {
                profileByUsername.avatar_url = userEmailData.avatar_url;
              }
            } else {
              setError("Profile not found");
              setLoading(false);
              return;
            }
          } else {
            setError("Profile not found");
            setLoading(false);
            return;
          }
        }
        
        // Type assertion since we modified our Profile interface to match Supabase
        setProfileData(profileByUsername as Profile);
        
        // Fetch feedback types
        const { data: types, error: typesError } = await supabase
          .from("feedback_types")
          .select("*")
          .eq("profile_id", profileByUsername.id)
          .eq("is_active", true);
          
        if (typesError) throw typesError;
        
        // Set input_type default for any feedback type that doesn't have one
        const typesWithInputType = types.map((type: any) => ({
          ...type,
          input_type: type.input_type || 'text'
        }));
        
        setFeedbackTypes(typesWithInputType as FeedbackType[]);
        
        // If this is the current user, fetch their associated emails
        if (user && user.id === profileByUsername.id) {
          const { data: emails, error: emailsError } = await supabase
            .from("user_emails")
            .select("*")
            .eq("user_id", profileByUsername.id);
            
          if (emailsError) throw emailsError;
          
          setUserEmails(emails as UserEmail[]);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-props-primary"></div>
      </div>
    );
  }
  
  if (error || !profileData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or is not available.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = () => {
    if (profileData.display_name) {
      return profileData.display_name.substring(0, 2).toUpperCase();
    }
    return profileData.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-props-primary to-props-accent"></div>
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-6 flex justify-between">
            <Avatar className="h-24 w-24 border-4 border-white bg-white">
              <AvatarFallback className="text-2xl bg-props-primary text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isCurrentUser && (
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => navigate("/settings")}
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {profileData.display_name || profileData.username}
            </h1>
            <div className="text-sm text-muted-foreground">@{profileData.username}</div>
            {profileData.bio && (
              <p className="text-gray-700 mt-2">{profileData.bio}</p>
            )}
          </div>
        </div>
      </Card>
      
      <div className="mt-8">
        <Tabs defaultValue="feedback">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="feedback">Feedback</TabsTrigger>
            {isCurrentUser && userEmails.length > 0 && (
              <TabsTrigger className="flex-1" value="profiles">My Profiles</TabsTrigger>
            )}
            {isCurrentUser && (
              <TabsTrigger className="flex-1" value="manage">Manage</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="feedback" className="mt-6">
            {feedbackTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbackTypes.map((type) => (
                  <FeedbackTypeCard 
                    key={type.id}
                    feedbackType={type}
                    profileId={profileData.id}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-600">
                    No feedback types are currently available.
                    {isCurrentUser && " Go to the Manage tab to create some."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {isCurrentUser && userEmails.length > 0 && (
            <TabsContent value="profiles" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile Links</CardTitle>
                  <CardDescription>
                    Share these links to collect different types of feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium">Main Profile</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {window.location.origin}/{profileData.username}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/${profileData.username}`);
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                    
                    {userEmails.map((email) => (
                      <div key={email.id} className="p-4 border rounded-md">
                        <h3 className="font-medium">{email.display_name || email.email}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {window.location.origin}/{email.email}
                        </p>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/${email.email}`);
                            }}
                          >
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/settings/email/${email.id}`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {isCurrentUser && (
            <TabsContent value="manage" className="mt-6">
              <div className="flex flex-col space-y-4">
                <Link to="/settings/feedback-types">
                  <Button>Manage Feedback Types</Button>
                </Link>
                <Link to="/settings/emails">
                  <Button variant="outline">Manage Email Profiles</Button>
                </Link>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
