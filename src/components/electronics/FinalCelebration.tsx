import { useState, useEffect } from 'react';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Badge {
  name: string;
  icon: string;
  color: string;
}

interface FinalCelebrationProps {
  totalStars: number;
  badges: Badge[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  isVisible: boolean;
}

export const FinalCelebration = ({
  totalStars,
  badges,
  onPlayAgain,
  onGoHome,
  isVisible,
}: FinalCelebrationProps) => {
  const [show, setShow] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showRank, setShowRank] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShow(true), 100);
      setTimeout(() => setShowBadges(true), 1000);
      setTimeout(() => setShowRank(true), 2000);
    }
  }, [isVisible]);

  const getRank = () => {
    if (totalStars >= 11) return { name: 'Master Engineer', emoji: '🏆', color: 'text-star' };
    if (totalStars >= 8) return { name: 'Electronics Scientist', emoji: '🔬', color: 'text-primary' };
    if (totalStars >= 5) return { name: 'Circuit Explorer', emoji: '🚀', color: 'text-secondary' };
    return { name: 'Electron Rookie', emoji: '⚡', color: 'text-muted-foreground' };
  };

  const rank = getRank();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" />

      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {['✨', '⭐', '🌟', '💫', '🎉', '🎊'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        className={`relative w-full max-w-2xl bg-card border border-primary/30 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Header gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/30 via-cosmic-purple/20 to-transparent pointer-events-none" />

        <div className="relative p-8 text-center">
          {/* Trophy */}
          <div className="mb-6">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-star/30 to-star/10 animate-pulse-glow">
              <Trophy className="w-20 h-20 text-star" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-display">
            Adventure Complete!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            You've explored all of Electronics Universe!
          </p>

          {/* Total Stars */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-2 mb-2">
              {[...Array(12)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 transition-all duration-300 ${
                    i < totalStars ? 'text-star fill-star animate-sparkle' : 'text-muted'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalStars} / 12 Stars Collected!
            </p>
          </div>

          {/* Badges */}
          <div
            className={`mb-8 transition-all duration-500 ${
              showBadges ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Badges Earned
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, index) => (
                <div
                  key={badge.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border transition-all duration-300`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className={`font-medium ${badge.color}`}>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rank */}
          <div
            className={`mb-8 transition-all duration-500 ${
              showRank ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{rank.emoji}</span>
                <span className={`text-2xl font-bold ${rank.color}`}>{rank.name}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={onPlayAgain}
              className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={onGoHome}
              variant="outline"
              className="px-8 py-6 text-lg font-bold rounded-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
