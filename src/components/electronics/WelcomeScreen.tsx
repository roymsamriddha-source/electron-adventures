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
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <StarField />

      {/* Animated electrons floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-electron glow-electron animate-float"
            style={{
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Decorative circuit lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 200 Q 200 180, 400 200 T 800 200" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-pulse" />
        <path d="M0 400 Q 250 420, 500 400 T 1000 400" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <path d="M0 600 Q 300 580, 600 600 T 1200 600" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '2s' }} />
      </svg>

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-4 md:px-6 max-w-5xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Animated Logo */}
        <div className="mb-8 md:mb-10 flex justify-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-primary blur-3xl opacity-20 scale-150 animate-pulse" />
            
            {/* Main icon container */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary via-cosmic-purple to-secondary flex items-center justify-center animate-pulse-glow shadow-2xl border-4 border-primary/30">
              <CircuitBoard className="w-14 h-14 md:w-18 md:h-18 text-foreground" />
            </div>
            
            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-resistor flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-background" />
              </div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-electron flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-background" />
              </div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
              <div className="absolute -bottom-2 left-1/4 w-5 h-5 rounded-full bg-capacitor shadow-lg" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-3 md:mb-4 font-display tracking-tight">
          Electronics
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cosmic-purple to-secondary animate-gradient-x">
            Universe
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Join <span className="text-electron font-semibold">Sparky the Electron</span> on an amazing journey 
          through the cosmos of electronics!
        </p>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="group px-10 md:px-14 py-7 md:py-8 text-xl md:text-2xl font-bold rounded-full bg-gradient-to-r from-primary via-cosmic-purple to-secondary hover:scale-110 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 text-foreground border-2 border-primary/30"
        >
          <Rocket className="w-7 h-7 md:w-8 md:h-8 mr-3 group-hover:animate-bounce" />
          Start Adventure
        </Button>

        {/* Stage preview cards */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isHovered = hoveredStage === index;
            
            return (
              <div
                key={stage.name}
                onMouseEnter={() => setHoveredStage(index)}
                onMouseLeave={() => setHoveredStage(null)}
                className={`relative p-4 md:p-5 rounded-2xl bg-card/60 backdrop-blur-md border transition-all duration-500 cursor-pointer group overflow-hidden ${
                  isHovered 
                    ? `border-${stage.color} scale-105 shadow-lg` 
                    : 'border-border/50 hover:border-border'
                }`}
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  boxShadow: isHovered ? `0 0 30px hsl(var(--${stage.color}) / 0.3)` : 'none'
                }}
              >
                {/* Background glow on hover */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br from-${stage.color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-${stage.color}/20 flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform border border-${stage.color}/30`}>
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 text-${stage.color}`} />
                  </div>
                  <h3 className={`font-bold text-sm md:text-base text-${stage.color} mb-1`}>
                    {stage.name}
                  </h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Museum-friendly text */}
        <p className="mt-10 text-sm text-muted-foreground/70">
          Touch-friendly • All ages welcome • No experience needed
        </p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
};
