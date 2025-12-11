import { useState, useCallback } from 'react';
import { StarField } from '@/components/electronics/StarField';
import { WelcomeScreen } from '@/components/electronics/WelcomeScreen';
import { ProgressConstellation } from '@/components/electronics/ProgressConstellation';
import { ResistorStage } from '@/components/electronics/stages/ResistorStage';
import { InductorStage } from '@/components/electronics/stages/InductorStage';
import { CapacitorStage } from '@/components/electronics/stages/CapacitorStage';
import { DiodeStage } from '@/components/electronics/stages/DiodeStage';
import { FinalCelebration } from '@/components/electronics/FinalCelebration';

type GameState = 'welcome' | 'resistor' | 'inductor' | 'capacitor' | 'diode' | 'complete';

interface StageData {
  id: number;
  name: string;
  icon: string;
  color: string;
  completed: boolean;
  current: boolean;
  stars: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [stages, setStages] = useState<StageData[]>([
    { id: 1, name: 'Resistor', icon: '🔶', color: 'resistor', completed: false, current: false, stars: 0 },
    { id: 2, name: 'Inductor', icon: '🔵', color: 'inductor', completed: false, current: false, stars: 0 },
    { id: 3, name: 'Capacitor', icon: '🟢', color: 'capacitor', completed: false, current: false, stars: 0 },
    { id: 4, name: 'Diode', icon: '🔴', color: 'diode', completed: false, current: false, stars: 0 },
  ]);

  const totalStars = stages.reduce((sum, stage) => sum + stage.stars, 0);

  const updateStageStatus = useCallback((stageIndex: number, current: boolean, completed: boolean = false) => {
    setStages(prev => prev.map((stage, i) => ({
      ...stage,
      current: i === stageIndex ? current : false,
      completed: i === stageIndex ? completed : stage.completed,
    })));
  }, []);

  const handleStageComplete = useCallback((stageIndex: number, stars: number) => {
    setStages(prev => prev.map((stage, i) => 
      i === stageIndex 
        ? { ...stage, completed: true, current: false, stars }
        : stage
    ));

    // Move to next stage
    const nextStages: GameState[] = ['resistor', 'inductor', 'capacitor', 'diode', 'complete'];
    setGameState(nextStages[stageIndex + 1]);
  }, []);

  const handleStart = useCallback(() => {
    setGameState('resistor');
    updateStageStatus(0, true);
  }, [updateStageStatus]);

  const handlePlayAgain = useCallback(() => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      completed: false,
      current: false,
      stars: 0,
    })));
    setGameState('resistor');
    updateStageStatus(0, true);
  }, [updateStageStatus]);

  const handleGoHome = useCallback(() => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      completed: false,
      current: false,
      stars: 0,
    })));
    setGameState('welcome');
  }, []);

  const badges = stages
    .filter(s => s.completed)
    .map(s => ({
      name: s.id === 1 ? 'Resistor Ranger' : s.id === 2 ? 'Magnetic Master' : s.id === 3 ? 'Energy Guardian' : 'Current Controller',
      icon: s.icon,
      color: `text-${s.color}`,
    }));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cosmic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-cosmic-purple/10 to-cosmic-blue/10" />
      <StarField />

      {/* Progress bar - visible during stages */}
      {gameState !== 'welcome' && gameState !== 'complete' && (
        <ProgressConstellation stages={stages} totalStars={totalStars} />
      )}

      {/* Screens */}
      {gameState === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {gameState === 'resistor' && (
        <ResistorStage 
          onComplete={(stars) => handleStageComplete(0, stars)} 
        />
      )}

      {gameState === 'inductor' && (
        <InductorStage 
          onComplete={(stars) => handleStageComplete(1, stars)} 
        />
      )}

      {gameState === 'capacitor' && (
        <CapacitorStage 
          onComplete={(stars) => handleStageComplete(2, stars)} 
        />
      )}

      {gameState === 'diode' && (
        <DiodeStage 
          onComplete={(stars) => handleStageComplete(3, stars)} 
        />
      )}

      {gameState === 'complete' && (
        <FinalCelebration
          isVisible={true}
          totalStars={totalStars}
          badges={badges}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default Index;
