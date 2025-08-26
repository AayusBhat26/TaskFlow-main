"use client";

import { useExternalServices } from "@/context/ExternalServicesProvider";

// Individual hooks for each external service
export const useLeetCode = () => {
  const {
    leetcode: data,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    leetcodeMetrics
  } = useExternalServices();

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasLeetCodeUsername: !!data,
    refreshData,
    progressPercentage: leetcodeMetrics.progressPercentage,
    difficultyStats: leetcodeMetrics.difficultyStats,
    achievements: leetcodeMetrics.achievements,
    insights: leetcodeMetrics.insights,
    nextGoals: leetcodeMetrics.nextGoals,
  };
};

export const useCodeforces = () => {
  const {
    codeforces: data,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    codeforcesMetrics
  } = useExternalServices();

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasCodeforcesUsername: !!data,
    refreshData,
    ratingProgress: codeforcesMetrics.ratingProgress,
    problemsThisMonth: codeforcesMetrics.problemsThisMonth,
    contestPerformance: codeforcesMetrics.contestPerformance,
    achievements: codeforcesMetrics.achievements,
    insights: codeforcesMetrics.insights,
    nextGoals: codeforcesMetrics.nextGoals,
  };
};

export const useGitHub = () => {
  const {
    github: data,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    githubMetrics
  } = useExternalServices();

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasGitHubUsername: !!data,
    refreshData,
    activityLevel: githubMetrics.activityLevel,
    contributionTrend: githubMetrics.contributionTrend,
    topLanguages: githubMetrics.topLanguages,
    achievements: githubMetrics.achievements,
    insights: githubMetrics.insights,
    nextGoals: githubMetrics.nextGoals,
  };
};

export const useReddit = () => {
  const {
    reddit: data,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    redditMetrics
  } = useExternalServices();

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasRedditUsername: !!data,
    refreshData,
    engagementScore: redditMetrics.engagementScore,
    karmaGrowth: redditMetrics.karmaGrowth,
    topCommunities: redditMetrics.topCommunities,
    achievements: redditMetrics.achievements,
    insights: redditMetrics.insights,
    nextGoals: redditMetrics.nextGoals,
  };
};

export const useEmail = () => {
  const {
    email: data,
    isLoading,
    isError,
    error,
    lastUpdated,
    refreshData,
    emailMetrics
  } = useExternalServices();

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    hasEmailConnected: !!data,
    refreshData,
    productivityScore: emailMetrics.productivityScore,
    emailLoad: emailMetrics.emailLoad,
    responseNeeded: emailMetrics.responseNeeded,
    achievements: emailMetrics.achievements,
    insights: emailMetrics.insights,
    nextGoals: emailMetrics.nextGoals,
  };
};