export type QuestionType = 'text' | 'image' | 'video' | 'audio';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  code: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
  current_question_index: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  order: number;
  question_text: string;
  question_type: QuestionType;
  media_url?: string;
  options: string[];
  correct_answer: number; // index of correct option
  time_limit: number; // in seconds
  points: number;
  created_at: string;
}

export interface Player {
  id: string;
  quiz_id: string;
  username: string;
  avatar: string;
  score: number;
  joined_at: string;
  is_active: boolean;
}

export interface Answer {
  id: string;
  question_id: string;
  player_id: string;
  selected_option: number;
  time_taken: number; // in seconds
  points_earned: number;
  answered_at: string;
}

export interface QuizSession {
  quiz: Quiz;
  players: Player[];
  currentQuestion?: Question;
  answers: Answer[];
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  player_id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
}

export interface QuestionResult {
  question: Question;
  total_responses: number;
  option_percentages: number[];
  correct_answer: number;
  top_performers: LeaderboardEntry[];
}

export type QuizEvent = 
  | { type: 'player_joined'; data: Player }
  | { type: 'player_left'; data: { player_id: string } }
  | { type: 'quiz_started'; data: { question: Question } }
  | { type: 'question_changed'; data: { question: Question; index: number } }
  | { type: 'answer_submitted'; data: { player_id: string } }
  | { type: 'question_completed'; data: QuestionResult }
  | { type: 'quiz_completed'; data: { top_3: LeaderboardEntry[] } }
  | { type: 'quiz_stopped'; data: { top_3: LeaderboardEntry[] } }
  | { type: 'leaderboard_updated'; data: LeaderboardEntry[] };
