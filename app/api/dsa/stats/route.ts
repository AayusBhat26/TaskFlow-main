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

    // Get overall progress statistics - ONLY for curated questions (isImported: false)
    const [
      totalQuestions,
      userProgress,
      topicProgress,
      difficultyProgress,
      recentActivity
    ] = await Promise.all([
      // Total curated questions available (excluding imported ones)
      db.dSAQuestion.count({
        where: {
          isImported: false
        }
      }),
      
      // User's progress on curated questions only
      db.dSAProgress.groupBy({
        by: ['status'],
        where: {
          userId: userId,
          question: {
            isImported: false
          }
        },
        _count: {
          status: true
        }
      }),
      
      // Progress by topic - curated questions only
      db.dSAProgress.findMany({
        where: {
          userId: userId,
          question: {
            isImported: false
          }
        },
        include: {
          question: {
            select: {
              topic: true,
              difficulty: true
            }
          }
        }
      }),
      
      // Progress by difficulty - curated questions only
      db.dSAProgress.groupBy({
        by: ['status'],
        where: {
          userId: userId,
          question: {
            isImported: false
          }
        },
        _count: {
          status: true
        }
      }),
      
      // Recent activity (last 7 days) - curated questions only
      db.dSAProgress.findMany({
        where: {
          userId: userId,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          },
          question: {
            isImported: false
          }
        },
        include: {
          question: {
            select: {
              title: true,
              topic: true,
              difficulty: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 5 // Limit to 5 recent activities for performance
      })
    ]);

    // Process the data
    const total = totalQuestions;
    const solved = userProgress.find(p => p.status === 'COMPLETED')?._count.status || 0;
    const inProgress = userProgress.find(p => p.status === 'IN_PROGRESS')?._count.status || 0;
    const todo = userProgress.find(p => p.status === 'TODO')?._count.status || 0;
    const completionPercentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Group by topic
    const topics: Record<string, { solved: number; total: number; inProgress: number }> = {};
    topicProgress.forEach(progress => {
      const topic = progress.question.topic;
      if (!topics[topic]) {
        topics[topic] = { solved: 0, total: 0, inProgress: 0 };
      }
      if (progress.status === 'COMPLETED') {
        topics[topic].solved++;
      } else if (progress.status === 'IN_PROGRESS') {
        topics[topic].inProgress++;
      }
      topics[topic].total++;
    });

    // Group by difficulty
    const difficulty: Record<string, { solved: number; total: number; inProgress: number }> = {};
    difficultyProgress.forEach(progress => {
      const diff = progress.status;
      if (!difficulty[diff]) {
        difficulty[diff] = { solved: 0, total: 0, inProgress: 0 };
      }
      difficulty[diff].total++;
    });

    // Process recent activity
    const recentActivityData = recentActivity.map(activity => ({
      id: activity.id,
      questionTitle: activity.question.title,
      topic: activity.question.topic,
      difficulty: activity.question.difficulty,
      status: activity.status,
      updatedAt: activity.updatedAt.toISOString()
    }));

    const stats = {
      overall: {
        total,
        solved,
        inProgress,
        todo,
        completionPercentage
      },
      topics,
      difficulty,
      recentActivity: recentActivityData,
      streak: 0 // Placeholder for streak calculation
    };

    // Add caching headers for better performance
    const response = NextResponse.json(stats, { status: 200 });
    response.headers.set('Cache-Control', 'private, max-age=300'); // Cache for 5 minutes
    response.headers.set('Vary', 'Authorization'); // Vary by user
    
    return response;
  } catch (error) {
    console.error('Error fetching DSA stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function calculateStreak(userId: string): Promise<number> {
  try {
    // Get all solved curated questions ordered by completion date
    const solvedQuestions = await db.dSAProgress.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
        completedAt: {
          not: null
        },
        question: {
          isImported: false
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

    if (!solvedToday) {
      // Check if solved yesterday to continue streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const solvedYesterday = solvedQuestions.some(q => {
        if (!q.completedAt) return false;
        const completedDate = new Date(q.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === yesterday.getTime();
      });

      if (!solvedYesterday) {
        return 0;
      }
      
      currentDate = yesterday;
    }

    // Count consecutive days
    for (let i = 0; i < solvedQuestions.length; i++) {
      const completedDate = new Date(solvedQuestions[i].completedAt!);
      completedDate.setHours(0, 0, 0, 0);

      if (completedDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (completedDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}
