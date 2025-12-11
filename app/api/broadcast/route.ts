import { NextRequest, NextResponse } from 'next/server';
import { broadcastToQuiz } from '@/lib/broadcast';

export async function POST(request: NextRequest) {
  try {
    const { quiz_id, type, data } = await request.json();

    if (!quiz_id || !type) {
      return NextResponse.json(
        { error: 'quiz_id and type are required' },
        { status: 400 }
      );
    }

    await broadcastToQuiz(quiz_id, type, data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
