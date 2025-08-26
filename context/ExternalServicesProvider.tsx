"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  ExternalServicesData,
  LeetCodeStats,
  CodeforcesStats,
  GitHubStats,
  RedditStats,
  EmailStats
} from '@/services/external';

interface ExternalServicesContextType {
  // Data
  data: ExternalServicesData | null;
  
  // Service-specific data
  leetcode: LeetCodeStats | null;
  codeforces: CodeforcesStats | null;
  github: GitHubStats | null;
  reddit: RedditStats | null;
  email: EmailStats | null;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // Metadata
  lastUpdated: string | null;
  hasAnyService: boolean;
  
  // Methods
  refreshData: () => Promise<void>;
  
  // Computed data for each service
  leetcodeMetrics: {
    progressPercentage: number;
    difficultyStats: {
      easy: { solved: number; percentage: number };
      medium: { solved: number; percentage: number };
      hard: { solved: number; percentage: number };
    };
    achievements: Record<string, boolean>;
    insights: string[];
    nextGoals: string[];
  };
  
  codeforcesMetrics: {
    ratingProgress: number;
    problemsThisMonth: number;
    contestPerformance: 'improving' | 'stable' | 'declining';
    achievements: Record<string, boolean>;
    insights: string[];
    nextGoals: string[];
  };
  
  githubMetrics: {
    activityLevel: 'high' | 'medium' | 'low';
    contributionTrend: 'increasing' | 'stable' | 'decreasing';
    topLanguages: Array<{ language: string; percentage: number }>;
    achievements: Record<string, boolean>;
    insights: string[];
    nextGoals: string[];
  };
  
  redditMetrics: {
    engagementScore: number;
    karmaGrowth: 'positive' | 'neutral' | 'negative';
    topCommunities: Array<{ subreddit: string; posts: number }>;
    achievements: Record<string, boolean>;
    insights: string[];
    nextGoals: string[];
  };
  
  emailMetrics: {
    productivityScore: number;
    emailLoad: 'heavy' | 'moderate' | 'light';
    responseNeeded: number;
    achievements: Record<string, boolean>;
    insights: string[];
    nextGoals: string[];
  };
  
  // Unified insights
  dailyDigest: {
    title: string;
    summary: string;
    highlights: string[];
    actionItems: string[];
  };
  
  overallInsights: string[];
  unifiedAchievements: Array<{
    id: string;
    title: string;
    description: string;
    service: 'leetcode' | 'codeforces' | 'github' | 'reddit' | 'email';
    icon: string;
    earned: boolean;
    progress?: number;
  }>;
}

const ExternalServicesContext = createContext<ExternalServicesContextType | undefined>(undefined);

interface ExternalServicesProviderProps {
  children: React.ReactNode;
}

