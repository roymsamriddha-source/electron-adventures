import { useState, useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryPanelProps {
  stageName: string;
  stageColor: 'resistor' | 'inductor' | 'capacitor' | 'diode';
  badgeName: string;
  badgeIcon: string;
  starsEarned: number;
  summaryPoints: string[];
  onNextStage: () => void;
  onReplay: () => void;
  isVisible: boolean;
  isLastStage?: boolean;
}

export const SummaryPanel = ({
  stageName,
  stageColor,
  badgeName,
  badgeIcon,
  starsEarned,
  summaryPoints,
  onNextStage,
  onReplay,
  isVisible,
  isLastStage = false,
}: SummaryPanelProps) => {
  const [show, setShow] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShow(true), 100);
      setTimeout(() => setShowStars(true), 600);
      setTimeout(() => setShowBadge(true), 1200);
    } else {
      setShow(false);
      setShowStars(false);
      setShowBadge(false);
    }
  }, [isVisible]);

  const getColorClasses = () => {
    switch (stageColor) {
      case 'resistor':
        return { accent: 'text-resistor', bg: 'from-resistor/20 to-resistor/5', border: 'border-resistor/30' };
      case 'inductor':
        return { accent: 'text-inductor', bg: 'from-inductor/20 to-inductor/5', border: 'border-inductor/30' };
      case 'capacitor':
        return { accent: 'text-capacitor', bg: 'from-capacitor/20 to-capacitor/5', border: 'border-capacitor/30' };
      case 'diode':
        return { accent: 'text-diode', bg: 'from-diode/20 to-diode/5', border: 'border-diode/30' };
    }
  };

  const colors = getColorClasses();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

      {/* Celebration particles */}
      {showStars && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Panel */}
      <div
        className={`relative w-full max-w-xl bg-card border ${colors.border} rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${colors.bg} pointer-events-none`} />

        <div className="relative p-8 text-center">
          {/* Trophy icon */}
          <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${colors.bg} mb-4`}>
            <Trophy className={`w-12 h-12 ${colors.accent}`} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {stageName} Complete!
          </h2>

          {/* Stars */}
          <div
            className={`flex justify-center gap-2 my-6 transition-all duration-500 ${
              showStars ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            {[1, 2, 3].map((star) => (
              <div
                key={star}
                className={`text-4xl transition-all duration-300 ${
                  star <= starsEarned ? 'animate-sparkle' : 'opacity-30 grayscale'
                }`}
                style={{ animationDelay: `${star * 0.2}s` }}
              >
                ⭐
              </div>
            ))}
          </div>

          {/* Badge */}
          <div
            className={`my-6 transition-all duration-500 ${
              showBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${colors.bg} border ${colors.border}`}>
              <span className="text-3xl">{badgeIcon}</span>
              <span className={`font-bold text-lg ${colors.accent}`}>{badgeName}</span>
            </div>
          </div>

          {/* Summary points */}
          <div className="text-left bg-muted/30 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              What You Learned
            </h3>
            <ul className="space-y-3">
              {summaryPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={colors.accent}>✓</span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onReplay}
              className="px-6 py-5 rounded-full"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Replay
            </Button>
            <Button
              onClick={onNextStage}
              className={`px-8 py-5 rounded-full bg-gradient-to-r ${
                stageColor === 'resistor' ? 'from-resistor to-resistor-glow' :
                stageColor === 'inductor' ? 'from-inductor to-inductor-glow' :
                stageColor === 'capacitor' ? 'from-capacitor to-capacitor-glow' :
                'from-diode to-diode-glow'
              } hover:scale-105 transition-transform text-foreground font-bold`}
            >
              {isLastStage ? 'Finish Adventure!' : 'Next Stage'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
