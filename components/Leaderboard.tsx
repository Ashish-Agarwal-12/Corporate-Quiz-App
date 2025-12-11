'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardEntry } from '@/lib/types';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  showTop?: number;
}

export default function Leaderboard({ leaderboard, showTop = 5 }: LeaderboardProps) {
  const topPlayers = leaderboard.slice(0, showTop);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 w-full sm:min-w-[300px] border-2 border-white/30">
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        🏆 Leaderboard
      </h3>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.player_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-150 shadow-md ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-200 to-amber-300 border-2 border-yellow-500 shadow-xl scale-[1.02]'
                  : index === 1
                  ? 'bg-gradient-to-r from-slate-200 to-gray-300 border-2 border-gray-500 shadow-lg'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-200 to-orange-300 border-2 border-orange-500 shadow-lg'
                  : 'bg-gradient-to-r from-white to-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(player.rank)}
              </div>
              <div className="text-2xl">{player.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 truncate text-lg">
                  {player.username}
                </div>
              </div>
              <div className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {player.score.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
