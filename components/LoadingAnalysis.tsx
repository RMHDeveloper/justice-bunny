import React, { useEffect, useState } from 'react';

interface LoadingAnalysisProps {
  onComplete: () => void;
}

const MESSAGES = [
  'Consulting BNS 2023...',
  'Cross-referencing Constitution...',
  'Drafting 3-Step Procedure...',
  'Compiling relevant precedents...',
  'Finalizing summary...',
];

export const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({ onComplete }) => {
  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const [messageCounter, setMessageCounter] = useState(0);

  useEffect(() => {
    if (messageCounter < MESSAGES.length) {
      const timer = setTimeout(() => {
        setCurrentMessages((prev) => [...prev, MESSAGES[messageCounter]]);
        setMessageCounter((prev) => prev + 1);
      }, 100); // Further reduced from 200ms to 100ms for faster message display
      return () => clearTimeout(timer);
    } else {
      // All messages displayed, now call onComplete after a short final pause
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 50); // Further reduced from 100ms to 50ms for faster completion
      return () => clearTimeout(finalTimer);
    }
  }, [messageCounter, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#F8FAFC]">
      <h2 className="text-3xl font-bold text-[#1A2B48] mb-8 uppercase">
        AI ANALYSIS
      </h2>

      {/* Skeleton loading animation */}
      <div className="flex flex-col items-center mb-8 w-full max-w-sm">
        <div className="h-4 bg-slate-300 rounded-full w-3/4 mb-3 animate-pulse"></div>
        <div className="h-4 bg-slate-300 rounded-full w-1/2 mb-3 animate-pulse delay-100"></div>
        <div className="h-4 bg-slate-300 rounded-full w-2/3 mb-3 animate-pulse delay-200"></div>
        <div className="h-4 bg-slate-300 rounded-full w-5/6 mb-3 animate-pulse delay-300"></div>
        <div className="h-4 bg-slate-300 rounded-full w-2/5 animate-pulse delay-400"></div>
      </div>

      {/* Dynamic loading messages */}
      <div className="text-lg text-gray-700 w-full max-w-sm">
        {currentMessages.map((msg, index) => (
          <p key={index} className="mb-2 text-[#1A2B48] font-medium transition-opacity duration-300">
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};