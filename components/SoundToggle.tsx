'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render on server
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-xl p-4 rounded-full shadow-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all"
      title={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="w-6 h-6 text-indigo-600" />
      ) : (
        <VolumeX className="w-6 h-6 text-gray-400" />
      )}
    </motion.button>
  );
}
