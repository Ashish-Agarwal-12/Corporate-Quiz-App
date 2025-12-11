'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, animated = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', container: 'gap-1' },
    md: { icon: 32, text: 'text-2xl', container: 'gap-2' },
    lg: { icon: 48, text: 'text-4xl', container: 'gap-3' },
    xl: { icon: 64, text: 'text-5xl', container: 'gap-4' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Brain Icon Logo */}
      <motion.div
        initial={animated ? { scale: 0, rotate: -180 } : {}}
        animate={animated ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {/* Outer Circle */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          {/* Circle Background */}
          <circle cx="50" cy="50" r="45" fill="url(#brainGradient)" opacity="0.2" />
          
          {/* Brain Shape */}
          <path
            d="M50 20 C35 20, 25 30, 25 42 C25 48, 27 53, 30 57 C28 60, 27 64, 27 68 C27 76, 33 82, 41 82 C43 82, 45 81.5, 47 81 C48 83, 50 85, 53 85 C56 85, 58 83, 59 81 C61 81.5, 63 82, 65 82 C73 82, 79 76, 79 68 C79 64, 78 60, 76 57 C79 53, 81 48, 81 42 C81 30, 71 20, 56 20 C54 20, 52 20, 50 20 Z"
            fill="url(#brainGradient)"
            stroke="url(#brainGradient)"
            strokeWidth="2"
          />
          
          {/* Brain Wrinkles/Details */}
          <path
            d="M35 35 Q40 38, 45 35"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M55 35 Q60 38, 65 35"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M40 45 Q45 48, 50 45"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M55 45 Q60 48, 65 45"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M35 55 Q40 58, 45 55"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M55 55 Q60 58, 65 55"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          
          {/* Lightning Bolt for "Lab" */}
          <motion.path
            d="M52 50 L48 60 L52 60 L50 70 L58 58 L54 58 Z"
            fill="url(#sparkGradient)"
            stroke="#f59e0b"
            strokeWidth="1"
            initial={animated ? { opacity: 0, scale: 0 } : {}}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Brand Text */}
      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -20 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: animated ? 0.5 : 0, duration: 0.5 }}
          className={`font-bold ${currentSize.text}`}
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Mind<span style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Labz</span>
        </motion.div>
      )}
    </div>
  );
}
