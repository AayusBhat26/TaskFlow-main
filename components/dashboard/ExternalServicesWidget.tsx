"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CodeIcon, 
  TrophyIcon, 
  GithubIcon,
  MessageCircleIcon,
  MailIcon,
  ExternalLinkIcon,
  SettingsIcon,
  BrainIcon,
  StarIcon,
  FlameIcon,
  UsersIcon,
  HeartIcon,
  InboxIcon
} from "lucide-react";
import { useExternalServices } from "@/context/ExternalServicesProvider";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: 'mini' | 'compact' | 'card';
  service?: 'leetcode' | 'codeforces' | 'github' | 'reddit' | 'email' | 'all';
}

export const ExternalServicesWidget = ({ className, variant = 'compact', service = 'all' }: Props) => {
  const {
    leetcode,
    codeforces,
    github,
    reddit,
    email,
    isLoading,
    hasAnyService,
    leetcodeMetrics,
    codeforcesMetrics,
    githubMetrics,
    redditMetrics,
    emailMetrics
  } = useExternalServices();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-16 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!hasAnyService) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No external services connected</span>
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

  // Individual service widgets
  if (service === 'leetcode' && leetcode) {
    return <LeetCodeWidget className={className} variant={variant} />;
  }
  
  if (service === 'codeforces' && codeforces) {
    return <CodeforcesWidget className={className} variant={variant} />;
  }
  
  if (service === 'github' && github) {
    return <GitHubWidget className={className} variant={variant} />;
  }
  
  if (service === 'reddit' && reddit) {
    return <RedditWidget className={className} variant={variant} />;
  }
  
  if (service === 'email' && email) {
    return <EmailWidget className={className} variant={variant} />;
  }

  // All services overview
  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {leetcode && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <CodeIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium">{leetcode.totalSolved}</span>
          </div>
        )}
        {codeforces && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium">{codeforces.user.rating}</span>
          </div>
        )}
        {github && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
              <GithubIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium">{github.totalStars}</span>
          </div>
        )}
        {reddit && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <MessageCircleIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium">{Math.floor(reddit.totalKarma / 1000)}k</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
              <MailIcon className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium">{email.totalUnread}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    const services = [
      { key: 'leetcode', data: leetcode, icon: CodeIcon, color: 'from-yellow-400 to-orange-500' },
      { key: 'codeforces', data: codeforces, icon: TrophyIcon, color: 'from-red-400 to-orange-500' },
      { key: 'github', data: github, icon: GithubIcon, color: 'from-gray-700 to-black' },
      { key: 'reddit', data: reddit, icon: MessageCircleIcon, color: 'from-orange-400 to-red-500' },
      { key: 'email', data: email, icon: MailIcon, color: 'from-blue-400 to-cyan-500' },
    ].filter(s => s.data);

    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", className)}>
        {services.map(({ key, data, icon: Icon, color }) => (
          <Card key={key} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 bg-gradient-to-r rounded-full flex items-center justify-center", color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">{key}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Card variant - detailed overview
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">External Services</h3>
            <Badge variant="secondary">{[leetcode, codeforces, github, reddit, email].filter(Boolean).length} connected</Badge>
          </div>

          <div className="space-y-4">
            {leetcode && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <CodeIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">LeetCode</p>
                    <p className="text-sm text-muted-foreground">{leetcode.totalSolved} problems</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">{leetcodeMetrics.progressPercentage.toFixed(1)}%</Badge>
              </div>
            )}

            {codeforces && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                    <TrophyIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Codeforces</p>
                    <p className="text-sm text-muted-foreground">{codeforces.user.rating} rating</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">{codeforces.user.rank}</Badge>
              </div>
            )}

            {github && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
                    <GithubIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">{github.user.public_repos} repos</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{github.totalStars} ⭐</Badge>
              </div>
            )}

            {reddit && (
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <MessageCircleIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Reddit</p>
                    <p className="text-sm text-muted-foreground">{reddit.totalKarma.toLocaleString()} karma</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">{Math.floor(reddit.accountAge / 365)}y</Badge>
              </div>
            )}

            {email && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <MailIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{email.totalUnread} unread</p>
                  </div>
                </div>
                <Badge className={cn(
                  email.totalUnread > 20 ? "bg-red-100 text-red-800" :
                  email.totalUnread > 5 ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                )}>
                  {emailMetrics.productivityScore.toFixed(0)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Individual service widgets
const LeetCodeWidget = ({ className, variant }: { className?: string; variant?: string }) => {
  const { leetcode, leetcodeMetrics } = useExternalServices();
  
  if (!leetcode) return null;

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <CodeIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{leetcode.totalSolved}</span>
        <span className="text-xs text-muted-foreground">solved</span>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{leetcode.totalSolved}</p>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-green-600">{leetcodeMetrics.progressPercentage.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CodeforcesWidget = ({ className, variant }: { className?: string; variant?: string }) => {
  const { codeforces } = useExternalServices();
  
  if (!codeforces) return null;

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
          <TrophyIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{codeforces.user.rating}</span>
        <span className="text-xs text-muted-foreground">{codeforces.user.rank}</span>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{codeforces.user.rating}</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-red-600">{codeforces.user.rank}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GitHubWidget = ({ className, variant }: { className?: string; variant?: string }) => {
  const { github } = useExternalServices();
  
  if (!github) return null;

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-black rounded-full flex items-center justify-center">
          <GithubIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{github.totalStars}</span>
        <span className="text-xs text-muted-foreground">stars</span>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
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
};

const RedditWidget = ({ className, variant }: { className?: string; variant?: string }) => {
  const { reddit } = useExternalServices();
  
  if (!reddit) return null;

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
          <MessageCircleIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{Math.floor(reddit.totalKarma / 1000)}k</span>
        <span className="text-xs text-muted-foreground">karma</span>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <MessageCircleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{reddit.totalKarma.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Karma</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-orange-600">{Math.floor(reddit.accountAge / 365)}</p>
            <p className="text-xs text-muted-foreground">Years</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmailWidget = ({ className, variant }: { className?: string; variant?: string }) => {
  const { email, emailMetrics } = useExternalServices();
  
  if (!email) return null;

  if (variant === 'mini') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
          <MailIcon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{email.totalUnread}</span>
        <span className="text-xs text-muted-foreground">unread</span>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              email.totalUnread > 20 ? "bg-gradient-to-r from-red-400 to-red-600" :
              email.totalUnread > 5 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
              "bg-gradient-to-r from-green-400 to-blue-500"
            )}>
              <MailIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{email.totalUnread}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn(
              "font-semibold",
              emailMetrics.productivityScore > 80 ? "text-green-600" :
              emailMetrics.productivityScore > 60 ? "text-yellow-600" :
              "text-red-600"
            )}>
              {emailMetrics.productivityScore.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Productivity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};