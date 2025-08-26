"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  MailIcon, 
  InboxIcon, 
  SendIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TrendingUpIcon,
  AwardIcon,
  TargetIcon,
  AlertTriangleIcon,
  BrainIcon,
  ZapIcon,
  SettingsIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon
} from "lucide-react";
import { useExternalServices } from "@/context/ExternalServicesProvider";
import { cn } from "@/lib/utils";

// Simple loading skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

interface Props {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

export const EmailStats = ({ className, variant = 'full' }: Props) => {
  const {
    email,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    emailMetrics
  } = useExternalServices();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!email) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-blue-500" />
            Email Management
          </CardTitle>
          <CardDescription>
            Connect your email accounts to track productivity and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Ready to optimize your email productivity?
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings/external-services">
                <ZapIcon className="w-4 h-4 mr-2" />
                Connect Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                email.totalUnread > 20 ? "bg-gradient-to-r from-red-400 to-red-600" :
                email.totalUnread > 5 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                "bg-gradient-to-r from-green-400 to-blue-500"
              )}>
                <MailIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{email.totalUnread}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-semibold",
                emailMetrics.productivityScore > 80 ? "text-green-600" :
                emailMetrics.productivityScore > 60 ? "text-yellow-600" :
                "text-red-600"
              )}>
                {emailMetrics.productivityScore.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Productivity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full dashboard view
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Card */}
      <Card className={cn(
        "border-blue-200 dark:border-blue-800",
        email.totalUnread > 20 ? "bg-gradient-to-r from-red-500/10 to-orange-600/10" :
        email.totalUnread > 5 ? "bg-gradient-to-r from-yellow-500/10 to-orange-600/10" :
        "bg-gradient-to-r from-blue-500/10 to-cyan-600/10"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                email.totalUnread > 20 ? "bg-gradient-to-r from-red-400 to-red-600" :
                email.totalUnread > 5 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                "bg-gradient-to-r from-blue-400 to-cyan-500"
              )}>
                <MailIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Email Dashboard</CardTitle>
                <CardDescription className="text-lg">
                  {emailMetrics.emailLoad} load • {emailMetrics.productivityScore.toFixed(0)}% productivity • {email.totalUnread} unread
                </CardDescription>
              </div>
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cn(
          "border-2",
          email.totalUnread > 20 ? "bg-gradient-to-br from-red-500/10 to-orange-600/10 border-red-200" :
          email.totalUnread > 5 ? "bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-200" :
          "bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-200"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-3xl font-bold",
                  email.totalUnread > 20 ? "text-red-600" :
                  email.totalUnread > 5 ? "text-yellow-600" :
                  "text-green-600"
                )}>
                  {email.totalUnread}
                </p>
                <p className="text-sm text-muted-foreground">Unread Emails</p>
              </div>
              {email.totalUnread > 20 ? 
                <AlertTriangleIcon className="w-8 h-8 text-red-500" /> :
                <InboxIcon className="w-8 h-8 text-green-500" />
              }
            </div>
            <Progress 
              value={Math.max(100 - (email.totalUnread / 50) * 100, 0)} 
              className="mt-3 h-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{email.totalToday}</p>
                <p className="text-sm text-muted-foreground">Today's Emails</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{Math.round(email.avgEmailsPerDay)}</p>
                <p className="text-sm text-muted-foreground">Daily Average</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{emailMetrics.productivityScore.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Productivity</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Load Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            Email Load Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={cn(
                  "text-white",
                  emailMetrics.emailLoad === 'heavy' ? 'bg-red-500' :
                  emailMetrics.emailLoad === 'moderate' ? 'bg-yellow-500' :
                  'bg-green-500'
                )}>
                  {emailMetrics.emailLoad.toUpperCase()}
                </Badge>
                <span className="font-semibold">Email Load</span>
              </div>
              <Progress 
                value={
                  emailMetrics.emailLoad === 'heavy' ? 90 :
                  emailMetrics.emailLoad === 'moderate' ? 60 : 30
                } 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Based on {Math.round(email.avgEmailsPerDay)} emails/day average
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Productivity Score</span>
                <span className={cn(
                  "text-lg font-bold",
                  emailMetrics.productivityScore > 80 ? "text-green-600" :
                  emailMetrics.productivityScore > 60 ? "text-yellow-600" :
                  "text-red-600"
                )}>
                  {emailMetrics.productivityScore.toFixed(0)}%
                </span>
              </div>
              <Progress value={emailMetrics.productivityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on inbox organization and response time
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Response Needed</span>
                <span className={cn(
                  "text-lg font-bold",
                  email.totalUnread > 20 ? "text-red-600" :
                  email.totalUnread > 5 ? "text-yellow-600" :
                  "text-green-600"
                )}>
                  {emailMetrics.responseNeeded}
                </span>
              </div>
              <Progress value={Math.min((emailMetrics.responseNeeded / 50) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Emails requiring immediate attention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Providers Overview */}
      {email.emailSummaries && email.emailSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Connected Email Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {email.emailSummaries.map((summary, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <MailIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{summary.provider.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {summary.totalEmails.toLocaleString()} total • {summary.unreadEmails} unread
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{summary.todayEmails}</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <Badge 
                      variant={summary.unreadEmails > 10 ? 'destructive' : 'secondary'}
                    >
                      {summary.unreadEmails > 0 ? `${summary.unreadEmails} unread` : 'All read'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AwardIcon className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(emailMetrics.achievements).map(([key, earned]) => {
                const achievementMap = {
                  organized: { icon: '📧', title: 'Email Organized', desc: 'Less than 10 unread emails' },
                  responsive: { icon: '⚡', title: 'Quick Responder', desc: 'Less than 5 unread emails' },
                  efficient: { icon: '🎯', title: 'Email Efficient', desc: 'Manageable daily volume' },
                  connected: { icon: '📨', title: 'Stay Connected', desc: 'Regular email activity' },
                };
                const achievement = achievementMap[key as keyof typeof achievementMap];
                
                return (
                  <div key={key} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    earned 
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                      : "bg-muted/50 border-muted"
                  )}>
                    <div className={cn(
                      "text-2xl",
                      earned ? "" : "grayscale opacity-50"
                    )}>
                      {achievement.icon}
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium",
                        earned ? "text-green-700 dark:text-green-300" : "text-muted-foreground"
                      )}>
                        {achievement.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                    </div>
                    {earned && <Badge className="ml-auto bg-green-100 text-green-800">✓</Badge>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Insights & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailMetrics.insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ZapIcon className="w-4 h-4" />
                    Your Progress
                  </h4>
                  <ul className="space-y-1">
                    {emailMetrics.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {emailMetrics.nextGoals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TargetIcon className="w-4 h-4" />
                    Next Goals
                  </h4>
                  <ul className="space-y-1">
                    {emailMetrics.nextGoals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Email Management Tips */}
              <div>
                <h4 className="font-medium mb-2">Productivity Tips</h4>
                <div className="space-y-2">
                  {email.totalUnread > 20 && (
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        📮 High unread count! Consider setting up filters or unsubscribing from unnecessary emails.
                      </p>
                    </div>
                  )}
                  {email.avgEmailsPerDay > 50 && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        ⏰ Heavy email load detected. Consider batching email processing times.
                      </p>
                    </div>
                  )}
                  {email.totalUnread < 5 && (
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ Great job maintaining a clean inbox! Keep up the organized approach.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:" target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Open Email
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/settings/external-services">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};