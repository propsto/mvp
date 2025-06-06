
export type Role = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  username: string; 
  email: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string; // Changed from Date to string to match Supabase
  updated_at: string; // Changed from Date to string
}

export interface UserEmail {
  id: string;
  user_id: string;
  email: string;
  is_primary: boolean;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export type FeedbackInputType = 'text' | 'stars' | 'rating' | 'questionnaire';

export interface FeedbackQuestion {
  id: string;
  question: string;
  input_type: FeedbackInputType;
}

export interface FeedbackType {
  id: string;
  profile_id: string;
  name: string;
  description?: string | null;
  input_type: FeedbackInputType;
  questions?: FeedbackQuestion[] | null;
  is_active: boolean;
  created_at: string; // Changed from Date to string
  updated_at: string; // Changed from Date to string
}

export interface Feedback {
  id: string;
  profile_id: string; // profile receiving feedback
  type_id?: string | null; // feedback type
  sender_id?: string | null; // user giving feedback (optional)
  content: string;
  is_anonymous: boolean;
  rating?: number | null; // Rating value (1-10)
  stars?: number | null; // Star rating (1-5)
  answers?: Record<string, any> | null; // Questionnaire answers
  created_at: string; // Changed from Date to string
  is_public?: boolean; // Added this property for FeedbackCard
}

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  key: string; // hashed key stored in DB
  lastUsed?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  organization: Organization | null;
}
