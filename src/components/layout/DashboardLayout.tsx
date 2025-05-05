import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import {
  LayoutDashboard,
  MessagesSquare,
  MessageSquareDashed,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [organizationName] = useState("Props.to");
  const { user, profile } = useAuth();

  const displayName =
    profile?.display_name || profile?.username || user?.email || "";

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Received",
      icon: MessagesSquare,
      path: "/feedback",
    },
    {
      name: "Types",
      icon: MessageSquareDashed,
      path: "/settings/feedback-types",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="hidden md:flex">
            <SidebarHeader className="h-16 border-b flex items-center px-4 flex-row">
              <span className="text-xl font-semibold text-props-primary">
                人
              </span>
              <span className="ml-2 text-lg font-medium">
                {organizationName}
              </span>
            </SidebarHeader>
            <SidebarContent className="pt-6">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full px-3 justify-start gap-3",
                        location.pathname === item.path && "bg-sidebar-accent"
                      )}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              <div className="md:hidden mb-6">
                <SidebarTrigger />
              </div>
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
