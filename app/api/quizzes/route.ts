import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuizCode } from '@/lib/utils';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .select(`
        *,
        questions (
          id,
          order,
          question_text,
          question_type,
          media_url,
          options,
          time_limit,
          points
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ quizzes: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, questions } = body;

    // Generate unique quiz code
    const code = generateQuizCode();

    // Insert quiz
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .insert({
        title,
        description,
        code,
        status: 'draft',
      })
      .select()
      .single();

    if (quizError) throw quizError;

    // Insert questions
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, index: number) => ({
        quiz_id: quiz.id,
        order: index,
        question_text: q.question_text,
        question_type: q.question_type || 'text',
        media_url: q.media_url || null,
        options: q.options,
        correct_answer: q.correct_answer,
        time_limit: q.time_limit || 60,
        points: q.points || 1000,
      }));

      const { error: questionsError } = await supabaseAdmin
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
