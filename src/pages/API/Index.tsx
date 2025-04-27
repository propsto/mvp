
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Key, Copy, Plus, Trash, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiKey } from "@/lib/types";

const APIPage: React.FC = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      organizationId: "org1",
      name: "Production Key",
      key: "•••••••••••••••••••••••",
      lastUsed: new Date(Date.now() - 86400000), // 1 day ago
      createdAt: new Date(Date.now() - 2592000000), // 30 days ago
    },
    {
      id: "2",
      organizationId: "org1",
      name: "Development Key",
      key: "•••••••••••••••••••••••",
      lastUsed: new Date(Date.now() - 3600000), // 1 hour ago
      createdAt: new Date(Date.now() - 7776000000), // 90 days ago
    },
  ]);
  
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  
  const formSchema = z.object({
    name: z.string().min(1, "API key name is required").max(100),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const handleCreateKey = (values: z.infer<typeof formSchema>) => {
    // Generate a mock API key
    const mockKey = "pk_" + Math.random().toString(36).substring(2, 15);
    
    // In a real app, this would be created on the server
    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(2, 9),
      organizationId: "org1",
      name: values.name,
      key: "•••••••••••••••••••••••",
      createdAt: new Date(),
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewApiKey(mockKey);
    form.reset();
  };
  
  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    
    toast({
      title: "API key deleted",
      description: "The API key has been permanently deleted.",
    });
  };
  
  const handleCopyKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      
      toast({
        title: "API key copied",
        description: "The API key has been copied to your clipboard.",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Access</h1>
        <p className="text-muted-foreground">
          Manage API keys to integrate feedback data with your systems.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use the Props.to API to fetch and manage your feedback data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-2">
                To authenticate API requests, include your API key in the Authorization header:
              </p>
              <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto">
                Authorization: Bearer YOUR_API_KEY
              </pre>
            </div>
            
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Example Request</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Fetch all feedback for your organization:
              </p>
              <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto">
                GET https://api.props.to/v1/feedback
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              View full documentation
            </a>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your API Keys</h2>
        
        <Dialog open={showNewKeyDialog && !newApiKey} onOpenChange={open => {
          setShowNewKeyDialog(open);
          if (!open) setNewApiKey(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-props-primary hover:bg-props-accent">
              <Plus className="mr-2 h-4 w-4" /> Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Enter a name to identify this API key.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateKey)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Production, Staging, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Create API Key</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {newApiKey && (
          <Dialog open={true} onOpenChange={() => setNewApiKey(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your New API Key</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center mt-2 text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Make sure to copy this key now. You won't be able to see it again!</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                <code className="text-sm font-mono">{newApiKey}</code>
                <Button size="sm" variant="outline" onClick={handleCopyKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setNewApiKey(null)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {apiKeys.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="font-mono">{apiKey.key}</TableCell>
                    <TableCell>{apiKey.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {apiKey.lastUsed 
                        ? apiKey.lastUsed.toLocaleDateString() 
                        : "Never used"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No API keys found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first API key.
          </p>
          <Button 
            onClick={() => setShowNewKeyDialog(true)} 
            className="mt-4 bg-props-primary hover:bg-props-accent"
          >
            <Plus className="mr-2 h-4 w-4" /> Create API Key
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default APIPage;
