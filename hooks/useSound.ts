import { useEffect, useState } from 'react';
import { soundManager } from '@/lib/sounds';

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    setMounted(true);
    
    if (typeof window !== 'undefined' && soundManager) {
      setEnabled(soundManager.isEnabled());
    }
  }, []);

  const toggle = () => {
    if (!mounted || typeof window === 'undefined') return false;
    
    if (soundManager) {
      const newState = soundManager.toggle();
      setEnabled(newState);
      return newState;
    }
    return false;
  };

  const play = (soundName: string, volume?: number) => {
    if (!mounted || typeof window === 'undefined') return;
    soundManager?.play(soundName, volume);
  };

  return {
    enabled,
    toggle,
    play,
    mounted,
  };
}
