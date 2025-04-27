
import React from "react";
import Navbar from "@/components/layout/Navbar";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
