import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getLeetcodeIdByTitle, getTitleByLeetcodeId } from "@/data/leetcodeToInternalMapping";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🔄 HandPickedProgress API: Fetching progress for user:', session.user.id);

    // Get all completed questions for the user
    const userProgress = await db.dSAProgress.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      select: {
        questionId: true,
        status: true,
        completedAt: true,
        question: {
          select: {
            title: true,
          },
        },
      },
    });

    console.log('📊 HandPickedProgress API: Found', userProgress.length, 'completed questions');

    // Map completed questions to LeetCode IDs using the mapping
    const completedLeetcodeIds: number[] = [];
    
    userProgress.forEach((progress) => {
      const leetcodeId = getLeetcodeIdByTitle(progress.question.title);
      if (leetcodeId !== null) {
        completedLeetcodeIds.push(leetcodeId);
        console.log('✅ HandPickedProgress API: Mapped', progress.question.title, 'to LeetCode ID', leetcodeId);
      } else {
        console.log('⚠️ HandPickedProgress API: Could not map', progress.question.title, 'to LeetCode ID');
      }
    });

    console.log('📊 HandPickedProgress API: Returning', completedLeetcodeIds.length, 'completed LeetCode IDs');

    return NextResponse.json({
      progress: userProgress,
      completedLeetcodeIds,
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Error fetching handpicked progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { leetcodeId, completed } = body;

    console.log('🔄 HandPickedProgress API: Updating progress for LeetCode ID:', leetcodeId, 'completed:', completed);

    if (typeof leetcodeId !== 'number' || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: "LeetCode ID and completed status are required" },
        { status: 400 }
      );
    }

    // Get the question title from the LeetCode ID
    const questionTitle = getTitleByLeetcodeId(leetcodeId);
    if (!questionTitle) {
      console.log('❌ HandPickedProgress API: Invalid LeetCode ID:', leetcodeId);
      return NextResponse.json(
        { error: "Invalid LeetCode ID" },
        { status: 400 }
      );
    }

    console.log('✅ HandPickedProgress API: Found question title:', questionTitle);

    // Find the question in the database
    const question = await db.dSAQuestion.findFirst({
      where: {
        title: questionTitle,
        isImported: false // Only for curated questions
      }
    });

    if (!question) {
      console.log('❌ HandPickedProgress API: Question not found in database:', questionTitle);
      return NextResponse.json(
        { error: "Question not found in database" },
        { status: 404 }
      );
    }

    console.log('✅ HandPickedProgress API: Found question in database:', question.id);

    // Update or create progress
    const progress = await db.dSAProgress.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: question.id
        }
      },
      update: {
        status: completed ? 'COMPLETED' : 'TODO',
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        questionId: question.id,
        status: completed ? 'COMPLETED' : 'TODO',
        completedAt: completed ? new Date() : null
      }
    });

    console.log('✅ HandPickedProgress API: Successfully updated progress:', progress.id);

    return NextResponse.json({
      success: true,
      progress,
      message: completed ? 'Problem marked as completed!' : 'Problem marked as todo!'
    });

  } catch (error) {
    console.error("Error updating handpicked progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
