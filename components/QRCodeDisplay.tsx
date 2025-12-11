'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface QRCodeDisplayProps {
  quizCode: string;
  quizId: string;
}

export default function QRCodeDisplay({ quizCode, quizId }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/join/${quizCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
      {/* QR Code */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-white p-8 rounded-3xl shadow-2xl"
      >
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
          <QRCodeSVG
            value={joinUrl}
            size={256}
            level="H"
            includeMargin={true}
            className="w-full h-auto"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Scan to join</p>
          <p className="text-3xl font-bold text-purple-600">{quizCode}</p>
        </div>
      </motion.div>

      {/* Join Instructions */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          📱 Join the Quiz
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <p className="text-gray-700">
              Scan the QR code with your phone camera
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <p className="text-gray-700">
              Or visit the link below and enter code: <span className="font-bold text-purple-600">{quizCode}</span>
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <p className="text-gray-700">
              Choose your username and avatar
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="text-xs text-gray-600 mb-2">Join Link:</p>
          <p className="text-sm font-mono text-gray-800 break-all">
            {joinUrl}
          </p>
        </div>

        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
