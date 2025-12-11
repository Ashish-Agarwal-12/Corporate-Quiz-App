'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz, Player, Question, LeaderboardEntry, QuestionResult } from '@/lib/types';
import { subscribeToQuiz, unsubscribeFromQuiz } from '@/lib/realtime';
import { RealtimeChannel } from '@supabase/supabase-js';
import WaitingRoom from '@/components/WaitingRoom';
import QuestionDisplay from '@/components/QuestionDisplay';
import QuizTimer from '@/components/QuizTimer';
import QuestionResults from '@/components/QuestionResults';
import PlayerQuestionResults from '@/components/PlayerQuestionResults';
import WinnerCelebration from '@/components/WinnerCelebration';
import Leaderboard from '@/components/Leaderboard';
import VotingAnimation from '@/components/VotingAnimation';
import PulsingBackground from '@/components/animations/PulsingBackground';
import SoundToggle from '@/components/SoundToggle';
import toast, { Toaster } from 'react-hot-toast';

type PlayerView = 'waiting' | 'question' | 'voted' | 'results' | 'complete';

export default function PlayQuiz() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentView, setCurrentView] = useState<PlayerView>('waiting');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  const [winners, setWinners] = useState<LeaderboardEntry[]>([]);
  useEffect(() => {
    const playerId = localStorage.getItem('player_id');
    const storedQuizId = localStorage.getItem('quiz_id');

    if (!playerId || storedQuizId !== quizId) {
      router.push('/');
      return;
    }

    fetchQuiz();
    fetchPlayers();
    fetchPlayerInfo(playerId);
  }, [quizId]);

  useEffect(() => {
    console.log(`[Player] Subscribing to quiz: ${quizId}`);
    
    const channel = subscribeToQuiz(quizId, (payload) => {
      console.log('[Player] Received event:', payload);
      const { type, data } = payload.payload;

      console.log(`[Player] Processing event type: ${type}`);

      switch (type) {
        case 'player_joined':
          setPlayers((prev) => [...prev, data]);
          break;
        case 'quiz_started':
          console.log('[Player] Quiz started, showing question');
          setCurrentQuestion(data.question);
          setCurrentQuestionIndex(0);
          setTimeRemaining(data.question.time_limit);
          setSelectedOption(null);
          setHasAnswered(false);
          setCurrentView('question');
          toast.success('Quiz started!', { icon: '🚀' });
          break;
        case 'question_changed':
          console.log('[Player] Question changed, showing new question');
          setCurrentQuestion(data.question);
          setCurrentQuestionIndex(data.index);
          setTimeRemaining(data.question.time_limit);
          setSelectedOption(null);
          setHasAnswered(false);
          setQuestionResult(null);
          setCurrentView('question');
          toast.success('Next question!', { icon: '➡️' });
          break;
        case 'question_completed':
          console.log('[Player] Question completed, showing results');
          setQuestionResult(data);
          fetchLeaderboard();
          
          // Get player's answer from localStorage
          const storedAnswer = localStorage.getItem(`answer_${data.question.id}`);
          if (storedAnswer) {
            const answerData = JSON.parse(storedAnswer);
            // Store for PlayerQuestionResults component
            setSelectedOption(answerData.selectedOption);
          }
          
          setCurrentView('results');
          break;
        case 'quiz_completed':
          console.log('[Player] Quiz completed');
          setWinners(data.top_3);
          setCurrentView('complete');
          localStorage.removeItem('player_id');
          localStorage.removeItem('quiz_id');
          break;
        case 'quiz_stopped':
          console.log('[Player] Quiz stopped by admin');
          setWinners(data.top_3);
          setCurrentView('complete');
          toast('Quiz stopped by admin', { icon: '⏹️' });
          localStorage.removeItem('player_id');
          localStorage.removeItem('quiz_id');
          break;
        case 'leaderboard_updated':
          setLeaderboard(data);
          break;
        default:
          console.log(`[Player] Unknown event type: ${type}`);
      }
    });

    return () => {
      console.log('[Player] Unsubscribing from quiz');
      unsubscribeFromQuiz(channel);
    };
  }, [quizId]);

  useEffect(() => {
    if (currentView === 'question' && timeRemaining > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (!hasAnswered && selectedOption !== null) {
              handleSubmitAnswer();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentView, timeRemaining, hasAnswered, selectedOption]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      const data = await response.json();
      setQuiz(data.quiz);
    } catch (error) {
      toast.error('Failed to load quiz');
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

  const fetchPlayerInfo = async (playerId: string) => {
    try {
      const response = await fetch(`/api/players/${quizId}`);
      const data = await response.json();
      const playerData = data.players?.find((p: Player) => p.id === playerId);
      setPlayer(playerData || null);
    } catch (error) {
      console.error('Failed to fetch player info');
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

  const handleSelectOption = (index: number) => {
    if (!hasAnswered) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = useCallback(async () => {
    if (hasAnswered || selectedOption === null || !currentQuestion || !player) return;

    setHasAnswered(true);
    setCurrentView('voted');

    const timeTaken = currentQuestion.time_limit - timeRemaining;

    try {
      const response = await fetch('/api/answers/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          player_id: player.id,
          selected_option: selectedOption,
          time_taken: timeTaken,
          quiz_id: quizId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store answer for later display in results
        localStorage.setItem(`answer_${currentQuestion.id}`, JSON.stringify({
          isCorrect: data.is_correct,
          pointsEarned: data.points_earned,
          selectedOption: selectedOption,
        }));
        
        if (data.is_correct) {
          toast.success(`Correct! +${data.points_earned} points! 🎉`, { duration: 3000 });
        } else {
          toast.error('Wrong answer', { icon: '❌' });
        }
        
        fetchLeaderboard();
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  }, [hasAnswered, selectedOption, currentQuestion, player, timeRemaining, quizId]);

  // Auto-submit when option is selected
  useEffect(() => {
    if (selectedOption !== null && !hasAnswered && currentView === 'question') {
      handleSubmitAnswer();
    }
  }, [selectedOption]);

  if (!quiz || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Toaster position="top-center" />
      <SoundToggle />
      <PulsingBackground />

      {/* Player Info */}
      <div className="fixed top-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-3xl">{player.avatar}</span>
        <div>
          <div className="font-semibold text-gray-800">{player.username}</div>
          <div className="text-sm text-purple-600">Score: {player.score}</div>
        </div>
      </div>

      <div className="relative z-10 p-8 pt-20">
        <AnimatePresence mode="wait">
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
                    onTimeUp={() => {}}
                  />
                  <QuestionDisplay
                    question={currentQuestion}
                    selectedOption={selectedOption}
                    onSelectOption={handleSelectOption}
                    hasAnswered={hasAnswered}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={quiz.questions?.length || 0}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard leaderboard={leaderboard} showTop={5} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Voted - Waiting for Results */}
          {currentView === 'voted' && (
            <motion.div
              key="voted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <VotingAnimation />
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
                <div className="lg:col-span-3">
                  {(() => {
                    const storedAnswer = localStorage.getItem(`answer_${questionResult.question.id}`);
                    if (storedAnswer) {
                      const answerData = JSON.parse(storedAnswer);
                      return (
                        <PlayerQuestionResults 
                          result={questionResult}
                          playerAnswer={answerData.selectedOption}
                          isCorrect={answerData.isCorrect}
                          pointsEarned={answerData.pointsEarned}
                        />
                      );
                    }
                    return <QuestionResults result={questionResult} />;
                  })()}
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard leaderboard={leaderboard} showTop={5} />
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
                onClose={() => router.push('/')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
