'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/types';
import { Users } from 'lucide-react';
import FloatingEmoji from './animations/FloatingEmoji';

interface WaitingRoomProps {
  players: Player[];
  quizTitle: string;
}

export default function WaitingRoom({ players, quizTitle }: WaitingRoomProps) {
  const emojis = ['🎮', '🎯', '⚡', '🌟', '🎪', '🎨', '🎭', '🎸'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Floating Emojis Background */}
      {emojis.map((emoji, i) => (
        <FloatingEmoji key={i} emoji={emoji} delay={i * 0.3} />
      ))}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-8 z-10"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          {quizTitle}
        </h1>

        <motion.div
          className="text-2xl font-semibold text-gray-700"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ⏳ Waiting for quiz to start...
        </motion.div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-w-[600px]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Players Joined: {players.length}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl hover:scale-[1.05] transition-transform duration-150"
              >
                <div className="text-5xl">
                  {player.avatar}
                </div>
                <div className="text-sm font-semibold text-gray-800 text-center truncate w-full">
                  {player.username}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="flex gap-3 justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
