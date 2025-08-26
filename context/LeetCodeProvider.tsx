"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { LeetCodeStats } from '@/services/external/leetcode';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface LeetCodeContextValue {
  // Data
  data: LeetCodeStats | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hasLeetCodeUsername: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  clearData: () => void;
  
  // Computed values
  progressPercentage: number;
  skillsCount: number;
  badgesCount: number;
  contestParticipation: boolean;
  difficultyStats: {
    easy: { solved: number; percentage: number };
    medium: { solved: number; percentage: number };
    hard: { solved: number; percentage: number };
  };
  
  // Achievement calculations
  achievements: {
    problemSolver: boolean;    // 100+ problems
    contestant: boolean;       // Participated in contests
    skilled: boolean;          // 5+ different skills
    consistent: boolean;       // Good acceptance rate
    expert: boolean;          // 500+ problems
  };
  
  // Insights
  insights: string[];
  nextGoals: string[];
}

const LeetCodeContext = createContext<LeetCodeContextValue | undefined>(undefined);

interface LeetCodeProviderProps {
  children: ReactNode;
}

export const LeetCodeProvider = ({ children }: LeetCodeProviderProps) => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<LeetCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasLeetCodeUsername, setHasLeetCodeUsername] = useState(false);

  const fetchLeetCodeData = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') {
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const response = await axios.get('/api/leetcode');
      
      if (response.data.success && response.data.data) {
        setData(response.data.data);
        setLastUpdated(new Date());
        setHasLeetCodeUsername(true);
      } else if (response.data.message === "No LeetCode username configured") {
        setData(null);
        setHasLeetCodeUsername(false);
        setError("No LeetCode username configured");
      } else {
        setIsError(true);
        setError("Failed to fetch LeetCode data");
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching LeetCode data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  const refreshData = useCallback(async () => {
    await fetchLeetCodeData();
  }, [fetchLeetCodeData]);

  const clearData = useCallback(() => {
    setData(null);
    setIsError(false);
    setError(null);
    setLastUpdated(null);
    setHasLeetCodeUsername(false);
  }, []);

  // Fetch data when user authenticates
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchLeetCodeData();
    } else if (status === 'unauthenticated') {
      clearData();
    }
  }, [session?.user?.id, status, fetchLeetCodeData, clearData]);

  // Computed values
  const computedValues = useMemo(() => {
    if (!data) {
      return {
        progressPercentage: 0,
        skillsCount: 0,
        badgesCount: 0,
        contestParticipation: false,
        difficultyStats: {
          easy: { solved: 0, percentage: 0 },
          medium: { solved: 0, percentage: 0 },
          hard: { solved: 0, percentage: 0 },
        },
        achievements: {
          problemSolver: false,
          contestant: false,
          skilled: false,
          consistent: false,
          expert: false,
        },
        insights: [],
        nextGoals: [],
      };
    }

    const progressPercentage = (data.totalSolved / data.totalQuestions) * 100;
    const skillsCount = data.skills?.length || 0;
    const badgesCount = data.badges?.length || 0;
    const contestParticipation = data.contestsAttended > 0;

    // Difficulty stats
    const totalProblems = data.totalQuestions;
    const difficultyStats = {
      easy: {
        solved: data.easySolved,
        percentage: totalProblems > 0 ? (data.easySolved / (totalProblems * 0.4)) * 100 : 0,
      },
      medium: {
        solved: data.mediumSolved,
        percentage: totalProblems > 0 ? (data.mediumSolved / (totalProblems * 0.45)) * 100 : 0,
      },
      hard: {
        solved: data.hardSolved,
        percentage: totalProblems > 0 ? (data.hardSolved / (totalProblems * 0.15)) * 100 : 0,
      },
    };

    // Achievements
    const achievements = {
      problemSolver: data.totalSolved >= 100,
      contestant: data.contestsAttended >= 1,
      skilled: skillsCount >= 5,
      consistent: data.acceptanceRate >= 70,
      expert: data.totalSolved >= 500,
    };

    // Generate insights
    const insights: string[] = [];
    if (data.totalSolved > 0) {
      insights.push(`You've solved ${data.totalSolved} problems! Great progress!`);
    }
    if (data.acceptanceRate > 80) {
      insights.push(`Excellent ${data.acceptanceRate.toFixed(1)}% acceptance rate!`);
    }
    if (data.contestRating > 0) {
      insights.push(`Contest rating of ${Math.round(data.contestRating)} shows your competitive skills!`);
    }
    if (data.ranking && data.ranking <= 100000) {
      insights.push(`You're in the top ${Math.ceil(data.ranking / 1000)}k globally!`);
    }
    if (badgesCount > 0) {
      insights.push(`${badgesCount} badges earned for consistent practice!`);
    }

    // Generate next goals
    const nextGoals: string[] = [];
    if (data.totalSolved < 100) {
      nextGoals.push(`Solve ${100 - data.totalSolved} more problems to reach 100!`);
    } else if (data.totalSolved < 500) {
      nextGoals.push(`${500 - data.totalSolved} problems away from expert level!`);
    }
    if (data.contestsAttended === 0) {
      nextGoals.push("Participate in your first contest!");
    } else if (data.contestsAttended < 10) {
      nextGoals.push(`Join ${10 - data.contestsAttended} more contests for experience!`);
    }
    if (data.hardSolved < 50) {
      nextGoals.push(`Challenge yourself with ${50 - data.hardSolved} more hard problems!`);
    }

    return {
      progressPercentage,
      skillsCount,
      badgesCount,
      contestParticipation,
      difficultyStats,
      achievements,
      insights,
      nextGoals,
    };
  }, [data]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasLeetCodeUsername,
    refreshData,
    clearData,
    ...computedValues,
  }), [
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasLeetCodeUsername,
    refreshData,
    clearData,
    computedValues,
  ]);

  return (
    <LeetCodeContext.Provider value={contextValue}>
      {children}
    </LeetCodeContext.Provider>
  );
};

export const useLeetCode = () => {
  const context = useContext(LeetCodeContext);
  if (context === undefined) {
    throw new Error('useLeetCode must be used within a LeetCodeProvider');
  }
  return context;
};