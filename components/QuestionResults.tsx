'use client';

import { motion } from 'framer-motion';
import { QuestionResult } from '@/lib/types';
import { CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface QuestionResultsProps {
  result: QuestionResult;
}

export default function QuestionResults({ result }: QuestionResultsProps) {
  const options = result.question.options as string[];

  useEffect(() => {
    // Trigger confetti for correct answers
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const optionEmojis = ['🔴', '🔵', '🟢', '🟡'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          📊 Results
        </h2>

        <div className="space-y-4 mb-8">
          {options.map((option, index) => {
            const percentage = result.option_percentages[index] || 0;
            const isCorrect = index === result.correct_answer;
            const totalVotes = Math.round((percentage / 100) * result.total_responses);

            return (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl border-4 ${
                  isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{optionEmojis[index]}</span>
                    <span className="font-semibold text-gray-800">{option}</span>
                    {isCorrect && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Background */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`absolute inset-0 rounded-2xl ${
                    isCorrect
                      ? 'bg-gradient-to-r from-green-200 to-green-300'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300'
                  } opacity-50`}
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 mb-2">
            Total Responses: <span className="font-bold">{result.total_responses}</span>
          </p>
          
          {result.top_performers.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-3">🌟 Top Performers This Round</h3>
              <div className="flex justify-center gap-4">
                {result.top_performers.map((performer) => (
                  <div key={performer.player_id} className="text-center">
                    <div className="text-3xl mb-1">{performer.avatar}</div>
                    <div className="text-sm font-semibold">{performer.username}</div>
                    <div className="text-xs text-purple-600">+{performer.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
