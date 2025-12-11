'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
}

export default function FloatingEmoji({ emoji, delay = 0 }: FloatingEmojiProps) {
  const position = useMemo(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }), []);

  return (
    <motion.div
      className="absolute text-3xl pointer-events-none"
      initial={{ 
        x: `${position.x}%`, 
        y: `${position.y}%`,
        opacity: 0,
      }}
      animate={{
        y: [`${position.y}%`, `${position.y - 10}%`, `${position.y}%`],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear",
      }}
      style={{ transform: 'translateZ(0)' }}
    >
      {emoji}
    </motion.div>
  );
}
