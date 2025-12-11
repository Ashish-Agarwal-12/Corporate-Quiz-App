import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const { data: players, error } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('is_active', true)
      .order('score', { ascending: false });

    if (error) throw error;

    const leaderboard = players.map((player, index) => ({
      player_id: player.id,
      username: player.username,
      avatar: player.avatar,
      score: player.score,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
