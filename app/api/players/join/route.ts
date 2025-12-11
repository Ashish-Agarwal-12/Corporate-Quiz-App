import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';
import { generateRandomAvatar } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_id, username, avatar } = body;

    // Check if quiz exists and is accepting players
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .select('status')
      .eq('id', quiz_id)
      .single();

    if (quizError) throw quizError;

    if (quiz.status === 'completed') {
      return NextResponse.json({ error: 'Quiz has ended' }, { status: 400 });
    }

    // Check if username is already taken
    const { data: existingPlayer } = await supabaseAdmin
      .from('players')
      .select('id')
      .eq('quiz_id', quiz_id)
      .eq('username', username)
      .single();

    if (existingPlayer) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Create player
    const { data: player, error: playerError } = await supabaseAdmin
      .from('players')
      .insert({
        quiz_id,
        username,
        avatar: avatar || generateRandomAvatar(),
        score: 0,
        is_active: true,
      })
      .select()
      .single();

    if (playerError) throw playerError;

    // Broadcast player joined event
    await broadcastToQuiz(quiz_id, 'player_joined', player);

    return NextResponse.json({ player }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
