import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { GitHubService } from "@/services/external/github";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log(`Debug: Attempting to fetch GitHub data for username: ${username}`);

    // Initialize the GitHub service
    const githubService = new GitHubService(process.env.GITHUB_TOKEN);

    // Fetch user statistics
    const githubData = await githubService.getUserStats(username);

    console.log('Debug: GitHub data result:', {
      username,
      dataFound: !!githubData,
      data: githubData
    });

    if (!githubData) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub data for this username" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: githubData,
      debug: {
        username,
        timestamp: new Date().toISOString(),
        tokenProvided: !!process.env.GITHUB_TOKEN
      }
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch GitHub data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}