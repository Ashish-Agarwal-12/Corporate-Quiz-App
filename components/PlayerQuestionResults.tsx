'use client';

import { motion } from 'framer-motion';
import { QuestionResult } from '@/lib/types';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { useEffect } from 'react';
import { playSoundEffect } from '@/lib/sounds';

interface PlayerQuestionResultsProps {
  result: QuestionResult;
  playerAnswer?: number | null;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export default function PlayerQuestionResults({ 
  result, 
  playerAnswer,
  isCorrect,
  pointsEarned 
}: PlayerQuestionResultsProps) {
  const options = result.question.options as string[];

  useEffect(() => {
    // Play appropriate sound
    if (isCorrect) {
      playSoundEffect.correct();
    } else if (playerAnswer !== null && playerAnswer !== undefined) {
      playSoundEffect.wrong();
    }
  }, [isCorrect, playerAnswer]);

  const optionEmojis = ['🔴', '🔵', '🟢', '🟡'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/30">
        {/* Player Feedback */}
        {playerAnswer !== null && playerAnswer !== undefined && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`mb-8 p-6 rounded-2xl ${
              isCorrect 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-500' 
                : 'bg-gradient-to-r from-red-100 to-rose-100 border-4 border-red-500'
            }`}
          >
            <div className="flex items-center justify-center gap-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-green-800">Correct! 🎉</h3>
                    <p className="text-xl text-green-700 mt-2">
                      You earned <span className="font-bold text-2xl">+{pointsEarned}</span> points!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-red-600" />
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-red-800">Wrong Answer</h3>
                    <p className="text-lg text-red-700 mt-2">Better luck next time!</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          📊 Question Results
        </h2>

        <div className="space-y-4 mb-8">
          {options.map((option, index) => {
            const percentage = result.option_percentages[index] || 0;
            const isCorrectAnswer = index === result.correct_answer;
            const isPlayerChoice = index === playerAnswer;
            const totalVotes = Math.round((percentage / 100) * result.total_responses);

            return (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl border-4 ${
                  isCorrectAnswer
                    ? 'border-green-500 bg-green-50'
                    : isPlayerChoice
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{optionEmojis[index]}</span>
                    <span className="font-semibold text-gray-800 text-lg">{option}</span>
                    {isCorrectAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {isPlayerChoice && !isCorrectAnswer && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    {isPlayerChoice && (
                      <span className="ml-2 px-3 py-1 bg-indigo-500 text-white text-sm font-bold rounded-full">
                        Your Answer
                      </span>
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
                    isCorrectAnswer
                      ? 'bg-gradient-to-r from-green-200 to-green-300'
                      : isPlayerChoice
                      ? 'bg-gradient-to-r from-red-200 to-red-300'
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
          
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border-2 border-indigo-300">
            <p className="text-lg font-bold text-indigo-800">
              ⏳ Waiting for next question...
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
