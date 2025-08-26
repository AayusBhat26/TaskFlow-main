"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  MessageCircleIcon, 
  StarIcon, 
  TrendingUpIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CalendarIcon,
  AwardIcon,
  TargetIcon,
  FlameIcon,
  BrainIcon,
  ZapIcon,
  SettingsIcon,
  UsersIcon,
  HeartIcon,
  ClockIcon
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

export const RedditStats = ({ className, variant = 'full' }: Props) => {
  const {
    reddit,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    redditMetrics
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

  if (!reddit) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircleIcon className="w-5 h-5 text-orange-500" />
            Reddit Journey
          </CardTitle>
          <CardDescription>
            Connect your Reddit account to track your community engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Ready to showcase your community contributions?
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings/external-services">
                <ZapIcon className="w-4 h-4 mr-2" />
                Connect Reddit
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{reddit.totalKarma.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Karma</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">{Math.floor(reddit.accountAge / 365)}</p>
              <p className="text-xs text-muted-foreground">Years</p>
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
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Reddit Journey</CardTitle>
                <CardDescription className="text-lg">
                  u/{reddit.user.name} • {redditMetrics.engagementScore.toFixed(1)}% engagement • {Math.floor(reddit.accountAge / 365)} years
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
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{reddit.totalKarma.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Karma</p>
              </div>
              <HeartIcon className="w-8 h-8 text-orange-500" />
            </div>
            <Progress value={Math.min(redditMetrics.engagementScore, 100)} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{reddit.postKarma.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Post Karma</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{reddit.commentKarma.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Comment Karma</p>
              </div>
              <MessageCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{Math.floor(reddit.accountAge / 365)}</p>
                <p className="text-sm text-muted-foreground">Years Active</p>
              </div>
              <ClockIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Karma Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="w-5 h-5" />
            Karma Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Post Karma</span>
                  <span className="text-sm text-muted-foreground">
                    {((reddit.postKarma / reddit.totalKarma) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(reddit.postKarma / reddit.totalKarma) * 100} 
                  className="h-3" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {reddit.postKarma.toLocaleString()} points from posts
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Comment Karma</span>
                  <span className="text-sm text-muted-foreground">
                    {((reddit.commentKarma / reddit.totalKarma) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(reddit.commentKarma / reddit.totalKarma) * 100} 
                  className="h-3" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {reddit.commentKarma.toLocaleString()} points from comments
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {reddit.postsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Posts Created</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {reddit.commentsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Comments Made</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Communities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Top Communities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {redditMetrics.topCommunities.length > 0 ? (
              redditMetrics.topCommunities.map((community, index) => (
                <div key={community.subreddit} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                      index === 0 ? "bg-yellow-500" :
                      index === 1 ? "bg-gray-400" :
                      index === 2 ? "bg-orange-600" :
                      "bg-blue-500"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">r/{community.subreddit}</p>
                      <p className="text-sm text-muted-foreground">
                        {community.posts} posts
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`https://reddit.com/r/${community.subreddit}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No community activity data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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
              {Object.entries(redditMetrics.achievements).map(([key, earned]) => {
                const achievementMap = {
                  active: { icon: '🎯', title: 'Active Poster', desc: '10+ posts created' },
                  popular: { icon: '⭐', title: 'Popular User', desc: '1,000+ karma earned' },
                  contributor: { icon: '💬', title: 'Active Commenter', desc: '100+ comments made' },
                  veteran: { icon: '🏆', title: 'Reddit Veteran', desc: '1+ year account age' },
                  social: { icon: '🌟', title: 'Social Influencer', desc: '5,000+ karma earned' },
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
              {redditMetrics.insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ZapIcon className="w-4 h-4" />
                    Your Progress
                  </h4>
                  <ul className="space-y-1">
                    {redditMetrics.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {redditMetrics.nextGoals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TargetIcon className="w-4 h-4" />
                    Next Goals
                  </h4>
                  <ul className="space-y-1">
                    {redditMetrics.nextGoals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Posts */}
              {reddit.recentPosts && reddit.recentPosts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recent Posts</h4>
                  <div className="space-y-2">
                    {reddit.recentPosts.slice(0, 3).map((post, index) => (
                      <div key={post.id} className="p-2 bg-muted/50 rounded">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{post.title}</p>
                            <p className="text-xs text-muted-foreground">
                              r/{post.subreddit} • {post.score} points • {new Date(post.created_utc * 1000).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLinkIcon className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <a href={`https://reddit.com/user/${reddit.user.name}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Visit Profile
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