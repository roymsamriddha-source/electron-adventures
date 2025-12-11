import { Check } from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  icon: string;
  color: string;
  completed: boolean;
  current: boolean;
}

interface ProgressConstellationProps {
  stages: Stage[];
  totalStars: number;
}

export const ProgressConstellation = ({ stages, totalStars }: ProgressConstellationProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md rounded-full px-6 py-3 border border-border shadow-lg">
        {/* Progress nodes */}
        <div className="flex items-center gap-1">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              {/* Connection line */}
              {index > 0 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-all duration-500 ${
                    stage.completed || stage.current
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'bg-muted'
                  }`}
                />
              )}
              
              {/* Stage node */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  stage.current
                    ? 'bg-gradient-to-br from-primary to-secondary scale-110 animate-pulse-glow'
                    : stage.completed
                    ? 'bg-capacitor'
                    : 'bg-muted'
                }`}
              >
                {stage.completed ? (
                  <Check className="w-5 h-5 text-foreground" />
                ) : (
                  <span className="text-lg">{stage.icon}</span>
                )}
                
                {/* Glow effect for current stage */}
                {stage.current && (
                  <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-50 -z-10" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Star count */}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
          <span className="text-2xl animate-sparkle">⭐</span>
          <span className="text-foreground font-bold text-lg">{totalStars}</span>
        </div>
      </div>
    </div>
  );
};
