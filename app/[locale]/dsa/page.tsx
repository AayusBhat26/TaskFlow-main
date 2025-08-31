'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DSAUploader } from '@/components/dsa/DSAUploader';
import { ImportedQuestionsTab } from '@/components/dsa/ImportedQuestionsTab';
import { HandPickedProgressTracker } from '@/components/dsa/HandPickedProgressTracker';
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Star,
  Upload,
  Download,
  Package,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playQuestionCompletionSound } from '@/lib/soundEffects';
import { useUserSettings } from '@/hooks/useUserSettings';

interface DSAQuestion {
  id: string;
  title: string;
  description?: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  leetcodeUrl?: string;
  platform: string;
  tags: string[];
  companies: string[];
  frequency: number;
  timeComplexity?: string;
  spaceComplexity?: string;
  approach?: string;
  progress?: {
    id: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW' | 'SKIPPED';
    attempts: number;
    timeSpent: number;
    completedAt?: string;
    rating?: number;
    notes?: string;
  }[];
}

interface DSAStats {
  total: number;
  completed: number;
  inProgress: number;
  completionPercentage: number;
}

interface TopicProgress {
  topic: string;
  total: number;
  completed: number;
  percentage: number;
}

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HARD: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  TODO: 'text-muted-foreground',
  IN_PROGRESS: 'text-blue-500',
  COMPLETED: 'text-green-500',
  REVIEW: 'text-orange-500',
  SKIPPED: 'text-muted-foreground/60'
};

