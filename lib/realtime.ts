'use client';

import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function getQuizChannel(quizId: string): string {
  return `quiz:${quizId}`;
}

export function subscribeToQuiz(
  quizId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(getQuizChannel(quizId))
    .on('broadcast', { event: 'quiz_event' }, callback)
    .subscribe();

  return channel;
}

export function unsubscribeFromQuiz(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

export async function broadcastQuizEvent(quizId: string, event: any) {
  const channel = supabase.channel(getQuizChannel(quizId));
  
  await channel.send({
    type: 'broadcast',
    event: 'quiz_event',
    payload: event,
  });
}
