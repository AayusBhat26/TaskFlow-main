import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeetCodeService } from "@/services/external/leetcode";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's LeetCode username from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        leetcodeUsername: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.leetcodeUsername) {
      return NextResponse.json({
        message: "No LeetCode username configured",
        data: null,
      });
    }

    // Initialize the LeetCode service
    const leetcodeService = new LeetCodeService();

    // Fetch user statistics
    const leetcodeData = await leetcodeService.getUserStats(user.leetcodeUsername);

    if (!leetcodeData) {
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leetcodeData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching user's LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}