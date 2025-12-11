'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRandomAvatar } from '@/lib/utils';
import PulsingBackground from '@/components/animations/PulsingBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const avatarOptions = [
  '🦊', '🐯', '🦁', '🐸', '🐵', '🐼', '🐨', '🐰', '🦝', '🐻',
  '🐷', '🐮', '🐶', '🐱', '🐭', '🐹', '🐺', '🦄', '🐙', '🦀',
  '🐠', '🐡', '🦈', '🐬', '🦭', '🐧', '🦩', '🦜', '🦚', '🦢'
];

export default function JoinQuiz() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(generateRandomAvatar());
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [code]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/code/${code}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      } else {
        toast.error('Quiz not found');
      }
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.length > 20) {
      toast.error('Username must be 20 characters or less');
      return;
    }

    setJoining(true);

    try {
      const response = await fetch('/api/players/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quiz?.id,
          username: username.trim(),
          avatar: selectedAvatar,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store player info in localStorage
        localStorage.setItem('player_id', data.player.id);
        localStorage.setItem('quiz_id', quiz?.id || '');
        
        toast.success('Joined successfully!');
        router.push(`/play/${quiz?.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to join quiz');
      }
    } catch (error) {
      toast.error('Failed to join quiz');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h2>
            <p className="text-gray-600">The quiz code "{code}" is invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Ended</h2>
            <p className="text-gray-600">This quiz has already been completed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <Toaster position="top-right" />
      <PulsingBackground />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎮
            </motion.div>
            <CardTitle className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join Quiz
            </CardTitle>
            <p className="text-2xl font-bold text-gray-800 mt-2">{quiz.title}</p>
            {quiz.description && (
              <p className="text-gray-600 mt-2">{quiz.description}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Your Username
              </label>
              <Input
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Avatar
              </label>
              <div className="grid grid-cols-10 gap-2">
                {avatarOptions.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-2 rounded-lg transition-all ${
                      selectedAvatar === avatar
                        ? 'bg-gradient-to-r from-purple-200 to-pink-200 ring-4 ring-purple-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-2">You will join as:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl">{selectedAvatar}</span>
                <span className="text-2xl font-bold text-gray-800">
                  {username || 'Your Name'}
                </span>
              </div>
            </div>

            {/* Join Button */}
            <Button
              size="lg"
              onClick={handleJoin}
              disabled={joining || !username.trim()}
              className="w-full"
            >
              {joining ? 'Joining...' : '🚀 Join Quiz'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
