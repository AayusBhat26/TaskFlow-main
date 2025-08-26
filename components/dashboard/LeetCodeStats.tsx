"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrophyIcon, 
  CodeIcon, 
  StarIcon, 
  RefreshCwIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TrendingUpIcon,
  AwardIcon,
  TargetIcon,
  FlameIcon,
  BrainIcon,
  ZapIcon
} from "lucide-react";
import { useLeetCode } from "@/hooks/useExternalServiceHooks";
import { cn } from "@/lib/utils";

// Simple loading skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

interface Props {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

export const LeetCodeStats = ({ className, variant = 'full' }: Props) => {
  const {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasLeetCodeUsername,
    refreshData,
    progressPercentage,
    difficultyStats,
    achievements,
    insights,
    nextGoals
  } = useLeetCode();

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

  if (!hasLeetCodeUsername || !data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="w-5 h-5 text-yellow-500" />
            LeetCode Journey
          </CardTitle>
          <CardDescription>
            Connect your LeetCode account to track your coding progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {error === "No LeetCode username configured" 
                ? "Ready to showcase your coding skills?"
                : "Unable to load your LeetCode progress"
              }
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings/external-services">
                <ZapIcon className="w-4 h-4 mr-2" />
                Connect LeetCode
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
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{data.totalSolved}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">{progressPercentage.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
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
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">LeetCode Journey</CardTitle>
                <CardDescription className="text-lg">
                  @{data.username} • {progressPercentage.toFixed(1)}% Complete
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
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{data.totalSolved}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
              <TrophyIcon className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={progressPercentage} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{data.acceptanceRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
              </div>
              <TargetIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {data.contestRating ? Math.round(data.contestRating) : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Contest Rating</p>
              </div>
              <FlameIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{data.ranking?.toLocaleString() || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Global Ranking</p>
              </div>
              <StarIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainIcon className="w-5 h-5" />
            Problem Difficulty Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Easy
                </Badge>
                <span className="font-semibold">{difficultyStats.easy.solved}</span>
              </div>
              <Progress value={Math.min(difficultyStats.easy.percentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {difficultyStats.easy.percentage.toFixed(1)}% of available easy problems
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  Medium
                </Badge>
                <span className="font-semibold">{difficultyStats.medium.solved}</span>
              </div>
              <Progress value={Math.min(difficultyStats.medium.percentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {difficultyStats.medium.percentage.toFixed(1)}% of available medium problems
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  Hard
                </Badge>
                <span className="font-semibold">{difficultyStats.hard.solved}</span>
              </div>
              <Progress value={Math.min(difficultyStats.hard.percentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {difficultyStats.hard.percentage.toFixed(1)}% of available hard problems
              </p>
            </div>
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
              {Object.entries(achievements).map(([key, earned]) => {
                const achievementMap = {
                  problemSolver: { icon: '🎯', title: 'Problem Solver', desc: '100+ problems solved' },
                  contestant: { icon: '🏆', title: 'Contestant', desc: 'Contest participant' },
                  skilled: { icon: '🧠', title: 'Skilled Coder', desc: '5+ different skills' },
                  consistent: { icon: '💎', title: 'Consistent', desc: '70%+ acceptance rate' },
                  expert: { icon: '⚡', title: 'Expert', desc: '500+ problems solved' },
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
              {insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ZapIcon className="w-4 h-4" />
                    Your Achievements
                  </h4>
                  <ul className="space-y-1">
                    {insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {nextGoals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TargetIcon className="w-4 h-4" />
                    Next Goals
                  </h4>
                  <ul className="space-y-1">
                    {nextGoals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
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
                <a href={`https://leetcode.com/${data.username}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Visit Profile
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/settings/external-services">
                  <CodeIcon className="w-4 h-4 mr-2" />
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