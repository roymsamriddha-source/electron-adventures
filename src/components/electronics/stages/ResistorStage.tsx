import { useState, useEffect, useCallback } from 'react';
import { SparkMascot } from '../SparkMascot';
import { PopupNotification } from '../PopupNotification';
import { EducationalPanel } from '../EducationalPanel';
import { SummaryPanel } from '../SummaryPanel';
import { StepIndicator } from '../StepIndicator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ResistorStageProps {
  onComplete: (stars: number) => void;
}

const STEPS = [
  { message: "Tap the glowing wire to create a path!", type: 'action' as const },
  { message: "Now drag the resistor into the gap!", type: 'action' as const },
  { message: "Slide to change resistance - watch the electrons!", type: 'hint' as const },
  { message: "Mini-game time! Click electrons to guide them through!", type: 'action' as const },
];

export const ResistorStage = ({ onComplete }: ResistorStageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEducation, setShowEducation] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sparkMessage, setSparkMessage] = useState("Welcome to Resistor Realm!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('idle');
  
  // Step states
  const [wireConnected, setWireConnected] = useState(false);
  const [resistorPlaced, setResistorPlaced] = useState(false);
  const [resistance, setResistance] = useState([50]);
  const [electrons, setElectrons] = useState<{ id: number; x: number; caught: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);

  useEffect(() => {
    if (!showEducation && currentStep < STEPS.length) {
      setPopupVisible(true);
    }
  }, [currentStep, showEducation]);

  const handlePopupDismiss = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const handleWireClick = () => {
    if (currentStep === 0 && !wireConnected) {
      setWireConnected(true);
      setSparkMessage("Great job! The wire is connected!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(1);
        setSparkMood('speaking');
        setSparkMessage("Now drag the resistor into the circuit!");
      }, 1000);
    }
  };

  const handleResistorDrop = () => {
    if (currentStep === 1 && !resistorPlaced) {
      setResistorPlaced(true);
      setDraggedOver(false);
      setSparkMessage("Perfect! The resistor is in place!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(2);
        setSparkMood('speaking');
        setSparkMessage("Try moving the slider to see how electrons react!");
      }, 1000);
    }
  };

  const handleResistanceChange = (value: number[]) => {
    setResistance(value);
    if (currentStep === 2) {
      if (value[0] > 70) {
        setSparkMessage("High resistance! Electrons are really slowing down!");
      } else if (value[0] < 30) {
        setSparkMessage("Low resistance! Electrons are zooming through!");
      } else {
        setSparkMessage("Try sliding more to see the difference!");
      }
    }
  };

  const handleStartGame = () => {
    setCurrentStep(3);
    setGameActive(true);
    setScore(0);
    setSparkMessage("Catch as many electrons as you can!");
    setSparkMood('encouraging');
    
    // Spawn electrons
    const spawnElectrons = () => {
      const newElectrons = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 + 10,
        caught: false,
      }));
      setElectrons(newElectrons);
    };
    
    spawnElectrons();
    
    // End game after time
    setTimeout(() => {
      setGameActive(false);
      const starsEarned = score >= 8 ? 3 : score >= 5 ? 2 : 1;
      setSparkMessage(`Amazing! You caught ${score} electrons!`);
      setSparkMood('celebrating');
      setTimeout(() => setShowSummary(true), 1500);
    }, 8000);
  };

  const handleElectronClick = (id: number) => {
    if (!gameActive) return;
    setElectrons(prev => prev.map(e => e.id === id ? { ...e, caught: true } : e));
    setScore(prev => prev + 1);
  };

  const getElectronSpeed = () => {
    return Math.max(2, 8 - (resistance[0] / 15));
  };

  const starsEarned = score >= 8 ? 3 : score >= 5 ? 2 : 1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Educational Panel */}
      <EducationalPanel
        isVisible={showEducation}
        onClose={() => setShowEducation(false)}
        title="Welcome to Resistor Realm! 🔶"
        explanation="A resistor is like a speed bump for electricity — it slows down the flow of electrons, controlling how much current can pass through a circuit."
        formula="R = V / I"
        formulaExplanation="Resistance equals Voltage divided by Current"
        didYouKnow="Your body has resistance too! That's why you don't get shocked by small batteries. The higher the resistance, the harder it is for electricity to flow."
        stageColor="resistor"
      />

      {/* Step Indicator */}
      {!showEducation && !showSummary && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <StepIndicator currentStep={currentStep} totalSteps={4} stageColor="resistor" />
        </div>
      )}

      {/* Popup Notification */}
      {currentStep < STEPS.length && (
        <PopupNotification
          isVisible={popupVisible && !showEducation}
          message={STEPS[currentStep].message}
          type={STEPS[currentStep].type}
          onDismiss={handlePopupDismiss}
        />
      )}

      {/* Main Stage Content */}
      {!showEducation && !showSummary && (
        <div className="relative w-full max-w-4xl">
          {/* Circuit visualization */}
          <div className="relative bg-card/50 backdrop-blur-md rounded-3xl border border-resistor/30 p-8 min-h-[400px]">
            {/* Wire path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
              {/* Left wire segment */}
              <line
                x1="50" y1="200" x2="300" y2="200"
                className={`stroke-[4] transition-all duration-500 ${
                  wireConnected ? 'stroke-resistor' : 'stroke-muted'
                }`}
                strokeLinecap="round"
              />
              {/* Right wire segment */}
              <line
                x1="500" y1="200" x2="750" y2="200"
                className={`stroke-[4] transition-all duration-500 ${
                  wireConnected ? 'stroke-resistor' : 'stroke-muted'
                }`}
                strokeLinecap="round"
              />
              {/* Resistor symbol when placed */}
              {resistorPlaced && (
                <g>
                  <path
                    d="M300 200 L320 200 L330 180 L350 220 L370 180 L390 220 L410 180 L430 220 L450 180 L470 220 L480 200 L500 200"
                    fill="none"
                    className="stroke-resistor stroke-[4]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </svg>

            {/* Clickable wire area (Step 1) */}
            {currentStep === 0 && !wireConnected && (
              <button
                onClick={handleWireClick}
                className="absolute left-[15%] top-1/2 -translate-y-1/2 w-32 h-16 rounded-xl bg-resistor/20 border-2 border-dashed border-resistor animate-pulse-glow cursor-pointer hover:bg-resistor/30 transition-colors flex items-center justify-center"
              >
                <span className="text-resistor font-bold">Tap!</span>
              </button>
            )}

            {/* Resistor drop zone (Step 2) */}
            {currentStep === 1 && !resistorPlaced && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDraggedOver(true); }}
                onDragLeave={() => setDraggedOver(false)}
                onDrop={handleResistorDrop}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 rounded-xl border-2 border-dashed transition-all ${
                  draggedOver ? 'border-resistor bg-resistor/30 scale-105' : 'border-resistor/50 bg-resistor/10'
                } flex items-center justify-center`}
              >
                <span className="text-resistor/70 font-medium">Drop here</span>
              </div>
            )}

            {/* Draggable resistor (Step 2) */}
            {currentStep === 1 && !resistorPlaced && (
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text', 'resistor')}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-resistor to-resistor-glow rounded-2xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shadow-lg glow-resistor"
              >
                <span className="text-foreground font-bold text-lg">🔶 Resistor</span>
              </div>
            )}

            {/* Flowing electrons animation */}
            {wireConnected && resistorPlaced && currentStep >= 2 && !gameActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-electron glow-electron"
                    style={{
                      left: '-20px',
                      animation: `electron-flow ${getElectronSpeed()}s linear infinite`,
                      animationDelay: `${i * (getElectronSpeed() / 5)}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Mini-game electrons */}
            {gameActive && (
              <div className="absolute inset-0">
                {electrons.map((electron) => (
                  !electron.caught && (
                    <button
                      key={electron.id}
                      onClick={() => handleElectronClick(electron.id)}
                      className="absolute w-12 h-12 rounded-full bg-electron glow-electron cursor-pointer hover:scale-125 transition-transform animate-float"
                      style={{
                        left: `${electron.x}%`,
                        top: `${Math.random() * 60 + 20}%`,
                        animationDuration: `${1 + Math.random()}s`,
                      }}
                    >
                      <span className="text-background font-bold">⚡</span>
                    </button>
                  )
                ))}
              </div>
            )}

            {/* Score display during game */}
            {gameActive && (
              <div className="absolute top-4 right-4 bg-resistor/20 backdrop-blur-sm rounded-full px-6 py-3 border border-resistor/50">
                <span className="text-resistor font-bold text-2xl">Score: {score}</span>
              </div>
            )}
          </div>

          {/* Resistance slider (Step 3) */}
          {currentStep === 2 && resistorPlaced && (
            <div className="mt-8 bg-card/50 backdrop-blur-md rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-foreground font-semibold">Resistance Level</span>
                <span className="text-resistor font-bold text-xl">{resistance[0]}Ω</span>
              </div>
              <Slider
                value={resistance}
                onValueChange={handleResistanceChange}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Low (Fast electrons)</span>
                <span>High (Slow electrons)</span>
              </div>
              
              <Button
                onClick={handleStartGame}
                className="mt-6 w-full py-6 text-lg font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow hover:scale-105 transition-transform"
              >
                Start Mini-Game! 🎮
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Summary Panel */}
      <SummaryPanel
        isVisible={showSummary}
        stageName="Resistor Realm"
        stageColor="resistor"
        badgeName="Resistor Ranger"
        badgeIcon="🔶"
        starsEarned={starsEarned}
        summaryPoints={[
          "Resistors slow down the flow of electrons",
          "Higher resistance = slower electron flow",
          "Resistance is measured in Ohms (Ω)",
          "R = V / I (Ohm's Law)",
        ]}
        onNextStage={() => onComplete(starsEarned)}
        onReplay={() => {
          setShowSummary(false);
          setShowEducation(true);
          setCurrentStep(0);
          setWireConnected(false);
          setResistorPlaced(false);
          setResistance([50]);
          setScore(0);
        }}
      />

      {/* Sparky Mascot */}
      {!showEducation && !showSummary && (
        <SparkMascot message={sparkMessage} mood={sparkMood} />
      )}
    </div>
  );
};