export const ExternalServicesProvider = ({ children }: ExternalServicesProviderProps) => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ExternalServicesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (status === 'loading' || !session?.user?.id) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetch('/api/external-services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setLastUpdated(new Date().toISOString());
      } else {
        setData(null);
        setError(result.message || 'No external services configured');
      }
    } catch (err) {
      console.error('Error fetching external services data:', err);
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch external services data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  // Auto-fetch data when user logs in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchData();
    }
  }, [status, session?.user?.id, fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Extract individual service data
  const leetcode = useMemo(() => data?.leetcode || null, [data]);
  const codeforces = useMemo(() => data?.codeforces || null, [data]);
  const github = useMemo(() => data?.github || null, [data]);
  const reddit = useMemo(() => data?.reddit || null, [data]);
  const email = useMemo(() => data?.email || null, [data]);

  // Check if user has any external services configured
  const hasAnyService = useMemo(() => {
    return !!(leetcode || codeforces || github || reddit || email);
  }, [leetcode, codeforces, github, reddit, email]);

  // LeetCode metrics (similar to previous implementation)
  const leetcodeMetrics = useMemo(() => {
    if (!leetcode) {
      return {
        progressPercentage: 0,
        difficultyStats: {
          easy: { solved: 0, percentage: 0 },
          medium: { solved: 0, percentage: 0 },
          hard: { solved: 0, percentage: 0 },
        },
        achievements: {},
        insights: [],
        nextGoals: [],
      };
    }

    const progressPercentage = (leetcode.totalSolved / leetcode.totalQuestions) * 100;
    
    const difficultyStats = {
      easy: {
        solved: leetcode.easySolved,
        percentage: (leetcode.easySolved / 800) * 100, // Approximate easy problems
      },
      medium: {
        solved: leetcode.mediumSolved,
        percentage: (leetcode.mediumSolved / 1600) * 100, // Approximate medium problems
      },
      hard: {
        solved: leetcode.hardSolved,
        percentage: (leetcode.hardSolved / 800) * 100, // Approximate hard problems
      },
    };

    const achievements = {
      problemSolver: leetcode.totalSolved >= 100,
      contestant: leetcode.contestRating > 0,
      skilled: leetcode.totalSolved >= 500,
      consistent: leetcode.acceptanceRate >= 70,
      expert: leetcode.totalSolved >= 1000,
    };

    const insights = [];
    if (leetcode.totalSolved > 0) {
      insights.push(`You've solved ${leetcode.totalSolved} problems on LeetCode!`);
    }
    if (leetcode.contestRating > 0) {
      insights.push(`Your contest rating is ${Math.round(leetcode.contestRating)}`);
    }
    if (leetcode.acceptanceRate >= 80) {
      insights.push(`Excellent ${leetcode.acceptanceRate.toFixed(1)}% acceptance rate!`);
    }

    const nextGoals = [];
    if (leetcode.totalSolved < 100) {
      nextGoals.push('Reach 100 solved problems');
    } else if (leetcode.totalSolved < 500) {
      nextGoals.push('Reach 500 solved problems');
    } else if (leetcode.totalSolved < 1000) {
      nextGoals.push('Reach 1000 solved problems');
    }
    
    if (leetcode.contestRating === 0) {
      nextGoals.push('Participate in your first contest');
    }

    return {
      progressPercentage,
      difficultyStats,
      achievements,
      insights,
      nextGoals,
    };
  }, [leetcode]);

  // Codeforces metrics
  const codeforcesMetrics = useMemo(() => {
    if (!codeforces) {
      return {
        ratingProgress: 0,
        problemsThisMonth: 0,
        contestPerformance: 'stable' as const,
        achievements: {},
        insights: [],
        nextGoals: [],
      };
    }

    const ratingProgress = ((codeforces.user.rating - 1200) / 2800) * 100; // Assuming 1200-4000 range
    
    const achievements = {
      newbie: codeforces.user.rating >= 1200,
      pupil: codeforces.user.rating >= 1400,
      specialist: codeforces.user.rating >= 1600,
      expert: codeforces.user.rating >= 1900,
      candidateMaster: codeforces.user.rating >= 2100,
      active: codeforces.contestsParticipated >= 10,
      solver: codeforces.solvedProblems >= 100,
    };

    const insights = [];
    insights.push(`Codeforces rating: ${codeforces.user.rating} (${codeforces.user.rank})`);
    insights.push(`Solved ${codeforces.solvedProblems} problems`);
    if (codeforces.contestsParticipated > 0) {
      insights.push(`Participated in ${codeforces.contestsParticipated} contests`);
    }

    const nextGoals = [];
    if (codeforces.user.rating < 1400) {
      nextGoals.push('Reach Pupil rank (1400+)');
    } else if (codeforces.user.rating < 1600) {
      nextGoals.push('Reach Specialist rank (1600+)');
    } else if (codeforces.user.rating < 1900) {
      nextGoals.push('Reach Expert rank (1900+)');
    }

    return {
      ratingProgress,
      problemsThisMonth: codeforces.solvedProblems, // Simplified
      contestPerformance: 'stable' as const,
      achievements,
      insights,
      nextGoals,
    };
  }, [codeforces]);

  // GitHub metrics
  const githubMetrics = useMemo(() => {
    if (!github) {
      return {
        activityLevel: 'low' as const,
        contributionTrend: 'stable' as const,
        topLanguages: [],
        achievements: {},
        insights: [],
        nextGoals: [],
      };
    }

    const activityLevel = github.currentStreak > 30 ? 'high' : github.currentStreak > 7 ? 'medium' : 'low';
    
    const topLanguages = Object.entries(github.languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({
        language,
        percentage: (count / Object.values(github.languageStats).reduce((sum, c) => sum + c, 0)) * 100
      }));

    const achievements = {
      contributor: github.totalCommits >= 100,
      popular: github.totalStars >= 50,
      consistent: github.currentStreak >= 30,
      prolific: github.user.public_repos >= 20,
      social: github.user.followers >= 10,
    };

    const insights = [];
    insights.push(`${github.user.public_repos} public repositories`);
    insights.push(`${github.totalStars} total stars across all repos`);
    if (github.currentStreak > 0) {
      insights.push(`Current streak: ${github.currentStreak} days`);
    }

    const nextGoals = [];
    if (github.currentStreak === 0) {
      nextGoals.push('Start a contribution streak');
    } else if (github.currentStreak < 30) {
      nextGoals.push('Maintain a 30-day streak');
    }
    if (github.totalStars < 100) {
      nextGoals.push('Reach 100 total stars');
    }

    return {
      activityLevel,
      contributionTrend: 'stable' as const,
      topLanguages,
      achievements,
      insights,
      nextGoals,
    };
  }, [github]);

  // Reddit metrics
  const redditMetrics = useMemo(() => {
    if (!reddit) {
      return {
        engagementScore: 0,
        karmaGrowth: 'neutral' as const,
        topCommunities: [],
        achievements: {},
        insights: [],
        nextGoals: [],
      };
    }

    const engagementScore = Math.min((reddit.totalKarma / 1000) * 100, 100);
    
    const topCommunities = Object.entries(reddit.topSubreddits || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([subreddit, posts]) => ({ subreddit, posts }));

    const achievements = {
      active: reddit.postsCount >= 10,
      popular: reddit.totalKarma >= 1000,
      contributor: reddit.commentsCount >= 100,
      veteran: reddit.accountAge >= 365,
      social: reddit.totalKarma >= 5000,
    };

    const insights = [];
    insights.push(`${reddit.totalKarma.toLocaleString()} total karma`);
    insights.push(`Account age: ${Math.floor(reddit.accountAge / 365)} years`);
    if (reddit.postsCount > 0) {
      insights.push(`${reddit.postsCount} posts created`);
    }

    const nextGoals = [];
    if (reddit.totalKarma < 1000) {
      nextGoals.push('Reach 1,000 karma');
    } else if (reddit.totalKarma < 10000) {
      nextGoals.push('Reach 10,000 karma');
    }

    return {
      engagementScore,
      karmaGrowth: 'neutral' as const,
      topCommunities,
      achievements,
      insights,
      nextGoals,
    };
  }, [reddit]);

  // Email metrics
  const emailMetrics = useMemo(() => {
    if (!email) {
      return {
        productivityScore: 0,
        emailLoad: 'light' as const,
        responseNeeded: 0,
        achievements: {},
        insights: [],
        nextGoals: [],
      };
    }

    const emailLoad = email.avgEmailsPerDay > 50 ? 'heavy' : email.avgEmailsPerDay > 20 ? 'moderate' : 'light';
    const productivityScore = Math.max(100 - (email.totalUnread / 10), 0);

    const achievements = {
      organized: email.totalUnread < 10,
      responsive: email.totalUnread < 5,
      efficient: email.avgEmailsPerDay < 30,
      connected: email.totalToday > 0,
    };

    const insights = [];
    insights.push(`${email.totalUnread} unread emails`);
    insights.push(`Average ${Math.round(email.avgEmailsPerDay)} emails per day`);
    if (email.totalToday > 0) {
      insights.push(`${email.totalToday} emails received today`);
    }

    const nextGoals = [];
    if (email.totalUnread > 20) {
      nextGoals.push('Clean up inbox to under 20 unread emails');
    } else if (email.totalUnread > 5) {
      nextGoals.push('Achieve inbox zero (under 5 unread)');
    }

    return {
      productivityScore,
      emailLoad,
      responseNeeded: email.totalUnread,
      achievements,
      insights,
      nextGoals,
    };
  }, [email]);

  // Unified insights and achievements
  const dailyDigest = useMemo(() => {
    const highlights: string[] = [];
    const actionItems: string[] = [];

    if (leetcode && leetcode.totalSolved > 0) {
      highlights.push(`LeetCode: ${leetcode.totalSolved} problems solved`);
    }
    
    if (codeforces && codeforces.solvedProblems > 0) {
      highlights.push(`Codeforces: ${codeforces.user.rating} rating`);
    }
    
    if (github && github.currentStreak > 0) {
      highlights.push(`GitHub: ${github.currentStreak}-day streak`);
    }
    
    if (reddit && reddit.totalKarma > 0) {
      highlights.push(`Reddit: ${reddit.totalKarma.toLocaleString()} karma`);
    }
    
    if (email && email.totalUnread > 10) {
      actionItems.push(`${email.totalUnread} unread emails need attention`);
    }

    return {
      title: 'External Services Overview',
      summary: highlights.length > 0 
        ? `Active across ${highlights.length} platforms` 
        : 'Connect your external services to see activity',
      highlights,
      actionItems,
    };
  }, [leetcode, codeforces, github, reddit, email]);

  const overallInsights = useMemo(() => {
    const insights: string[] = [];
    
    [leetcodeMetrics, codeforcesMetrics, githubMetrics, redditMetrics, emailMetrics]
      .forEach(metrics => insights.push(...metrics.insights.slice(0, 2)));
    
    return insights.slice(0, 8); // Limit to 8 total insights
  }, [leetcodeMetrics, codeforcesMetrics, githubMetrics, redditMetrics, emailMetrics]);

  const unifiedAchievements = useMemo(() => {
    const achievements = [];

    // LeetCode achievements
    if (leetcode) {
      achievements.push(
        {
          id: 'leetcode-solver',
          title: 'Problem Solver',
          description: 'Solved 100+ LeetCode problems',
          service: 'leetcode' as const,
          icon: '🎯',
          earned: leetcodeMetrics.achievements.problemSolver,
        },
        {
          id: 'leetcode-expert',
          title: 'LeetCode Expert',
          description: 'Solved 1000+ problems',
          service: 'leetcode' as const,
          icon: '⚡',
          earned: leetcodeMetrics.achievements.expert,
        }
      );
    }

    // Codeforces achievements
    if (codeforces) {
      achievements.push(
        {
          id: 'codeforces-specialist',
          title: 'Specialist',
          description: 'Reached Specialist rank on Codeforces',
          service: 'codeforces' as const,
          icon: '🏆',
          earned: codeforcesMetrics.achievements.specialist,
        }
      );
    }

    // GitHub achievements
    if (github) {
      achievements.push(
        {
          id: 'github-contributor',
          title: 'Active Contributor',
          description: '100+ commits on GitHub',
          service: 'github' as const,
          icon: '💻',
          earned: githubMetrics.achievements.contributor,
        }
      );
    }

    // Reddit achievements
    if (reddit) {
      achievements.push(
        {
          id: 'reddit-popular',
          title: 'Reddit Popular',
          description: '1000+ total karma',
          service: 'reddit' as const,
          icon: '📱',
          earned: redditMetrics.achievements.popular,
        }
      );
    }

    // Email achievements
    if (email) {
      achievements.push(
        {
          id: 'email-organized',
          title: 'Email Organized',
          description: 'Less than 10 unread emails',
          service: 'email' as const,
          icon: '📧',
          earned: emailMetrics.achievements.organized,
        }
      );
    }

    return achievements;
  }, [leetcode, codeforces, github, reddit, email, leetcodeMetrics, codeforcesMetrics, githubMetrics, redditMetrics, emailMetrics]);

  const value = useMemo(
    () => ({
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
      leetcodeMetrics,
      codeforcesMetrics,
      githubMetrics,
      redditMetrics,
      emailMetrics,
      dailyDigest,
      overallInsights,
      unifiedAchievements,
    }),
    [
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
      leetcodeMetrics,
      codeforcesMetrics,
      githubMetrics,
      redditMetrics,
      emailMetrics,
      dailyDigest,
      overallInsights,
      unifiedAchievements,
    ]
  );

  return (
    <ExternalServicesContext.Provider value={value}>
      {children}
    </ExternalServicesContext.Provider>
  );
};

export const useExternalServices = () => {
  const context = useContext(ExternalServicesContext);
  if (context === undefined) {
    throw new Error('useExternalServices must be used within an ExternalServicesProvider');
  }
  return context;
};