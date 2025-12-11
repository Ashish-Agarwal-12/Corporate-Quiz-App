import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const { data, error } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ players: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
