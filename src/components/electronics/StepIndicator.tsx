interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stageColor: 'resistor' | 'inductor' | 'capacitor' | 'diode';
}

export const StepIndicator = ({ currentStep, totalSteps, stageColor }: StepIndicatorProps) => {
  const getColorClass = () => {
    switch (stageColor) {
      case 'resistor': return 'bg-resistor';
      case 'inductor': return 'bg-inductor';
      case 'capacitor': return 'bg-capacitor';
      case 'diode': return 'bg-diode';
    }
  };

  return (
    <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md rounded-full px-6 py-3 border border-border">
      <div className="flex items-center gap-2">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentStep
                ? getColorClass()
                : index === currentStep
                ? `${getColorClass()} animate-pulse-glow`
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-foreground font-semibold">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
};
