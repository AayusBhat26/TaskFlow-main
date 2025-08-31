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
  ArrowRight,
  Flame
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DSAStats {
  overall: {
    total: number;
    solved: number;
    inProgress: number;
    todo: number;
    completionPercentage: number;
  };
  topics: Record<string, {
    solved: number;
    total: number;
    inProgress: number;
  }>;
  difficulty: Record<string, {
    solved: number;
    total: number;
    inProgress: number;
  }>;

  streak: number;
}

export function DSAProgressDashboard() {
  const [stats, setStats] = useState<DSAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Listen for progress updates from other components
  useEffect(() => {
    const handleProgressUpdate = () => {
      console.log('📡 DSAProgressDashboard received dsaProgressUpdated event, refreshing stats...');
      fetchStats();
    };

    console.log('🔌 DSAProgressDashboard setting up event listener for dsaProgressUpdated');
    window.addEventListener('dsaProgressUpdated', handleProgressUpdate);
    
    // Fallback: Poll for updates every 30 seconds as a backup
    const pollInterval = setInterval(() => {
      console.log('🔄 DSAProgressDashboard polling for updates...');
      fetchStats();
    }, 30000);
    
    return () => {
      console.log('🔌 DSAProgressDashboard removing event listener for dsaProgressUpdated');
      window.removeEventListener('dsaProgressUpdated', handleProgressUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dsa/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching DSA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-accent-foreground bg-muted border-border';
      case 'MEDIUM': return 'text-secondary-foreground bg-secondary border-border';
      case 'HARD': return 'text-destructive-foreground bg-destructive border-border';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-primary-foreground bg-primary border-border';
      case 'IN_PROGRESS': return 'text-accent-foreground bg-accent border-border';
      case 'TODO': return 'text-muted-foreground bg-muted border-border';
      case 'REVIEW': return 'text-secondary-foreground bg-secondary border-border';
      case 'SKIPPED': return 'text-muted-foreground bg-muted border-border';
      default: return 'text-muted-foreground bg-muted border-border';
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
            <p className="text-muted-foreground">Failed to load DSA progress</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topTopics = Object.entries(stats.topics)
    .sort((a, b) => b[1].solved - a[1].solved)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Theme Integration */}
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-r from-accent/5 via-primary/5 to-secondary/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-50" />
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-accent/20">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  DSA Practice Progress
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground/80">
                  Track your progress on curated Data Structures & Algorithms questions
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchStats}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-secondary/20 transition-all duration-200 text-sm"
                size="sm"
              >
                Refresh
              </Button>
              <Button 
                onClick={() => router.push('/dsa')}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-200 text-sm"
                size="sm"
              >
                <span className="hidden xs:inline">Practice DSA</span>
                <span className="xs:hidden">Practice</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Overall Progress */}
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Curated Questions</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-primary/20">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-foreground mb-2">
              {stats.overall.solved}/{stats.overall.total}
            </div>
            <Progress 
              value={stats.overall.completionPercentage} 
              className="h-2 bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.overall.completionPercentage}% completed
            </p>
          </CardContent>
        </Card>

        {/* Streak */}
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
        <Card className="group relative overflow-hidden border border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-blue-500/20">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.overall.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">
              questions started
            </p>
          </CardContent>
        </Card>

        {/* Total Solved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solved</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.overall.solved}
            </div>
            <p className="text-xs text-muted-foreground">
              questions completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.difficulty).map(([difficulty, data]) => (
              <div key={difficulty} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {data.solved}/{data.total}
                  </span>
                </div>
                <Progress 
                  value={data.total > 0 ? (data.solved / data.total) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Top Topics Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTopics.map(([topic, data]) => (
              <div key={topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{topic}</span>
                  <span className="text-sm text-muted-foreground">
                    {data.solved}/{data.total}
                  </span>
                </div>
                <Progress 
                  value={data.total > 0 ? (data.solved / data.total) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
