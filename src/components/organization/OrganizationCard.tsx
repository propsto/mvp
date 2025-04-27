
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Organization } from "@/lib/types";

interface OrganizationCardProps {
  organization: Organization;
  memberCount: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onManageMembers?: (id: string) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  memberCount,
  onEdit,
  onDelete,
  onManageMembers,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{organization.name}</CardTitle>
          <div>
            {organization.isActive ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold">Slug:</span> {organization.slug}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Members:</span> {memberCount}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <span className="font-semibold">Created:</span> {new Date(organization.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onManageMembers && onManageMembers(organization.id)}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Manage Members</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit && onEdit(organization.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Organization</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete && onDelete(organization.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Organization</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;
