
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrganizationCard from "@/components/organization/OrganizationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Building, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import type { Organization } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(3, "Organization name is too short").max(100),
  slug: z.string().min(3, "Slug is too short").max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  isActive: z.boolean().default(true),
});

const OrganizationsPage: React.FC = () => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock organizations data
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "Acme Corporation",
      slug: "acme-corp",
      isActive: true,
      createdAt: new Date(Date.now() - 7776000000), // 90 days ago
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "2",
      name: "Globex Industries",
      slug: "globex",
      isActive: true,
      createdAt: new Date(Date.now() - 2592000000), // 30 days ago
      updatedAt: new Date(Date.now() - 2592000000), // 30 days ago
    },
    {
      id: "3",
      name: "Initech Software",
      slug: "initech",
      isActive: false,
      createdAt: new Date(Date.now() - 31536000000), // 1 year ago
      updatedAt: new Date(Date.now() - 5184000000), // 60 days ago
    },
  ]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
    },
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would be sent to an API
    const newOrg: Organization = {
      id: Math.random().toString(36).substring(2, 9),
      name: values.name,
      slug: values.slug,
      isActive: values.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrganizations(prev => [...prev, newOrg]);
    setShowAddDialog(false);
    form.reset();
    
    toast({
      title: "Organization created",
      description: `${values.name} has been successfully created.`,
    });
  };
  
  const handleEdit = (id: string) => {
    // In a real app, this would open an edit dialog with the org data
    toast({
      title: "Edit organization",
      description: `Editing organization ID: ${id}`,
    });
  };
  
  const handleDelete = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id));
    
    toast({
      title: "Organization deleted",
      description: "The organization has been successfully deleted.",
      variant: "destructive",
    });
  };
  
  const handleManageMembers = (id: string) => {
    // In a real app, this would navigate to a members management page
    toast({
      title: "Manage members",
      description: `Managing members for organization ID: ${id}`,
    });
  };
  
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Organizations</h1>
        <p className="text-muted-foreground">
          Manage your organizations and teams.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-props-primary hover:bg-props-accent">
              <Plus className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new organization or team to your account.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="acme-inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this organization active and visible to users.
                        </FormDescription>
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
                
                <DialogFooter>
                  <Button type="submit">Create Organization</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredOrganizations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              memberCount={Math.floor(Math.random() * 50) + 1} // Random member count for demo
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageMembers={handleManageMembers}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No organizations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? "No organizations match your search criteria." 
              : "Get started by adding your first organization."}
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
              <Plus className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizationsPage;
