'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Progress } from './ui/progress';

interface QuizTimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
}

export default function QuizTimer({ timeRemaining, totalTime, onTimeUp }: QuizTimerProps) {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const percentage = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className={`flex items-center justify-center gap-3 mb-4 ${
          isLowTime ? 'text-red-600' : 'text-purple-600'
        }`}
        animate={isLowTime ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
      >
        <Clock className="w-8 h-8" />
        <span className="text-5xl font-bold">
          {formatTime(timeRemaining)}
        </span>
      </motion.div>

      <div className="relative">
        <Progress 
          value={timeRemaining} 
          max={totalTime}
          className={`h-6 ${
            isLowTime ? 'animate-pulse' : ''
          }`}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {isLowTime && (
        <motion.p
          className="text-center mt-2 text-red-600 font-bold"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚠️ Hurry up!
        </motion.p>
      )}
    </div>
  );
}
