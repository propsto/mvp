
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Overview from "@/components/dashboard/Overview";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Overview />
    </DashboardLayout>
  );
};

export default Dashboard;
