'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ArrowLeft, Save, Image as ImageIcon, Video, Music } from 'lucide-react';
import Logo from '@/components/Logo';
import PulsingBackground from '@/components/animations/PulsingBackground';
import SoundToggle from '@/components/SoundToggle';
import { playSoundEffect } from '@/lib/sounds';
import toast, { Toaster } from 'react-hot-toast';

interface Question {
  id?: string;
  question_text: string;
  question_type: 'text' | 'image' | 'video' | 'audio';
  media_url: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
  points: number;
  order: number;
}

export default function EditQuiz() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('adminAuth');
    if (!authStatus) {
      router.push('/admin/login');
      return;
    }
    
    fetchQuiz();
  }, [quizId, router]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      const data = await response.json();
      
      if (data.quiz) {
        setTitle(data.quiz.title);
        setDescription(data.quiz.description || '');
        
        // Convert questions to editable format
        const formattedQuestions = data.quiz.questions.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          media_url: q.media_url || '',
          options: q.options,
          correct_answer: q.correct_answer,
          time_limit: q.time_limit,
          points: q.points,
          order: q.order,
        }));
        
        setQuestions(formattedQuestions);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      setLoading(false);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    playSoundEffect.click();
    const newQuestion: Question = {
      question_text: '',
      question_type: 'text',
      media_url: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      time_limit: 30,
      points: 1000,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    playSoundEffect.click();
    if (confirm('Are you sure you want to remove this question?')) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Update order
      newQuestions.forEach((q, i) => {
        q.order = i;
      });
      setQuestions(newQuestions);
    }
  };

  const validateQuiz = () => {
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return false;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1}: Please enter question text`);
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateQuiz()) return;

    playSoundEffect.click();
    setLoading(true);

    try {
      // Update quiz details
      const quizResponse = await fetch(`/api/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to update quiz');
      }

      // Delete existing questions
      for (const question of questions) {
        if (question.id) {
          await fetch(`/api/questions/${question.id}`, {
            method: 'DELETE',
          });
        }
      }

      // Create updated questions
      for (const question of questions) {
        await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quiz_id: quizId,
            ...question,
          }),
        });
      }

      playSoundEffect.success();
      toast.success('Quiz updated successfully!');
      
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (error) {
      playSoundEffect.error();
      toast.error('Failed to update quiz');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Toaster position="top-right" />
      <SoundToggle />
      <PulsingBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Logo size="sm" showText={false} animated={false} className="sm:hidden" />
            <Logo size="md" showText={false} animated={false} className="hidden sm:flex" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              Edit Quiz
            </h1>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                Quiz Title *
              </label>
              <Input
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                className="flex w-full rounded-xl border-2 border-indigo-300 bg-white/95 backdrop-blur px-5 py-4 text-base font-medium transition-all duration-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none hover:border-indigo-400 shadow-md"
                placeholder="Enter quiz description..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="border-2 border-indigo-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Question {qIndex + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Question Type */}
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-2">
                    Question Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'text', label: 'Text', icon: '📝' },
                      { value: 'image', label: 'Image', icon: '🖼️' },
                      { value: 'video', label: 'Video', icon: '🎥' },
                      { value: 'audio', label: 'Audio', icon: '🎵' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateQuestion(qIndex, 'question_type', type.value)}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          question.question_type === type.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 bg-white hover:border-indigo-400'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media URL */}
                {question.question_type !== 'text' && (
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-2">
                      Media URL
                    </label>
                    <Input
                      placeholder={`Enter ${question.question_type} URL`}
                      value={question.media_url}
                      onChange={(e) => updateQuestion(qIndex, 'media_url', e.target.value)}
                    />
                  </div>
                )}

                {/* Question Text */}
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-2">
                    Question *
                  </label>
                  <textarea
                    className="flex w-full rounded-xl border-2 border-indigo-300 bg-white/95 backdrop-blur px-5 py-4 text-base font-medium transition-all duration-200 placeholder:text-gray-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 focus:outline-none hover:border-indigo-400 shadow-md"
                    placeholder="Enter your question..."
                    rows={2}
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-2">
                    Options *
                  </label>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correct_answer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                          className="w-5 h-5 text-green-600"
                        />
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className={question.correct_answer === oIndex ? 'border-green-500' : ''}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Select the radio button to mark the correct answer
                  </p>
                </div>

                {/* Time and Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-2">
                      Time Limit (seconds)
                    </label>
                    <Input
                      type="number"
                      min="10"
                      max="120"
                      value={question.time_limit}
                      onChange={(e) => updateQuestion(qIndex, 'time_limit', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-2">
                      Base Points
                    </label>
                    <Input
                      type="number"
                      min="100"
                      max="10000"
                      step="100"
                      value={question.points}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Question Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={addQuestion}
          className="w-full mb-6"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </Button>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
