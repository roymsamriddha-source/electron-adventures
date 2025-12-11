import { useState, useEffect } from 'react';

interface SparkMascotProps {
  message: string;
  mood?: 'idle' | 'speaking' | 'celebrating' | 'encouraging' | 'thinking';
  onHelpClick?: () => void;
}

export const SparkMascot = ({ message, mood = 'idle', onHelpClick }: SparkMascotProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (message) {
      setShowBubble(true);
    }
  }, [message]);

  const getMoodAnimation = () => {
    switch (mood) {
      case 'celebrating':
        return 'animate-bounce';
      case 'speaking':
        return 'animate-pulse-glow';
      case 'thinking':
        return 'animate-float';
      case 'encouraging':
        return 'animate-bounce-gentle';
      default:
        return 'animate-bounce-gentle';
    }
  };

  const getEyeExpression = () => {
    switch (mood) {
      case 'celebrating':
        return { left: '◠', right: '◠' };
      case 'encouraging':
        return { left: '◕', right: '◕' };
      case 'thinking':
        return { left: '◔', right: '◔' };
      default:
        return { left: '●', right: '●' };
    }
  };

  const eyes = getEyeExpression();

  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 flex items-end gap-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Sparky the Electron */}
      <div 
        className={`relative cursor-pointer ${getMoodAnimation()}`}
        onClick={onHelpClick}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-electron blur-xl opacity-50 scale-150" />
        
        {/* Main body */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-electron to-secondary flex items-center justify-center glow-electron">
          {/* Inner shine */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/30 blur-sm" />
          
          {/* Face */}
          <div className="relative flex flex-col items-center">
            {/* Eyes */}
            <div className="flex gap-3 text-lg font-bold text-background">
              <span className={mood === 'celebrating' ? 'animate-sparkle' : ''}>{eyes.left}</span>
              <span className={mood === 'celebrating' ? 'animate-sparkle' : ''}>{eyes.right}</span>
            </div>
            {/* Mouth */}
            <div className="mt-1 text-background text-sm">
              {mood === 'celebrating' ? '◡' : mood === 'encouraging' ? '‿' : '◡'}
            </div>
          </div>

          {/* Orbiting electrons */}
          <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-star glow-star" />
          </div>
          <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>

        {/* Help indicator */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-star text-background text-xs font-bold flex items-center justify-center animate-pulse">
          ?
        </div>
      </div>

      {/* Speech bubble */}
      {showBubble && message && (
        <div className="relative max-w-xs animate-scale-in">
          {/* Bubble pointer */}
          <div className="absolute left-0 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-card border-b-8 border-b-transparent -ml-3" />
          
          {/* Bubble content */}
          <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-foreground text-sm leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
