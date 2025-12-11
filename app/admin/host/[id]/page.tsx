'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz, Player, Question, LeaderboardEntry, QuestionResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { subscribeToQuiz, unsubscribeFromQuiz } from '@/lib/realtime';
import { RealtimeChannel } from '@supabase/supabase-js';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import WaitingRoom from '@/components/WaitingRoom';
import QuestionDisplay from '@/components/QuestionDisplay';
import QuizTimer from '@/components/QuizTimer';
import QuestionResults from '@/components/QuestionResults';
import WinnerCelebration from '@/components/WinnerCelebration';
import Leaderboard from '@/components/Leaderboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import PulsingBackground from '@/components/animations/PulsingBackground';
import toast, { Toaster } from 'react-hot-toast';
import { Play, Square, SkipForward, Users, RotateCcw } from 'lucide-react';
import Logo from '@/components/Logo';

type HostView = 'setup' | 'waiting' | 'question' | 'results' | 'complete';

export default function HostQuiz() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentView, setCurrentView] = useState<HostView>('setup');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  const [winners, setWinners] = useState<LeaderboardEntry[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
    fetchPlayers();
    fetchLeaderboard();
  }, [quizId]);

  useEffect(() => {
    const channel = subscribeToQuiz(quizId, (payload) => {
      const { type, data } = payload.payload;

      switch (type) {
        case 'player_joined':
          setPlayers((prev) => [...prev, data]);
          toast.success(`${data.username} joined!`, { icon: data.avatar });
          break;
        case 'answer_submitted':
          setAnsweredCount((prev) => prev + 1);
          break;
        case 'leaderboard_updated':
          setLeaderboard(data);
          break;
      }
    });

    return () => {
      unsubscribeFromQuiz(channel);
    };
  }, [quizId]);

  useEffect(() => {
    if (currentView === 'question' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentView, timeRemaining]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      const data = await response.json();
      setQuiz(data.quiz);
      
      if (data.quiz.status === 'active') {
        setCurrentView('waiting');
      }
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`/api/players/${quizId}`);
      const data = await response.json();
      setPlayers(data.players || []);
    } catch (error) {
      console.error('Failed to fetch players');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboard/${quizId}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    }
  };

  const handleStartQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/start`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentQuestion(data.firstQuestion);
        setCurrentQuestionIndex(0);
        setTimeRemaining(data.firstQuestion.time_limit);
        setAnsweredCount(0);
        setCurrentView('question');
        toast.success('Quiz started!');
      }
    } catch (error) {
      toast.error('Failed to start quiz');
    }
  };

  const handleTimeUp = useCallback(async () => {
    if (!currentQuestion) return;

    try {
      const response = await fetch(`/api/questions/${currentQuestion.id}/results`);
      const data = await response.json();
      setQuestionResult(data);
      fetchLeaderboard();
      setCurrentView('results');
      
      // Broadcast results to all players
      await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizId,
          type: 'question_completed',
          data: data
        }),
      });
    } catch (error) {
      toast.error('Failed to fetch results');
    }
  }, [currentQuestion, quizId]);

  const handleNextQuestion = async () => {
    try {
      const response = await fetch('/api/questions/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: quizId }),
      });

      const data = await response.json();

      if (data.completed) {
        setWinners(data.top_3);
        setCurrentView('complete');
      } else {
        setCurrentQuestion(data.question);
        setCurrentQuestionIndex(data.index);
        setTimeRemaining(data.question.time_limit);
        setAnsweredCount(0);
        setQuestionResult(null);
        setCurrentView('question');
      }
    } catch (error) {
      toast.error('Failed to load next question');
    }
  };

  const handleStopQuiz = async () => {
    if (!confirm('Are you sure you want to stop the quiz?')) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}/stop`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setWinners(data.top_3);
        setCurrentView('complete');
        toast.success('Quiz stopped');
      }
    } catch (error) {
      toast.error('Failed to stop quiz');
    }
  };

  const handleRestartQuiz = async () => {
    if (!confirm('Are you sure you want to restart this quiz? All player data will be cleared.')) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}/restart`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Quiz restarted successfully!');
        
        // Reset all state
        setPlayers([]);
        setLeaderboard([]);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(0);
        setTimeRemaining(60);
        setQuestionResult(null);
        setWinners([]);
        setAnsweredCount(0);
        setCurrentView('setup');
        
        // Refresh quiz data
        await fetchQuiz();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to restart quiz');
      }
    } catch (error) {
      toast.error('Failed to restart quiz');
      console.error('Restart error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="min-h-screen relative">
      <Toaster position="top-right" />
      <PulsingBackground />

      {/* Admin Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span className="font-semibold">{players.length} Players</span>
        </div>
        
        {currentView === 'question' && (
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm text-gray-600">Answered: </span>
            <span className="font-semibold text-purple-600">
              {answeredCount}/{players.length}
            </span>
          </div>
        )}

        {(currentView === 'waiting' || currentView === 'question' || currentView === 'results') && (
          <Button variant="destructive" onClick={handleStopQuiz}>
            <Square className="w-4 h-4" />
            Stop Quiz
          </Button>
        )}
      </div>

      <div className="relative z-10 p-8">
        <AnimatePresence mode="wait">
          {/* Setup View */}
          {currentView === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {quiz.title}
                </h1>
                <p className="text-xl text-gray-600">{quiz.description}</p>
              </div>

              <QRCodeDisplay quizCode={quiz.code} quizId={quiz.id} />

              <div className="mt-12 text-center">
                <p className="text-lg text-gray-600 mb-4">
                  {players.length} {players.length === 1 ? 'player' : 'players'} waiting
                </p>
                <Button size="lg" onClick={handleStartQuiz} disabled={players.length === 0}>
                  <Play className="w-6 h-6" />
                  Start Quiz
                </Button>
                {players.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Waiting for players to join...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Waiting Room */}
          {currentView === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WaitingRoom players={players} quizTitle={quiz.title} />
            </motion.div>
          )}

          {/* Question View */}
          {currentView === 'question' && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <QuizTimer
                    timeRemaining={timeRemaining}
                    totalTime={currentQuestion.time_limit}
                    onTimeUp={handleTimeUp}
                  />
                  <QuestionDisplay
                    question={currentQuestion}
                    selectedOption={null}
                    onSelectOption={() => {}}
                    hasAnswered={true}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={quiz.questions?.length || 0}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard leaderboard={leaderboard} showTop={10} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results View */}
          {currentView === 'results' && questionResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <QuestionResults result={questionResult} />
                  <div className="text-center">
                    <Button size="lg" onClick={handleNextQuestion}>
                      <SkipForward className="w-5 h-5" />
                      Next Question
                    </Button>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard leaderboard={leaderboard} showTop={10} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete View */}
          {currentView === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WinnerCelebration
                winners={winners}
                onClose={() => router.push('/admin')}
                onRestart={handleRestartQuiz}
                showRestart={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
