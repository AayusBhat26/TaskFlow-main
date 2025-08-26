import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/services/external/github";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat'; // Default test user

    console.log(`🧪 Test GitHub API for username: ${username}`);
    console.log(`🔑 GitHub token available: ${!!process.env.GITHUB_TOKEN}`);

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({
        error: "GITHUB_TOKEN not configured",
        message: "Please add GITHUB_TOKEN to your .env file",
        instructions: [
          "1. Go to https://github.com/settings/tokens",
          "2. Generate new token (classic)",
          "3. Select scopes: public_repo, read:user, user:email", 
          "4. Add GITHUB_TOKEN=your_token to .env file",
          "5. Restart your development server"
        ]
      }, { status: 500 });
    }

    // Initialize the GitHub service
    const githubService = new GitHubService(process.env.GITHUB_TOKEN);

    // Fetch user statistics
    const githubData = await githubService.getUserStats(username);

    if (!githubData) {
      return NextResponse.json({
        error: "Failed to fetch GitHub data",
        username,
        message: "Check console logs for detailed error information"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      username,
      data: {
        user: {
          login: githubData.user.login,
          name: githubData.user.name,
          public_repos: githubData.user.public_repos,
          followers: githubData.user.followers,
          following: githubData.user.following
        },
        stats: {
          totalRepositories: githubData.repositories.length,
          totalStars: githubData.totalStars,
          totalForks: githubData.totalForks,
          totalCommits: githubData.totalCommits,
          currentStreak: githubData.currentStreak,
          longestStreak: githubData.longestStreak
        },
        debug: {
          timestamp: new Date().toISOString(),
          tokenProvided: !!process.env.GITHUB_TOKEN,
          repositoriesCount: githubData.repositories.length,
          contributionsCount: githubData.contributions.length,
          recentCommitsCount: githubData.recentCommits.length
        }
      }
    });
  } catch (error) {
    console.error("❌ Test GitHub API error:", error);
    return NextResponse.json({
      error: "Failed to test GitHub API",
      details: error instanceof Error ? error.message : 'Unknown error',
      message: "Check server console for detailed error logs"
    }, { status: 500 });
  }
}