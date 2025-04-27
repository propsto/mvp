
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      description="Sign up for Props.to to start collecting feedback"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
