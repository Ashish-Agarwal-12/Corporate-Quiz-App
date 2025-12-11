import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) throw error;

    return NextResponse.json({ quiz: data });
  } catch (error: any) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }
}
