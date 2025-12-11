import { useState, useEffect } from 'react';
import { X, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EducationalPanelProps {
  title: string;
  explanation: string;
  formula?: string;
  formulaExplanation?: string;
  didYouKnow: string;
  stageColor: 'resistor' | 'inductor' | 'capacitor' | 'diode';
  onClose: () => void;
  isVisible: boolean;
}

export const EducationalPanel = ({
  title,
  explanation,
  formula,
  formulaExplanation,
  didYouKnow,
  stageColor,
  onClose,
  isVisible,
}: EducationalPanelProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  const getColorClasses = () => {
    switch (stageColor) {
      case 'resistor':
        return {
          accent: 'text-resistor',
          bg: 'from-resistor/20 to-resistor/5',
          border: 'border-resistor/30',
          glow: 'glow-resistor',
        };
      case 'inductor':
        return {
          accent: 'text-inductor',
          bg: 'from-inductor/20 to-inductor/5',
          border: 'border-inductor/30',
          glow: 'glow-inductor',
        };
      case 'capacitor':
        return {
          accent: 'text-capacitor',
          bg: 'from-capacitor/20 to-capacitor/5',
          border: 'border-capacitor/30',
          glow: 'glow-capacitor',
        };
      case 'diode':
        return {
          accent: 'text-diode',
          bg: 'from-diode/20 to-diode/5',
          border: 'border-diode/30',
          glow: 'glow-diode',
        };
    }
  };

  const colors = getColorClasses();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl bg-card border ${colors.border} rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header gradient */}
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${colors.bg} pointer-events-none`} />

        {/* Content */}
        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Title */}
          <h2 className={`text-3xl font-bold ${colors.accent} mb-6 font-display`}>
            {title}
          </h2>

          {/* Main explanation */}
          <div className="mb-6">
            <p className="text-foreground text-xl leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Formula section */}
          {formula && (
            <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-6 mb-6 border ${colors.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className={`w-5 h-5 ${colors.accent}`} />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  The Formula
                </span>
              </div>
              <div className={`text-4xl font-bold ${colors.accent} mb-2 font-mono`}>
                {formula}
              </div>
              {formulaExplanation && (
                <p className="text-muted-foreground text-sm">
                  {formulaExplanation}
                </p>
              )}
            </div>
          )}

          {/* Did you know section */}
          <div className="bg-star/10 rounded-2xl p-6 border border-star/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-star/20">
                <Lightbulb className="w-6 h-6 text-star" />
              </div>
              <div>
                <h3 className="text-star font-bold mb-2 text-lg">Did You Know?</h3>
                <p className="text-foreground leading-relaxed">
                  {didYouKnow}
                </p>
              </div>
            </div>
          </div>

          {/* Start button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onClose}
              size="lg"
              className={`px-12 py-6 text-xl font-bold rounded-full bg-gradient-to-r ${
                stageColor === 'resistor' ? 'from-resistor to-resistor-glow' :
                stageColor === 'inductor' ? 'from-inductor to-inductor-glow' :
                stageColor === 'capacitor' ? 'from-capacitor to-capacitor-glow' :
                'from-diode to-diode-glow'
              } hover:scale-105 transition-transform text-foreground`}
            >
              Let's Start! 🚀
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
