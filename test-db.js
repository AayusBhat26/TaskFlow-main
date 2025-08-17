const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    
    // Test if we can connect to the database
    const userCount = await prisma.user.count();
    
    // Test if Note model exists
    const noteCount = await prisma.note.count();
    
    // Check available models
    
  } catch (error) {
    console.error('Database test error:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
