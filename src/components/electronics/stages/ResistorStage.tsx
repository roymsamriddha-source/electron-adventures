import { useState, useEffect, useCallback, useRef } from 'react';
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
  x: number;
  delay: number;
}

const STEPS = [
  { step: 1, message: "Step 1: Drag the resistor into the gap in the wire.", type: 'action' as const },
  { step: 2, message: "Step 2: Add the battery and tap Power On!", type: 'action' as const },
  { step: 3, message: "Watch how electrons slow down inside the resistor!", type: 'hint' as const },
  { step: 4, message: "Try changing the resistance — see how current changes!", type: 'hint' as const },
  { step: 5, message: "Mini-challenge: Match the LED brightness to the target!", type: 'action' as const },
];

export const ResistorStage = ({ onComplete }: ResistorStageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [popupVisible, setPopupVisible] = useState(true);
  const [sparkMessage, setSparkMessage] = useState("Let's learn about resistors!");
  const [sparkMood, setSparkMood] = useState<'idle' | 'speaking' | 'celebrating' | 'encouraging'>('speaking');
  
  // Step states
  const [resistorPlaced, setResistorPlaced] = useState(false);
  const [batteryPlaced, setBatteryPlaced] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [resistance, setResistance] = useState(50);
  const [draggedOver, setDraggedOver] = useState(false);
  const [batteryDraggedOver, setBatteryDraggedOver] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  
  // Mini-game states
  const [gameActive, setGameActive] = useState(false);
  const [targetBrightness, setTargetBrightness] = useState(60);
  const [gameWon, setGameWon] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // Electrons for animation
  const [electrons, setElectrons] = useState<Electron[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize electrons
  useEffect(() => {
    if (powerOn) {
      const newElectrons = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 0,
        delay: i * 0.4,
      }));
      setElectrons(newElectrons);
    } else {
      setElectrons([]);
    }
  }, [powerOn]);

  // Show graph after step 3
  useEffect(() => {
    if (currentStep >= 3 && powerOn) {
      setTimeout(() => setShowGraph(true), 500);
    }
  }, [currentStep, powerOn]);

  const handlePopupDismiss = useCallback(() => {
    setPopupVisible(false);
  }, []);

  // Calculate current based on resistance (Ohm's Law: I = V/R)
  const voltage = 9; // 9V battery
  const current = voltage / Math.max(resistance, 1);
  const electronSpeed = Math.max(1.5, 6 - (resistance / 20));
  const brightness = Math.min(100, Math.max(10, (current / 0.18) * 100));

  const handleResistorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !resistorPlaced) {
      setResistorPlaced(true);
      setDraggedOver(false);
      setSparkMessage("Perfect! The resistor clicks into place!");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(2);
        setPopupVisible(true);
        setSparkMood('speaking');
        setSparkMessage("Now let's add power to our circuit!");
      }, 1200);
    }
  };

  const handleBatteryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentStep === 2 && !batteryPlaced) {
      setBatteryPlaced(true);
      setBatteryDraggedOver(false);
      setSparkMessage("Battery connected! Now tap Power On!");
      setSparkMood('encouraging');
    }
  };

  const handlePowerOn = () => {
    if (currentStep === 2 && batteryPlaced && !powerOn) {
      setPowerOn(true);
      setSparkMessage("Electrons are flowing! Watch them carefully...");
      setSparkMood('celebrating');
      setTimeout(() => {
        setCurrentStep(3);
        setPopupVisible(true);
        setSparkMood('speaking');
        setSparkMessage("See how electrons squeeze through the resistor?");
      }, 2000);
    }
  };

  const handleResistanceChange = (value: number[]) => {
    setResistance(value[0]);
    if (currentStep === 3 || currentStep === 4) {
      if (value[0] > 70) {
        setSparkMessage("High resistance! Electrons really slow down!");
      } else if (value[0] < 30) {
        setSparkMessage("Low resistance! Electrons zoom through!");
      } else {
        setSparkMessage("Perfect! See how current changes with resistance?");
      }
    }
    
    // Check game win condition
    if (gameActive) {
      const diff = Math.abs(brightness - targetBrightness);
      if (diff < 8) {
        setGameWon(true);
        setGameActive(false);
        setSparkMessage("You did it! More resistance → less current → dimmer light!");
        setSparkMood('celebrating');
        setTimeout(() => setShowSummary(true), 2000);
      }
    }
  };

  const handleExploreComplete = () => {
    setCurrentStep(5);
    setPopupVisible(true);
    setTargetBrightness(30 + Math.floor(Math.random() * 50));
    setTimeout(() => {
      setGameActive(true);
      setSparkMessage("Match the LED brightness to the target zone!");
      setSparkMood('encouraging');
    }, 3500);
  };

  const handleGoHome = () => {
    onComplete(gameWon ? 3 : 2);
  };

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
    setSparkMessage("Let's learn about resistors again!");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header with step indicator */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md rounded-full px-4 py-2 border border-resistor/30">
          <div className="w-8 h-8 rounded-full bg-resistor flex items-center justify-center">
            <span className="text-background font-bold text-sm">{currentStep}</span>
          </div>
          <span className="text-foreground/80 font-medium">of 5 Steps</span>
        </div>
        
        <div className="flex items-center gap-2 bg-card/60 backdrop-blur-md rounded-full px-4 py-2 border border-resistor/30">
          <span className="text-2xl">🔶</span>
          <span className="text-resistor font-bold hidden sm:inline">Resistor Module</span>
        </div>
      </div>

      {/* Popup Notification */}
      <PopupNotification
        isVisible={popupVisible && !showSummary}
        message={STEPS[currentStep - 1]?.message || ""}
        type={STEPS[currentStep - 1]?.type || 'hint'}
        onDismiss={handlePopupDismiss}
        duration={4000}
      />

      {/* Main Circuit Area */}
      {!showSummary && (
        <div className="relative w-full max-w-5xl mt-16">
          <div className="relative bg-gradient-to-br from-card/70 via-card/50 to-card/70 backdrop-blur-xl rounded-3xl border-2 border-resistor/30 p-6 md:p-10 min-h-[450px] overflow-hidden shadow-2xl">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-radial from-resistor/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Circuit SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
              {/* Main wire path */}
              <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--resistor) / 0.6)" />
                  <stop offset="50%" stopColor="hsl(var(--resistor))" />
                  <stop offset="100%" stopColor="hsl(var(--resistor) / 0.6)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Battery terminal left */}
              {batteryPlaced && (
                <g className="animate-fade-in">
                  <rect x="60" y="160" width="40" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--resistor))" strokeWidth="2" />
                  <rect x="70" y="155" width="20" height="10" fill="hsl(var(--resistor))" />
                  <text x="80" y="208" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="bold">9V</text>
                </g>
              )}
              
              {/* Left wire segment */}
              <path
                d={`M 100 200 L 280 200`}
                fill="none"
                stroke={powerOn ? "url(#wireGradient)" : "hsl(var(--muted))"}
                strokeWidth="6"
                strokeLinecap="round"
                filter={powerOn ? "url(#glow)" : "none"}
                className="transition-all duration-500"
              />
              
              {/* Resistor gap / placed resistor */}
              {resistorPlaced ? (
                <g className="animate-scale-in" filter={powerOn ? "url(#glow)" : "none"}>
                  <path
                    d="M280 200 L300 200 L315 170 L345 230 L375 170 L405 230 L435 170 L465 230 L480 200 L500 200"
                    fill="none"
                    stroke="hsl(var(--resistor))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Resistor body */}
                  <rect x="295" y="165" width="190" height="70" rx="10" fill="hsl(var(--resistor) / 0.2)" stroke="hsl(var(--resistor))" strokeWidth="2" />
                  {/* Color bands */}
                  <rect x="320" y="165" width="12" height="70" fill="hsl(var(--resistor))" opacity="0.8" />
                  <rect x="360" y="165" width="12" height="70" fill="hsl(var(--star))" opacity="0.8" />
                  <rect x="400" y="165" width="12" height="70" fill="hsl(var(--resistor))" opacity="0.8" />
                </g>
              ) : (
                <rect x="280" y="185" width="220" height="30" rx="8" fill="none" stroke="hsl(var(--resistor) / 0.4)" strokeWidth="3" strokeDasharray="10 5" className="animate-pulse" />
              )}
              
              {/* Right wire segment */}
              <path
                d={`M 500 200 L 700 200`}
                fill="none"
                stroke={powerOn ? "url(#wireGradient)" : "hsl(var(--muted))"}
                strokeWidth="6"
                strokeLinecap="round"
                filter={powerOn ? "url(#glow)" : "none"}
                className="transition-all duration-500"
              />
              
              {/* LED Bulb */}
              <g className="transition-all duration-300">
                <circle 
                  cx="750" 
                  cy="200" 
                  r="40" 
                  fill={powerOn ? `hsl(var(--star) / ${brightness / 100})` : "hsl(var(--muted) / 0.3)"}
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                  filter={powerOn && brightness > 30 ? "url(#glow)" : "none"}
                  className="transition-all duration-300"
                />
                <Lightbulb 
                  x={725} 
                  y={175} 
                  width={50} 
                  height={50}
                  className={`${powerOn ? 'text-star' : 'text-muted-foreground'} transition-colors duration-300`}
                />
              </g>
              
              {/* Return wire */}
              <path
                d={`M 750 240 L 750 320 L 100 320 L 100 240`}
                fill="none"
                stroke={powerOn ? "url(#wireGradient)" : "hsl(var(--muted))"}
                strokeWidth="6"
                strokeLinecap="round"
                filter={powerOn ? "url(#glow)" : "none"}
                className="transition-all duration-500"
              />
              
              {/* Flowing electrons */}
              {powerOn && electrons.map((electron) => (
                <g key={electron.id}>
                  <circle
                    r="8"
                    fill="hsl(var(--electron))"
                    filter="url(#glow)"
                    className="electron-particle"
                    style={{
                      offsetPath: `path("M 100 200 L 280 200 L 300 200 L 315 170 L 345 230 L 375 170 L 405 230 L 435 170 L 465 230 L 480 200 L 500 200 L 700 200 L 750 200 L 750 320 L 100 320 L 100 200")`,
                      animation: `electron-path ${electronSpeed}s linear infinite`,
                      animationDelay: `${electron.delay}s`,
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Resistor drag zone */}
            {currentStep === 1 && !resistorPlaced && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDraggedOver(true); }}
                onDragLeave={() => setDraggedOver(false)}
                onDrop={handleResistorDrop}
                className={`absolute left-[31%] top-[42%] w-[25%] h-[18%] rounded-2xl border-3 border-dashed transition-all duration-300 flex items-center justify-center ${
                  draggedOver 
                    ? 'border-resistor bg-resistor/30 scale-105 shadow-lg shadow-resistor/30' 
                    : 'border-resistor/50 bg-resistor/10'
                }`}
              >
                <span className="text-resistor/70 font-semibold text-lg">Drop Resistor Here</span>
              </div>
            )}

            {/* Battery drag zone */}
            {currentStep === 2 && !batteryPlaced && (
              <div
                onDragOver={(e) => { e.preventDefault(); setBatteryDraggedOver(true); }}
                onDragLeave={() => setBatteryDraggedOver(false)}
                onDrop={handleBatteryDrop}
                className={`absolute left-[6%] top-[35%] w-[8%] h-[25%] rounded-xl border-3 border-dashed transition-all duration-300 flex items-center justify-center ${
                  batteryDraggedOver 
                    ? 'border-star bg-star/30 scale-105' 
                    : 'border-star/50 bg-star/10'
                }`}
              >
                <Battery className="w-8 h-8 text-star/60" />
              </div>
            )}

            {/* Draggable Resistor */}
            {currentStep === 1 && !resistorPlaced && (
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text', 'resistor')}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-10 py-5 bg-gradient-to-r from-resistor to-resistor-glow rounded-2xl cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-200 shadow-xl glow-resistor flex items-center gap-3 border-2 border-resistor"
              >
                <Zap className="w-7 h-7 text-background" />
                <span className="text-background font-bold text-xl">Resistor</span>
              </div>
            )}

            {/* Draggable Battery */}
            {currentStep === 2 && !batteryPlaced && (
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text', 'battery')}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-10 py-5 bg-gradient-to-r from-star to-yellow-400 rounded-2xl cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-200 shadow-xl flex items-center gap-3 border-2 border-star"
              >
                <Battery className="w-7 h-7 text-background" />
                <span className="text-background font-bold text-xl">9V Battery</span>
              </div>
            )}

            {/* Power On Button */}
            {currentStep === 2 && batteryPlaced && !powerOn && (
              <Button
                onClick={handlePowerOn}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-12 py-7 text-xl font-bold rounded-full bg-gradient-to-r from-green-500 to-green-400 hover:scale-110 transition-all duration-200 shadow-xl animate-pulse-glow"
              >
                <Zap className="w-7 h-7 mr-2" />
                Power On!
              </Button>
            )}
          </div>

          {/* Ohm's Law Graph Panel */}
          {showGraph && (currentStep === 3 || currentStep === 4) && (
            <div className="mt-6 bg-card/70 backdrop-blur-xl rounded-2xl border border-resistor/30 p-6 animate-slide-up">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Visual Formula */}
                <div className="flex items-center gap-4 bg-resistor/10 rounded-xl px-6 py-4 border border-resistor/30">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-star flex items-center justify-center">
                      <Battery className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-2xl font-bold text-star">V</span>
                  </div>
                  <span className="text-2xl text-foreground">=</span>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-electron flex items-center justify-center">
                      <Zap className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-2xl font-bold text-electron">I</span>
                  </div>
                  <span className="text-2xl text-foreground">×</span>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-resistor flex items-center justify-center">
                      <span className="text-background font-bold">Ω</span>
                    </div>
                    <span className="text-2xl font-bold text-resistor">R</span>
                  </div>
                </div>

                {/* Live values */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="text-center bg-star/10 rounded-xl py-3 px-4 border border-star/30">
                    <div className="text-sm text-muted-foreground">Voltage</div>
                    <div className="text-2xl font-bold text-star">{voltage}V</div>
                  </div>
                  <div className="text-center bg-electron/10 rounded-xl py-3 px-4 border border-electron/30">
                    <div className="text-sm text-muted-foreground">Current</div>
                    <div className="text-2xl font-bold text-electron">{current.toFixed(2)}A</div>
                  </div>
                  <div className="text-center bg-resistor/10 rounded-xl py-3 px-4 border border-resistor/30">
                    <div className="text-sm text-muted-foreground">Resistance</div>
                    <div className="text-2xl font-bold text-resistor">{resistance}Ω</div>
                  </div>
                </div>
              </div>

              {/* Simple bar graph */}
              <div className="mt-6 flex items-end gap-4 h-24">
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-electron to-electron/50 rounded-t-lg transition-all duration-300"
                    style={{ height: `${Math.min(100, current * 55)}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">Current</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-resistor to-resistor/50 rounded-t-lg transition-all duration-300"
                    style={{ height: `${resistance}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">Resistance</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-star to-star/50 rounded-t-lg transition-all duration-300"
                    style={{ height: `${brightness}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">Brightness</span>
                </div>
              </div>
            </div>
          )}

          {/* Resistance Slider Control */}
          {powerOn && (currentStep >= 3) && !showSummary && (
            <div className="mt-6 bg-card/70 backdrop-blur-xl rounded-2xl border border-resistor/30 p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-foreground font-bold text-lg">Adjust Resistance</span>
                <span className="text-resistor font-bold text-2xl">{resistance}Ω</span>
              </div>
              
              {/* Preset buttons */}
              <div className="flex gap-3 mb-4">
                {[
                  { label: 'Low', value: 20 },
                  { label: 'Medium', value: 50 },
                  { label: 'High', value: 80 },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => handleResistanceChange([preset.value])}
                    variant={resistance === preset.value ? 'default' : 'outline'}
                    className={`flex-1 py-6 text-lg font-bold rounded-xl transition-all ${
                      resistance === preset.value 
                        ? 'bg-resistor hover:bg-resistor/80' 
                        : 'border-resistor/50 hover:bg-resistor/20'
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              <Slider
                value={[resistance]}
                onValueChange={handleResistanceChange}
                min={10}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>10Ω (Fast electrons)</span>
                <span>100Ω (Slow electrons)</span>
              </div>

              {/* Mini-game or continue button */}
              {currentStep === 4 && !gameActive && (
                <Button
                  onClick={handleExploreComplete}
                  className="mt-6 w-full py-7 text-xl font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow hover:scale-105 transition-all"
                >
                  Start Mini-Challenge!
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              )}

              {currentStep === 3 && (
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="mt-6 w-full py-7 text-xl font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow hover:scale-105 transition-all"
                >
                  Continue to Exploration
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              )}
            </div>
          )}

          {/* Mini-game LED brightness matching */}
          {gameActive && (
            <div className="mt-6 bg-card/70 backdrop-blur-xl rounded-2xl border border-star/30 p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-center text-foreground mb-4">
                Match the LED Brightness!
              </h3>
              
              <div className="flex items-center gap-6">
                {/* Target brightness */}
                <div className="flex-1 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Target</div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-star/50 to-star rounded-full transition-all"
                      style={{ width: `${targetBrightness}%` }}
                    />
                  </div>
                  <div className="text-star font-bold mt-1">{targetBrightness}%</div>
                </div>

                {/* Current brightness */}
                <div className="flex-1 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Your LED</div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        Math.abs(brightness - targetBrightness) < 8 
                          ? 'bg-gradient-to-r from-green-500 to-green-400' 
                          : 'bg-gradient-to-r from-electron/50 to-electron'
                      }`}
                      style={{ width: `${brightness}%` }}
                    />
                  </div>
                  <div className="text-electron font-bold mt-1">{Math.round(brightness)}%</div>
                </div>
              </div>

              <p className="text-center text-muted-foreground mt-4 text-sm">
                Adjust the resistance slider above to match the target brightness!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Card */}
      {showSummary && (
        <div className="w-full max-w-2xl animate-scale-in">
          <div className="bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-xl rounded-3xl border-2 border-resistor/50 p-8 shadow-2xl">
            {/* Success animation */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-resistor to-resistor-glow mb-4 animate-bounce">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Module Complete!</h2>
              <p className="text-muted-foreground">You've mastered the Resistor!</p>
            </div>

            {/* Summary content */}
            <div className="bg-resistor/10 rounded-2xl p-6 border border-resistor/30 mb-6">
              {/* Mini animated graph */}
              <div className="flex items-end justify-center gap-3 h-16 mb-4">
                <div className="w-8 bg-gradient-to-t from-electron to-electron/50 rounded-t animate-pulse" style={{ height: '40%' }} />
                <div className="w-8 bg-gradient-to-t from-resistor to-resistor/50 rounded-t animate-pulse" style={{ height: '80%', animationDelay: '0.2s' }} />
                <div className="w-8 bg-gradient-to-t from-star to-star/50 rounded-t animate-pulse" style={{ height: '30%', animationDelay: '0.4s' }} />
              </div>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground mb-4">
                <span>Current</span>
                <span>Resistance</span>
                <span>Brightness</span>
              </div>

              {/* Formula */}
              <div className="flex items-center justify-center gap-3 bg-background/50 rounded-xl py-4 mb-4">
                <span className="text-star text-2xl font-bold">V</span>
                <span className="text-foreground text-xl">=</span>
                <span className="text-electron text-2xl font-bold">I</span>
                <span className="text-foreground text-xl">×</span>
                <span className="text-resistor text-2xl font-bold">R</span>
              </div>

              {/* Key takeaway */}
              <p className="text-center text-foreground font-medium">
                <span className="text-resistor">Higher resistance</span> → 
                <span className="text-electron"> less current</span> → 
                <span className="text-star"> dimmer light</span>
              </p>
            </div>

            {/* Badge earned */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-3xl">🔶</span>
              <span className="text-xl font-bold text-resistor">Resistor Ranger Badge Earned!</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleReplay}
                variant="outline"
                className="flex-1 py-6 text-lg font-bold rounded-full border-resistor/50 hover:bg-resistor/20"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Replay
              </Button>
              <Button
                onClick={handleGoHome}
                className="flex-1 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-resistor to-resistor-glow hover:scale-105 transition-all"
              >
                <Home className="w-5 h-5 mr-2" />
                Continue Journey
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sparky Mascot */}
      {!showSummary && (
        <SparkMascot message={sparkMessage} mood={sparkMood} />
      )}
    </div>
  );
};
