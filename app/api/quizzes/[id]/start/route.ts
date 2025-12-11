import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get quiz with questions
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select(`
        *,
        questions (*)
      `)
      .eq('id', id)
      .order('order', { foreignTable: 'questions', ascending: true })
      .single();

    if (quizError) throw quizError;

    if (!quiz.questions || quiz.questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 400 });
    }

    // Update quiz status to active
    const { error: updateError } = await supabaseAdmin
      .from('quizzes')
      .update({ status: 'active', current_question_index: 0 })
      .eq('id', id);

    if (updateError) throw updateError;

    // Broadcast quiz started event with first question
    await broadcastToQuiz(id, 'quiz_started', {
      question: quiz.questions[0],
    });

    return NextResponse.json({ success: true, firstQuestion: quiz.questions[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
