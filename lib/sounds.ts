// Sound Effects Manager for MindLabz

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    // Don't initialize during SSR
    if (typeof window === 'undefined') return;
    
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize sounds
    this.loadSound('click', '/sounds/click.mp3');
    this.loadSound('success', '/sounds/success.mp3');
    this.loadSound('error', '/sounds/error.mp3');
    this.loadSound('correct', '/sounds/correct.mp3');
    this.loadSound('wrong', '/sounds/wrong.mp3');
    this.loadSound('timer', '/sounds/timer.mp3');
    this.loadSound('winner', '/sounds/winner.mp3');
    this.loadSound('join', '/sounds/join.mp3');
    this.loadSound('countdown', '/sounds/countdown.mp3');
    this.loadSound('whoosh', '/sounds/whoosh.mp3');
    
    // Check localStorage for sound preference
    try {
      const savedPreference = localStorage.getItem('soundEnabled');
      if (savedPreference !== null) {
        this.enabled = savedPreference === 'true';
      }
    } catch (error) {
      // localStorage might not be available
      console.warn('Could not access localStorage for sound preference');
    }
  }

  private loadSound(name: string, path: string) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.5; // Default volume
      this.sounds.set(name, audio);
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`);
    }
  }

  play(soundName: string, volume: number = 0.5) {
    if (typeof window === 'undefined') return;
    if (!this.initialized) this.initialize();
    if (!this.enabled) return;
    
    try {
      const sound = this.sounds.get(soundName);
      if (sound) {
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(err => {
          console.warn(`Failed to play sound: ${soundName}`, err);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound: ${soundName}`);
    }
  }

  toggle() {
    if (typeof window === 'undefined') return false;
    if (!this.initialized) this.initialize();
    
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('soundEnabled', String(this.enabled));
    } catch (error) {
      console.warn('Could not save sound preference');
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create singleton instance (lazy initialization)
let soundManagerInstance: SoundManager | null = null;

export const soundManager = typeof window !== 'undefined' 
  ? (soundManagerInstance || (soundManagerInstance = new SoundManager()))
  : null;

// Convenience functions
export const playSound = (name: string, volume?: number) => {
  soundManager?.play(name, volume);
};

export const toggleSound = () => {
  return soundManager?.toggle();
};

export const isSoundEnabled = () => {
  return soundManager?.isEnabled() ?? false;
};

// Sound event helpers
export const playSoundEffect = {
  click: () => playSound('click', 0.3),
  success: () => playSound('success', 0.6),
  error: () => playSound('error', 0.5),
  correct: () => playSound('correct', 0.7),
  wrong: () => playSound('wrong', 0.5),
  timer: () => playSound('timer', 0.4),
  winner: () => playSound('winner', 0.8),
  join: () => playSound('join', 0.5),
  countdown: () => playSound('countdown', 0.6),
  whoosh: () => playSound('whoosh', 0.4),
};
