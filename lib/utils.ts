import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomAvatar() {
  const avatars = [
    '🦊', '🐯', '🦁', '🐸', '🐵', '🐼', '🐨', '🐰', '🦝', '🐻',
    '🐷', '🐮', '🐶', '🐱', '🐭', '🐹', '🐺', '🦄', '🐙', '🦀',
    '🐠', '🐡', '🦈', '🐬', '🦭', '🐧', '🦩', '🦜', '🦚', '🦢'
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

export function generateQuizCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function calculateScore(timeRemaining: number, maxTime: number): number {
  const baseScore = 1000;
  const timeBonus = Math.floor((timeRemaining / maxTime) * 500);
  return baseScore + timeBonus;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
