"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  GithubIcon, 
  StarIcon, 
  GitForkIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TrendingUpIcon,
  AwardIcon,
  TargetIcon,
  FlameIcon,
  BrainIcon,
  ZapIcon,
  SettingsIcon,
  UsersIcon,
  CodeIcon,
  BookOpenIcon
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

export const GitHubStats = ({ className, variant = 'full' }: Props) => {
  const {
    github,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    githubMetrics
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

  if (!github) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GithubIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            GitHub Journey
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to track your development activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Ready to showcase your coding contributions?
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings/external-services">
                <ZapIcon className="w-4 h-4 mr-2" />
                Connect GitHub
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
              <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
                <GithubIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{github.user.public_repos}</p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-yellow-600">{github.totalStars}</p>
              <p className="text-xs text-muted-foreground">Stars</p>
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
      <Card className="bg-gradient-to-r from-gray-500/10 to-slate-600/10 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
                <GithubIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">GitHub Journey</CardTitle>
                <CardDescription className="text-lg">
                  @{github.user.login} • {githubMetrics.activityLevel} activity • {github.currentStreak} day streak
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
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{github.user.public_repos}</p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
              <BookOpenIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-600">{github.totalStars}</p>
                <p className="text-sm text-muted-foreground">Total Stars</p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{github.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
              <FlameIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{github.user.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlameIcon className="w-5 h-5" />
            Contribution Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={cn(
                  "text-white",
                  githubMetrics.activityLevel === 'high' ? 'bg-green-500' :
                  githubMetrics.activityLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-gray-500'
                )}>
                  {githubMetrics.activityLevel.toUpperCase()}
                </Badge>
                <span className="font-semibold">Activity Level</span>
              </div>
              <Progress 
                value={
                  githubMetrics.activityLevel === 'high' ? 100 :
                  githubMetrics.activityLevel === 'medium' ? 65 : 30
                } 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Based on recent contribution patterns
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Current Streak</span>
                <span className="text-lg font-bold text-green-600">{github.currentStreak} days</span>
              </div>
              <Progress value={Math.min((github.currentStreak / 365) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Longest: {github.longestStreak} days
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Commits</span>
                <span className="text-lg font-bold text-blue-600">{github.totalCommits.toLocaleString()}</span>
              </div>
              <Progress value={Math.min((github.totalCommits / 1000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                This year's activity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="w-5 h-5" />
            Programming Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {githubMetrics.topLanguages.length > 0 ? (
              githubMetrics.topLanguages.map((lang, index) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-green-500" :
                      index === 2 ? "bg-yellow-500" :
                      index === 3 ? "bg-purple-500" :
                      "bg-gray-500"
                    )} />
                    <span className="font-medium">{lang.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {lang.percentage.toFixed(1)}%
                    </span>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-300",
                          index === 0 ? "bg-blue-500" :
                          index === 1 ? "bg-green-500" :
                          index === 2 ? "bg-yellow-500" :
                          index === 3 ? "bg-purple-500" :
                          "bg-gray-500"
                        )}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No language data available
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
              {Object.entries(githubMetrics.achievements).map(([key, earned]) => {
                const achievementMap = {
                  contributor: { icon: '💻', title: 'Active Contributor', desc: '100+ commits made' },
                  popular: { icon: '⭐', title: 'Popular Developer', desc: '50+ stars earned' },
                  consistent: { icon: '🔥', title: 'Consistent Coder', desc: '30+ day streak' },
                  prolific: { icon: '📚', title: 'Prolific Creator', desc: '20+ repositories' },
                  social: { icon: '👥', title: 'Community Member', desc: '10+ followers' },
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
              {githubMetrics.insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ZapIcon className="w-4 h-4" />
                    Your Progress
                  </h4>
                  <ul className="space-y-1">
                    {githubMetrics.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-gray-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {githubMetrics.nextGoals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TargetIcon className="w-4 h-4" />
                    Next Goals
                  </h4>
                  <ul className="space-y-1">
                    {githubMetrics.nextGoals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Commits */}
              {github.recentCommits && github.recentCommits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recent Commits</h4>
                  <div className="space-y-2">
                    {github.recentCommits.slice(0, 3).map((commit, index) => (
                      <div key={index} className="p-2 bg-muted/50 rounded">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{commit.commit.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {commit.repository} • {new Date(commit.commit.author.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
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
                <a href={`https://github.com/${github.user.login}`} target="_blank" rel="noopener noreferrer">
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