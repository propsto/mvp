
import React from "react";
import { FeedbackType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, Bookmark } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface FeedbackTypeCardProps {
  feedbackType: FeedbackType;
  profileId: string;
  identifier: string;
}

export function FeedbackTypeCard({ feedbackType, profileId, identifier }: FeedbackTypeCardProps) {
  const getIcon = () => {
    switch (feedbackType.input_type) {
      case 'stars':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'rating':
        return <Bookmark className="h-5 w-5 text-blue-500" />;
      case 'questionnaire':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-props-primary" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-lg">{feedbackType.name}</CardTitle>
        </div>
        {feedbackType.description && (
          <CardDescription>{feedbackType.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        {getInputTypeDescription(feedbackType.input_type)}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          asChild
        >
          <Link to={`/${identifier}/${feedbackType.name}`}>
            Give Feedback
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getInputTypeDescription(inputType: string): string {
  switch (inputType) {
    case 'stars':
      return 'Rate with 1-5 stars';
    case 'rating':
      return 'Rate on a scale from 1-10';
    case 'questionnaire':
      return 'Answer a series of questions';
    default:
      return 'Share your thoughts and comments';
  }
}

export default FeedbackTypeCard;
