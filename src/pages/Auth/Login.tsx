
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <AuthLayout 
      title="Welcome back" 
      description="Sign in to your Props.to account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
