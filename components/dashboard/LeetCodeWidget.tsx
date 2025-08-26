"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CodeIcon, 
  TrophyIcon, 
  FlameIcon,
  ExternalLinkIcon,
  SettingsIcon,
  BrainIcon 
} from "lucide-react";
import { useLeetCode } from "@/hooks/useExternalServiceHooks";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: 'mini' | 'compact' | 'card';
}

export const LeetCodeWidget = ({ className, variant = 'compact' }: Props) => {
  const {
    data,
    isLoading,
    hasLeetCodeUsername,
    progressPercentage,
    achievements
  } = useLeetCode();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-16 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!hasLeetCodeUsername || !data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No LeetCode connected</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/settings/external-services">
                <SettingsIcon className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <CodeIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{data.totalSolved}</span>
        <span className="text-xs text-muted-foreground">solved</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50", className)}>
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
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>
    );
  }

  // Card variant - more detailed
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <CodeIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">LeetCode</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={`https://leetcode.com/${data.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Main Stats */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{data.totalSolved}</p>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
            <div className="mt-2 bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">{data.easySolved}</p>
              <p className="text-xs text-muted-foreground">Easy</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-yellow-600">{data.mediumSolved}</p>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-600">{data.hardSolved}</p>
              <p className="text-xs text-muted-foreground">Hard</p>
            </div>
          </div>

          {/* Contest Info */}
          {data.contestRating > 0 && (
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <FlameIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Contest Rating</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {Math.round(data.contestRating)}
              </Badge>
            </div>
          )}

          {/* Achievements */}
          <div className="flex flex-wrap gap-1">
            {Object.entries(achievements).slice(0, 3).map(([key, earned]) => {
              if (!earned) return null;
              
              const icons = {
                problemSolver: '🎯',
                contestant: '🏆',
                skilled: '🧠',
                consistent: '💎',
                expert: '⚡',
              };
              
              return (
                <Badge 
                  key={key} 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  {icons[key as keyof typeof icons]}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};