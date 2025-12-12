import { useState, useEffect } from 'react';
import { Rocket, Zap, Sparkles, CircuitBoard, Atom, Lightbulb, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarField } from './StarField';

interface WelcomeScreenProps {
  onStart: () => void;
}

const stages = [
  { icon: Zap, name: 'Resistors', color: 'resistor', description: 'Control electron flow' },
  { icon: Radio, name: 'Inductors', color: 'inductor', description: 'Create magnetic fields' },
  { icon: Atom, name: 'Capacitors', color: 'capacitor', description: 'Store electrical energy' },
  { icon: Lightbulb, name: 'Diodes', color: 'diode', description: 'One-way electron gates' },
];

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <StarField />

      {/* Floating electrons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-electron glow-electron animate-float"
            style={{
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content - centered and compact */}
      <div
        className={`relative z-10 text-center px-4 w-full max-w-4xl transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 scale-150" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary via-cosmic-purple to-secondary flex items-center justify-center animate-pulse-glow border-2 border-primary/30">
              <CircuitBoard className="w-10 h-10 md:w-12 md:h-12 text-foreground" />
            </div>
            {/* Orbiting dot */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <Sparkles className="absolute -top-1 left-1/2 w-4 h-4 text-star" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-1 font-display tracking-tight">
          Electronics
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cosmic-purple to-secondary">
            Universe
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
          Join <span className="text-electron font-semibold">Sparky</span> on a journey through electronics!
        </p>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="px-8 py-6 text-lg md:text-xl font-bold rounded-full bg-gradient-to-r from-primary via-cosmic-purple to-secondary hover:scale-105 transition-all duration-300 text-foreground border border-primary/30 mb-6"
        >
          <Rocket className="w-6 h-6 mr-2" />
          Start Adventure
        </Button>

        {/* Stage cards - compact grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.name}
                className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-${stage.color}/20 flex items-center justify-center mb-2 mx-auto border border-${stage.color}/30`}>
                  <Icon className={`w-5 h-5 text-${stage.color}`} />
                </div>
                <h3 className={`font-semibold text-xs md:text-sm text-${stage.color}`}>
                  {stage.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Footer text */}
        <p className="mt-4 text-xs text-muted-foreground/60">
          Touch-friendly • All ages welcome
        </p>
      </div>
    </div>
  );
};
