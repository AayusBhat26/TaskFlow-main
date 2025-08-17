// Test script to verify the enhanced LeetCode service with real data integration
import { LeetCodeService } from './services/external/leetcode';
import { googleSheetsLeetCodeService } from './services/external/googleSheetsLeetCode';

async function testLeetCodeIntegration() {
  console.log('🧪 Testing Enhanced LeetCode Service with Real Data Integration\n');

  const leetcodeService = new LeetCodeService();
  const testUsername = 'testuser'; // Replace with a real username for testing

  try {
    const allQuestions = await googleSheetsLeetCodeService.getAllLeetCodeQuestions();
    
    if (allQuestions.length > 0) {
      allQuestions.slice(0, 3).forEach(q => {
      });
    }

    const submissions = await leetcodeService.getUserComprehensiveSubmissions(testUsername);
    
    if (submissions.length > 0) {
      const byDifficulty = {
        Easy: submissions.filter(s => s.difficulty === 'Easy').length,
        Medium: submissions.filter(s => s.difficulty === 'Medium').length,
        Hard: submissions.filter(s => s.difficulty === 'Hard').length
      };

      submissions.slice(0, 5).forEach(sub => {
      });
    }

    const userStats = await leetcodeService.getUserStats(testUsername);
    if (userStats) {
    }

    const arrayQuestions = await googleSheetsLeetCodeService.getQuestionsByTopic('Array');

    const mediumQuestions = await googleSheetsLeetCodeService.getQuestionsByDifficulty('Medium');


  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run the test
// testLeetCodeIntegration();
