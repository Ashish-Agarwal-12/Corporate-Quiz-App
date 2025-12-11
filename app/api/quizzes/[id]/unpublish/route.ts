import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if quiz exists and is published
    const { data: existingQuiz, error: fetchError } = await supabaseAdmin
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' }, 
        { status: 404 }
      );
    }

    if (existingQuiz.status !== 'published') {
      return NextResponse.json(
        { error: 'Only published quizzes can be unpublished' }, 
        { status: 400 }
      );
    }

    // Update quiz status to draft
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .update({ 
        status: 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Unpublish error:', error);
      throw error;
    }

    return NextResponse.json({ 
      quiz: data, 
      success: true,
      message: 'Quiz unpublished successfully. You can now edit it.'
    });
  } catch (error: any) {
    console.error('Unpublish error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
