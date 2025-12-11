import { useState, useEffect } from 'react';
import { Rocket, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarField } from './StarField';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <StarField />

      {/* Floating electrons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-electron glow-electron animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-30 scale-150" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow">
              <Zap className="w-16 h-16 text-foreground" />
            </div>
            {/* Orbiting sparkles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <Sparkles className="absolute -top-2 left-1/2 w-6 h-6 text-star" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
              <Sparkles className="absolute top-1/2 -right-2 w-4 h-4 text-electron" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 font-display text-glow">
          Electronics
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            Universe
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join Sparky the Electron on an amazing adventure through the cosmos of electronics!
        </p>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="group px-12 py-8 text-2xl font-bold rounded-full bg-gradient-to-r from-primary via-cosmic-purple to-secondary hover:scale-110 transition-all duration-300 text-foreground shadow-lg hover:shadow-primary/50"
        >
          <Rocket className="w-8 h-8 mr-3 group-hover:animate-bounce" />
          Start Adventure
        </Button>

        {/* Stage preview */}
        <div className="mt-16 flex justify-center gap-6 flex-wrap">
          {[
            { icon: '🔶', name: 'Resistors', color: 'text-resistor' },
            { icon: '🔵', name: 'Inductors', color: 'text-inductor' },
            { icon: '🟢', name: 'Capacitors', color: 'text-capacitor' },
            { icon: '🔴', name: 'Diodes', color: 'text-diode' },
          ].map((stage, index) => (
            <div
              key={stage.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm transition-all duration-500`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-2xl">{stage.icon}</span>
              <span className={`font-medium ${stage.color}`}>{stage.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
