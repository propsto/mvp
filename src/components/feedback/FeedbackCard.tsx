
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Edit, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Feedback } from "@/lib/types";

interface FeedbackCardProps {
  feedback: Feedback;
  showProfile?: boolean;
  showControls?: boolean;
  onToggleVisibility?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  showProfile = false,
  showControls = false,
  onToggleVisibility,
  onEdit,
  onDelete,
}) => {
  // In a real app, you would use real data from an API
  const profileName = "Jane Doe";
  const authorName = feedback.authorId ? "John Smith" : "Anonymous";
  const formattedDate = new Date(feedback.createdAt).toLocaleDateString();
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {showProfile && (
              <div className="font-medium text-sm mb-1">
                To: {profileName}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From: {authorName}</span>
              {feedback.isPublic ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Public</Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Private</Badge>
              )}
            </div>
          </div>
          {feedback.rating && (
            <div className="flex items-center">
              <div className="bg-props-light text-props-primary text-sm font-medium rounded-full h-8 w-8 flex items-center justify-center">
                {feedback.rating}/5
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800">{feedback.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        
        {showControls && (
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleVisibility && onToggleVisibility(feedback.id)}
                  >
                    {feedback.isPublic ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {feedback.isPublic ? "Make private" : "Make public"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit && onEdit(feedback.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete && onDelete(feedback.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeedbackCard;
