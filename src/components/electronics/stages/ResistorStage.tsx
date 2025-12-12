import { useState, useEffect, useCallback } from 'react';
import { SparkMascot } from '../SparkMascot';
import { PopupNotification } from '../PopupNotification';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Home, RotateCcw, ChevronRight, Zap, Battery, Lightbulb } from 'lucide-react';

interface ResistorStageProps {
  onComplete: (stars: number) => void;
}

interface Electron {
  id: number;
  delay: number;
}

const STEPS = [
  { step: 1, message: "Step 1: Drag the resistor into the gap.", type: 'action' as const },
  { step: 2, message: "Step 2: Add the battery and tap Power On!", type: 'action' as const },
  { step: 3, message: "Watch electrons slow down in the resistor!", type: 'hint' as const },
  { step: 4, message: "Try changing resistance — see the current change!", type: 'hint' as const },
  { step: 5, message: "Mini-challenge: Match the LED brightness!", type: 'action' as const },
];

export const ResistorStage = ({ onComplete }: ResistorStageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [popupVisible, setPopupVisible] = useState(true);
  const [sparkMessage, setSparkMessage] = useState("Let's learn about resistors!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('speaking');
  
  const [resistorPlaced, setResistorPlaced] = useState(false);
  const [batteryPlaced, setBatteryPlaced] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [resistance, setResistance] = useState(50);
  const [draggedOver, setDraggedOver] = useState(false);
  const [batteryDraggedOver, setBatteryDraggedOver] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  
  const [gameActive, setGameActive] = useState(false);
  const [targetBrightness, setTargetBrightness] = useState(60);
  const [gameWon, setGameWon] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const [electrons, setElectrons] = useState<Electron[]>([]);

  useEffect(() => {
    if (powerOn) {
      setElectrons(Array.from({ length: 6 }, (_, i) => ({ id: i, delay: i * 0.5 })));
    } else {
      setElectrons([]);
    }
  }, [powerOn]);

  useEffect(() => {
    if (currentStep >= 3 && powerOn) {
      setTimeout(() => setShowGraph(true), 400);
    }
  }, [currentStep, powerOn]);

  const handlePopupDismiss = useCallback(() => setPopupVisible(false), []);

  const voltage = 9;
  const current = voltage / Math.max(resistance, 1);
  const electronSpeed = Math.max(1.5, 5 - (resistance / 25));
  const brightness = Math.min(100, Math.max(10, (current / 0.18) * 100));

  const handleResistorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !resistorPlaced) {
      setResistorPlaced(true);
      setDraggedOver(false);
      setSparkMessage("Perfect! Resistor in place!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(2);
        setPopupVisible(true);
        setSparkMood('speaking');
        setSparkMessage("Now add the battery!");
      }, 1000);
    }
  };

  const handleBatteryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentStep === 2 && !batteryPlaced) {
      setBatteryPlaced(true);
      setBatteryDraggedOver(false);
      setSparkMessage("Tap Power On!");
      setSparkMood('encouraging');
    }
  };

  const handlePowerOn = () => {
    if (currentStep === 2 && batteryPlaced && !powerOn) {
      setPowerOn(true);
      setSparkMessage("Electrons flowing!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(3);
        setPopupVisible(true);
        setSparkMood('speaking');
      }, 1500);
    }
  };

  const handleResistanceChange = (value: number[]) => {
    setResistance(value[0]);
    if (currentStep >= 3) {
      setSparkMessage(value[0] > 70 ? "High resistance — slow electrons!" : value[0] < 30 ? "Low resistance — fast electrons!" : "Try different values!");
    }
    if (gameActive && Math.abs(brightness - targetBrightness) < 8) {
      setGameWon(true);
      setGameActive(false);
      setSparkMessage("You did it! More resistance = less current = dimmer light!");
      setSparkMood('celebrating');
      setTimeout(() => setShowSummary(true), 1500);
    }
  };

  const handleExploreComplete = () => {
    setCurrentStep(5);
    setPopupVisible(true);
    setTargetBrightness(30 + Math.floor(Math.random() * 40));
    setTimeout(() => {
      setGameActive(true);
      setSparkMessage("Match the target brightness!");
      setSparkMood('encouraging');
    }, 3000);
  };

  const handleGoHome = () => onComplete(gameWon ? 3 : 2);

  const handleReplay = () => {
    setCurrentStep(1);
    setResistorPlaced(false);
    setBatteryPlaced(false);
    setPowerOn(false);
    setResistance(50);
    setShowGraph(false);
    setGameActive(false);
    setGameWon(false);
    setShowSummary(false);
    setPopupVisible(true);
  };

  return (
    <div className="fixed inset-0 flex flex-col p-3 md:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 bg-card/60 backdrop-blur rounded-full px-3 py-1.5 border border-resistor/30">
          <div className="w-6 h-6 rounded-full bg-resistor flex items-center justify-center">
            <span className="text-background font-bold text-xs">{currentStep}</span>
          </div>
          <span className="text-foreground/80 text-sm">of 5</span>
        </div>
        <div className="flex items-center gap-2 bg-card/60 backdrop-blur rounded-full px-3 py-1.5 border border-resistor/30">
          <span className="text-lg">🔶</span>
          <span className="text-resistor font-bold text-sm hidden sm:inline">Resistor</span>
        </div>
      </div>

      <PopupNotification
        isVisible={popupVisible && !showSummary}
        message={STEPS[currentStep - 1]?.message || ""}
        type={STEPS[currentStep - 1]?.type || 'hint'}
        onDismiss={handlePopupDismiss}
        duration={3500}
      />

      {/* Main Content */}
      {!showSummary && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Circuit Area */}
          <div className="relative flex-1 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur rounded-2xl border border-resistor/30 overflow-hidden min-h-[200px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--resistor) / 0.6)" />
                  <stop offset="50%" stopColor="hsl(var(--resistor))" />
                  <stop offset="100%" stopColor="hsl(var(--resistor) / 0.6)" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              
              {batteryPlaced && (
                <g className="animate-fade-in">
                  <rect x="40" y="110" width="35" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--star))" strokeWidth="2" />
                  <rect x="50" y="105" width="15" height="8" fill="hsl(var(--star))" />
                  <text x="57" y="148" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">9V</text>
                </g>
              )}
              
              <path d="M 75 140 L 220 140" fill="none" stroke={powerOn ? "url(#wireGrad)" : "hsl(var(--muted))"} strokeWidth="5" strokeLinecap="round" filter={powerOn ? "url(#glow)" : ""} />
              
              {resistorPlaced ? (
                <g className="animate-scale-in" filter={powerOn ? "url(#glow)" : ""}>
                  <path d="M220 140 L240 140 L255 115 L285 165 L315 115 L345 165 L375 115 L395 140 L420 140" fill="none" stroke="hsl(var(--resistor))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="230" y="108" width="180" height="64" rx="8" fill="hsl(var(--resistor) / 0.15)" stroke="hsl(var(--resistor))" strokeWidth="1.5" />
                </g>
              ) : (
                <rect x="220" y="125" width="200" height="30" rx="6" fill="none" stroke="hsl(var(--resistor) / 0.4)" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
              )}
              
              <path d="M 420 140 L 600 140" fill="none" stroke={powerOn ? "url(#wireGrad)" : "hsl(var(--muted))"} strokeWidth="5" strokeLinecap="round" filter={powerOn ? "url(#glow)" : ""} />
              
              <g>
                <circle cx="660" cy="140" r="35" fill={powerOn ? `hsl(var(--star) / ${brightness / 100})` : "hsl(var(--muted) / 0.2)"} stroke="hsl(var(--border))" strokeWidth="2" filter={powerOn && brightness > 30 ? "url(#glow)" : ""} />
                <circle cx="660" cy="140" r="20" fill={powerOn ? `hsl(var(--star) / ${brightness / 80})` : "transparent"} />
              </g>
              
              <path d="M 695 140 L 695 240 L 75 240 L 75 170" fill="none" stroke={powerOn ? "url(#wireGrad)" : "hsl(var(--muted))"} strokeWidth="5" strokeLinecap="round" filter={powerOn ? "url(#glow)" : ""} />
              
              {powerOn && electrons.map((e) => (
                <circle key={e.id} r="6" fill="hsl(var(--electron))" filter="url(#glow)"
                  style={{
                    offsetPath: `path("M 75 140 L 220 140 L 240 140 L 255 115 L 285 165 L 315 115 L 345 165 L 375 115 L 395 140 L 420 140 L 600 140 L 660 140 L 695 140 L 695 240 L 75 240 L 75 140")`,
                    animation: `electron-path ${electronSpeed}s linear infinite`,
                    animationDelay: `${e.delay}s`,
                  }}
                />
              ))}
            </svg>

            {currentStep === 1 && !resistorPlaced && (
              <div onDragOver={(e) => { e.preventDefault(); setDraggedOver(true); }} onDragLeave={() => setDraggedOver(false)} onDrop={handleResistorDrop}
                className={`absolute left-[28%] top-[38%] w-[26%] h-[24%] rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${draggedOver ? 'border-resistor bg-resistor/30 scale-105' : 'border-resistor/50 bg-resistor/10'}`}>
                <span className="text-resistor/70 font-medium text-sm">Drop Here</span>
              </div>
            )}

            {currentStep === 2 && !batteryPlaced && (
              <div onDragOver={(e) => { e.preventDefault(); setBatteryDraggedOver(true); }} onDragLeave={() => setBatteryDraggedOver(false)} onDrop={handleBatteryDrop}
                className={`absolute left-[4%] top-[32%] w-[8%] h-[28%] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${batteryDraggedOver ? 'border-star bg-star/30' : 'border-star/50 bg-star/10'}`}>
                <Battery className="w-5 h-5 text-star/60" />
              </div>
            )}

            {currentStep === 1 && !resistorPlaced && (
              <div draggable onDragStart={(e) => e.dataTransfer.setData('text', 'resistor')}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-resistor to-resistor-glow rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-lg flex items-center gap-2 border border-resistor">
                <Zap className="w-5 h-5 text-background" />
                <span className="text-background font-bold">Resistor</span>
              </div>
            )}

            {currentStep === 2 && !batteryPlaced && (
              <div draggable onDragStart={(e) => e.dataTransfer.setData('text', 'battery')}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-star to-yellow-400 rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-lg flex items-center gap-2 border border-star">
                <Battery className="w-5 h-5 text-background" />
                <span className="text-background font-bold">9V Battery</span>
              </div>
            )}

            {currentStep === 2 && batteryPlaced && !powerOn && (
              <Button onClick={handlePowerOn} className="absolute bottom-3 left-1/2 -translate-x-1/2 px-8 py-5 text-lg font-bold rounded-full bg-gradient-to-r from-green-500 to-green-400 hover:scale-105 transition-all animate-pulse-glow">
                <Zap className="w-5 h-5 mr-2" />Power On!
              </Button>
            )}
          </div>

          {/* Controls Panel */}
          {showGraph && (
            <div className="mt-2 bg-card/60 backdrop-blur rounded-xl border border-resistor/30 p-3 animate-slide-up">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {/* Formula */}
                <div className="flex items-center gap-2 bg-resistor/10 rounded-lg px-3 py-2 border border-resistor/20">
                  <span className="text-star font-bold">V</span>
                  <span className="text-foreground">=</span>
                  <span className="text-electron font-bold">I</span>
                  <span className="text-foreground">×</span>
                  <span className="text-resistor font-bold">R</span>
                </div>
                {/* Values */}
                <div className="flex gap-2 text-xs">
                  <span className="bg-star/20 px-2 py-1 rounded text-star">{voltage}V</span>
                  <span className="bg-electron/20 px-2 py-1 rounded text-electron">{current.toFixed(2)}A</span>
                  <span className="bg-resistor/20 px-2 py-1 rounded text-resistor">{resistance}Ω</span>
                </div>
              </div>

              {/* Slider with presets */}
              <div className="flex items-center gap-2 mb-2">
                {[{ l: 'Low', v: 20 }, { l: 'Med', v: 50 }, { l: 'High', v: 80 }].map((p) => (
                  <Button key={p.l} onClick={() => handleResistanceChange([p.v])} variant={resistance === p.v ? 'default' : 'outline'} size="sm"
                    className={`flex-1 ${resistance === p.v ? 'bg-resistor' : 'border-resistor/40'}`}>{p.l}</Button>
                ))}
              </div>
              <Slider value={[resistance]} onValueChange={handleResistanceChange} min={10} max={100} step={1} className="w-full" />

              {/* Game or Continue */}
              {gameActive && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Target: {targetBrightness}%</div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-star/60 rounded-full" style={{ width: `${targetBrightness}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Your LED: {Math.round(brightness)}%</div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${Math.abs(brightness - targetBrightness) < 8 ? 'bg-green-500' : 'bg-electron'}`} style={{ width: `${brightness}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <Button onClick={() => setCurrentStep(4)} className="mt-2 w-full py-4 font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              {currentStep === 4 && !gameActive && (
                <Button onClick={handleExploreComplete} className="mt-2 w-full py-4 font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow">
                  Start Mini-Challenge! <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-card/80 backdrop-blur rounded-2xl border border-resistor/50 p-6 animate-scale-in">
            <div className="text-center mb-4">
              <div className="inline-flex w-14 h-14 rounded-full bg-gradient-to-br from-resistor to-resistor-glow items-center justify-center mb-2 animate-bounce">
                <span className="text-2xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Module Complete!</h2>
            </div>

            <div className="bg-resistor/10 rounded-xl p-4 border border-resistor/30 mb-4">
              <div className="flex items-center justify-center gap-2 bg-background/50 rounded-lg py-2 mb-3">
                <span className="text-star text-xl font-bold">V</span>
                <span className="text-foreground">=</span>
                <span className="text-electron text-xl font-bold">I</span>
                <span className="text-foreground">×</span>
                <span className="text-resistor text-xl font-bold">R</span>
              </div>
              <p className="text-center text-sm text-foreground">
                <span className="text-resistor">↑ Resistance</span> → <span className="text-electron">↓ Current</span> → <span className="text-star">Dimmer light</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🔶</span>
              <span className="font-bold text-resistor">Resistor Ranger Badge!</span>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReplay} variant="outline" className="flex-1 py-4 border-resistor/50">
                <RotateCcw className="w-4 h-4 mr-1" />Replay
              </Button>
              <Button onClick={handleGoHome} className="flex-1 py-4 bg-gradient-to-r from-resistor to-resistor-glow">
                <Home className="w-4 h-4 mr-1" />Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {!showSummary && <SparkMascot message={sparkMessage} mood={sparkMood} />}
    </div>
  );
};
