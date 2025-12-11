import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';
import { calculateScore } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question_id, player_id, selected_option, time_taken, quiz_id } = body;

    // Get question details
    const { data: question, error: questionError } = await supabaseAdmin
      .from('questions')
      .select('*, quiz_id')
      .eq('id', question_id)
      .single();

    if (questionError) throw questionError;

    // Calculate points
    const isCorrect = selected_option === question.correct_answer;
    const points_earned = isCorrect ? calculateScore(question.time_limit - time_taken, question.time_limit) : 0;

    // Insert answer
    const { data: answer, error: answerError } = await supabaseAdmin
      .from('answers')
      .insert({
        question_id,
        player_id,
        selected_option,
        time_taken,
        points_earned,
      })
      .select()
      .single();

    if (answerError) throw answerError;

    // Update player score
    const { data: player, error: playerError } = await supabaseAdmin
      .from('players')
      .select('score')
      .eq('id', player_id)
      .single();

    if (playerError) throw playerError;

    const newScore = player.score + points_earned;

    await supabaseAdmin
      .from('players')
      .update({ score: newScore })
      .eq('id', player_id);

    // Broadcast answer submitted event
    await broadcastToQuiz(quiz_id, 'answer_submitted', {
      player_id,
    });

    return NextResponse.json({ answer, points_earned, is_correct: isCorrect });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
