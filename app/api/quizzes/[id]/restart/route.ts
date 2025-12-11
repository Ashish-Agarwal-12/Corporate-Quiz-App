import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if quiz exists and is completed
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' }, 
        { status: 404 }
      );
    }

    if (quiz.status !== 'completed') {
      return NextResponse.json(
        { error: 'Only completed quizzes can be restarted' }, 
        { status: 400 }
      );
    }

    // Get all question IDs for this quiz first
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id')
      .eq('quiz_id', id);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    }

    // Delete all answers for this quiz if questions exist
    if (questions && questions.length > 0) {
      const questionIds = questions.map(q => q.id);
      const { error: answersError } = await supabaseAdmin
        .from('answers')
        .delete()
        .in('question_id', questionIds);

      if (answersError) {
        console.error('Error deleting answers:', answersError);
      }
    }

    // Delete all players for this quiz
    const { error: playersError } = await supabaseAdmin
      .from('players')
      .delete()
      .eq('quiz_id', id);

    if (playersError) {
      console.error('Error deleting players:', playersError);
    }

    // Reset quiz status to published
    const { data: updatedQuiz, error: updateError } = await supabaseAdmin
      .from('quizzes')
      .update({ 
        status: 'published',
        current_question_index: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating quiz:', updateError);
      throw updateError;
    }

    // Broadcast quiz restarted event (if anyone is listening)
    try {
      await broadcastToQuiz(id, 'quiz_restarted', {
        quiz_id: id,
        message: 'Quiz has been restarted by host'
      });
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
      // Don't fail the request if broadcast fails
    }

    return NextResponse.json({ 
      success: true, 
      quiz: updatedQuiz,
      message: 'Quiz restarted successfully. Ready to host again!'
    });
  } catch (error: any) {
    console.error('Restart error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
