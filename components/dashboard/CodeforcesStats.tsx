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
  ZapIcon,
  SettingsIcon
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

export const CodeforcesStats = ({ className, variant = 'full' }: Props) => {
  const {
    codeforces,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    codeforcesMetrics
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

  if (!codeforces) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="w-5 h-5 text-red-500" />
            Codeforces Journey
          </CardTitle>
          <CardDescription>
            Connect your Codeforces account to track your competitive programming progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Ready to showcase your competitive programming skills?
            </p>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings/external-services">
                <ZapIcon className="w-4 h-4 mr-2" />
                Connect Codeforces
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{codeforces.user.rating}</p>
                <p className="text-sm text-muted-foreground">{codeforces.user.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">{codeforces.solvedProblems}</p>
              <p className="text-xs text-muted-foreground">Problems</p>
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
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-600/10 border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Codeforces Journey</CardTitle>
                <CardDescription className="text-lg">
                  {codeforces.user.handle} • {codeforces.user.rank} • {codeforcesMetrics.ratingProgress.toFixed(1)}% to Master
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
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-600">{codeforces.user.rating}</p>
                <p className="text-sm text-muted-foreground">Current Rating</p>
              </div>
              <TrophyIcon className="w-8 h-8 text-red-500" />
            </div>
            <Progress value={Math.min(codeforcesMetrics.ratingProgress, 100)} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{codeforces.user.maxRating}</p>
                <p className="text-sm text-muted-foreground">Max Rating</p>
              </div>
              <StarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{codeforces.solvedProblems}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
              <BrainIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{codeforces.contestsParticipated}</p>
                <p className="text-sm text-muted-foreground">Contests</p>
              </div>
              <FlameIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5" />
            Rank Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge 
                  className={cn(
                    "text-white",
                    codeforces.user.rank === 'newbie' ? 'bg-gray-500' :
                    codeforces.user.rank === 'pupil' ? 'bg-green-500' :
                    codeforces.user.rank === 'specialist' ? 'bg-cyan-500' :
                    codeforces.user.rank === 'expert' ? 'bg-blue-500' :
                    codeforces.user.rank === 'candidate master' ? 'bg-purple-500' :
                    codeforces.user.rank === 'master' ? 'bg-orange-500' :
                    'bg-red-500'
                  )}
                >
                  {codeforces.user.rank.toUpperCase()}
                </Badge>
                <span className="font-semibold">{codeforces.user.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Max: {codeforces.user.maxRating} ({codeforces.user.maxRank})
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { rank: 'Newbie', min: 0, color: 'bg-gray-500' },
                { rank: 'Pupil', min: 1200, color: 'bg-green-500' },
                { rank: 'Specialist', min: 1400, color: 'bg-cyan-500' },
                { rank: 'Expert', min: 1600, color: 'bg-blue-500' },
                { rank: 'Candidate Master', min: 1900, color: 'bg-purple-500' },
              ].map((rankInfo) => (
                <div 
                  key={rankInfo.rank}
                  className={cn(
                    "p-3 rounded-lg border",
                    codeforces.user.rating >= rankInfo.min 
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                      : "bg-muted/50 border-muted"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", rankInfo.color)} />
                  <p className="font-medium text-sm">{rankInfo.rank}</p>
                  <p className="text-xs text-muted-foreground">{rankInfo.min}+</p>
                  {codeforces.user.rating >= rankInfo.min && (
                    <Badge className="mt-1 bg-green-100 text-green-800">✓</Badge>
                  )}
                </div>
              ))}
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
              {Object.entries(codeforcesMetrics.achievements).map(([key, earned]) => {
                const achievementMap = {
                  newbie: { icon: '🎯', title: 'Newbie', desc: 'Joined Codeforces' },
                  pupil: { icon: '🌱', title: 'Pupil', desc: 'Reached 1400+ rating' },
                  specialist: { icon: '🎓', title: 'Specialist', desc: 'Reached 1600+ rating' },
                  expert: { icon: '⭐', title: 'Expert', desc: 'Reached 1900+ rating' },
                  candidateMaster: { icon: '👑', title: 'Candidate Master', desc: 'Reached 2100+ rating' },
                  active: { icon: '🔥', title: 'Contest Active', desc: '10+ contests participated' },
                  solver: { icon: '🧠', title: 'Problem Solver', desc: '100+ problems solved' },
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
              {codeforcesMetrics.insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ZapIcon className="w-4 h-4" />
                    Your Progress
                  </h4>
                  <ul className="space-y-1">
                    {codeforcesMetrics.insights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {codeforcesMetrics.nextGoals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TargetIcon className="w-4 h-4" />
                    Next Goals
                  </h4>
                  <ul className="space-y-1">
                    {codeforcesMetrics.nextGoals.slice(0, 3).map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Activity */}
              {codeforces.recentSubmissions && codeforces.recentSubmissions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {codeforces.recentSubmissions.slice(0, 3).map((submission, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{submission.problem.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {submission.problem.rating ? `${submission.problem.rating} • ` : ''}
                            {submission.programmingLanguage}
                          </p>
                        </div>
                        <Badge 
                          variant={submission.verdict === 'OK' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {submission.verdict === 'OK' ? '✓' : '✗'}
                        </Badge>
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
                <a href={`https://codeforces.com/profile/${codeforces.user.handle}`} target="_blank" rel="noopener noreferrer">
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