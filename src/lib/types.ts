
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
  userId: string;
  organizationId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  isClaimed: boolean;
  publicIdentifier?: string; // email or link that can be used for claiming
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  profileId: string; // profile receiving feedback
  authorId?: string; // user giving feedback (optional)
  organizationId: string;
  content: string;
  rating?: number; // optional rating
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
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
