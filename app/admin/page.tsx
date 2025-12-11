'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Edit, Trash2, Eye, RotateCcw, LogOut, FileEdit } from 'lucide-react';
import Logo from '@/components/Logo';
import PulsingBackground from '@/components/animations/PulsingBackground';
import toast, { Toaster } from 'react-hot-toast';
import SoundToggle from '@/components/SoundToggle';
import { playSoundEffect } from '@/lib/sounds';

export default function AdminDashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('adminAuth');
    if (!authStatus) {
      router.push('/admin/login');
      return;
    }
    fetchQuizzes();
  }, [router]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (quizId: string) => {
    try {
      playSoundEffect.click();
      const response = await fetch(`/api/quizzes/${quizId}/publish`, {
        method: 'POST',
      });
      
      if (response.ok) {
        playSoundEffect.success();
        toast.success('Quiz published successfully!');
        fetchQuizzes();
      } else {
        playSoundEffect.error();
        toast.error('Failed to publish quiz');
      }
    } catch (error) {
      playSoundEffect.error();
      toast.error('Failed to publish quiz');
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      playSoundEffect.click();
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        playSoundEffect.error();
        toast.success('Quiz deleted successfully!');
        fetchQuizzes();
      } else {
        playSoundEffect.error();
        toast.error('Failed to delete quiz');
      }
    } catch (error) {
      playSoundEffect.error();
      toast.error('Failed to delete quiz');
    }
  };

  const handleRestart = async (quizId: string) => {
    if (!confirm('Are you sure you want to restart this quiz? All player data will be cleared and the quiz will be ready to host again.')) return;

    try {
      playSoundEffect.click();
      const response = await fetch(`/api/quizzes/${quizId}/restart`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        playSoundEffect.success();
        toast.success(data.message || 'Quiz restarted successfully!');
        fetchQuizzes();
      } else {
        const errorData = await response.json();
        playSoundEffect.error();
        toast.error(errorData.error || 'Failed to restart quiz');
      }
    } catch (error) {
      playSoundEffect.error();
      toast.error('Failed to restart quiz');
    }
  };

  const handleUnpublish = async (quizId: string) => {
    if (!confirm('Unpublish this quiz? It will return to draft status and you can edit it.')) return;

    try {
      playSoundEffect.click();
      const response = await fetch(`/api/quizzes/${quizId}/unpublish`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        playSoundEffect.success();
        toast.success(data.message || 'Quiz unpublished successfully!');
        fetchQuizzes();
      } else {
        const errorData = await response.json();
        playSoundEffect.error();
        toast.error(errorData.error || 'Failed to unpublish quiz');
      }
    } catch (error) {
      playSoundEffect.error();
      toast.error('Failed to unpublish quiz');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      playSoundEffect.whoosh();
      localStorage.removeItem('adminAuth');
      document.cookie = 'adminAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      toast.success('Logged out successfully');
      setTimeout(() => {
        router.push('/');
      }, 300);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg',
      published: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg',
      active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg animate-pulse',
      completed: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg',
    };
    return (
      <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Toaster position="top-right" />
      <SoundToggle />
      <PulsingBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Logo size="sm" showText={false} animated={false} className="sm:hidden" />
            <Logo size="md" showText={true} animated={false} className="hidden sm:flex" />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Admin Dashboard
              </h1>
              <p className="text-white/90 mt-1 text-sm sm:text-base font-medium">Create and manage your quizzes</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => router.push('/admin/create')}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create New Quiz</span>
              <span className="sm:hidden">Create Quiz</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              Logout
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl"
          >
            <div className="text-8xl mb-4">📝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">No quizzes yet</h2>
            <p className="text-gray-600 text-lg mb-6">Create your first quiz to get started!</p>
            <Button onClick={() => router.push('/admin/create')} size="lg">
              <Plus className="w-5 h-5" />
              Create Quiz
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-3xl transition-all hover:scale-[1.02] border-white/30">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{quiz.title}</CardTitle>
                      {getStatusBadge(quiz.status)}
                    </div>
                    <CardDescription className="text-base text-gray-700">
                      {quiz.description || 'No description provided'}
                    </CardDescription>
                    <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                      <span className="text-sm text-gray-700">Quiz Code: </span>
                      <span className="font-bold text-2xl text-indigo-600 tracking-wider">{quiz.code}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-base text-gray-700 mb-4 font-medium">
                      <span className="text-2xl">📝</span>
                      <span>{quiz.questions?.length || 0} Questions</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {quiz.status === 'draft' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/edit/${quiz.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePublish(quiz.id)}
                          >
                            <Eye className="w-4 h-4" />
                            Publish
                          </Button>
                        </>
                      )}
                      {quiz.status === 'published' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/admin/host/${quiz.id}`)}
                          >
                            <Play className="w-4 h-4" />
                            Start Quiz
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUnpublish(quiz.id)}
                          >
                            <FileEdit className="w-4 h-4" />
                            Unpublish
                          </Button>
                        </>
                      )}
                      {quiz.status === 'active' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => router.push(`/admin/host/${quiz.id}`)}
                        >
                          <Play className="w-4 h-4" />
                          Join Active
                        </Button>
                      )}
                      {quiz.status === 'completed' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleRestart(quiz.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restart
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(quiz.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </>
                      )}
                      {quiz.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
