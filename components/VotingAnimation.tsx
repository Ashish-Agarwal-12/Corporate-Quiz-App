'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const votingGifs = [
  '🤔', '💭', '🧠', '⚡', '🎯', '✨', '🔥', '💡'
];

const waitingMessages = [
  'Thinking hard...',
  'Calculating answers...',
  'Brain power activated!',
  'Knowledge in progress...',
  'Genius at work...',
  'Making tough choices...',
];

export default function VotingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % waitingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="text-8xl mb-6"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {votingGifs[messageIndex % votingGifs.length]}
      </motion.div>

      <motion.h2
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-bold text-gray-800 mb-4"
      >
        {waitingMessages[messageIndex]}
      </motion.h2>

      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-purple-600 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <p className="mt-6 text-lg text-gray-600">
        Waiting for other players to submit their answers...
      </p>
    </div>
  );
}
