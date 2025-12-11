'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ArrowLeft, Save, Image as ImageIcon, Video, Music } from 'lucide-react';
import Logo from '@/components/Logo';
import PulsingBackground from '@/components/animations/PulsingBackground';
import toast, { Toaster } from 'react-hot-toast';
import { QuestionType } from '@/lib/types';

interface QuestionForm {
  question_text: string;
  question_type: QuestionType;
  media_url: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
  points: number;
}

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      question_text: '',
      question_type: 'text',
      media_url: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      time_limit: 60,
      points: 1000,
    },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'text',
        media_url: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        time_limit: 60,
        points: 1000,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1}: Please enter question text`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (response.ok) {
        toast.success('Quiz created successfully!');
        router.push('/admin');
      } else {
        toast.error('Failed to create quiz');
      }
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Toaster position="top-right" />
      <PulsingBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push('/admin')}>
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <Logo size="md" showText={false} animated={false} />
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Create New Quiz
            </h1>
          </div>
        </div>

        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                Quiz Title *
              </label>
              <Input
                placeholder="Enter quiz title..."
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
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {qIndex + 1}</CardTitle>
                    {questions.length > 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question Type */}
                  <div>
                    <label className="block text-base font-bold text-gray-800 mb-2">
                      Question Type
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={question.question_type === 'text' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(qIndex, 'question_type', 'text')}
                      >
                        📝 Text
                      </Button>
                      <Button
                        size="sm"
                        variant={question.question_type === 'image' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(qIndex, 'question_type', 'image')}
                      >
                        <ImageIcon className="w-4 h-4" /> Image
                      </Button>
                      <Button
                        size="sm"
                        variant={question.question_type === 'video' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(qIndex, 'question_type', 'video')}
                      >
                        <Video className="w-4 h-4" /> Video
                      </Button>
                      <Button
                        size="sm"
                        variant={question.question_type === 'audio' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(qIndex, 'question_type', 'audio')}
                      >
                        <Music className="w-4 h-4" /> Audio
                      </Button>
                    </div>
                  </div>

                  {/* Media URL */}
                  {question.question_type !== 'text' && (
                    <div>
                      <label className="block text-base font-bold text-gray-800 mb-2">
                        Media URL
                      </label>
                      <Input
                        placeholder="https://example.com/media.jpg"
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
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <span className="text-2xl">{['🔴', '🔵', '🟢', '🟡'][oIndex]}</span>
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          />
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correct_answer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                            className="w-5 h-5 text-purple-600"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
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
                        max="300"
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
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 sticky bottom-8">
          <Button onClick={addQuestion} variant="outline" size="lg">
            <Plus className="w-5 h-5" />
            Add Question
          </Button>
          <Button onClick={handleSave} size="lg" disabled={saving} className="flex-1">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
}
