const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDSAQuestions() {
  try {
    console.log('🔍 Testing DSA Questions Database...\n');

    // Check total count
    const totalCount = await prisma.dSAQuestion.count();
    console.log(`📊 Total DSA Questions: ${totalCount}`);

    // Check curated vs imported
    const curatedCount = await prisma.dSAQuestion.count({
      where: { isImported: false }
    });
    const importedCount = await prisma.dSAQuestion.count({
      where: { isImported: true }
    });
    
    console.log(`📚 Curated Questions: ${curatedCount}`);
    console.log(`📥 Imported Questions: ${importedCount}\n`);

    // Check by topic
    const topics = await prisma.dSAQuestion.groupBy({
      by: ['topic'],
      _count: { topic: true }
    });
    
    console.log('📋 Questions by Topic:');
    topics.forEach(topic => {
      console.log(`  ${topic.topic}: ${topic._count.topic}`);
    });

    // Check by difficulty
    const difficulties = await prisma.dSAQuestion.groupBy({
      by: ['difficulty'],
      _count: { difficulty: true }
    });
    
    console.log('\n📊 Questions by Difficulty:');
    difficulties.forEach(diff => {
      console.log(`  ${diff.difficulty}: ${diff._count.difficulty}`);
    });

    // Check by platform
    const platforms = await prisma.dSAQuestion.groupBy({
      by: ['platform'],
      _count: { platform: true }
    });
    
    console.log('\n🌐 Questions by Platform:');
    platforms.forEach(platform => {
      console.log(`  ${platform.platform}: ${platform._count.platform}`);
    });

    // Sample questions
    console.log('\n🔍 Sample Questions:');
    const sampleQuestions = await prisma.dSAQuestion.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        topic: true,
        difficulty: true,
        isImported: true,
        platform: true
      }
    });
    
    sampleQuestions.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.title} (${q.topic}, ${q.difficulty}, ${q.isImported ? 'Imported' : 'Curated'})`);
    });

    // Check if there are any questions with specific criteria
    const allQuestions = await prisma.dSAQuestion.findMany({
      where: {},
      take: 10,
      select: {
        id: true,
        title: true,
        topic: true,
        difficulty: true,
        isImported: true
      }
    });

    console.log(`\n✅ Found ${allQuestions.length} questions in sample`);
    
    if (allQuestions.length === 0) {
      console.log('❌ No questions found in database!');
    } else {
      console.log('✅ Database contains questions');
    }

  } catch (error) {
    console.error('❌ Error testing DSA questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDSAQuestions();
