'use client';

import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/lib/types';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { playSoundEffect } from '@/lib/sounds';

interface WinnerCelebrationProps {
  winners: LeaderboardEntry[];
  onClose?: () => void;
  onRestart?: () => void;
  showRestart?: boolean;
}

export default function WinnerCelebration({ winners, onClose, onRestart, showRestart = false }: WinnerCelebrationProps) {
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Play winner celebration sound
    playSoundEffect.winner();
    
    // Continuous confetti
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333ea', '#ec4899', '#3b82f6'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9333ea', '#ec4899', '#3b82f6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const getPodiumHeight = (rank: number) => {
    if (rank === 1) return 'h-48';
    if (rank === 2) return 'h-36';
    return 'h-24';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-12 h-12 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-10 h-10 text-gray-400" />;
    return <Award className="w-8 h-8 text-orange-600" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-300 via-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-gray-300 via-gray-400 to-gray-500';
    return 'from-orange-300 via-orange-400 to-orange-500';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          className="text-9xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Quiz Complete!
        </h1>
        <p className="text-2xl text-gray-700 font-semibold">
          Congratulations to our winners! 🏆
        </p>
      </motion.div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-8 mb-12">
        {/* 2nd Place */}
        {winners[1] && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              {getRankIcon(2)}
            </motion.div>
            <div className="text-6xl mb-2">{winners[1].avatar}</div>
            <div className="font-bold text-lg text-gray-800 mb-2">
              {winners[1].username}
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-4">
              {winners[1].score.toLocaleString()}
            </div>
            <div className={`w-32 ${getPodiumHeight(2)} bg-gradient-to-t ${getRankColor(2)} rounded-t-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl`}>
              2nd
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {winners[0] && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              {getRankIcon(1)}
            </motion.div>
            <div className="text-8xl mb-2">{winners[0].avatar}</div>
            <div className="font-bold text-2xl text-gray-800 mb-2">
              {winners[0].username}
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-4">
              {winners[0].score.toLocaleString()}
            </div>
            <div className={`w-40 ${getPodiumHeight(1)} bg-gradient-to-t ${getRankColor(1)} rounded-t-2xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl`}>
              1st
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {winners[2] && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="mb-4"
            >
              {getRankIcon(3)}
            </motion.div>
            <div className="text-5xl mb-2">{winners[2].avatar}</div>
            <div className="font-bold text-base text-gray-800 mb-2">
              {winners[2].username}
            </div>
            <div className="text-xl font-bold text-purple-600 mb-4">
              {winners[2].score.toLocaleString()}
            </div>
            <div className={`w-28 ${getPodiumHeight(3)} bg-gradient-to-t ${getRankColor(3)} rounded-t-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl`}>
              3rd
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center space-y-4"
      >
        <p className="text-xl text-gray-700">
          🎊 Thank you for playing! 🎊
        </p>
        <div className="flex gap-4 justify-center">
          {showRestart && onRestart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSoundEffect.click();
                onRestart?.();
              }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              🔄 Restart Quiz
            </motion.button>
          )}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSoundEffect.click();
                onClose?.();
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
