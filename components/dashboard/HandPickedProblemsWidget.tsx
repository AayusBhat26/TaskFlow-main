"use client";

import { useState, useEffect } from "react";
import { Trophy, Target, CheckCircle, TrendingUp } from "lucide-react";
import { totalHandPickedProblems } from "@/data/aayushHandPickedProblems";
import { useSession } from "next-auth/react";

interface HandPickedProblemsWidgetProps {
  userId?: string;
}

interface DSAProgress {
  questionId: string;
  status: string;
  completedAt?: string;
}

export const HandPickedProblemsWidget = ({ userId }: HandPickedProblemsWidgetProps) => {
  const { data: session } = useSession();
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch progress from database
  const fetchProgress = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/dsa/handpicked-progress');
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      
      const data = await response.json();
      const completedIds = new Set<number>();
      
      // Map internal question IDs back to LeetCode IDs
      data.progress.forEach((item: DSAProgress) => {
        const leetcodeId = parseInt(item.questionId);
        if (!isNaN(leetcodeId)) {
          completedIds.add(leetcodeId);
        }
      });
      
      setCompletedProblems(completedIds);
    } catch (err) {
      console.error('Error fetching handpicked progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load progress when component mounts or session changes
  useEffect(() => {
    fetchProgress();
  }, [session?.user?.id]);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      fetchProgress();
    };

    window.addEventListener('dsaProgressUpdated', handleProgressUpdate);
    
    // Fallback: Poll for updates every 30 seconds as a backup
    const pollInterval = setInterval(() => {
      console.log('🔄 HandPickedProblemsWidget polling for updates...');
      fetchProgress();
    }, 30000);
    
    return () => {
      window.removeEventListener('dsaProgressUpdated', handleProgressUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const getTotalCompleted = () => completedProblems.size;
  const getProgressPercentage = () => (getTotalCompleted() / totalHandPickedProblems) * 100;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hand Picked Problems
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aayush's curated collection
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{getTotalCompleted()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {totalHandPickedProblems - getTotalCompleted()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          View All
        </button>
        <button className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Practice
        </button>
      </div>

      {/* Achievement Indicator */}
      {getProgressPercentage() >= 100 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              🎉 All problems completed!
            </span>
          </div>
        </div>
      )}

      {/* Streak Indicator */}
      {getTotalCompleted() > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-3 w-3" />
          <span>Keep up the great work!</span>
        </div>
      )}
    </div>
  );
};
