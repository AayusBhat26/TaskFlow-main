import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingUsersNotesCount() {
  try {
    console.log('🔄 Updating existing users notes count...');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        totalNotesCreated: true
      }
    });

    console.log(`Found ${users.length} users to process...`);

    let updatedCount = 0;
    for (const user of users) {
      // Count actual notes for this user
      const actualNotesCount = await prisma.note.count({
        where: { authorId: user.id }
      });

      // Update if the count is different
      if (actualNotesCount !== user.totalNotesCreated) {
        await prisma.user.update({
          where: { id: user.id },
          data: { totalNotesCreated: actualNotesCount }
        });
        
        console.log(`  📝 Updated ${user.username}: ${user.totalNotesCreated} → ${actualNotesCount} notes`);
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} users' notes count`);
    console.log('🎉 Notes count update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating users notes count:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  updateExistingUsersNotesCount()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default updateExistingUsersNotesCount;