export default function DSAPracticePage() {
  const router = useRouter();
  const { userSettings } = useUserSettings();
  const soundsEnabled = (userSettings as any)?.soundsEnabled ?? true;
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [stats, setStats] = useState<DSAStats>({ total: 0, completed: 0, inProgress: 0, completionPercentage: 0 });
  const [overallStats, setOverallStats] = useState<DSAStats>({ total: 0, completed: 0, inProgress: 0, completionPercentage: 0 });
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [importBatches, setImportBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
  const [progressNotes, setProgressNotes] = useState('');
  const [progressRating, setProgressRating] = useState<number>(0);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  // Fetch import batches
  const fetchImportBatches = async () => {
    try {
      const response = await fetch('/api/dsa/imported');
      const data = await response.json();
      if (data.importBatches) {
        setImportBatches(data.importBatches);
      }
    } catch (error) {
      console.error('Error fetching import batches:', error);
    }
  };

  // Fetch comprehensive stats (both curated and imported)
  const fetchOverallStats = async () => {
    try {
      console.log('🔍 Fetching overall stats...');
      const response = await fetch(`/api/dsa/all-stats?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      
      console.log('📊 All-stats API response:', data);
      
      if (data.overall) {
        console.log('✅ Setting overall stats:', {
          total: data.overall.total,
          completed: data.overall.solved,
          inProgress: data.overall.inProgress,
          completionPercentage: data.overall.completionPercentage
        });
        setOverallStats({
          total: data.overall.total,
          completed: data.overall.solved,
          inProgress: data.overall.inProgress,
          completionPercentage: data.overall.completionPercentage
        });
      } else {
        console.error('❌ No overall stats in response:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching overall stats:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    console.log('🚀 DSA Page mounting, loading initial data...');
    fetchQuestions();
    fetchImportBatches();
    fetchOverallStats();
  }, []); // Only run on mount

  // Fetch questions when filters change
  useEffect(() => {
    console.log('🔍 Filters changed, fetching questions...');
    fetchQuestions();
  }, [selectedTopic, selectedDifficulty, selectedStatus, searchQuery]);

  // Listen for progress updates from ImportedQuestionsTab
  useEffect(() => {
    const handleProgressUpdate = () => {
      console.log('📡 Received progress update event, refreshing overall stats...');
      fetchOverallStats();
    };

    window.addEventListener('dsaProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('dsaProgressUpdated', handleProgressUpdate);
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (searchQuery) params.append('search', searchQuery);
      
      // Explicitly include imported questions to match the stats
      params.append('includeImported', 'true');

      console.log('🔍 Fetching questions with params:', params.toString());
      
      const response = await fetch(`/api/dsa/questions?${params}`);
      const data = await response.json();

      console.log('📊 Questions API response:', data);

      if (data.success) {
        console.log('✅ Setting questions:', data.questions.length, 'questions');
        setQuestions(data.questions);
        setStats(data.stats);
        setTopicProgress(data.topicProgress);
        
        // Log debug info if available
        if (data.debug) {
          console.log('🔍 Debug info:', data.debug);
        }
      } else {
        console.error('❌ API returned error:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (questionId: string, status: string, notes?: string, rating?: number) => {
    try {
      console.log('🔄 Updating progress:', { questionId, status });
      const response = await fetch('/api/dsa/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          status,
          notes,
          rating
        })
      });

      const data = await response.json();
      console.log('📊 Progress API response:', data);

      if (data.success) {
        toast({
          title: status === 'COMPLETED' ? '🎉 Question Completed!' : 'Success',
          description: data.message
        });
        
        // Immediately update the local state to reflect the change
        setQuestions(prevQuestions => 
          prevQuestions.map(q => {
            if (q.id === questionId) {
              const existingProgress = q.progress?.[0];
              const updatedProgress = {
                id: existingProgress?.id || 'temp-id',
                status: status as any,
                attempts: status === 'COMPLETED' ? (existingProgress?.attempts || 0) + 1 : (existingProgress?.attempts || 0),
                timeSpent: existingProgress?.timeSpent || 0,
                completedAt: status === 'COMPLETED' ? new Date().toISOString() : existingProgress?.completedAt,
                rating: rating || existingProgress?.rating,
                notes: notes || existingProgress?.notes
              };
              
              return {
                ...q,
                progress: [updatedProgress]
              };
            }
            return q;
          })
        );
        
        // Refresh both filtered questions and overall stats
        console.log('🔄 Refreshing questions and overall stats...');
        await fetchQuestions();
        await fetchOverallStats();
        
        // Dispatch event to notify other components (like dashboard and handpicked tracker)
        console.log('📡 Dispatching dsaProgressUpdated event...');
        window.dispatchEvent(new CustomEvent('dsaProgressUpdated'));
        
        console.log('✅ Refresh completed');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('❌ Update progress error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update progress',
        variant: 'destructive'
      });
    }
  };

  const getQuestionStatus = (question: DSAQuestion) => {
    const status = question.progress?.[0]?.status || 'TODO';
    console.log(`🔍 Question ${question.id} status:`, status, 'Progress:', question.progress);
    return status;
  };

  // Test function to manually test completion
  const testCompletion = async (questionId: string) => {
    console.log('🧪 Testing completion for question:', questionId);
    try {
      const response = await fetch('/api/dsa/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          status: 'COMPLETED',
          notes: 'Test completion',
          rating: 5
        })
      });

      const data = await response.json();
      console.log('🧪 Test completion response:', data);

      if (data.success) {
        toast({
          title: 'Test Success',
          description: 'Test completion successful'
        });
        await fetchQuestions();
        await fetchOverallStats();
      } else {
        toast({
          title: 'Test Failed',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('🧪 Test completion error:', error);
      toast({
        title: 'Test Error',
        description: 'Test completion failed',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const uniqueTopics = [...new Set(questions.map(q => q.topic))].sort();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">DSA Practice</h1>
              <p className="text-muted-foreground">Master Data Structures & Algorithms for placement interviews</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showUploader} onOpenChange={setShowUploader}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DSAUploader onUploadComplete={() => {
                  setShowUploader(false);
                  fetchQuestions();
                }} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Progress
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{overallStats.total}</p>
                  <p className="text-xs text-muted-foreground">Curated + Imported</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{overallStats.completed}</p>
                  <p className="text-xs text-muted-foreground">All questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{overallStats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">All questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{overallStats.completionPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Overall completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {overallStats.completed} / {overallStats.total} questions completed
                </span>
              </div>
              <Progress value={overallStats.completionPercentage} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="questions">Curated Questions</TabsTrigger>
          <TabsTrigger value="handpicked">Aayush's Hand Picked</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="imported">All Imports</TabsTrigger>
          {importBatches.map((batch) => (
            <TabsTrigger key={batch.batchId} value={`batch-${batch.batchId}`}>
              {batch.batchName}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {uniqueTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Information */}
          <Card>
            <CardContent className="p-4">
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>Total Questions: {questions.length}</div>
                  <div>Selected Topic: {selectedTopic}</div>
                  <div>Selected Difficulty: {selectedDifficulty}</div>
                  <div>Selected Status: {selectedStatus}</div>
                  <div>Search Query: {searchQuery || 'None'}</div>
                  <div>Loading: {loading ? 'Yes' : 'No'}</div>
                  <div>Stats Total: {stats.total}</div>
                  <div>Overall Total: {overallStats.total}</div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2">Question Status Breakdown:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>Completed: {questions.filter(q => getQuestionStatus(q) === 'COMPLETED').length}</div>
                    <div>In Progress: {questions.filter(q => getQuestionStatus(q) === 'IN_PROGRESS').length}</div>
                    <div>TODO: {questions.filter(q => getQuestionStatus(q) === 'TODO').length}</div>
                    <div>With Progress: {questions.filter(q => q.progress && q.progress.length > 0).length}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2">Overall Stats:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>Total: {overallStats.total}</div>
                    <div>Completed: {overallStats.completed}</div>
                    <div>In Progress: {overallStats.inProgress}</div>
                    <div>Percentage: {overallStats.completionPercentage}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No questions found</p>
                </div>
              ) : (
                questions.map((question) => {
                  const status = getQuestionStatus(question);
                  const progress = question.progress?.[0];
                  
                  console.log(`🔍 Rendering question ${question.id}:`, {
                    title: question.title,
                    status,
                    progress,
                    progressLength: question.progress?.length
                  });
                  
                  return (
                    <Card key={question.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Question content - 80% width */}
                          <div className="flex-1 space-y-2" style={{width: '80%'}}>
                            <div className="flex items-start">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{question.title}</h3>
                                    {question.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {question.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge className={cn("text-xs", difficultyColors[question.difficulty])}>
                                      {question.difficulty}
                                    </Badge>
                                    {question.frequency > 5 && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Star className="w-3 h-3 mr-1" />
                                        High Freq
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                                    {question.topic}
                                  </span>
                                  <span>{question.platform}</span>
                                  {progress && (
                                    <>
                                      <span>Attempts: {progress.attempts}</span>
                                      <span>Time: {progress.timeSpent}m</span>
                                    </>
                                  )}
                                </div>

                                {question.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {question.tags.slice(0, 3).map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {question.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{question.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedQuestion(question);
                                          setProgressNotes(progress?.notes || '');
                                          setProgressRating(progress?.rating || 0);
                                        }}
                                      >
                                        Update Progress
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Update Progress - {question.title}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">Status</label>
                                          <Select 
                                            defaultValue={status}
                                            onValueChange={(value) => {
                                              // Play sound for completion
                                              if (value === 'COMPLETED') {
                                                playQuestionCompletionSound(undefined, soundsEnabled);
                                              }
                                              updateProgress(question.id, value, progressNotes, progressRating);
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="TODO">To Do</SelectItem>
                                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                              <SelectItem value="COMPLETED">Completed</SelectItem>
                                              <SelectItem value="REVIEW">Review</SelectItem>
                                              <SelectItem value="SKIPPED">Skipped</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium">Notes</label>
                                          <Textarea
                                            placeholder="Add your notes, approach, or solution..."
                                            value={progressNotes}
                                            onChange={(e) => setProgressNotes(e.target.value)}
                                          />
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium">Difficulty Rating (1-5)</label>
                                          <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                              <Button
                                                key={rating}
                                                variant={progressRating >= rating ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setProgressRating(rating)}
                                              >
                                                <Star className="w-4 h-4" />
                                              </Button>
                                            ))}
                                          </div>
                                        </div>

                                        <Button
                                          onClick={() => updateProgress(question.id, status, progressNotes, progressRating)}
                                          className="w-full"
                                        >
                                          Save Progress
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  {question.leetcodeUrl && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(question.leetcodeUrl, '_blank')}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-1" />
                                      View Problem
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Completion button - 20% width */}
                          <div className="flex flex-col items-center gap-2" style={{width: '20%'}}>
                            <Button
                              onClick={() => {
                                console.log('🔴 BUTTON CLICKED! Question:', question.id, 'Current status:', status);
                                console.log('🔍 Question progress:', question.progress);
                                const newStatus = status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
                                console.log('🔄 New status will be:', newStatus);
                                // Play sound for completion
                                if (newStatus === 'COMPLETED') {
                                  playQuestionCompletionSound(undefined, soundsEnabled);
                                }
                                updateProgress(question.id, newStatus);
                              }}
                              className={cn(
                                "w-full",
                                status === 'COMPLETED' 
                                  ? "bg-green-500 hover:bg-green-600 text-white" 
                                  : "bg-primary hover:bg-primary/90"
                              )}
                              disabled={loading}
                            >
                              {status === 'COMPLETED' ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Circle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </>
                              )}
                            </Button>
                            {progress && progress.attempts > 0 && (
                              <span className="text-xs text-muted-foreground text-center">
                                {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="handpicked" className="space-y-4">
          <HandPickedProgressTracker />
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicProgress.map((topic) => (
              <Card key={topic.topic}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{topic.topic}</CardTitle>
                  <CardDescription>
                    {topic.completed} / {topic.total} questions completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={topic.percentage} />
                    <div className="flex justify-between text-sm">
                      <span>{topic.percentage}% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="imported" className="space-y-4">
          <ImportedQuestionsTab />
        </TabsContent>

        {/* Dynamic Import Batch Tabs */}
        {importBatches.map((batch) => (
          <TabsContent key={batch.batchId} value={`batch-${batch.batchId}`} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {batch.batchName}
                </CardTitle>
                <CardDescription>
                  {batch.questionCount} questions imported on {new Date(batch.importedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
            <ImportedQuestionsTab batchId={batch.batchId} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
