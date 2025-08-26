import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { LeetCodeService } from "@/services/external/leetcode";

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

    // Initialize the LeetCode service
    const leetcodeService = new LeetCodeService();

    // Fetch user statistics
    const leetcodeData = await leetcodeService.getUserStats(username);

    if (!leetcodeData) {
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data for this username" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leetcodeData,
    });
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}

// Optional: Support POST method for validation during onboarding
export async function POST(
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

    // Initialize the LeetCode service
    const leetcodeService = new LeetCodeService();

    // Validate username by fetching basic data
    const leetcodeData = await leetcodeService.getUserStats(username);

    if (!leetcodeData) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid LeetCode username or user not found" 
        },
        { status: 404 }
      );
    }

    // Return minimal validation data
    return NextResponse.json({
      success: true,
      valid: true,
      username: leetcodeData.username,
      totalSolved: leetcodeData.totalSolved,
      ranking: leetcodeData.ranking,
    });
  } catch (error) {
    console.error("Error validating LeetCode username:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to validate LeetCode username" 
      },
      { status: 500 }
    );
  }
}