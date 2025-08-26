"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Star,
  ArrowRight,
  Flame,
  Package,
  Calendar,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ImportedDSAStats {
  overall: {
    total: number;
    curated: number;
    imported: number;
    solved: number;
    inProgress: number;
    todo: number;
    completionPercentage: number;
  };
  topics: Record<string, {
    solved: number;
    total: number;
    inProgress: number;
    curated: number;
    imported: number;
  }>;
  difficulty: Record<string, {
    solved: number;
    total: number;
    inProgress: number;
    curated: number;
    imported: number;
  }>;
  recentActivity: Array<{
    id: string;
    questionTitle: string;
    topic: string;
    difficulty: string;
    status: string;
    isImported: boolean;
    updatedAt: string;
  }>;
  lastSolved: {
    title: string;
    topic: string;
    difficulty: string;
    completedAt: string;
  } | null;
  streak: number;
}

export function ImportedDSAProgressDashboard() {
  const [stats, setStats] = useState<ImportedDSAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dsa/all-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching imported DSA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TODO': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REVIEW': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SKIPPED': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Failed to load imported DSA progress</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topTopics = Object.entries(stats.topics)
    .filter(([_, data]) => data.imported > 0) // Only show topics with imported questions
    .sort((a, b) => b[1].imported - a[1].imported)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-transparent opacity-50" />
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-blue-500/20">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Imported DSA Collection
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground/80">
                  Love Babbar's 450 DSA Sheet & More - Track your coding practice progress
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/dsa')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-600/20 transition-all duration-200 text-sm"
              size="sm"
            >
              <span className="hidden xs:inline">Start Practice</span>
              <span className="xs:hidden">Practice</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Imported Questions */}
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-blue-500/20">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-foreground mb-2">
              {stats.overall.imported}
            </div>
            <p className="text-xs text-muted-foreground">
              imported questions available
            </p>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-green-500/20">
              <Trophy className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.overall.solved}/{stats.overall.total}
            </div>
            <Progress 
              value={stats.overall.completionPercentage} 
              className="h-2 bg-muted mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {stats.overall.completionPercentage}% completed
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-orange-500/20">
              <Flame className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {stats.streak}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.streak === 1 ? 'day' : 'days'} in a row
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-cyan-500/20">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              {stats.overall.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">
              questions started
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Top Topics (Imported Collection)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTopics.map(([topic, data]) => (
              <div key={topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {data.solved}/{data.imported}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {data.imported} total
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={data.imported > 0 ? (data.solved / data.imported) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Last Solved & Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.lastSolved ? (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Last Solved Question
                  </span>
                </div>
                <p className="font-semibold text-sm text-green-900 dark:text-green-100">
                  {stats.lastSolved.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getDifficultyColor(stats.lastSolved.difficulty)}>
                    {stats.lastSolved.difficulty}
                  </Badge>
                  <span className="text-xs text-green-700 dark:text-green-300">
                    {stats.lastSolved.topic}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(stats.lastSolved.completedAt).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No questions solved yet. Start your coding journey!
                </p>
              </div>
            )}

            {/* Quick Action Button */}
            <div className="pt-2">
              <Button 
                onClick={() => router.push('/dsa')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                View All Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 8).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {activity.questionTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.topic} • {new Date(activity.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </Badge>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    {activity.isImported && (
                      <Badge variant="outline" className="text-xs">
                        Imported
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}