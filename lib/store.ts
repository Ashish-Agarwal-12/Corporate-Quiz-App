'use client';

import { create } from 'zustand';
import { Quiz, Player, Question, LeaderboardEntry, QuestionResult } from './types';

interface QuizStore {
  // Admin state
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  
  // Player state
  playerInfo: Player | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  hasAnswered: boolean;
  selectedOption: number | null;
  timeRemaining: number;
  
  // Shared state
  players: Player[];
  leaderboard: LeaderboardEntry[];
  questionResult: QuestionResult | null;
  isLoading: boolean;
  
  // Actions
  setQuizzes: (quizzes: Quiz[]) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setPlayerInfo: (player: Player | null) => void;
  setCurrentQuestion: (question: Question | null, index: number) => void;
  setHasAnswered: (hasAnswered: boolean) => void;
  setSelectedOption: (option: number | null) => void;
  setTimeRemaining: (time: number) => void;
  setPlayers: (players: Player[]) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setQuestionResult: (result: QuestionResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  resetQuizState: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  // Initial state
  quizzes: [],
  currentQuiz: null,
  playerInfo: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  hasAnswered: false,
  selectedOption: null,
  timeRemaining: 60,
  players: [],
  leaderboard: [],
  questionResult: null,
  isLoading: false,
  
  // Actions
  setQuizzes: (quizzes) => set({ quizzes }),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setPlayerInfo: (player) => set({ playerInfo: player }),
  setCurrentQuestion: (question, index) => set({ 
    currentQuestion: question, 
    currentQuestionIndex: index,
    hasAnswered: false,
    selectedOption: null,
    questionResult: null,
    timeRemaining: question?.time_limit || 60
  }),
  setHasAnswered: (hasAnswered) => set({ hasAnswered }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setPlayers: (players) => set({ players }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setQuestionResult: (result) => set({ questionResult: result }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  resetQuizState: () => set({
    currentQuiz: null,
    playerInfo: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    hasAnswered: false,
    selectedOption: null,
    timeRemaining: 60,
    players: [],
    leaderboard: [],
    questionResult: null,
  }),
}));
