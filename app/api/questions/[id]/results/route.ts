import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get question
    const { data: question, error: questionError } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (questionError) throw questionError;

    // Get all answers for this question
    const { data: answers, error: answersError } = await supabaseAdmin
      .from('answers')
      .select(`
        *,
        players (username, avatar, score)
      `)
      .eq('question_id', id);

    if (answersError) throw answersError;

    // Calculate option percentages
    const totalResponses = answers.length;
    const optionCounts = new Array(question.options.length).fill(0);
    
    answers.forEach((answer: any) => {
      optionCounts[answer.selected_option]++;
    });

    const optionPercentages = optionCounts.map(count => 
      totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
    );

    // Get top performers for this question
    const topPerformers = answers
      .sort((a: any, b: any) => b.points_earned - a.points_earned)
      .slice(0, 3)
      .map((answer: any, index: number) => ({
        player_id: answer.player_id,
        username: answer.players.username,
        avatar: answer.players.avatar,
        score: answer.players.score,
        rank: index + 1,
      }));

    return NextResponse.json({
      question,
      total_responses: totalResponses,
      option_percentages: optionPercentages,
      correct_answer: question.correct_answer,
      top_performers: topPerformers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
