import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get comprehensive statistics - ALL questions (imported + curated)
    const [
      totalQuestions,
      totalCurated,
      totalImported,
      userProgress,
      topicProgress,
      recentActivity,
      lastSolvedQuestion
    ] = await Promise.all([
      // Total ALL questions
      db.dSAQuestion.count(),
      
      // Total curated questions
      db.dSAQuestion.count({
        where: { isImported: false }
      }),
      
      // Total imported questions  
      db.dSAQuestion.count({
        where: { isImported: true }
      }),
      
      // User's progress on ALL questions
      db.dSAProgress.groupBy({
        by: ['status'],
        where: {
          userId: userId
        },
        _count: {
          status: true
        }
      }),
      
      // Progress by topic - ALL questions
      db.dSAProgress.findMany({
        where: {
          userId: userId
        },
        include: {
          question: {
            select: {
              topic: true,
              difficulty: true,
              isImported: true
            }
          }
        }
      }),
      
      // Recent activity (last 30 days) - ALL questions
      db.dSAProgress.findMany({
        where: {
          userId: userId,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        include: {
          question: {
            select: {
              title: true,
              topic: true,
              difficulty: true,
              isImported: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 20
      }),

      // Last solved question
      db.dSAProgress.findFirst({
        where: {
          userId: userId,
          status: 'COMPLETED',
          completedAt: {
            not: null
          }
        },
        include: {
          question: {
            select: {
              title: true,
              topic: true,
              difficulty: true,
              isImported: true
            }
          }
        },
        orderBy: {
          completedAt: 'desc'
        }
      })
    ]);

    // Process topic progress for ALL questions
    const topicStats: Record<string, { solved: number; total: number; inProgress: number; curated: number; imported: number }> = {};
    
    // Get all topics with their question counts
    const allTopics = await db.dSAQuestion.groupBy({
      by: ['topic'],
      _count: {
        topic: true
      }
    });

    const curatedTopics = await db.dSAQuestion.groupBy({
      by: ['topic'],
      where: { isImported: false },
      _count: {
        topic: true
      }
    });

    const importedTopics = await db.dSAQuestion.groupBy({
      by: ['topic'], 
      where: { isImported: true },
      _count: {
        topic: true
      }
    });

    // Initialize topic stats
    allTopics.forEach(topic => {
      const curatedCount = curatedTopics.find(c => c.topic === topic.topic)?._count.topic || 0;
      const importedCount = importedTopics.find(i => i.topic === topic.topic)?._count.topic || 0;
      
      topicStats[topic.topic] = {
        total: topic._count.topic,
        solved: 0,
        inProgress: 0,
        curated: curatedCount,
        imported: importedCount
      };
    });

    // Update with user progress
    topicProgress.forEach(progress => {
      const topic = progress.question.topic;
      if (topicStats[topic]) {
        if (progress.status === 'COMPLETED') {
          topicStats[topic].solved++;
        } else if (progress.status === 'IN_PROGRESS') {
          topicStats[topic].inProgress++;
        }
      }
    });

    // Process difficulty progress for ALL questions
    const difficultyStats: Record<string, { solved: number; total: number; inProgress: number; curated: number; imported: number }> = {
      EASY: { solved: 0, total: 0, inProgress: 0, curated: 0, imported: 0 },
      MEDIUM: { solved: 0, total: 0, inProgress: 0, curated: 0, imported: 0 },
      HARD: { solved: 0, total: 0, inProgress: 0, curated: 0, imported: 0 }
    };

    // Get total questions by difficulty
    const difficultyTotals = await db.dSAQuestion.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });

    const curatedDifficulty = await db.dSAQuestion.groupBy({
      by: ['difficulty'],
      where: { isImported: false },
      _count: {
        difficulty: true
      }
    });

    const importedDifficulty = await db.dSAQuestion.groupBy({
      by: ['difficulty'],
      where: { isImported: true },
      _count: {
        difficulty: true
      }
    });

    difficultyTotals.forEach(diff => {
      const curatedCount = curatedDifficulty.find(c => c.difficulty === diff.difficulty)?._count.difficulty || 0;
      const importedCount = importedDifficulty.find(i => i.difficulty === diff.difficulty)?._count.difficulty || 0;
      
      difficultyStats[diff.difficulty].total = diff._count.difficulty;
      difficultyStats[diff.difficulty].curated = curatedCount;
      difficultyStats[diff.difficulty].imported = importedCount;
    });

    // Update with user progress by difficulty
    const userDifficultyDetailed = await db.dSAProgress.findMany({
      where: {
        userId: userId
      },
      include: {
        question: {
          select: {
            difficulty: true
          }
        }
      }
    });

    userDifficultyDetailed.forEach(progress => {
      const difficulty = progress.question.difficulty;
      if (difficultyStats[difficulty]) {
        if (progress.status === 'COMPLETED') {
          difficultyStats[difficulty].solved++;
        } else if (progress.status === 'IN_PROGRESS') {
          difficultyStats[difficulty].inProgress++;
        }
      }
    });

    // Process overall stats
    const overallStats = {
      total: totalQuestions,
      curated: totalCurated,
      imported: totalImported,
      solved: 0,
      inProgress: 0,
      todo: 0
    };

    console.log('📊 Processing user progress:', userProgress);
    userProgress.forEach(progress => {
      console.log('🔍 Progress item:', progress);
      if (progress.status === 'COMPLETED') {
        overallStats.solved = progress._count.status;
      } else if (progress.status === 'IN_PROGRESS') {
        overallStats.inProgress = progress._count.status;
      } else if (progress.status === 'TODO') {
        overallStats.todo = progress._count.status;
      }
    });

    const completionPercentage = overallStats.total > 0 
      ? Math.round((overallStats.solved / overallStats.total) * 100) 
      : 0;

    console.log('📊 Final overall stats:', {
      ...overallStats,
      completionPercentage
    });

    // Calculate streak for ALL questions
    const streak = await calculateStreak(userId);

    return NextResponse.json({
      overall: {
        ...overallStats,
        completionPercentage
      },
      topics: topicStats,
      difficulty: difficultyStats,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        questionTitle: activity.question.title,
        topic: activity.question.topic,
        difficulty: activity.question.difficulty,
        status: activity.status,
        isImported: activity.question.isImported,
        updatedAt: activity.updatedAt
      })),
      lastSolved: lastSolvedQuestion ? {
        title: lastSolvedQuestion.question.title,
        topic: lastSolvedQuestion.question.topic,
        difficulty: lastSolvedQuestion.question.difficulty,
        completedAt: lastSolvedQuestion.completedAt
      } : null,
      streak
    });

  } catch (error) {
    console.error('Error fetching comprehensive DSA statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function calculateStreak(userId: string): Promise<number> {
  try {
    // Get all solved questions (both imported and curated) ordered by completion date
    const solvedQuestions = await db.dSAProgress.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
        completedAt: {
          not: null
        }
      },
      select: {
        completedAt: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    if (solvedQuestions.length === 0) {
      return 0;
    }

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if user solved anything today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const solvedToday = solvedQuestions.some(q => {
      if (!q.completedAt) return false;
      const completedDate = new Date(q.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    // If not solved today, check yesterday
    if (!solvedToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const solvedYesterday = solvedQuestions.some(q => {
        if (!q.completedAt) return false;
        const completedDate = new Date(q.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === yesterday.getTime();
      });
      
      if (!solvedYesterday) {
        return 0; // Streak broken
      }
      
      currentDate = yesterday;
    }

    // Count consecutive days
    const uniqueDates = [...new Set(
      solvedQuestions
        .filter(q => q.completedAt)
        .map(q => {
          const date = new Date(q.completedAt!);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
    )].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      if (uniqueDates[i] === checkDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;

  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}