/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine.ts';
import { LEVELS } from './game/levels.ts';
import { GameState, RunStats } from './game/types.ts';
import { GameHUD } from './components/GameHUD.tsx';
import { TouchControls } from './components/TouchControls.tsx';
import { TitleScreen } from './components/TitleScreen.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';
import { HowToPlayModal } from './components/HowToPlayModal.tsx';

interface HudData {
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  shurikens: number;
  maxShurikens: number;
  score: number;
  scrolls: number;
  totalScrolls: number;
  time: number;
  levelName: string;
  bossHp?: number;
  bossMaxHp?: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ninja_school_unlocked_level');
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ninja_school_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('ninja_school_level_stars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastRunStats, setLastRunStats] = useState<RunStats | null>(null);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  const [hudData, setHudData] = useState<HudData>({
    hp: 100,
    maxHp: 100,
    chakra: 100,
    maxChakra: 100,
    shurikens: 15,
    maxShurikens: 25,
    score: 0,
    scrolls: 0,
    totalScrolls: 3,
    time: 0,
    levelName: LEVELS[0].name,
  });

  // Keep state machine synced with document.body.dataset.state
  const updateGameState = useCallback((state: GameState) => {
    setGameState(state);
    document.body.dataset.state = state;
  }, []);

  // Initialize or resize game canvas
  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use responsive device pixel ratio or standard 16:9 pixel resolution
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    if (engineRef.current) {
      engineRef.current.canvas.width = w;
      engineRef.current.canvas.height = h;
    }
  }, []);

  // Launch a specific level
  const startLevel = useCallback((levelId: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetLevel = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    setCurrentLevelId(targetLevel.id);

    if (!engineRef.current) {
      engineRef.current = new GameEngine(canvas, targetLevel);
    } else {
      engineRef.current.loadLevel(targetLevel);
    }

    const engine = engineRef.current;

    // Setup HUD update callback
    engine.onHudUpdate = (hud) => {
      setHudData(hud);
    };

    // Setup victory / gameover callback
    engine.onStateChange = (stats: RunStats) => {
      setLastRunStats(stats);
      if (stats.cleared) {
        updateGameState('gameover'); // Modal state is gameover/result

        // Update high score
        if (stats.score > highScore) {
          setHighScore(stats.score);
          try {
            localStorage.setItem('ninja_school_high_score', stats.score.toString());
          } catch {}
        }

        // Unlock next level
        if (targetLevel.id + 1 > unlockedLevel && targetLevel.id < LEVELS.length) {
          const next = targetLevel.id + 1;
          setUnlockedLevel(next);
          try {
            localStorage.setItem('ninja_school_unlocked_level', next.toString());
          } catch {}
        }

        // Update stars
        setLevelStars((prev) => {
          const updated = {
            ...prev,
            [targetLevel.id]: Math.max(prev[targetLevel.id] || 0, stats.stars),
          };
          try {
            localStorage.setItem('ninja_school_level_stars', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } else {
        updateGameState('gameover');
      }
    };

    setIsLevelSelectOpen(false);
    setIsHowToPlayOpen(false);
    updateGameState('playing');
    engine.start();
  }, [highScore, unlockedLevel, updateGameState]);

  // Handle autostart query param & initial mount
  useEffect(() => {
    setupCanvasSize();
    window.addEventListener('resize', setupCanvasSize);

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startLevel(1);
    }

    return () => {
      window.removeEventListener('resize', setupCanvasSize);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [setupCanvasSize, startLevel]);

  // Window key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      // Global Start handshake for title screen
      if (gameState === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        startLevel(currentLevelId);
        return;
      }

      if (engineRef.current && gameState === 'playing') {
        engineRef.current.handleKeyDown(e.code);
        if (e.code === 'KeyP' || e.code === 'Escape') {
          updateGameState('paused');
        }
      } else if (gameState === 'paused' && (e.code === 'KeyP' || e.code === 'Escape')) {
        engineRef.current?.togglePause();
        updateGameState('playing');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (engineRef.current) {
        engineRef.current.handleKeyUp(e.code);
      }
    };

    const handleBlur = () => {
      if (engineRef.current) {
        engineRef.current.clearInputs();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, currentLevelId, startLevel, updateGameState]);

  // Pause action
  const handlePause = () => {
    if (engineRef.current && gameState === 'playing') {
      engineRef.current.togglePause();
      updateGameState('paused');
    }
  };

  // Resume action
  const handleResume = () => {
    if (engineRef.current && gameState === 'paused') {
      engineRef.current.togglePause();
      updateGameState('playing');
    }
  };

  // Restart level
  const handleRestart = () => {
    startLevel(currentLevelId);
  };

  // Next level
  const handleNextLevel = () => {
    if (currentLevelId < LEVELS.length) {
      startLevel(currentLevelId + 1);
    } else {
      updateGameState('title');
    }
  };

  // Return to title screen
  const handleHome = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    updateGameState('title');
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden font-pixel">
      {/* Simulation Canvas */}
      <canvas
        ref={canvasRef}
        data-testid="game-canvas"
        className="w-full h-full block pixelated"
      />

      {/* Live Gameplay HUD */}
      {gameState === 'playing' && (
        <>
          <GameHUD
            hp={hudData.hp}
            maxHp={hudData.maxHp}
            chakra={hudData.chakra}
            maxChakra={hudData.maxChakra}
            shurikens={hudData.shurikens}
            maxShurikens={hudData.maxShurikens}
            score={hudData.score}
            scrolls={hudData.scrolls}
            totalScrolls={hudData.totalScrolls}
            time={hudData.time}
            levelName={hudData.levelName}
            bossHp={hudData.bossHp}
            bossMaxHp={hudData.bossMaxHp}
            onPause={handlePause}
            onRestart={handleRestart}
          />
          <TouchControls engine={engineRef.current} />
        </>
      )}

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={() => startLevel(currentLevelId)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          highScore={highScore}
        />
      )}

      {/* Paused Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Victory Modal */}
      {gameState === 'gameover' && lastRunStats?.cleared && (
        <VictoryModal
          stats={lastRunStats}
          hasNextLevel={currentLevelId < LEVELS.length}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Defeat / Game Over Modal */}
      {gameState === 'gameover' && !lastRunStats?.cleared && lastRunStats && (
        <GameOverModal
          stats={lastRunStats}
          onRetry={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Level Select Modal */}
      {isLevelSelectOpen && (
        <LevelSelectModal
          unlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={(id) => startLevel(id)}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      )}

      {/* How to Play / Ninja Jutsu Codex Modal */}
      {isHowToPlayOpen && (
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
      )}
    </div>
  );
}
