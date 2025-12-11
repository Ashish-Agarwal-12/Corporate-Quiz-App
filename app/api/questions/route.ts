import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('questions')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ question: data });
  } catch (error: any) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
