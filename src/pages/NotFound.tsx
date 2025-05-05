import { Router, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FeatureSuggestionForm } from "@/components/feedback/FeatureSuggestionForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "501 Not Implemented: User attempted to access feature:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            501 Not Implemented
          </CardTitle>
          <CardDescription className="text-lg">
            This feature is not yet available in the MVP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We're actively developing new features. Would you like to share what
            functionality you were looking for? Your feedback will help us
            prioritize our roadmap.
          </p>
          <FeatureSuggestionForm />
          <div className="text-center pt-4">
            <Button onClick={() => window.history.back()} variant="secondary">
              <ArrowLeft className="size-8" /> Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
