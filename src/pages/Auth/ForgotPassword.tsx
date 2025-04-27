
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout 
      title="Reset your password" 
      description="We'll email you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
