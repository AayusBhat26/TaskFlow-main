
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleUser() {
  try {
    console.log('👤 Creating sample user for testing...');

    // Check if sample user already exists
    const existingUser = await prisma.user.findFirst({
      where: { username: 'testuser' }
    });

    if (existingUser) {
      console.log('✅ Sample user already exists:', existingUser.username);
      return existingUser;
    }

    // Create sample user
    const sampleUser = await prisma.user.create({
      data: {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        hashedPassword: 'hashed_password_here',
        completedOnboarding: true,
        useCase: 'STUDY',
        level: 1,
        experience: 0,
        points: 0,
        totalTasksCompleted: 0,
        totalPomodoroCompleted: 0,
        totalNotesCreated: 0,
        currentStreak: 0,
        longestStreak: 0,
        profileBadges: []
      }
    });

    console.log('✅ Sample user created successfully:', sampleUser.username);
    console.log('📊 User stats:');
    console.log(`  - Level: ${sampleUser.level}`);
    console.log(`  - Experience: ${sampleUser.experience}`);
    console.log(`  - Points: ${sampleUser.points}`);
    console.log(`  - Notes created: ${sampleUser.totalNotesCreated}`);
    console.log(`  - Tasks completed: ${sampleUser.totalTasksCompleted}`);
    console.log(`  - Pomodoro sessions: ${sampleUser.totalPomodoroCompleted}`);

    return sampleUser;
  } catch (error) {
    console.error('❌ Error creating sample user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  createSampleUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default createSampleUser;
