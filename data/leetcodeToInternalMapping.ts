// Mapping from LeetCode problem IDs to internal question titles
// This allows us to track progress for handpicked problems even when the database
// doesn't store LeetCode IDs directly

export const leetcodeToInternalMapping: Record<number, string> = {
  // Two Pointer Patterns
  1: "Two Sum",
  11: "Container With Most Water",
  15: "3Sum",
  16: "3Sum Closest",
  18: "4Sum",
  167: "Two Sum II - Input Array Is Sorted",
  349: "Intersection of Two Arrays",
  881: "Boats to Save People",
  977: "Squares of a Sorted Array",
  259: "3Sum Smaller",
  141: "Linked List Cycle",
  202: "Happy Number",
  287: "Find the Duplicate Number",
  392: "Is Subsequence",
  19: "Remove Nth Node From End of List",
  876: "Middle of the Linked List",
  2095: "Delete the Middle Node of a Linked List",
  26: "Remove Duplicates from Sorted Array",
  27: "Remove Element",
  75: "Sort Colors",
  80: "Remove Duplicates from Sorted Array II",
  283: "Move Zeroes",
  443: "String Compression",
  905: "Sort Array By Parity",
  2337: "Move Pieces to Obtain a String",
  2938: "Separate Black and White Balls",
  844: "Backspace String Compare",
  5: "Longest Palindromic Substring",
  647: "Palindromic Substrings",
  151: "Reverse Words in a String",
  344: "Reverse String",
  345: "Reverse Vowels of a String",
  541: "Reverse String II",

  // Sliding Window Patterns
  346: "Moving Average from Data Stream",
  643: "Maximum Average Subarray I",
  2985: "Calculate Compressed Mean",
  3254: "Find the Power of K-Size Subarrays I",
  3318: "Find X-Sum of All K-Long Subarrays I",
  3: "Longest Substring Without Repeating Characters",
  76: "Minimum Window Substring",
  209: "Minimum Size Subarray Sum",
  219: "Contains Duplicate II",
  424: "Longest Repeating Character Replacement",
  713: "Subarray Product Less Than K",
  904: "Fruit Into Baskets",
  1004: "Max Consecutive Ones III",
  1438: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
  1493: "Longest Subarray of 1's After Deleting One Element",
  1658: "Minimum Operations to Reduce X to Zero",
  1838: "Frequency of the Most Frequent Element",
  2461: "Maximum Sum of Distinct Subarrays With Length K",
  2516: "Take K of Each Character From Left and Right",
  2762: "Continuous Subarrays",
  2779: "Maximum Beauty of an Array After Applying Operation",
  2981: "Find Longest Special Substring That Occurs Thrice I",
  3026: "Maximum Good Subarray Sum",
  3346: "Maximum Frequency of an Element After Performing Operations I",
  3347: "Maximum Frequency of an Element After Performing Operations II",
  239: "Sliding Window Maximum",
  862: "Shortest Subarray with Sum at Least K",
  1696: "Jump Game VI",
  438: "Find All Anagrams in a String",
  567: "Permutation in String",

  // Tree Traversal Patterns
  102: "Binary Tree Level Order Traversal",
  103: "Binary Tree Zigzag Level Order Traversal",
  199: "Binary Tree Right Side View",
  515: "Find Largest Value in Each Tree Row",
  1161: "Maximum Level Sum of a Binary Tree",
  100: "Same Tree",
  101: "Symmetric Tree",
  105: "Construct Binary Tree from Preorder and Inorder Traversal",
  114: "Flatten Binary Tree to Linked List",
  226: "Invert Binary Tree",
  257: "Binary Tree Paths",
  988: "Smallest String Starting From Leaf",
  94: "Binary Tree Inorder Traversal",
  98: "Validate Binary Search Tree",
  173: "Binary Search Tree Iterator",
  230: "Kth Smallest Element in a BST",
  501: "Find Mode in Binary Search Tree",
  530: "Minimum Absolute Difference in BST",
  104: "Maximum Depth of Binary Tree",
  110: "Balanced Binary Tree",
};

// Reverse mapping from title to LeetCode ID
export const titleToLeetcodeMapping: Record<string, number> = Object.entries(leetcodeToInternalMapping).reduce(
  (acc, [id, title]) => {
    acc[title] = parseInt(id);
    return acc;
  },
  {} as Record<string, number>
);

// Get LeetCode ID by title
export const getLeetcodeIdByTitle = (title: string): number | null => {
  return titleToLeetcodeMapping[title] || null;
};

// Get title by LeetCode ID
export const getTitleByLeetcodeId = (leetcodeId: number): string | null => {
  return leetcodeToInternalMapping[leetcodeId] || null;
};
