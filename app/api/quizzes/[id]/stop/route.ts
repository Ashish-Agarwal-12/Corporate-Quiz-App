import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { broadcastToQuiz } from '@/lib/broadcast';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get top 3 players
    const { data: players, error: playersError } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('quiz_id', id)
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

    // Broadcast quiz stopped event
    await broadcastToQuiz(id, 'quiz_stopped', {
      top_3: top3,
    });

    // Clean up quiz data
    await supabaseAdmin.rpc('cleanup_completed_quiz', { quiz_id_param: id });

    return NextResponse.json({ success: true, top_3: top3 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
