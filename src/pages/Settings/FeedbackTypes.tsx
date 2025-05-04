import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FeedbackType } from "@/lib/types";

const feedbackTypeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FeedbackTypeFormValues = z.infer<typeof feedbackTypeSchema>;

const FeedbackTypesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const form = useForm<FeedbackTypeFormValues>({
    resolver: zodResolver(feedbackTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });
  
  useEffect(() => {
    if (user) {
      fetchFeedbackTypes();
    }
  }, [user]);
  
  const fetchFeedbackTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback_types")
        .select("*")
        .eq("profile_id", user!.id)
        .order("name");
        
      if (error) throw error;
      
      // Type assertion since we modified our FeedbackType interface
      setFeedbackTypes(data as FeedbackType[]);
    } catch (error) {
      console.error("Error fetching feedback types:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data: FeedbackTypeFormValues) => {
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("feedback_types")
          .update({
            name: data.name,
            description: data.description || null,
            is_active: data.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)
          .eq("profile_id", user!.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Feedback type updated successfully",
        });
      } else {
        // Create new
        const { error } = await supabase
          .from("feedback_types")
          .insert({
            profile_id: user!.id,
            name: data.name,
            description: data.description || null,
            is_active: data.is_active,
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Feedback type created successfully",
        });
      }
      
      // Reset form and reload data
      resetForm();
      fetchFeedbackTypes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save feedback type",
        variant: "destructive",
      });
      console.error("Error saving feedback type:", error);
    }
  };
  
  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      is_active: true,
    });
    setEditingId(null);
  };
  
  const handleEdit = (type: FeedbackType) => {
    form.reset({
      name: type.name,
      description: type.description || "",
      is_active: type.is_active,
    });
    setEditingId(type.id);
  };
  
  const handleToggleActive = async (type: FeedbackType) => {
    try {
      const { error } = await supabase
        .from("feedback_types")
        .update({
          is_active: !type.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", type.id)
        .eq("profile_id", user!.id);
        
      if (error) throw error;
      
      fetchFeedbackTypes();
    } catch (error) {
      console.error("Error toggling feedback type:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback type status",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Feedback Types</h1>
          <p className="text-muted-foreground">
            Manage the types of feedback people can leave for you
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Create"} Feedback Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Button type="submit">
                    {editingId ? "Update" : "Create"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback Types</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-props-primary"></div>
              </div>
            ) : feedbackTypes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.description || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          type.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {type.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          onClick={() => handleEdit(type)} 
                          variant="outline" 
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => handleToggleActive(type)}
                          variant="ghost" 
                          size="sm"
                        >
                          {type.is_active ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No feedback types found. Create one above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackTypesPage;
