import { supabaseAdmin } from './supabase';

export async function broadcastToQuiz(quizId: string, eventType: string, data: any) {
  try {
    // Get the channel name
    const channelName = `quiz:${quizId}`;
    
    console.log(`[Broadcast] Sending ${eventType} to ${channelName}`);
    
    // Create a temporary channel for broadcasting
    const channel = supabaseAdmin.channel(channelName);
    
    // Subscribe first (required before sending)
    await channel.subscribe();
    
    // Wait a bit for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Send the broadcast
    const result = await channel.send({
      type: 'broadcast',
      event: 'quiz_event',
      payload: {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`[Broadcast] Result:`, result);
    
    // Wait a bit before cleanup to ensure message is sent
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clean up
    await supabaseAdmin.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('[Broadcast] Error:', error);
    return { success: false, error };
  }
}
