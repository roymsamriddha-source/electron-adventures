import { useState, useEffect, useCallback } from 'react';
import { SparkMascot } from '../SparkMascot';
import { PopupNotification } from '../PopupNotification';
import { EducationalPanel } from '../EducationalPanel';
import { SummaryPanel } from '../SummaryPanel';
import { StepIndicator } from '../StepIndicator';
import { Button } from '@/components/ui/button';

interface InductorStageProps {
  onComplete: (stars: number) => void;
}

const STEPS = [
  { message: "Connect the wires to power the coil!", type: 'action' as const },
  { message: "Tap the switch to send current through!", type: 'action' as const },
  { message: "Watch the magnetic field grow around the coil!", type: 'learn' as const },
  { message: "Tap the flip button to reverse the current!", type: 'action' as const },
  { message: "Mini-game: Tap in rhythm to sustain the swirl!", type: 'action' as const },
];

export const InductorStage = ({ onComplete }: InductorStageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEducation, setShowEducation] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sparkMessage, setSparkMessage] = useState("Welcome to Inductor Galaxy!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('idle');

  // Step states
  const [wiresConnected, setWiresConnected] = useState(false);
  const [currentOn, setCurrentOn] = useState(false);
  const [fieldStrength, setFieldStrength] = useState(0);
  const [currentDirection, setCurrentDirection] = useState<'forward' | 'reverse'>('forward');
  const [gameActive, setGameActive] = useState(false);
  const [rhythmScore, setRhythmScore] = useState(0);
  const [targetPulse, setTargetPulse] = useState(false);
  const [wireLeft, setWireLeft] = useState(false);
  const [wireRight, setWireRight] = useState(false);

  useEffect(() => {
    if (!showEducation && currentStep < STEPS.length) {
      setPopupVisible(true);
    }
  }, [currentStep, showEducation]);

  // Animate field growth when current is on
  useEffect(() => {
    if (currentOn && !gameActive) {
      const interval = setInterval(() => {
        setFieldStrength(prev => Math.min(100, prev + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentOn, gameActive]);

  // Rhythm game logic
  useEffect(() => {
    if (gameActive) {
      const pulseInterval = setInterval(() => {
        setTargetPulse(true);
        setTimeout(() => setTargetPulse(false), 800);
      }, 1500);

      const endGame = setTimeout(() => {
        setGameActive(false);
        const starsEarned = rhythmScore >= 8 ? 3 : rhythmScore >= 5 ? 2 : 1;
        setSparkMessage(`Fantastic rhythm! Score: ${rhythmScore}!`);
        setSparkMood('celebrating');
        setTimeout(() => setShowSummary(true), 1500);
      }, 12000);

      return () => {
        clearInterval(pulseInterval);
        clearTimeout(endGame);
      };
    }
  }, [gameActive, rhythmScore]);

  const handlePopupDismiss = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const handleWireConnect = (side: 'left' | 'right') => {
    if (currentStep === 0) {
      if (side === 'left') setWireLeft(true);
      if (side === 'right') setWireRight(true);
      
      if ((side === 'left' && wireRight) || (side === 'right' && wireLeft)) {
        setWiresConnected(true);
        setSparkMessage("Both wires connected! Power ready!");
        setSparkMood('celebrating');
        setTimeout(() => {
          setCurrentStep(1);
          setSparkMood('speaking');
          setSparkMessage("Now tap the switch to start the current!");
        }, 1000);
      }
    }
  };

  const handleSwitchOn = () => {
    if (currentStep === 1 && !currentOn) {
      setCurrentOn(true);
      setSparkMessage("Current flowing! Watch the magnetic field form!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(2);
        setSparkMood('speaking');
        setSparkMessage("See those blue rings? That's the magnetic field!");
        setTimeout(() => {
          setCurrentStep(3);
          setSparkMessage("Try flipping the current direction!");
        }, 3000);
      }, 1500);
    }
  };

  const handleFlipCurrent = () => {
    if (currentStep === 3) {
      setCurrentDirection(prev => prev === 'forward' ? 'reverse' : 'forward');
      setFieldStrength(0);
      setSparkMessage(currentDirection === 'forward' 
        ? "Current reversed! The field rebuilds in the opposite way!" 
        : "Back to forward! Notice how the field changes!");
      setSparkMood('encouraging');
    }
  };

  const handleStartGame = () => {
    setCurrentStep(4);
    setGameActive(true);
    setRhythmScore(0);
    setSparkMessage("Tap when the ring pulses bright!");
    setSparkMood('encouraging');
  };

  const handleRhythmTap = () => {
    if (gameActive && targetPulse) {
      setRhythmScore(prev => prev + 1);
      setFieldStrength(prev => Math.min(100, prev + 15));
    }
  };

  const starsEarned = rhythmScore >= 8 ? 3 : rhythmScore >= 5 ? 2 : 1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Educational Panel */}
      <EducationalPanel
        isVisible={showEducation}
        onClose={() => setShowEducation(false)}
        title="Welcome to Inductor Galaxy! 🔵"
        explanation="When electricity flows through a coiled wire, it creates an invisible magnetic force field! This magical property is called inductance."
        formula="L = Φ / I"
        formulaExplanation="Inductance equals Magnetic Flux divided by Current"
        didYouKnow="Inductors are used in wireless phone chargers — they transfer energy through magnetism without any wires touching!"
        stageColor="inductor"
      />

      {/* Step Indicator */}
      {!showEducation && !showSummary && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <StepIndicator currentStep={currentStep} totalSteps={5} stageColor="inductor" />
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
          <div className="relative bg-card/50 backdrop-blur-md rounded-3xl border border-inductor/30 p-8 min-h-[450px]">
            {/* Coil visualization */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Magnetic field rings */}
              {currentOn && (
                <>
                  {[1, 2, 3, 4].map((ring) => (
                    <div
                      key={ring}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-inductor/40 transition-all duration-500 ${
                        currentDirection === 'reverse' ? 'animate-spin' : ''
                      }`}
                      style={{
                        width: `${80 + ring * 40 * (fieldStrength / 100)}px`,
                        height: `${80 + ring * 40 * (fieldStrength / 100)}px`,
                        opacity: fieldStrength / 100,
                        animationDuration: `${4 + ring}s`,
                        animationDirection: currentDirection === 'reverse' ? 'reverse' : 'normal',
                      }}
                    />
                  ))}
                </>
              )}

              {/* Coil center */}
              <div 
                className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-inductor to-inductor-glow flex items-center justify-center transition-all duration-300 ${
                  currentOn ? 'glow-inductor scale-110' : ''
                } ${targetPulse ? 'scale-125 brightness-150' : ''}`}
                onClick={handleRhythmTap}
                style={{ cursor: gameActive ? 'pointer' : 'default' }}
              >
                {/* Coil lines */}
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <path
                    d="M50 10 Q70 10 70 30 Q70 50 50 50 Q30 50 30 70 Q30 90 50 90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-foreground"
                  />
                </svg>

                {/* Current direction indicator */}
                {currentOn && (
                  <div className={`absolute -bottom-8 text-2xl transition-transform ${
                    currentDirection === 'reverse' ? 'rotate-180' : ''
                  }`}>
                    ⚡
                  </div>
                )}
              </div>
            </div>

            {/* Wire connection points */}
            {currentStep === 0 && (
              <>
                <button
                  onClick={() => handleWireConnect('left')}
                  className={`absolute left-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-dashed transition-all ${
                    wireLeft ? 'bg-inductor border-inductor' : 'bg-inductor/20 border-inductor/50 animate-pulse-glow'
                  } flex items-center justify-center`}
                >
                  <span className="text-foreground">{wireLeft ? '✓' : '+'}</span>
                </button>
                <button
                  onClick={() => handleWireConnect('right')}
                  className={`absolute right-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-dashed transition-all ${
                    wireRight ? 'bg-inductor border-inductor' : 'bg-inductor/20 border-inductor/50 animate-pulse-glow'
                  } flex items-center justify-center`}
                >
                  <span className="text-foreground">{wireRight ? '✓' : '−'}</span>
                </button>
              </>
            )}

            {/* Connected wires */}
            {wiresConnected && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
                <line x1="80" y1="225" x2="350" y2="225" className="stroke-inductor stroke-[4]" />
                <line x1="450" y1="225" x2="720" y2="225" className="stroke-inductor stroke-[4]" />
                {currentOn && (
                  <>
                    <circle cx="200" cy="225" r="6" className="fill-electron animate-pulse" />
                    <circle cx="600" cy="225" r="6" className="fill-electron animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </svg>
            )}

            {/* Game score */}
            {gameActive && (
              <div className="absolute top-4 right-4 bg-inductor/20 backdrop-blur-sm rounded-full px-6 py-3 border border-inductor/50">
                <span className="text-inductor font-bold text-2xl">Score: {rhythmScore}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          {wiresConnected && !gameActive && (
            <div className="mt-8 flex justify-center gap-4">
              {currentStep === 1 && (
                <Button
                  onClick={handleSwitchOn}
                  className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-inductor to-inductor-glow hover:scale-105 transition-transform"
                >
                  ⚡ Turn On Current
                </Button>
              )}
              {currentStep >= 3 && (
                <>
                  <Button
                    onClick={handleFlipCurrent}
                    variant="outline"
                    className="px-8 py-6 text-lg font-bold rounded-full border-inductor text-inductor hover:bg-inductor/20"
                  >
                    🔄 Flip Direction
                  </Button>
                  <Button
                    onClick={handleStartGame}
                    className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-inductor to-inductor-glow hover:scale-105 transition-transform"
                  >
                    🎮 Start Rhythm Game!
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Game instruction */}
          {gameActive && (
            <div className="mt-8 text-center">
              <p className="text-xl text-muted-foreground animate-pulse">
                Tap the coil when it glows bright! ✨
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Panel */}
      <SummaryPanel
        isVisible={showSummary}
        stageName="Inductor Galaxy"
        stageColor="inductor"
        badgeName="Magnetic Master"
        badgeIcon="🔵"
        starsEarned={starsEarned}
        summaryPoints={[
          "Inductors create magnetic fields when current flows",
          "The field stores energy in magnetic form",
          "Reversing current changes the field direction",
          "Inductance is measured in Henrys (H)",
        ]}
        onNextStage={() => onComplete(starsEarned)}
        onReplay={() => {
          setShowSummary(false);
          setShowEducation(true);
          setCurrentStep(0);
          setWiresConnected(false);
          setCurrentOn(false);
          setFieldStrength(0);
          setCurrentDirection('forward');
          setRhythmScore(0);
          setWireLeft(false);
          setWireRight(false);
        }}
      />

      {/* Sparky Mascot */}
      {!showEducation && !showSummary && (
        <SparkMascot message={sparkMessage} mood={sparkMood} />
      )}
    </div>
  );
};
