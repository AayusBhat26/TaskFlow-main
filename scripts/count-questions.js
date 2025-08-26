const fs = require('fs');

// Read the TypeScript file and extract the array
const fileContent = fs.readFileSync('./combined-dsa-questions.ts', 'utf8');

// Count questions by looking for title properties
const titleMatches = fileContent.match(/title: "/g);
const totalQuestions = titleMatches ? titleMatches.length : 0;

console.log('🎯 Comprehensive DSA Questions Collection Summary');
console.log('=' .repeat(50));
console.log(`📊 Total Questions: ${totalQuestions}`);

// Extract topics
const topicMatches = fileContent.match(/topic: "([^"]+)"/g);
const topics = {};
if (topicMatches) {
  topicMatches.forEach(match => {
    const topic = match.match(/topic: "([^"]+)"/)[1];
    topics[topic] = (topics[topic] || 0) + 1;
  });
}

// Extract difficulties
const difficultyMatches = fileContent.match(/difficulty: "([^"]+)"/g);
const difficulties = {};
if (difficultyMatches) {
  difficultyMatches.forEach(match => {
    const difficulty = match.match(/difficulty: "([^"]+)"/)[1];
    difficulties[difficulty] = (difficulties[difficulty] || 0) + 1;
  });
}

// Extract sources
const sourceMatches = fileContent.match(/source: "([^"]+)"/g);
const sources = {};
if (sourceMatches) {
  sourceMatches.forEach(match => {
    const source = match.match(/source: "([^"]+)"/)[1];
    sources[source] = (sources[source] || 0) + 1;
  });
}

console.log('\n📂 Questions by Topic:');
Object.entries(topics)
  .sort((a, b) => b[1] - a[1])
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count} questions`);
  });

console.log('\n⚡ Questions by Difficulty:');
Object.entries(difficulties).forEach(([diff, count]) => {
  console.log(`  ${diff}: ${count} questions`);
});

console.log('\n📚 Questions by Source:');
Object.entries(sources).forEach(([source, count]) => {
  console.log(`  ${source}: ${count} questions`);
});

console.log('\n✅ Ready to import to database!');
console.log('Run: npx tsx scripts/combined-dsa-questions.ts');