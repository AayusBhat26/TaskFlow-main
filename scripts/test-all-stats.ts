// Test script to check comprehensive DSA statistics
// Run: npx tsx scripts/test-all-stats.ts

import { db } from '../lib/db';

async function main() {
  try {
    console.log('🔍 Comprehensive DSA Statistics Check\n');

    // Get total question counts
    const totalQuestions = await db.dSAQuestion.count();
    const totalCurated = await db.dSAQuestion.count({
      where: { isImported: false }
    });
    const totalImported = await db.dSAQuestion.count({
      where: { isImported: true }
    });

    console.log('📊 Overall Statistics:');
    console.log(`   Total Questions: ${totalQuestions}`);
    console.log(`   Curated Questions: ${totalCurated}`);
    console.log(`   Imported Questions: ${totalImported}\n`);

    // Get topic breakdown
    const allTopics = await db.dSAQuestion.groupBy({
      by: ['topic'],
      _count: {
        topic: true
      },
      orderBy: {
        _count: {
          topic: 'desc'
        }
      }
    });

    console.log('🏷️ Questions by Topic (Top 10):');
    allTopics.slice(0, 10).forEach(topic => {
      console.log(`   ${topic.topic}: ${topic._count.topic} questions`);
    });
    console.log();

    // Get difficulty breakdown
    const difficultyStats = await db.dSAQuestion.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });

    console.log('⚡ Questions by Difficulty:');
    difficultyStats.forEach(diff => {
      console.log(`   ${diff.difficulty}: ${diff._count.difficulty} questions`);
    });
    console.log();

    // Get imported question details
    if (totalImported > 0) {
      const importBatches = await db.dSAQuestion.groupBy({
        by: ['importBatchId', 'originalFileName'],
        where: {
          isImported: true,
          importBatchId: {
            not: null
          }
        },
        _count: {
          importBatchId: true
        }
      });

      console.log('📥 Import Batches:');
      importBatches.forEach(batch => {
        console.log(`   Batch: ${batch.originalFileName || 'Unknown'}`);
        console.log(`   Questions: ${batch._count.importBatchId}`);
        console.log(`   Batch ID: ${batch.importBatchId?.substring(0, 8)}...`);
        console.log();
      });
    }

    // Get sample questions
    const sampleQuestions = await db.dSAQuestion.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        title: true,
        topic: true,
        difficulty: true,
        isImported: true,
        companies: true
      }
    });

    console.log('📝 Sample Recent Questions:');
    sampleQuestions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.title}`);
      console.log(`      Topic: ${q.topic} | Difficulty: ${q.difficulty}`);
      console.log(`      Type: ${q.isImported ? 'Imported' : 'Curated'}`);
      if (q.companies && q.companies.length > 0) {
        console.log(`      Companies: ${q.companies.slice(0, 3).join(', ')}`);
      }
      console.log();
    });

    console.log('✅ Statistics check complete!');
    console.log('💡 You can now use the /api/dsa/all-stats endpoint to get comprehensive statistics');

  } catch (error) {
    console.error('❌ Error checking statistics:', error);
  } finally {
    await db.$disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
}