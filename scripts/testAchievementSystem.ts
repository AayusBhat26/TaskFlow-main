import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAchievementSystem() {
  try {
    console.log('🧪 Testing achievement system...');

    // Get a test user (first user in the system)
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        totalNotesCreated: true,
        totalTasksCompleted: true,
        totalPomodoroCompleted: true,
        level: true,
        experience: true,
        points: true
      }
    });

    if (!testUser) {
      console.log('❌ No users found in the system');
      return;
    }

    console.log(`👤 Testing with user: ${testUser.username}`);
    console.log(`📊 Current stats:`);
    console.log(`  - Notes created: ${testUser.totalNotesCreated}`);
    console.log(`  - Tasks completed: ${testUser.totalTasksCompleted}`);
    console.log(`  - Pomodoro sessions: ${testUser.totalPomodoroCompleted}`);
    console.log(`  - Level: ${testUser.level}`);
    console.log(`  - Experience: ${testUser.experience}`);
    console.log(`  - Points: ${testUser.points}`);

    // Check current achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: testUser.id },
      include: { achievement: true }
    });

    console.log(`\n🏆 Current achievements (${userAchievements.length}):`);
    for (const ua of userAchievements) {
      const status = ua.isCompleted ? '✅ COMPLETED' : `🔄 ${ua.progress}/${ua.achievement.requirement}`;
      console.log(`  - ${ua.achievement.name}: ${status}`);
    }

    // Test achievement checking by manually checking a few achievements
    console.log('\n🔍 Testing achievement checking manually...');
    
    // Check for "First Note" achievement
    const firstNoteAchievement = await prisma.achievement.findFirst({
      where: { name: 'First Note' }
    });
    
    if (firstNoteAchievement) {
      console.log(`📝 Found "First Note" achievement:`);
      console.log(`  - Requirement: ${firstNoteAchievement.requirement} notes`);
      console.log(`  - User has: ${testUser.totalNotesCreated} notes`);
      console.log(`  - Status: ${testUser.totalNotesCreated >= firstNoteAchievement.requirement ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
    }

    // Check for "First Task" achievement
    const firstTaskAchievement = await prisma.achievement.findFirst({
      where: { name: 'First Task' }
    });
    
    if (firstTaskAchievement) {
      console.log(`✅ Found "First Task" achievement:`);
      console.log(`  - Requirement: ${firstTaskAchievement.requirement} tasks`);
      console.log(`  - User has: ${testUser.totalTasksCompleted} tasks`);
      console.log(`  - Status: ${testUser.totalTasksCompleted >= firstTaskAchievement.requirement ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
    }

    // Check for "Focus Beginner" achievement
    const focusAchievement = await prisma.achievement.findFirst({
      where: { name: 'Focus Beginner' }
    });
    
    if (focusAchievement) {
      console.log(`⏰ Found "Focus Beginner" achievement:`);
      console.log(`  - Requirement: ${focusAchievement.requirement} Pomodoro sessions`);
      console.log(`  - User has: ${testUser.totalPomodoroCompleted} sessions`);
      console.log(`  - Status: ${testUser.totalPomodoroCompleted >= focusAchievement.requirement ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
    }

    // Check total achievements available
    const totalAchievements = await prisma.achievement.count();
    console.log(`\n📊 Total achievements available: ${totalAchievements}`);

    // Check achievements by category
    const achievementsByCategory = await prisma.achievement.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    console.log('\n📂 Achievements by category:');
    for (const category of achievementsByCategory) {
      console.log(`  - ${category.category}: ${category._count.id} achievements`);
    }

    console.log('\n✅ Achievement system test completed!');
  } catch (error) {
    console.error('❌ Error testing achievement system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testAchievementSystem()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default testAchievementSystem;
