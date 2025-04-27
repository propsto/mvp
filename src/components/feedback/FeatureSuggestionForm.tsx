
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function FeatureSuggestionForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("feature_suggestions")
      .insert([{ content }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you!",
        description: "Your suggestion has been recorded.",
      });
      setContent("");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What features would you like to see implemented?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !content.trim()}
        className="w-full"
      >
        Submit Suggestion
      </Button>
    </form>
  );
}
