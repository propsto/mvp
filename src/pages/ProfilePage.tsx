
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile, FeedbackType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackType[]>([]);
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
          setError("Profile not found");
          setLoading(false);
          return;
        }
        
        setProfileData(profileByUsername as Profile);
        
        // Fetch feedback types
        const { data: types, error: typesError } = await supabase
          .from("feedback_types")
          .select("*")
          .eq("profile_id", profileByUsername.id)
          .eq("is_active", true);
          
        if (typesError) throw typesError;
        
        setFeedbackTypes(types as FeedbackType[]);
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
  }, [username]);

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
            <TabsTrigger className="flex-1" value="feedback">Give Feedback</TabsTrigger>
            {isCurrentUser && (
              <TabsTrigger className="flex-1" value="manage">Manage Feedback Types</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="feedback" className="mt-6">
            {feedbackTypes.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Leave Feedback for {profileData.display_name || profileData.username}</CardTitle>
                  <CardDescription>
                    Choose a feedback type below to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {feedbackTypes.map((type) => (
                      <div key={type.id} className="mb-4">
                        <h3 className="font-medium text-lg">{type.name}</h3>
                        {type.description && (
                          <p className="text-sm text-gray-600 mt-1 mb-3">{type.description}</p>
                        )}
                        <FeedbackForm 
                          profileId={profileData.id} 
                          feedbackType={type} 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
          
          {isCurrentUser && (
            <TabsContent value="manage" className="mt-6">
              <Link to="/settings/feedback-types">
                <Button>Manage Feedback Types</Button>
              </Link>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
