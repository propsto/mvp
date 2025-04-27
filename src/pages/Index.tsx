
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6 inline-block">
                <span className="text-6xl font-bold text-props-primary">人</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Collect and Own Your Feedback
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Props.to helps individuals and organizations build better relationships
                through structured feedback that you control.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-props-primary hover:bg-props-accent">
                  <Link to="/auth/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-tenant Platform</h3>
                <p className="text-gray-600">
                  Each organization gets its own isolated space for feedback, users, and profiles.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Profile-Based Feedback</h3>
                <p className="text-gray-600">
                  Link feedback to specific profiles and decide if it should be private or public.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feedback Claiming</h3>
                <p className="text-gray-600">
                  Users can claim feedback tied to their identifiers like email or profile link.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                <p className="text-gray-600">
                  Control who can view, manage, and publish feedback with flexible role-based permissions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-gray-600">
                  Comprehensive admin tools to manage feedback, users, and organizational settings.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-props-light rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-props-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">API Access</h3>
                <p className="text-gray-600">
                  Integration capabilities with API keys to pull feedback data into your systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-props-primary text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to take control of your feedback?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join Props.to today and start building a better feedback culture for your team.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth/register">Start Now — It's Free</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-props-primary mr-2">人</span>
                <span className="text-lg font-semibold">Props.to</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Open-source feedback platform
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link to="/about" className="text-sm text-gray-600 hover:text-props-primary">About</Link>
              <Link to="/features" className="text-sm text-gray-600 hover:text-props-primary">Features</Link>
              <Link to="/pricing" className="text-sm text-gray-600 hover:text-props-primary">Pricing</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-props-primary">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Props.to. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
