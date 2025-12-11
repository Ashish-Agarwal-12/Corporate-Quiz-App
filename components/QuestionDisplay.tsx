'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/types';
import { Button } from './ui/button';
import { Image as ImageIcon, Video, Music } from 'lucide-react';
import Image from 'next/image';
import { playSoundEffect } from '@/lib/sounds';

interface QuestionDisplayProps {
  question: Question;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  hasAnswered: boolean;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionDisplay({
  question,
  selectedOption,
  onSelectOption,
  hasAnswered,
  currentIndex,
  totalQuestions,
}: QuestionDisplayProps) {
  const options = question.options as string[];

  const optionColors = [
    'from-red-500 to-rose-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
  ];

  const optionEmojis = ['🔴', '🔵', '🟢', '🟡'];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <span className="text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-2xl shadow-lg">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-6 border-2 border-white/30">
        {/* Media Display */}
        {question.media_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-6 rounded-xl overflow-hidden"
          >
            {question.question_type === 'image' && (
              <div className="relative w-full h-64 bg-gray-100">
                <Image
                  src={question.media_url}
                  alt="Question media"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            {question.question_type === 'video' && (
              <video
                src={question.media_url}
                controls
                className="w-full max-h-64 rounded-xl"
              />
            )}
            {question.question_type === 'audio' && (
              <div className="flex items-center justify-center gap-4 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <Music className="w-12 h-12 text-purple-600" />
                <audio src={question.media_url} controls className="flex-1" />
              </div>
            )}
          </motion.div>
        )}

        {/* Question Text */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {question.question_text}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.15 }}
              whileHover={!hasAnswered ? { scale: 1.02 } : {}}
              whileTap={!hasAnswered ? { scale: 0.98 } : {}}
              onClick={() => {
                if (!hasAnswered) {
                  playSoundEffect.click();
                  onSelectOption(index);
                }
              }}
              disabled={hasAnswered}
              className={`relative p-6 rounded-2xl font-semibold text-lg transition-all ${
                selectedOption === index
                  ? `bg-gradient-to-r ${optionColors[index]} text-white shadow-2xl scale-105`
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${hasAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{optionEmojis[index]}</span>
                <span className="flex-1 text-left">{option}</span>
                {selectedOption === index && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {!hasAnswered && selectedOption !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-green-600 font-bold text-lg"
        >
          ✅ Answer locked in! Waiting for others...
        </motion.div>
      )}
    </motion.div>
  );
}
