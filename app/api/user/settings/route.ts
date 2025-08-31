import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings from database
    const userSettings = await db.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!userSettings) {
      // Return default settings if user settings don't exist
      return NextResponse.json({
        soundsEnabled: true,
        soundVolume: 0.5,
        taskCompletionSound: 'TASK_COMPLETE',
        questionCompletionSound: 'QUESTION_COMPLETE',
      });
    }

    return NextResponse.json({
      soundsEnabled: userSettings.soundsEnabled,
      soundVolume: userSettings.soundVolume,
      taskCompletionSound: userSettings.taskCompletionSound,
      questionCompletionSound: userSettings.questionCompletionSound,
    });

  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}
