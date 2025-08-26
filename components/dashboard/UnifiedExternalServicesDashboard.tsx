"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrophyIcon, 
  CodeIcon, 
  RefreshCwIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TrendingUpIcon,
  AwardIcon,
  TargetIcon,
  FlameIcon,
  BrainIcon,
  ZapIcon,
  GithubIcon,
  MessageCircleIcon,
  MailIcon,
  SettingsIcon,
  PlusIcon,
  StarIcon
} from "lucide-react";
import { useExternalServices } from "@/context/ExternalServicesProvider";
import { LeetCodeStats } from "./LeetCodeStats";
import { CodeforcesStats } from "./CodeforcesStats";
import { GitHubStats } from "./GitHubStats";
import { RedditStats } from "./RedditStats";
import { EmailStats } from "./EmailStats";
import { ExternalServicesWidget } from "./ExternalServicesWidget";
import { cn } from "@/lib/utils";

// Simple loading skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

interface Props {
  className?: string;
  variant?: 'full' | 'overview' | 'compact';
}

export const UnifiedExternalServicesDashboard = ({ className, variant = 'full' }: Props) => {
  const {
    data,
    leetcode,
    codeforces,
    github,
    reddit,
    email,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasAnyService,
    refreshData,
    dailyDigest,
    overallInsights,
    unifiedAchievements
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

  if (!hasAnyService && variant !== 'overview') {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-blue-500" />
            External Services Hub
          </CardTitle>
          <CardDescription>
            Connect your external accounts to get a unified view of your digital activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
                <GithubIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <MailIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Digital Ecosystem</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Track your progress across LeetCode, Codeforces, GitHub, Reddit, and Email in one unified dashboard
            </p>
            <Button asChild>
              <a href="/dashboard/settings/external-services">
                <PlusIcon className="w-4 h-4 mr-2" />
                Connect Services
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-blue-500" />
              External Services
            </CardTitle>
            <Button onClick={refreshData} variant="ghost" size="sm">
              <RefreshCwIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ExternalServicesWidget variant="compact" />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'overview') {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Digital Activity Hub</CardTitle>
                  <CardDescription className="text-lg">
                    {dailyDigest.summary}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Refresh All
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/external-services">
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    Full View
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats Grid - Always show all 5 services */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full min-h-[120px]">
          {/* LeetCode */}
          <Card className={cn(
            "bg-gradient-to-br from-yellow-500/10 to-orange-600/10 hover:shadow-md transition-all duration-200 cursor-pointer border-yellow-200/50",
            !leetcode && "opacity-75 border-dashed"
          )}
                onClick={() => window.open('/dashboard/settings/external-services', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CodeIcon className="w-4 h-4 text-white" />
              </div>
              {leetcode ? (
                <>
                  <p className="text-2xl font-bold text-yellow-600">{leetcode.totalSolved}</p>
                  <p className="text-sm text-muted-foreground">LeetCode</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">LeetCode</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Codeforces */}
          <Card className={cn(
            "bg-gradient-to-br from-red-500/10 to-orange-600/10 hover:shadow-md transition-all duration-200 cursor-pointer border-red-200/50",
            !codeforces && "opacity-75 border-dashed"
          )}
                onClick={() => window.open('/dashboard/settings/external-services', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrophyIcon className="w-4 h-4 text-white" />
              </div>
              {codeforces ? (
                <>
                  <p className="text-2xl font-bold text-red-600">{codeforces.user.rating}</p>
                  <p className="text-sm text-muted-foreground">Codeforces</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">Codeforces</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* GitHub */}
          <Card className={cn(
            "bg-gradient-to-br from-gray-500/10 to-slate-600/10 hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200/50",
            !github && "opacity-75 border-dashed"
          )}
                onClick={() => window.open('/dashboard/settings/external-services', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mx-auto mb-2">
                <GithubIcon className="w-4 h-4 text-white" />
              </div>
              {github ? (
                <>
                  <p className="text-2xl font-bold text-gray-600">{github.totalStars}</p>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Reddit */}
          <Card className={cn(
            "bg-gradient-to-br from-orange-500/10 to-red-600/10 hover:shadow-md transition-all duration-200 cursor-pointer border-orange-200/50",
            !reddit && "opacity-75 border-dashed"
          )}
                onClick={() => window.open('/dashboard/settings/external-services', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircleIcon className="w-4 h-4 text-white" />
              </div>
              {reddit ? (
                <>
                  <p className="text-2xl font-bold text-orange-600">{Math.floor(reddit.totalKarma / 1000)}k</p>
                  <p className="text-sm text-muted-foreground">Reddit</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">Reddit</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Email */}
          <Card className={cn(
            "bg-gradient-to-br from-blue-500/10 to-cyan-600/10 hover:shadow-md transition-all duration-200 cursor-pointer border-blue-200/50",
            !email && "opacity-75 border-dashed"
          )}
                onClick={() => window.open('/dashboard/settings/external-services', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <MailIcon className="w-4 h-4 text-white" />
              </div>
              {email ? (
                <>
                  <p className="text-2xl font-bold text-blue-600">{email.totalUnread}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-muted-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Daily Digest */}
        {hasAnyService && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Connected Services Summary */}
                <div>
                  <h4 className="font-medium mb-2">Connected Services</h4>
                  <div className="space-y-1">
                    {leetcode && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>{leetcode.totalSolved} LeetCode problems solved</span>
                      </div>
                    )}
                    {codeforces && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>Codeforces rating: {codeforces.user.rating}</span>
                      </div>
                    )}
                    {github && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-gray-600 rounded-full" />
                        <span>{github.totalStars} GitHub stars earned</span>
                      </div>
                    )}
                    {reddit && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span>{reddit.totalKarma.toLocaleString()} Reddit karma</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>{email.totalUnread} unread emails</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Today's Highlights */}
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-1">
                    {dailyDigest.highlights.slice(0, 3).map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 mt-0.5">•</span>
                        {highlight}
                      </div>
                    ))}
                    {dailyDigest.highlights.length === 0 && (
                      <p className="text-sm text-muted-foreground">No recent activity detected</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Full detailed view with tabs
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">External Services Dashboard</CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive view of your digital activities across platforms
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Refresh All
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/settings/external-services">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Service Tabs - Always show all services */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leetcode" className={!leetcode ? "opacity-60" : ""}>
            LeetCode {!leetcode && "(Connect)"}
          </TabsTrigger>
          <TabsTrigger value="codeforces" className={!codeforces ? "opacity-60" : ""}>
            Codeforces {!codeforces && "(Connect)"}
          </TabsTrigger>
          <TabsTrigger value="github" className={!github ? "opacity-60" : ""}>
            GitHub {!github && "(Connect)"}
          </TabsTrigger>
          <TabsTrigger value="reddit" className={!reddit ? "opacity-60" : ""}>
            Reddit {!reddit && "(Connect)"}
          </TabsTrigger>
          <TabsTrigger value="email" className={!email ? "opacity-60" : ""}>
            Email {!email && "(Connect)"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <UnifiedExternalServicesDashboard variant="overview" />
        </TabsContent>

        <TabsContent value="leetcode" className="mt-6">
          {leetcode ? (
            <LeetCodeStats />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon className="w-5 h-5 text-yellow-500" />
                  LeetCode Integration
                </CardTitle>
                <CardDescription>
                  Connect your LeetCode account to track your programming progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CodeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Coding Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor your problem-solving progress, contest ratings, and coding achievements
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect LeetCode
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="codeforces" className="mt-6">
          {codeforces ? (
            <CodeforcesStats />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-red-500" />
                  Codeforces Integration
                </CardTitle>
                <CardDescription>
                  Connect your Codeforces account to track competitive programming progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Competitive Programming Excellence</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track your rating, contest performance, and problem-solving achievements
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Codeforces
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="github" className="mt-6">
          {github ? (
            <GitHubStats />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-gray-600" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Connect your GitHub account to track development activity and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <GithubIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Showcase Your Development Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor your repositories, contributions, coding streaks, and collaboration metrics
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reddit" className="mt-6">
          {reddit ? (
            <RedditStats />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleIcon className="w-5 h-5 text-orange-500" />
                  Reddit Integration
                </CardTitle>
                <CardDescription>
                  Connect your Reddit account to track community engagement and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Engagement Insights</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track your karma, posts, comments, and community involvement across subreddits
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Reddit
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          {email ? (
            <EmailStats />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-blue-500" />
                  Email Integration
                </CardTitle>
                <CardDescription>
                  Connect your email accounts to track productivity and communication metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Productivity Insights</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor inbox health, response times, and email management efficiency
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {[leetcode, codeforces, github, reddit, email].filter(Boolean).length}/5 services connected
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/settings/external-services">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add More
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};