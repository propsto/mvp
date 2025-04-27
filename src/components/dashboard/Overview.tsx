
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, CheckCircle, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-props-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Overview: React.FC = () => {
  // In a real app, these would come from API calls
  const stats = [
    {
      title: "Total Feedback",
      value: "142",
      description: "↑ 22% from last month",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Active Users",
      value: "28",
      description: "↑ 5% from last month",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Claimed Profiles",
      value: "18",
      description: "↑ 12% from last month",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      title: "Public Feedback",
      value: "89",
      description: "62% of total feedback",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your organization's feedback and activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              The most recent feedback received across all profiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium">Jane Smith's Profile</p>
                  <p className="text-sm text-muted-foreground my-1">
                    Great collaboration on the recent project. Excellent communication skills!
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">From: Anonymous</span>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Recent activity in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
                  <div className="min-w-fit">
                    {i % 2 === 0 ? (
                      <Users className="h-4 w-4 text-props-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-props-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {i % 2 === 0 
                        ? "New user Michael Johnson joined" 
                        : "New feedback submitted for Taylor Swift's profile"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i} {i === 1 ? 'hour' : 'hours'} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
