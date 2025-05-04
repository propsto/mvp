
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FeedbackCard from "@/components/feedback/FeedbackCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Feedback } from "@/lib/types";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const FeedbackPage: React.FC = () => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock feedback data
  const initialFeedback: Feedback[] = [
    {
      id: "1",
      profile_id: "profile1",
      content: "Really great work on the latest project! Your attention to detail was exceptional and you delivered everything on time.",
      is_anonymous: false,
      is_public: true,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "2",
      profile_id: "profile2",
      sender_id: "user1",
      content: "I appreciate your help with the client presentation. It made a big difference in how we communicated the value proposition.",
      rating: 5,
      is_anonymous: false,
      is_public: false,
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: "3",
      profile_id: "profile3",
      content: "Communication could be improved. Sometimes I wasn't sure about the project status.",
      rating: 3,
      is_anonymous: false,
      is_public: true,
      created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
  ];
  
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>(initialFeedback);
  
  const handleToggleVisibility = (id: string) => {
    setFeedbackItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, is_public: !item.is_public }
          : item
      )
    );
    
    toast({
      title: "Visibility updated",
      description: "The feedback visibility has been updated.",
    });
  };
  
  const handleEdit = (id: string) => {
    // In a real app, this would open an edit dialog
    toast({
      title: "Edit feedback",
      description: `Editing feedback ID: ${id}`,
    });
  };
  
  const handleDelete = (id: string) => {
    setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Feedback deleted",
      description: "The feedback has been deleted successfully.",
      variant: "destructive",
    });
  };
  
  const filteredFeedback = feedbackItems.filter(item =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mock feedback type for the form in the dialog
  const mockFeedbackType = {
    id: "type1",
    profile_id: "profile1",
    name: "General",
    description: "General feedback about my work",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Feedback</h1>
        <p className="text-muted-foreground">
          View and manage feedback across your organization.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-props-primary hover:bg-props-accent">
              <Plus className="mr-2 h-4 w-4" /> Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Feedback</DialogTitle>
            </DialogHeader>
            <FeedbackForm 
              profileId="profile1" 
              feedbackType={mockFeedbackType} 
              onSuccess={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map(feedback => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              showProfile={true}
              showControls={true}
              onToggleVisibility={handleToggleVisibility}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery 
                ? "No feedback matches your search criteria." 
                : "Get started by adding your first feedback."}
            </p>
            {searchQuery ? (
              <Button 
                variant="link" 
                className="mt-4" 
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            ) : (
              <Button 
                onClick={() => setShowAddDialog(true)} 
                className="mt-4 bg-props-primary hover:bg-props-accent"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Feedback
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
