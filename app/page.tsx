'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PulsingBackground from '@/components/animations/PulsingBackground';
import FloatingEmoji from '@/components/animations/FloatingEmoji';
import Logo from '@/components/Logo';
import { Users, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SoundToggle from '@/components/SoundToggle';
import { playSoundEffect } from '@/lib/sounds';

export default function Home() {
  const router = useRouter();
  const [quizCode, setQuizCode] = useState('');

  const handleJoinQuiz = () => {
    if (!quizCode.trim()) {
      playSoundEffect.error();
      toast.error('Please enter a quiz code');
      return;
    }
    playSoundEffect.success();
    router.push(`/join/${quizCode.toUpperCase()}`);
  };

  const emojis = ['🎯', '🎮', '🏆', '⚡', '🌟', '🎪', '🎨', '🎭'];

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Toaster position="top-center" />
      <SoundToggle />
      <PulsingBackground />

      {/* Floating Emojis */}
      {emojis.map((emoji, i) => (
        <FloatingEmoji key={i} emoji={emoji} delay={i * 0.4} />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Brand Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="xl" animated={true} />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-3xl text-white/95 font-bold mb-3 drop-shadow-lg"
          >
            The Ultimate Interactive Quiz Experience
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-xl text-white/90 max-w-2xl mx-auto font-medium"
          >
            Unlock your mind's potential with real-time quizzes, live leaderboards, and stunning animations!
          </motion.p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-12">
          {/* Join Quiz Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all hover:scale-[1.02] border-white/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-10 h-10 text-indigo-600" />
                  <CardTitle className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Join a Quiz</CardTitle>
                </div>
                <CardDescription className="text-lg text-gray-700 font-medium">
                  Enter a quiz code to join the fun!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Quiz Code"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinQuiz()}
                  className="text-2xl text-center font-bold tracking-wider"
                  maxLength={6}
                />
                <Button 
                  size="lg" 
                  onClick={() => {
                    playSoundEffect.click();
                    handleJoinQuiz();
                  }} 
                  className="w-full"
                >
                  <Zap className="w-5 h-5" />
                  Join Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white/30"
        >
          <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✨ Amazing Features
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:scale-[1.02] transition-transform duration-200">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="font-bold text-gray-900 mb-3 text-xl">Real-Time Play</h3>
              <p className="text-base text-gray-700">
                Instant synchronization across all devices
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 hover:scale-[1.02] transition-transform duration-200">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="font-bold text-gray-900 mb-3 text-xl">Live Leaderboard</h3>
              <p className="text-base text-gray-700">
                Track rankings in real-time
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:scale-[1.02] transition-transform duration-200">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="font-bold text-gray-900 mb-3 text-xl">Rich Media</h3>
              <p className="text-base text-gray-700">
                Support for images, videos & audio
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:scale-[1.02] transition-transform duration-200">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="font-bold text-gray-900 mb-3 text-xl">Lightning Fast</h3>
              <p className="text-base text-gray-700">
                Optimized for 100+ players
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
