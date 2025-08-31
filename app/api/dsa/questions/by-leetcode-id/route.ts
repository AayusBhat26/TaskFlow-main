import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getTitleByLeetcodeId } from "@/data/leetcodeToInternalMapping";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leetcodeId } = await request.json();
    
    if (!leetcodeId) {
      return NextResponse.json({ error: "LeetCode ID is required" }, { status: 400 });
    }

    // Get the title for this LeetCode ID
    const title = getTitleByLeetcodeId(leetcodeId);
    
    if (!title) {
      return NextResponse.json({ error: "Question not found in handpicked problems" }, { status: 404 });
    }

    // Find the question by title
    const question = await db.dSAQuestion.findFirst({
      where: {
        title: title,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found in database" }, { status: 404 });
    }

    return NextResponse.json({
      questionId: question.id,
      leetcodeId: leetcodeId,
      title: question.title,
    });
  } catch (error) {
    console.error("Error finding question by LeetCode ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
