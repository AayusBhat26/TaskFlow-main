// Additional Comprehensive DSA Questions from Various Sources
// Beyond Love Babbar and Striver: LeetCode Top 100, FAANG Questions, GeeksforGeeks

export const additionalDSAQuestions = [
  // ========== POPULAR LEETCODE QUESTIONS ==========
  {
    title: "Subarray Sum Equals K",
    description: "Given an array and integer k, find total number of continuous subarrays whose sum equals k",
    topic: "Array",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/",
    platform: "LeetCode",
    tags: ["Array", "Hash Table", "Prefix Sum"],
    companies: ["Facebook", "Amazon", "Google", "Microsoft"],
    frequency: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    approach: "Prefix sum with hash map",
    source: "LeetCode Top 100"
  },
  {
    title: "Product of Array Except Self",
    description: "Return array where output[i] equals product of all elements except nums[i]",
    topic: "Array",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    platform: "LeetCode",
    tags: ["Array", "Prefix Sum"],
    companies: ["Amazon", "Microsoft", "Apple", "Facebook"],
    frequency: 10,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    approach: "Two passes with left and right products",
    source: "FAANG Questions"
  },
  {
    title: "Group Anagrams",
    description: "Group anagrams together from array of strings",
    topic: "String",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    platform: "LeetCode",
    tags: ["Array", "Hash Table", "String", "Sorting"],
    companies: ["Amazon", "Facebook", "Google", "Uber"],
    frequency: 9,
    timeComplexity: "O(n*k*log(k))",
    spaceComplexity: "O(n*k)",
    approach: "Sort each string and use as hash key",
    source: "String Patterns"
  },
  {
    title: "Minimum Window Substring",
    description: "Find minimum window substring containing all characters of t",
    topic: "String",
    difficulty: "HARD" as const,
    leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
    platform: "LeetCode",
    tags: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Facebook", "Google", "Microsoft"],
    frequency: 9,
    timeComplexity: "O(|s| + |t|)",
    spaceComplexity: "O(|s| + |t|)",
    approach: "Sliding window with character frequency map",
    source: "Sliding Window Pattern"
  },

  // ========== SYSTEM DESIGN QUESTIONS ==========
  {
    title: "LRU Cache",
    description: "Design and implement a Least Recently Used cache",
    topic: "Design",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
    platform: "LeetCode",
    tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    frequency: 10,
    timeComplexity: "O(1)",
    spaceComplexity: "O(capacity)",
    approach: "Hash table + doubly linked list",
    source: "System Design"
  },
  {
    title: "Design Twitter",
    description: "Design a simplified version of Twitter",
    topic: "Design",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/design-twitter/",
    platform: "LeetCode",
    tags: ["Hash Table", "Linked List", "Design", "Heap"],
    companies: ["Amazon", "Facebook", "Twitter"],
    frequency: 7,
    timeComplexity: "O(log N)",
    spaceComplexity: "O(N)",
    approach: "Hash maps with merge k sorted lists",
    source: "Social Media Design"
  },

  // ========== ADVANCED TREE PROBLEMS ==========
  {
    title: "Serialize and Deserialize Binary Tree",
    description: "Design algorithm to serialize and deserialize binary tree",
    topic: "Binary Tree",
    difficulty: "HARD" as const,
    leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    platform: "LeetCode",
    tags: ["String", "Tree", "DFS", "BFS", "Design"],
    companies: ["Amazon", "Google", "Facebook", "LinkedIn"],
    frequency: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    approach: "Preorder traversal with markers",
    source: "Tree Serialization"
  },
  {
    title: "Binary Tree Maximum Path Sum",
    description: "Find maximum path sum in binary tree",
    topic: "Binary Tree",
    difficulty: "HARD" as const,
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    platform: "LeetCode",
    tags: ["Dynamic Programming", "Tree", "DFS"],
    companies: ["Amazon", "Facebook", "Google", "Microsoft"],
    frequency: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    approach: "Post-order traversal with global maximum",
    source: "Tree DP"
  },

  // ========== INTERVAL PROBLEMS ==========
  {
    title: "Meeting Rooms II",
    description: "Find minimum number of conference rooms required",
    topic: "Interval",
    difficulty: "MEDIUM" as const,
    platform: "LeetCode",
    tags: ["Array", "Two Pointers", "Greedy", "Sorting", "Heap"],
    companies: ["Amazon", "Facebook", "Google", "Microsoft"],
    frequency: 9,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    approach: "Sort and use min heap or two pointers",
    source: "Interval Scheduling"
  },
  {
    title: "Non-overlapping Intervals",
    description: "Find minimum number of intervals to remove to make rest non-overlapping",
    topic: "Interval",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/",
    platform: "LeetCode",
    tags: ["Array", "Dynamic Programming", "Greedy", "Sorting"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    frequency: 8,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    approach: "Greedy algorithm with end time sorting",
    source: "Interval Problems"
  },

  // ========== GRAPH ALGORITHMS ==========
  {
    title: "Word Ladder",
    description: "Find shortest transformation sequence from beginWord to endWord",
    topic: "Graph",
    difficulty: "HARD" as const,
    leetcodeUrl: "https://leetcode.com/problems/word-ladder/",
    platform: "LeetCode",
    tags: ["Hash Table", "String", "BFS"],
    companies: ["Amazon", "Facebook", "Google", "LinkedIn"],
    frequency: 8,
    timeComplexity: "O(M²×N)",
    spaceComplexity: "O(M²×N)",
    approach: "BFS with word transformations",
    source: "BFS Applications"
  },
  {
    title: "Alien Dictionary",
    description: "Find order of characters in alien language from sorted words",
    topic: "Graph",
    difficulty: "HARD" as const,
    leetcodeUrl: "https://leetcode.com/problems/alien-dictionary/",
    platform: "LeetCode",
    tags: ["Array", "String", "DFS", "BFS", "Graph", "Topological Sort"],
    companies: ["Amazon", "Google", "Facebook", "Airbnb"],
    frequency: 8,
    timeComplexity: "O(C)",
    spaceComplexity: "O(1)",
    approach: "Build graph and topological sort",
    source: "Topological Sort"
  },

  // ========== ADVANCED DP ==========
  {
    title: "Word Break",
    description: "Check if string can be segmented into dictionary words",
    topic: "Dynamic Programming",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/word-break/",
    platform: "LeetCode",
    tags: ["Array", "Hash Table", "String", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Facebook", "Microsoft"],
    frequency: 9,
    timeComplexity: "O(n²*m)",
    spaceComplexity: "O(n)",
    approach: "DP with substring checking",
    source: "String DP"
  },
  {
    title: "Decode Ways",
    description: "Count number of ways to decode a string of digits",
    topic: "Dynamic Programming",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/decode-ways/",
    platform: "LeetCode",
    tags: ["String", "Dynamic Programming"],
    companies: ["Amazon", "Facebook", "Microsoft", "Uber"],
    frequency: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    approach: "DP with space optimization",
    source: "Classic DP"
  },

  // ========== MATRIX PROBLEMS ==========
  {
    title: "Spiral Matrix",
    description: "Return all elements of matrix in spiral order",
    topic: "Matrix",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/",
    platform: "LeetCode",
    tags: ["Array", "Matrix", "Simulation"],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    frequency: 8,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(1)",
    approach: "Layer by layer traversal with boundaries",
    source: "Matrix Problems"
  },
  {
    title: "Set Matrix Zeroes",
    description: "If element is 0, set its entire row and column to 0",
    topic: "Matrix",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/",
    platform: "LeetCode",
    tags: ["Array", "Matrix", "Hash Table"],
    companies: ["Amazon", "Microsoft", "Apple"],
    frequency: 7,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(1)",
    approach: "Use first row and column as markers",
    source: "Matrix Problems"
  },

  // ========== MATHEMATICAL ALGORITHMS ==========
  {
    title: "Pow(x, n)",
    description: "Implement pow(x, n), which calculates x raised to power n",
    topic: "Math",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/powx-n/",
    platform: "LeetCode",
    tags: ["Math", "Recursion"],
    companies: ["Amazon", "Facebook", "Google", "LinkedIn"],
    frequency: 8,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n)",
    approach: "Fast exponentiation using recursion",
    source: "Mathematical Algorithms"
  },
  {
    title: "Excel Sheet Column Number",
    description: "Convert Excel column title to corresponding column number",
    topic: "Math",
    difficulty: "EASY" as const,
    leetcodeUrl: "https://leetcode.com/problems/excel-sheet-column-number/",
    platform: "LeetCode",
    tags: ["Math", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    frequency: 7,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    approach: "Base 26 number system conversion",
    source: "Base Conversion"
  },

  // ========== UNION FIND ==========
  {
    title: "Number of Connected Components",
    description: "Find number of connected components in undirected graph",
    topic: "Union Find",
    difficulty: "MEDIUM" as const,
    platform: "LeetCode",
    tags: ["DFS", "BFS", "Union Find", "Graph"],
    companies: ["Amazon", "Google", "Facebook"],
    frequency: 7,
    timeComplexity: "O(n + m*α(n))",
    spaceComplexity: "O(n)",
    approach: "Union-Find with path compression",
    source: "Graph Connectivity"
  },
  {
    title: "Accounts Merge",
    description: "Merge accounts that belong to the same person",
    topic: "Union Find",
    difficulty: "MEDIUM" as const,
    leetcodeUrl: "https://leetcode.com/problems/accounts-merge/",
    platform: "LeetCode",
    tags: ["Array", "Hash Table", "String", "DFS", "BFS"],
    companies: ["Amazon", "Facebook", "Google"],
    frequency: 7,
    timeComplexity: "O(N*M*α(N*M))",
    spaceComplexity: "O(N*M)",
    approach: "Union-Find or DFS on email graph",
    source: "Union Find Applications"
  }
];

// Statistics for additional questions
export const additionalQuestionStats = {
  totalQuestions: additionalDSAQuestions.length,
  topicDistribution: additionalDSAQuestions.reduce((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  difficultyDistribution: additionalDSAQuestions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  sourceDistribution: additionalDSAQuestions.reduce((acc, q) => {
    acc[q.source] = (acc[q.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};

console.log('=== Additional DSA Questions Summary ===');
console.log(`Total Questions: ${additionalQuestionStats.totalQuestions}`);
console.log('Topic Distribution:', additionalQuestionStats.topicDistribution);
console.log('Difficulty Distribution:', additionalQuestionStats.difficultyDistribution);
console.log('Source Distribution:', additionalQuestionStats.sourceDistribution);