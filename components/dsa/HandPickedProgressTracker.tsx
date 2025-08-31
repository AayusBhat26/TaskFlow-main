"use client";

import { useState } from "react";
import { Trophy, Target } from "lucide-react";
import { aayushHandPickedProblems, totalHandPickedProblems } from "@/data/aayushHandPickedProblems";

interface HandPickedProgressTrackerProps {
  userId?: string;
}

export const HandPickedProgressTracker = ({ userId }: HandPickedProgressTrackerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Aayush's Hand Picked Problems
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Curated collection of essential DSA problems
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Total Problems Display */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Problems</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalHandPickedProblems}</p>
        </div>
      </div>

      {/* Expandable Problem List */}
      {isExpanded && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Problem Categories</h3>
          {aayushHandPickedProblems.map((category) => {
            return (
              <div key={category.category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{category.category}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.problems.length} problems
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {category.problems.map((problem) => {
                    const difficultyColor = {
                      Easy: 'text-green-600',
                      Medium: 'text-yellow-600',
                      Hard: 'text-red-600'
                    }[problem.difficulty];
                    
                    return (
                      <div
                        key={problem.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {problem.id}. {problem.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor} bg-opacity-10`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
