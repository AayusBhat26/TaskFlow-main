'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExternalServices } from '@/hooks/useExternalServices';
import { cn } from '@/lib/utils';
import {
  CodeIcon,
  TrophyIcon,
  GithubIcon,
  MessageCircleIcon,
  MailIcon,
  RefreshCwIcon,
  SettingsIcon,
  CalendarIcon,
  TrendingUpIcon,
  StarIcon,
  GitBranchIcon,
  ClockIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  BrainIcon,
  PlusIcon,
  ActivityIcon,
  ZapIcon,
  TargetIcon,
  AwardIcon
} from 'lucide-react';

interface TabbedExternalServicesDashboardProps {
  className?: string;
}

export const TabbedExternalServicesDashboard = ({ className }: TabbedExternalServicesDashboardProps) => {
  const {
    data,
    isLoading,
    isRefetching,
    error,
    hasData,
    refreshData,
    dailyDigest
  } = useExternalServices();

  // Extract individual service data from the main data object
  const leetcode = data?.leetcode;
  const codeforces = data?.codeforces;
  const github = data?.github;
  const reddit = data?.reddit;
  const email = data?.email;
  const hasAnyService = hasData;

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 sm:h-24 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasAnyService) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-blue-500" />
            Digital Activity Hub
          </CardTitle>
          <CardDescription>
            Connect your external accounts to get a unified view of your digital activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CodeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
                <GithubIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <MailIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Digital Ecosystem</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Track your progress across LeetCode, Codeforces, GitHub, Reddit, and Email in one unified dashboard
            </p>
            <Button asChild>
              <a href="/dashboard/settings/external-services">
                <PlusIcon className="w-4 h-4 mr-2" />
                Connect Services
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header - Enhanced with theme-aware styling */}
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-50" />
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-primary/20">
                  <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Digital Activity Hub
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground/80">
                  {dailyDigest?.summary || 'Track your progress across multiple platforms'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm" 
                disabled={isRefetching}
                className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-xs sm:text-sm"
              >
                <RefreshCwIcon className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", isRefetching && "animate-spin")} />
                <span className="hidden xs:inline">{isRefetching ? 'Refreshing...' : 'Refresh All'}</span>
                <span className="xs:hidden">{isRefetching ? '...' : 'Refresh'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="border-border/50 hover:border-border hover:bg-accent/50 transition-all duration-200 text-xs sm:text-sm"
              >
                <a href="/dashboard/settings/external-services">
                  <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Settings</span>
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="relative">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-12 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 gap-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 font-medium">
                <ActivityIcon className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden md:inline">Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="leetcode" 
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200",
                !leetcode && "opacity-60 data-[state=active]:opacity-100"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <CodeIcon className="w-4 h-4 text-yellow-500" />
                <span className="hidden xs:inline sm:hidden md:inline">LeetCode</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="codeforces" 
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200",
                !codeforces && "opacity-60 data-[state=active]:opacity-100"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <TrophyIcon className="w-4 h-4 text-red-500" />
                <span className="hidden xs:inline sm:hidden md:inline">Codeforces</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="github" 
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200",
                !github && "opacity-60 data-[state=active]:opacity-100"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <GithubIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="hidden xs:inline sm:hidden md:inline">GitHub</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="reddit" 
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200",
                !reddit && "opacity-60 data-[state=active]:opacity-100"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <MessageCircleIcon className="w-4 h-4 text-orange-500" />
                <span className="hidden xs:inline sm:hidden md:inline">Reddit</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="email" 
              className={cn(
                "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-md transition-all duration-200",
                !email && "opacity-60 data-[state=active]:opacity-100"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <MailIcon className="w-4 h-4 text-blue-500" />
                <span className="hidden xs:inline sm:hidden md:inline">Email</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Enhanced Service Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {/* LeetCode Card */}
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1",
                !leetcode && "opacity-75 border-dashed hover:opacity-90"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-yellow-500/20">
                    <CodeIcon className="w-5 h-5 text-white" />
                  </div>
                  {leetcode ? (
                    <>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{leetcode.totalSolved}</p>
                      <p className="text-sm text-muted-foreground font-medium">Problems Solved</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-muted-foreground mb-1">Connect</p>
                      <p className="text-sm text-muted-foreground">LeetCode</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Codeforces Card */}
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-gradient-to-br from-red-500/5 to-orange-500/5 hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1",
                !codeforces && "opacity-75 border-dashed hover:opacity-90"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-red-500/20">
                    <TrophyIcon className="w-5 h-5 text-white" />
                  </div>
                  {codeforces ? (
                    <>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{codeforces.user.rating}</p>
                      <p className="text-sm text-muted-foreground font-medium">Rating</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-muted-foreground mb-1">Connect</p>
                      <p className="text-sm text-muted-foreground">Codeforces</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* GitHub Card */}
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-gradient-to-br from-gray-500/5 to-slate-600/5 hover:from-gray-500/10 hover:to-slate-600/10 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10 hover:-translate-y-1",
                !github && "opacity-75 border-dashed hover:opacity-90"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-gray-600/20">
                    <GithubIcon className="w-5 h-5 text-white" />
                  </div>
                  {github ? (
                    <>
                      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">{github.totalStars}</p>
                      <p className="text-sm text-muted-foreground font-medium">Stars Earned</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-muted-foreground mb-1">Connect</p>
                      <p className="text-sm text-muted-foreground">GitHub</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Reddit Card */}
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1",
                !reddit && "opacity-75 border-dashed hover:opacity-90"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-orange-500/20">
                    <MessageCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  {reddit ? (
                    <>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">{Math.floor(reddit.totalKarma / 1000)}k</p>
                      <p className="text-sm text-muted-foreground font-medium">Karma Points</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-muted-foreground mb-1">Connect</p>
                      <p className="text-sm text-muted-foreground">Reddit</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className={cn(
                "group relative overflow-hidden border border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1",
                !email && "opacity-75 border-dashed hover:opacity-90"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-blue-500/20">
                    <MailIcon className="w-5 h-5 text-white" />
                  </div>
                  {email ? (
                    <>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{email.totalUnread}</p>
                      <p className="text-sm text-muted-foreground font-medium">Unread Emails</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-muted-foreground mb-1">Connect</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Daily Activity Summary */}
            <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-primary/3 via-background to-accent/3 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
              <CardHeader className="relative border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-primary/20">
                    <CalendarIcon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      Daily Activity Summary
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your progress across all connected platforms
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Connected Services */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ActivityIcon className="w-4 h-4" />
                      Connected Services
                    </h4>
                    <div className="space-y-2">
                      {leetcode && (
                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800/40 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full" />
                            <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">LeetCode</span>
                          </div>
                          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">{leetcode.totalSolved} solved</span>
                        </div>
                      )}
                      {codeforces && (
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full" />
                            <span className="text-sm font-medium text-red-900 dark:text-red-100">Codeforces</span>
                          </div>
                          <span className="text-sm font-semibold text-red-800 dark:text-red-200">{codeforces.user.rating} rating</span>
                        </div>
                      )}
                      {github && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/40 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-600 dark:bg-gray-400 rounded-full" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">GitHub</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{github.totalStars} stars</span>
                        </div>
                      )}
                      {reddit && (
                        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/40 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full" />
                            <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Reddit</span>
                          </div>
                          <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">{reddit.totalKarma.toLocaleString()} karma</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Email</span>
                          </div>
                          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">{email.totalUnread} unread</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Highlights */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ZapIcon className="w-4 h-4 text-green-500" />
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      {dailyDigest?.highlights?.slice(0, 4).map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-lg transition-colors">
                          <span className="text-green-600 dark:text-green-400 mt-0.5 font-bold">•</span>
                          <span className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                      {(!dailyDigest?.highlights || dailyDigest.highlights.length === 0) && (
                        <div className="p-3 bg-muted/30 border border-muted-foreground/20 rounded-lg">
                          <p className="text-sm text-muted-foreground text-center">No recent activity detected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LeetCode Tab */}
        <TabsContent value="leetcode" className="mt-6">
          {leetcode ? (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <TargetIcon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{leetcode.totalSolved}</p>
                        <p className="text-sm text-muted-foreground">Problems Solved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{leetcode.easySolved}</p>
                        <p className="text-sm text-muted-foreground">Easy Problems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <ZapIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{leetcode.mediumSolved}</p>
                        <p className="text-sm text-muted-foreground">Medium Problems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <AwardIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{leetcode.hardSolved}</p>
                        <p className="text-sm text-muted-foreground">Hard Problems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Difficulty Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Problem Difficulty Distribution</CardTitle>
                  <CardDescription>Breakdown of solved problems by difficulty level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Easy</span>
                      <span className="text-sm text-muted-foreground">{leetcode.easySolved} problems</span>
                    </div>
                    <Progress value={leetcode.totalSolved > 0 ? (leetcode.easySolved / leetcode.totalSolved) * 100 : 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Medium</span>
                      <span className="text-sm text-muted-foreground">{leetcode.mediumSolved} problems</span>
                    </div>
                    <Progress value={leetcode.totalSolved > 0 ? (leetcode.mediumSolved / leetcode.totalSolved) * 100 : 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hard</span>
                      <span className="text-sm text-muted-foreground">{leetcode.hardSolved} problems</span>
                    </div>
                    <Progress value={leetcode.totalSolved > 0 ? (leetcode.hardSolved / leetcode.totalSolved) * 100 : 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Progress Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {leetcode.totalSolved >= 100 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            100+ Problems
                          </Badge>
                        )}
                        {leetcode.hardSolved >= 10 && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Hard Problem Solver
                          </Badge>
                        )}
                        {leetcode.totalSolved >= 500 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            500+ Problems
                          </Badge>
                        )}
                        {leetcode.totalSolved >= 50 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            50+ Problems
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Next Milestones</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Next 100: {Math.ceil(leetcode.totalSolved / 100) * 100 - leetcode.totalSolved} problems left</div>
                        <div>Hard Problems: {leetcode.hardSolved} solved so far</div>
                        <div>Success Rate: {((leetcode.totalSolved / Math.max(leetcode.totalSolved + 50, 100)) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon className="w-5 h-5 text-yellow-500" />
                  LeetCode Integration
                </CardTitle>
                <CardDescription>
                  Connect your LeetCode account to track your programming progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CodeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Coding Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor your problem-solving progress, contest ratings, and coding achievements
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect LeetCode
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Codeforces Tab */}
        <TabsContent value="codeforces" className="mt-6">
          {codeforces ? (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <TrophyIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{codeforces.user.rating}</p>
                        <p className="text-sm text-muted-foreground">Current Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <AwardIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">{codeforces.user.rank}</p>
                        <p className="text-sm text-muted-foreground">Rank</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <TargetIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{codeforces.solvedProblems}</p>
                        <p className="text-sm text-muted-foreground">Problems Solved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{codeforces.contestsParticipated}</p>
                        <p className="text-sm text-muted-foreground">Contests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating & Performance</CardTitle>
                  <CardDescription>Your competitive programming journey on Codeforces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Rating</span>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {codeforces.user.rating} ({codeforces.user.rank})
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Max Rating</span>
                      <span className="text-sm text-muted-foreground">{codeforces.user.maxRating || codeforces.user.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Account Age</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor((Date.now() - new Date(codeforces.user.registrationTimeSeconds * 1000).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(codeforces.solvedProblems / Math.max(codeforces.contestsParticipated, 1))}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Problems/Contest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {codeforces.user.rating >= 1200 ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-muted-foreground">Specialist+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(0, (codeforces.user.maxRating || codeforces.user.rating) - codeforces.user.rating)}
                      </div>
                      <div className="text-sm text-muted-foreground">Rating from Peak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Badges Earned</h4>
                      <div className="flex flex-wrap gap-2">
                        {codeforces.user.rating >= 1200 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Pupil+
                          </Badge>
                        )}
                        {codeforces.user.rating >= 1400 && (
                          <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                            Specialist+
                          </Badge>
                        )}
                        {codeforces.contestsParticipated >= 10 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Contest Regular
                          </Badge>
                        )}
                        {codeforces.solvedProblems >= 100 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            100+ Problems
                          </Badge>
                        )}
                        {codeforces.solvedProblems >= 500 && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            500+ Problems
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Goal Tracking</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Next Rating Milestone: {Math.ceil(codeforces.user.rating / 100) * 100}</div>
                        <div>Problems to 500: {Math.max(0, 500 - codeforces.solvedProblems)}</div>
                        <div>Contest Participation: {codeforces.contestsParticipated} total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-red-500" />
                  Codeforces Integration
                </CardTitle>
                <CardDescription>
                  Connect your Codeforces account to track competitive programming progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Competitive Programming Excellence</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track your rating, contest performance, and problem-solving achievements
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Codeforces
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* GitHub Tab */}
        <TabsContent value="github" className="mt-6">
          {github ? (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{github.totalStars}</p>
                        <p className="text-sm text-muted-foreground">Total Stars</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <GitBranchIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{github.user.public_repos}</p>
                        <p className="text-sm text-muted-foreground">Public Repos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{github.currentStreak}</p>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <ActivityIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{github.user.followers}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Repository Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Repository Statistics</CardTitle>
                  <CardDescription>Overview of your GitHub repositories and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Public Repositories</span>
                        <span className="text-sm text-muted-foreground">{github.user.public_repos}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Following</span>
                        <span className="text-sm text-muted-foreground">{github.user.following}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Account Created</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(github.user.created_at).getFullYear()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Views</span>
                        <span className="text-sm text-muted-foreground">Public</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Stars Earned</span>
                        <span className="text-sm text-muted-foreground">{github.totalStars}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Score</span>
                        <Badge variant="outline">
                          {github.totalStars > 100 ? 'Expert' : github.totalStars > 50 ? 'Advanced' : github.totalStars > 10 ? 'Intermediate' : 'Beginner'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Activity</CardTitle>
                  <CardDescription>Your coding activity and contribution patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Streak Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Current Streak</span>
                            <span className="font-medium">{github.currentStreak} days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Longest Streak</span>
                            <span className="font-medium">{github.longestStreak} days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>This Week</span>
                            <span className="font-medium">{github.recentCommits?.length || 0} recent commits</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Activity Level</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              github.currentStreak > 7 ? "bg-green-500" :
                              github.currentStreak > 3 ? "bg-yellow-500" :
                              github.currentStreak > 0 ? "bg-orange-500" : "bg-red-500"
                            )} />
                            <span className="text-sm">
                              {github.currentStreak > 7 ? 'Very Active' :
                               github.currentStreak > 3 ? 'Active' :
                               github.currentStreak > 0 ? 'Moderate' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {github.currentStreak > 0 ? 
                              `Keep up the great work! ${github.currentStreak} days strong.` :
                              'Time to start a new contribution streak!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Developer Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {github.totalStars >= 100 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Star Collector
                          </Badge>
                        )}
                        {github.user.public_repos >= 10 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Repository Creator
                          </Badge>
                        )}
                        {github.currentStreak >= 30 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Consistent Contributor
                          </Badge>
                        )}
                        {github.user.followers >= 10 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            Community Builder
                          </Badge>
                        )}
                        {new Date().getFullYear() - new Date(github.user.created_at).getFullYear() >= 2 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Veteran Developer
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Goals & Milestones</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Next star milestone: {Math.ceil(github.totalStars / 10) * 10} stars</div>
                        <div>Repository goal: {Math.max(0, 20 - github.user.public_repos)} more repos to 20</div>
                        <div>Streak goal: {Math.max(0, 30 - github.currentStreak)} days to 30-day streak</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-gray-600" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Connect your GitHub account to track development activity and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <GithubIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Showcase Your Development Journey</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor your repositories, contributions, coding streaks, and collaboration metrics
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Reddit Tab */}
        <TabsContent value="reddit" className="mt-6">
          {reddit ? (
            <div className="space-y-6">
              {/* Network Notice */}
              {reddit.user.id.startsWith('fallback_') && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                        <ActivityIcon className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          Sample Data Displayed
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-300">
                          Reddit is not accessible from your network. Showing sample data to demonstrate the interface.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <TrophyIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{reddit.totalKarma.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Karma</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <MessageCircleIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{reddit.recentPosts.length}</p>
                        <p className="text-sm text-muted-foreground">Recent Posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{Math.floor(reddit.accountAge / 365)}</p>
                        <p className="text-sm text-muted-foreground">Years Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{Math.round(reddit.totalKarma / Math.max(reddit.accountAge / 365, 1))}</p>
                        <p className="text-sm text-muted-foreground">Karma/Year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Engagement</CardTitle>
                  <CardDescription>Your activity and participation across Reddit communities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{reddit.totalKarma.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Karma Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{reddit.recentPosts.length}</div>
                        <div className="text-sm text-muted-foreground">Recent Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {reddit.totalKarma > 10000 ? 'High' : reddit.totalKarma > 1000 ? 'Medium' : 'Low'}
                        </div>
                        <div className="text-sm text-muted-foreground">Engagement Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {reddit.recentPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>Your latest contributions to Reddit communities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reddit.recentPosts.slice(0, 5).map((post, index) => (
                        <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                          <h4 className="font-medium text-sm">{post.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>r/{post.subreddit}</span>
                            <span>•</span>
                            <span>{post.score} points</span>
                            <span>•</span>
                            <span>{new Date(post.created_utc * 1000).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Reddit Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Community Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {reddit.totalKarma >= 1000 && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            1K+ Karma
                          </Badge>
                        )}
                        {reddit.totalKarma >= 10000 && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            10K+ Karma
                          </Badge>
                        )}
                        {reddit.accountAge >= 365 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Veteran Redditor
                          </Badge>
                        )}
                        {reddit.recentPosts.length >= 5 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active Contributor
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Statistics</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Account age: {Math.floor(reddit.accountAge / 365)} years, {Math.floor((reddit.accountAge % 365) / 30)} months</div>
                        <div>Karma per year: ~{Math.round(reddit.totalKarma / Math.max(reddit.accountAge / 365, 1))}</div>
                        <div>Engagement level: {reddit.totalKarma > 10000 ? 'Very High' : reddit.totalKarma > 1000 ? 'High' : 'Moderate'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleIcon className="w-5 h-5 text-orange-500" />
                  Reddit Integration
                </CardTitle>
                <CardDescription>
                  Connect your Reddit account to track community engagement and karma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Community Impact</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Monitor your karma, post engagement, and community contributions across Reddit
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Reddit
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="mt-6">
          {email ? (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <MailIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{email.totalUnread}</p>
                        <p className="text-sm text-muted-foreground">Unread Emails</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{email.totalToday || 0}</p>
                        <p className="text-sm text-muted-foreground">Today's Emails</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{Math.max(0, 100 - email.totalUnread)}%</p>
                        <p className="text-sm text-muted-foreground">Inbox Health</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {email.totalUnread <= 5 ? 'Good' : email.totalUnread <= 20 ? 'Fair' : 'Poor'}
                        </p>
                        <p className="text-sm text-muted-foreground">Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Management</CardTitle>
                  <CardDescription>Your email productivity and inbox organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{email.totalUnread}</div>
                        <div className="text-sm text-muted-foreground">Unread Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{email.totalToday || 0}</div>
                        <div className="text-sm text-muted-foreground">Received Today</div>
                      </div>
                      <div className="text-center">
                        <div className={cn(
                          "text-2xl font-bold",
                          email.totalUnread <= 5 ? "text-green-600" :
                          email.totalUnread <= 20 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {email.totalUnread <= 5 ? 'Excellent' :
                           email.totalUnread <= 20 ? 'Good' : 'Needs Attention'}
                        </div>
                        <div className="text-sm text-muted-foreground">Productivity Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inbox Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Inbox Health Analysis</CardTitle>
                  <CardDescription>Recommendations for better email management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        email.totalUnread <= 5 ? "bg-green-500" :
                        email.totalUnread <= 20 ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span className="text-sm font-medium">
                        {email.totalUnread <= 5 ? 'Your inbox is well-managed!' :
                         email.totalUnread <= 20 ? 'Good inbox management, could be improved' :
                         'Your inbox needs attention'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Recommendations:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {email.totalUnread > 20 && <li>• Consider batch processing emails</li>}
                          {email.totalUnread > 50 && <li>• Set up email filters and labels</li>}
                          {email.totalUnread > 10 && <li>• Schedule specific times for email</li>}
                          <li>• Use the 2-minute rule for quick responses</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Productivity Tips:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Unsubscribe from unnecessary emails</li>
                          <li>• Use templates for common responses</li>
                          <li>• Enable priority inbox features</li>
                          <li>• Archive processed emails</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Productivity Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Productivity Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {email.totalUnread <= 5 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Inbox Zero Hero
                          </Badge>
                        )}
                        {email.totalUnread <= 10 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Well Organized
                          </Badge>
                        )}
                        {(email.totalToday || 0) < 10 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            Light Email Day
                          </Badge>
                        )}
                        {email.totalUnread < 50 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Under Control
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Goals</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Goal: Keep unread emails under 10</div>
                        <div>Current: {email.totalUnread} unread emails</div>
                        <div>Action needed: {Math.max(0, email.totalUnread - 10)} emails to process</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-blue-500" />
                  Email Integration
                </CardTitle>
                <CardDescription>
                  Connect your email account to track productivity and inbox management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Optimize Your Email Productivity</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track unread emails, response times, and maintain inbox zero for better productivity
                  </p>
                  <Button asChild>
                    <a href="/dashboard/settings/external-services">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Connect Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};