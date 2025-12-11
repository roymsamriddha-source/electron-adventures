import { useState, useEffect, useCallback } from 'react';
import { SparkMascot } from '../SparkMascot';
import { PopupNotification } from '../PopupNotification';
import { EducationalPanel } from '../EducationalPanel';
import { SummaryPanel } from '../SummaryPanel';
import { StepIndicator } from '../StepIndicator';
import { Button } from '@/components/ui/button';

interface DiodeStageProps {
  onComplete: (stars: number) => void;
}

const STEPS = [
  { message: "Connect the wires to the diode terminals!", type: 'action' as const },
  { message: "Toggle FORWARD BIAS — watch electrons flow!", type: 'action' as const },
  { message: "Now try REVERSE BIAS!", type: 'action' as const },
  { message: "Puzzle: Orient the diode to light the bulb!", type: 'action' as const },
];

export const DiodeStage = ({ onComplete }: DiodeStageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEducation, setShowEducation] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sparkMessage, setSparkMessage] = useState("Welcome to Diode Dimension!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('idle');

  // Step states
  const [wiresConnected, setWiresConnected] = useState(false);
  const [biasMode, setBiasMode] = useState<'none' | 'forward' | 'reverse'>('none');
  const [triedReverse, setTriedReverse] = useState(false);
  const [puzzleActive, setPuzzleActive] = useState(false);
  const [diodeRotation, setDiodeRotation] = useState(0);
  const [bulbLit, setBulbLit] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [anodeConnected, setAnodeConnected] = useState(false);
  const [cathodeConnected, setCathodeConnected] = useState(false);

  useEffect(() => {
    if (!showEducation && currentStep < STEPS.length) {
      setPopupVisible(true);
    }
  }, [currentStep, showEducation]);

  // Check puzzle solution
  useEffect(() => {
    if (puzzleActive) {
      // Correct orientation: 0 or 360 degrees (arrow pointing right = forward bias)
      const isCorrect = diodeRotation % 360 === 0;
      setBulbLit(isCorrect);
      if (isCorrect && !puzzleSolved) {
        setPuzzleSolved(true);
        setSparkMessage("BRILLIANT! You solved it! The LED lights up!");
        setSparkMood('celebrating');
        setTimeout(() => setShowSummary(true), 2000);
      }
    }
  }, [diodeRotation, puzzleActive, puzzleSolved]);

  const handlePopupDismiss = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const handleWireConnect = (terminal: 'anode' | 'cathode') => {
    if (currentStep === 0) {
      if (terminal === 'anode') setAnodeConnected(true);
      if (terminal === 'cathode') setCathodeConnected(true);

      if ((terminal === 'anode' && cathodeConnected) || (terminal === 'cathode' && anodeConnected)) {
        setWiresConnected(true);
        setSparkMessage("Both terminals connected! Now try the bias modes!");
        setSparkMood('celebrating');
        setTimeout(() => {
          setCurrentStep(1);
          setSparkMood('speaking');
          setSparkMessage("Toggle to Forward Bias to see electrons flow!");
        }, 1000);
      }
    }
  };

  const handleBiasToggle = (mode: 'forward' | 'reverse') => {
    setBiasMode(mode);
    
    if (mode === 'forward') {
      setSparkMessage("Forward bias! Electrons are flowing through like cars on a highway!");
      setSparkMood('celebrating');
      if (currentStep === 1) {
        setTimeout(() => {
          setCurrentStep(2);
          setSparkMessage("Now try Reverse Bias to see what happens!");
        }, 2000);
      }
    } else {
      setTriedReverse(true);
      setSparkMessage("Reverse bias! The electrons are BLOCKED! It's like a one-way door!");
      setSparkMood('encouraging');
      if (currentStep === 2 && !triedReverse) {
        setTimeout(() => {
          setCurrentStep(3);
          setSparkMessage("Now for the puzzle — can you light the LED?");
        }, 2500);
      }
    }
  };

  const handleStartPuzzle = () => {
    setPuzzleActive(true);
    setDiodeRotation(180); // Start wrong way
    setSparkMessage("Rotate the diode so electrons can flow and light the LED!");
    setSparkMood('encouraging');
  };

  const handleRotateDiode = () => {
    setDiodeRotation(prev => (prev + 90) % 360);
    setAttempts(prev => prev + 1);
  };

  const starsEarned = attempts <= 2 ? 3 : attempts <= 4 ? 2 : 1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Educational Panel */}
      <EducationalPanel
        isVisible={showEducation}
        onClose={() => setShowEducation(false)}
        title="Welcome to Diode Dimension! 🔴"
        explanation="A diode is a one-way door for electrons — they can only flow in one direction! When connected correctly (forward bias), current flows. When reversed, it's blocked!"
        formula="Anode → Cathode"
        formulaExplanation="Current flows from positive (Anode) to negative (Cathode)"
        didYouKnow="LEDs are special diodes that light up! The 'D' in LED stands for Diode. Your phone screen has millions of tiny LEDs!"
        stageColor="diode"
      />

      {/* Step Indicator */}
      {!showEducation && !showSummary && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <StepIndicator currentStep={currentStep} totalSteps={4} stageColor="diode" />
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
          <div className="relative bg-card/50 backdrop-blur-md rounded-3xl border border-diode/30 p-8 min-h-[450px]">
            
            {/* Diode visualization */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Diode symbol */}
              <div 
                className={`relative transition-transform duration-300 ${puzzleActive ? 'cursor-pointer hover:scale-105' : ''}`}
                style={{ transform: `rotate(${diodeRotation}deg)` }}
                onClick={puzzleActive ? handleRotateDiode : undefined}
              >
                <svg viewBox="0 0 200 100" className="w-48 h-24">
                  {/* Triangle (P-side) */}
                  <polygon
                    points="60,50 100,20 100,80"
                    className={`transition-all duration-300 ${
                      biasMode === 'forward' ? 'fill-diode' : 'fill-muted'
                    }`}
                  />
                  {/* Line (N-side) */}
                  <line
                    x1="100" y1="20" x2="100" y2="80"
                    className={`stroke-[4] transition-all duration-300 ${
                      biasMode === 'forward' ? 'stroke-diode' : 'stroke-muted-foreground'
                    }`}
                  />
                  {/* Wires */}
                  <line x1="20" y1="50" x2="60" y2="50" className="stroke-muted-foreground stroke-[3]" />
                  <line x1="100" y1="50" x2="180" y2="50" className="stroke-muted-foreground stroke-[3]" />
                  
                  {/* Labels */}
                  <text x="40" y="85" className="fill-diode text-xs font-bold">A</text>
                  <text x="105" y="85" className="fill-muted-foreground text-xs font-bold">C</text>
                </svg>

                {/* Electron flow animation */}
                {biasMode === 'forward' && !puzzleActive && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-electron glow-electron"
                        style={{
                          animation: 'electron-flow 1.5s linear infinite',
                          animationDelay: `${i * 0.4}s`,
                          left: '-10px',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Blocked indicator */}
                {biasMode === 'reverse' && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                    🚫
                  </div>
                )}
              </div>

              {/* Glow effect */}
              {biasMode === 'forward' && (
                <div className="absolute inset-0 rounded-full bg-diode blur-xl opacity-30 scale-150 animate-pulse" />
              )}
            </div>

            {/* Connection points */}
            {currentStep === 0 && !wiresConnected && (
              <>
                <button
                  onClick={() => handleWireConnect('anode')}
                  className={`absolute left-24 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-dashed transition-all ${
                    anodeConnected ? 'bg-diode border-diode' : 'bg-diode/20 border-diode/50 animate-pulse-glow'
                  } flex items-center justify-center`}
                >
                  <span className="text-foreground font-bold">{anodeConnected ? '✓' : 'A+'}</span>
                </button>
                <button
                  onClick={() => handleWireConnect('cathode')}
                  className={`absolute right-24 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-dashed transition-all ${
                    cathodeConnected ? 'bg-muted-foreground border-muted-foreground' : 'bg-muted/50 border-muted-foreground/50 animate-pulse-glow'
                  } flex items-center justify-center`}
                >
                  <span className="text-foreground font-bold">{cathodeConnected ? '✓' : 'C−'}</span>
                </button>
              </>
            )}

            {/* LED bulb for puzzle */}
            {puzzleActive && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className={`w-16 h-24 rounded-full transition-all duration-300 ${
                  bulbLit 
                    ? 'bg-gradient-to-b from-star to-yellow-500 glow-star' 
                    : 'bg-muted'
                }`}>
                  <div className="w-8 h-6 bg-muted-foreground mx-auto rounded-b-lg" />
                </div>
                <span className="block text-center mt-2 text-muted-foreground font-medium">LED</span>
              </div>
            )}

            {/* Puzzle rotate hint */}
            {puzzleActive && !puzzleSolved && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
                <span className="text-lg">👆 Tap diode to rotate</span>
              </div>
            )}
          </div>

          {/* Controls */}
          {wiresConnected && !puzzleActive && (
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Button
                onClick={() => handleBiasToggle('forward')}
                className={`px-8 py-6 text-lg font-bold rounded-full transition-all ${
                  biasMode === 'forward'
                    ? 'bg-gradient-to-r from-diode to-diode-glow scale-105'
                    : 'bg-muted hover:bg-diode/20'
                }`}
              >
                ⚡ Forward Bias
              </Button>
              <Button
                onClick={() => handleBiasToggle('reverse')}
                className={`px-8 py-6 text-lg font-bold rounded-full transition-all ${
                  biasMode === 'reverse'
                    ? 'bg-gradient-to-r from-muted-foreground to-muted scale-105'
                    : 'bg-muted hover:bg-muted-foreground/20'
                }`}
              >
                🚫 Reverse Bias
              </Button>
              {currentStep >= 3 && (
                <Button
                  onClick={handleStartPuzzle}
                  className="px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-star to-yellow-400 text-background hover:scale-105 transition-transform"
                >
                  🎮 Start LED Puzzle!
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Panel */}
      <SummaryPanel
        isVisible={showSummary}
        stageName="Diode Dimension"
        stageColor="diode"
        badgeName="Current Controller"
        badgeIcon="🔴"
        starsEarned={starsEarned}
        summaryPoints={[
          "Diodes allow current to flow in only ONE direction",
          "Forward bias = current flows, Reverse bias = blocked",
          "LEDs are diodes that emit light",
          "Used in circuits to protect and control current",
        ]}
        onNextStage={() => onComplete(starsEarned)}
        onReplay={() => {
          setShowSummary(false);
          setShowEducation(true);
          setCurrentStep(0);
          setWiresConnected(false);
          setBiasMode('none');
          setTriedReverse(false);
          setPuzzleActive(false);
          setDiodeRotation(0);
          setBulbLit(false);
          setPuzzleSolved(false);
          setAttempts(0);
          setAnodeConnected(false);
          setCathodeConnected(false);
        }}
        isLastStage
      />

      {/* Sparky Mascot */}
      {!showEducation && !showSummary && (
        <SparkMascot message={sparkMessage} mood={sparkMood} />
      )}
    </div>
  );
};
