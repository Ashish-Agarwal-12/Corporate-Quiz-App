'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import PulsingBackground from '@/components/animations/PulsingBackground';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, User } from 'lucide-react';
import SoundToggle from '@/components/SoundToggle';
import { playSoundEffect } from '@/lib/sounds';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication (you should replace this with proper auth)
    if (username === 'admin' && password === 'admin123') {
      // Set session/cookie
      localStorage.setItem('adminAuth', 'true');
      
      // Set cookie for middleware
      document.cookie = 'adminAuth=true; path=/; max-age=86400'; // 24 hours
      
      playSoundEffect.success();
      toast.success('Welcome to MindLabz Admin!');
      
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } else {
      playSoundEffect.error();
      toast.error('Invalid credentials. Try admin/admin123');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Toaster position="top-center" />
      <SoundToggle />
      <PulsingBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Logo size="xl" animated={true} />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/90 text-lg font-medium"
          >
            Unlock Your Mind's Potential
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <Card className="border-white/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-base text-gray-700">
              Sign in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200"
            >
              <p className="text-sm text-gray-700 text-center font-medium">
                <span className="text-indigo-600 font-bold">Demo Credentials:</span>
                <br />
                Username: <code className="bg-white px-2 py-1 rounded text-indigo-600 font-bold">admin</code>
                <br />
                Password: <code className="bg-white px-2 py-1 rounded text-indigo-600 font-bold">admin123</code>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => router.push('/')}
            className="text-white/90 hover:text-white font-medium underline"
          >
            ← Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
