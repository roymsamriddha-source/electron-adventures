import { useState, useEffect, useCallback } from 'react';
import { SparkMascot } from '../SparkMascot';
import { PopupNotification } from '../PopupNotification';
import { EducationalPanel } from '../EducationalPanel';
import { SummaryPanel } from '../SummaryPanel';
import { StepIndicator } from '../StepIndicator';
import { Button } from '@/components/ui/button';

interface CapacitorStageProps {
  onComplete: (stars: number) => void;
}

const STEPS = [
  { message: "Drag the battery to connect the circuit!", type: 'action' as const },
  { message: "Press START CHARGE to begin storing energy!", type: 'action' as const },
  { message: "Watch the energy gauge fill up!", type: 'learn' as const },
  { message: "The capacitor is full! Press DISCHARGE!", type: 'action' as const },
  { message: "Mini-game: Balance electrons to hit the target!", type: 'action' as const },
];

export const CapacitorStage = ({ onComplete }: CapacitorStageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEducation, setShowEducation] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sparkMessage, setSparkMessage] = useState("Welcome to Capacitor Cosmos!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('idle');

  // Step states
  const [batteryConnected, setBatteryConnected] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const [discharged, setDischarged] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [targetCharge, setTargetCharge] = useState(50);
  const [playerCharge, setPlayerCharge] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!showEducation && currentStep < STEPS.length) {
      setPopupVisible(true);
    }
  }, [currentStep, showEducation]);

  // Charging animation
  useEffect(() => {
    if (charging && chargeLevel < 100) {
      const interval = setInterval(() => {
        setChargeLevel(prev => {
          if (prev >= 100) {
            setCharging(false);
            setSparkMessage("Fully charged! Now release the energy!");
            setSparkMood('celebrating');
            setTimeout(() => setCurrentStep(3), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [charging, chargeLevel]);

  const handlePopupDismiss = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const handleBatteryDrop = () => {
    if (currentStep === 0) {
      setBatteryConnected(true);
      setDragOver(false);
      setSparkMessage("Battery connected! Ready to charge!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(1);
        setSparkMood('speaking');
        setSparkMessage("Press the charge button to start!");
      }, 1000);
    }
  };

  const handleStartCharge = () => {
    if (currentStep === 1) {
      setCharging(true);
      setCurrentStep(2);
      setSparkMessage("Electrons are flowing onto the plates!");
      setSparkMood('encouraging');
    }
  };

  const handleDischarge = () => {
    if (currentStep === 3 && chargeLevel === 100) {
      setDischarged(true);
      setChargeLevel(0);
      setSparkMessage("BOOM! Energy released in a flash!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setDischarged(false);
        setSparkMessage("Amazing! Now try the balance game!");
      }, 2000);
    }
  };

  const handleStartGame = () => {
    setCurrentStep(4);
    setGameActive(true);
    setGameScore(0);
    setPlayerCharge(0);
    setTargetCharge(Math.floor(Math.random() * 60) + 20);
    setSparkMessage("Match the target charge level!");
    setSparkMood('encouraging');
  };

  const handleAddCharge = () => {
    if (gameActive && playerCharge < 100) {
      setPlayerCharge(prev => Math.min(100, prev + 10));
    }
  };

  const handleRemoveCharge = () => {
    if (gameActive && playerCharge > 0) {
      setPlayerCharge(prev => Math.max(0, prev - 10));
    }
  };

  const handleSubmitCharge = () => {
    if (gameActive) {
      const accuracy = 100 - Math.abs(playerCharge - targetCharge);
      setGameScore(accuracy);
      setGameActive(false);
      
      const starsEarned = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
      setSparkMessage(`${accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Great!' : 'Good try!'} ${accuracy}% accuracy!`);
      setSparkMood('celebrating');
      setTimeout(() => setShowSummary(true), 1500);
    }
  };

  const starsEarned = gameScore >= 90 ? 3 : gameScore >= 70 ? 2 : 1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Educational Panel */}
      <EducationalPanel
        isVisible={showEducation}
        onClose={() => setShowEducation(false)}
        title="Welcome to Capacitor Cosmos! 🟢"
        explanation="A capacitor stores electrical energy like a rechargeable cosmic battery! It has two metal plates that hold opposite charges, creating an electric field between them."
        formula="C = Q / V"
        formulaExplanation="Capacitance equals Charge divided by Voltage"
        didYouKnow="The flash in your camera uses a capacitor! It stores energy slowly, then releases it super fast to create that bright flash of light."
        stageColor="capacitor"
      />

      {/* Step Indicator */}
      {!showEducation && !showSummary && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <StepIndicator currentStep={currentStep} totalSteps={5} stageColor="capacitor" />
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
          <div className="relative bg-card/50 backdrop-blur-md rounded-3xl border border-capacitor/30 p-8 min-h-[450px]">
            
            {/* Capacitor visualization */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
              {/* Left plate */}
              <div 
                className={`relative w-8 h-40 rounded-lg bg-gradient-to-b from-capacitor to-capacitor-glow transition-all duration-300 ${
                  chargeLevel > 0 ? 'glow-capacitor' : ''
                }`}
              >
                {/* Electrons on plate */}
                {chargeLevel > 0 && (
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    {[...Array(Math.floor(chargeLevel / 10))].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-electron animate-pulse"
                        style={{
                          left: '50%',
                          top: `${10 + i * 9}%`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                    ))}
                  </div>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-capacitor font-bold">−</span>
              </div>

              {/* Gap with electric field */}
              <div className="relative w-20 h-40 flex items-center justify-center">
                {chargeLevel > 50 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-0.5 bg-gradient-to-r from-capacitor via-electron to-capacitor opacity-50"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
                {/* Discharge burst */}
                {discharged && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-capacitor animate-ping" />
                    <span className="absolute text-4xl animate-bounce">⚡</span>
                  </div>
                )}
              </div>

              {/* Right plate */}
              <div 
                className={`relative w-8 h-40 rounded-lg bg-gradient-to-b from-capacitor to-capacitor-glow transition-all duration-300 ${
                  chargeLevel > 0 ? 'glow-capacitor' : ''
                }`}
              >
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-capacitor font-bold">+</span>
              </div>
            </div>

            {/* Battery drop zone */}
            {currentStep === 0 && !batteryConnected && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleBatteryDrop}
                className={`absolute left-16 top-1/2 -translate-y-1/2 w-24 h-32 rounded-xl border-2 border-dashed transition-all ${
                  dragOver ? 'border-capacitor bg-capacitor/30 scale-105' : 'border-capacitor/50 bg-capacitor/10'
                } flex items-center justify-center`}
              >
                <span className="text-capacitor/70 text-sm text-center">Drop<br/>Battery</span>
              </div>
            )}

            {/* Draggable battery */}
            {currentStep === 0 && !batteryConnected && (
              <div
                draggable
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 bg-gradient-to-r from-star to-yellow-400 rounded-2xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shadow-lg"
              >
                <span className="text-background font-bold text-lg">🔋 Battery</span>
              </div>
            )}

            {/* Connected battery */}
            {batteryConnected && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2 px-4 py-3 bg-gradient-to-r from-star to-yellow-400 rounded-xl">
                <span className="text-background font-bold">🔋</span>
              </div>
            )}

            {/* Charge gauge */}
            {batteryConnected && !gameActive && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-48 bg-muted rounded-full overflow-hidden border-2 border-capacitor/30">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-capacitor to-capacitor-glow transition-all duration-300"
                  style={{ height: `${chargeLevel}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-foreground font-bold text-sm rotate-[-90deg]">{chargeLevel}%</span>
                </div>
              </div>
            )}

            {/* Mini-game UI */}
            {gameActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border border-capacitor/30">
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground mb-2">Target Charge Level:</p>
                    <span className="text-4xl font-bold text-capacitor">{targetCharge}%</span>
                  </div>
                  
                  {/* Player charge gauge */}
                  <div className="w-64 h-8 bg-muted rounded-full overflow-hidden mb-6 border border-border">
                    <div
                      className="h-full bg-gradient-to-r from-capacitor to-capacitor-glow transition-all duration-200"
                      style={{ width: `${playerCharge}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-2xl font-bold text-foreground">{playerCharge}%</span>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleRemoveCharge}
                      variant="outline"
                      className="w-16 h-16 rounded-full text-2xl border-destructive text-destructive"
                    >
                      −
                    </Button>
                    <Button
                      onClick={handleAddCharge}
                      variant="outline"
                      className="w-16 h-16 rounded-full text-2xl border-capacitor text-capacitor"
                    >
                      +
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSubmitCharge}
                    className="mt-6 w-full py-4 text-lg font-bold rounded-full bg-gradient-to-r from-capacitor to-capacitor-glow"
                  >
                    Lock In! 🎯
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {batteryConnected && !gameActive && (
            <div className="mt-8 flex justify-center gap-4">
              {currentStep === 1 && (
                <Button
                  onClick={handleStartCharge}
                  className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-capacitor to-capacitor-glow hover:scale-105 transition-transform"
                >
                  ⚡ Start Charging
                </Button>
              )}
              {currentStep === 3 && chargeLevel === 100 && !discharged && (
                <>
                  <Button
                    onClick={handleDischarge}
                    className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-star to-yellow-400 text-background hover:scale-105 transition-transform"
                  >
                    💥 Discharge!
                  </Button>
                  <Button
                    onClick={handleStartGame}
                    variant="outline"
                    className="px-8 py-6 text-lg font-bold rounded-full border-capacitor text-capacitor hover:bg-capacitor/20"
                  >
                    🎮 Try Balance Game
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Panel */}
      <SummaryPanel
        isVisible={showSummary}
        stageName="Capacitor Cosmos"
        stageColor="capacitor"
        badgeName="Energy Guardian"
        badgeIcon="🟢"
        starsEarned={starsEarned}
        summaryPoints={[
          "Capacitors store electrical energy between two plates",
          "They charge slowly and can discharge instantly",
          "Used in camera flashes and phone batteries",
          "Capacitance is measured in Farads (F)",
        ]}
        onNextStage={() => onComplete(starsEarned)}
        onReplay={() => {
          setShowSummary(false);
          setShowEducation(true);
          setCurrentStep(0);
          setBatteryConnected(false);
          setCharging(false);
          setChargeLevel(0);
          setDischarged(false);
          setPlayerCharge(0);
          setGameScore(0);
        }}
      />

      {/* Sparky Mascot */}
      {!showEducation && !showSummary && (
        <SparkMascot message={sparkMessage} mood={sparkMood} />
      )}
    </div>
  );
};
