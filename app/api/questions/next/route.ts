import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_id } = body;

    // Get current quiz state
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select(`
        *,
        questions (*)
      `)
      .eq('id', quiz_id)
      .order('order', { foreignTable: 'questions', ascending: true })
      .single();

    if (quizError) throw quizError;

    const nextIndex = quiz.current_question_index + 1;

    // Check if there are more questions
    if (nextIndex >= quiz.questions.length) {
      // Quiz completed - get top 3
      const { data: players, error: playersError } = await supabaseAdmin
        .from('players')
        .select('*')
        .eq('quiz_id', quiz_id)
        .order('score', { ascending: false })
        .limit(3);

      if (playersError) throw playersError;

      const top3 = players.map((p, index) => ({
        player_id: p.id,
        username: p.username,
        avatar: p.avatar,
        score: p.score,
        rank: index + 1,
      }));

      // Broadcast quiz completed event
      await broadcastToQuiz(quiz_id, 'quiz_completed', {
        top_3: top3,
      });

      // Clean up quiz data
      await supabaseAdmin.rpc('cleanup_completed_quiz', { quiz_id_param: quiz_id });

      return NextResponse.json({ completed: true, top_3: top3 });
    }

    // Update current question index
    await supabaseAdmin
      .from('quizzes')
      .update({ current_question_index: nextIndex })
      .eq('id', quiz_id);

    // Broadcast next question
    const nextQuestion = quiz.questions[nextIndex];
    
    console.log(`[API] Broadcasting question_changed for quiz ${quiz_id}, question ${nextIndex}`);
    
    const broadcastResult = await broadcastToQuiz(quiz_id, 'question_changed', {
      question: nextQuestion,
      index: nextIndex,
    });
    
    console.log('[API] Broadcast result:', broadcastResult);

    return NextResponse.json({ question: nextQuestion, index: nextIndex });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
