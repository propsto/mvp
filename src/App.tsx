
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/auth/RouteGuard";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard/Index";
import FeedbackPage from "./pages/Feedback/Index";
import APIPage from "./pages/API/Index";
import SettingsPage from "./pages/Settings";
import FeedbackTypesPage from "./pages/Settings/FeedbackTypes";
import ProfilePage from "./pages/ProfilePage";
import EmailSettingsPage from "./pages/Settings/EmailsSettings";
import EmailEditorPage from "./pages/Settings/EmailEditorPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";

// Define internal routes that should never be treated as usernames
const internalRoutes = [
  'dashboard', 
  'feedback', 
  'api', 
  'settings', 
  'auth', 
  'about', 
  'privacy', 
  'terms', 
  'contact', 
  'help',
  'admin',
  'support'
];

const App = () => {
  // Create a client inside the component to maintain React context
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<RouteGuard><Dashboard /></RouteGuard>} />
              <Route path="/feedback" element={<RouteGuard><FeedbackPage /></RouteGuard>} />
              <Route path="/api" element={<RouteGuard><APIPage /></RouteGuard>} />
              <Route path="/settings" element={<RouteGuard><SettingsPage /></RouteGuard>} />
              <Route path="/settings/feedback-types" element={<RouteGuard><FeedbackTypesPage /></RouteGuard>} />
              <Route path="/settings/emails" element={<RouteGuard><EmailSettingsPage /></RouteGuard>} />
              <Route path="/settings/email/:emailId" element={<RouteGuard><EmailEditorPage /></RouteGuard>} />
              
              {/* Profile Routes */}
              <Route path="/:identifier/:feedbackType" element={<FeedbackFormPage />} />
              <Route path="/:identifier" element={<ProfilePage />} />
              
              {/* Internal routes that should show 501 Not Implemented */}
              {internalRoutes.map(route => (
                <Route key={route} path={`/${route}/*`} element={<NotFound />} />
              ))}
              
              {/* Catch-all - will be handled by the ProfilePage logic */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
