import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Trophy, Shield, Maximize2, Minimize2, Users, User, Zap } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
type Point = { r: number; c: number };

// 9x9 Balanced Connected Maze with Four 2x2 Obstacle Boxes (0 Dead Ends)
// 1 = Wall, 0 = Normal Byte (+10), 2 = Empty path, 3 = Power-up Byte (+50)
const BASE_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 0, 0, 0, 3, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const CORNERS: Point[] = [
  { r: 1, c: 1 },
  { r: 1, c: 7 },
  { r: 7, c: 1 },
  { r: 7, c: 7 },
];

function getFarthestCorner(p: Point, exclude?: Point | null): Point {
  let best = CORNERS[0];
  let maxD = -1;
  for (const c of CORNERS) {
    if (exclude && c.r === exclude.r && c.c === exclude.c) continue;
    const d = Math.abs(c.r - p.r) + Math.abs(c.c - p.c);
    if (d > maxD) {
      maxD = d;
      best = c;
    }
  }
  return best;
}

const CELL_SIZE = 20;

// All walkable cells in the 9x9 maze
const WALKABLE_CELLS: Point[] = [];
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    if (BASE_MAZE[r][c] !== 1) {
      WALKABLE_CELLS.push({ r, c });
    }
  }
}

// Lightweight BFS Distance
function getBfsDistance(start: Point, end: Point, maze: number[][]): number {
  if (start.r === end.r && start.c === end.c) return 0;
  const queue: { r: number; c: number; d: number }[] = [{ r: start.r, c: start.c, d: 0 }];
  const visited = Array.from({ length: 9 }, () => Array(9).fill(false));
  visited[start.r][start.c] = true;

  const directions = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  while (queue.length > 0) {
    const { r, c, d } = queue.shift()!;
    if (r === end.r && c === end.c) return d;

    for (const dir of directions) {
      const nr = r + dir.r;
      const nc = c + dir.c;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && maze[nr][nc] !== 1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push({ r: nr, c: nc, d: d + 1 });
      }
    }
  }
  return 999;
}

// Validated random spawn points
function generateSpawns(maze: number[][]): { player: Point; ghost1: Point; ghost2: Point } {
  const walkable = [...WALKABLE_CELLS];
  const MIN_PLAYER_GHOST_DIST = 3;
  const MIN_GHOST_GHOST_DIST = 2;

  let bestSpawns = {
    player: { r: 4, c: 4 },
    ghost1: { r: 1, c: 1 },
    ghost2: { r: 7, c: 7 },
  };

  for (let attempt = 0; attempt < 100; attempt++) {
    const playerIdx = Math.floor(Math.random() * walkable.length);
    const p = walkable[playerIdx];

    const validGhost1s = walkable.filter(
      (cell) =>
        !(cell.r === p.r && cell.c === p.c) &&
        getBfsDistance(p, cell, maze) >= MIN_PLAYER_GHOST_DIST
    );
    if (validGhost1s.length === 0) continue;

    const g1 = validGhost1s[Math.floor(Math.random() * validGhost1s.length)];

    const validGhost2s = walkable.filter(
      (cell) =>
        !(cell.r === p.r && cell.c === p.c) &&
        !(cell.r === g1.r && cell.c === g1.c) &&
        getBfsDistance(p, cell, maze) >= MIN_PLAYER_GHOST_DIST &&
        getBfsDistance(g1, cell, maze) >= MIN_GHOST_GHOST_DIST
    );
    if (validGhost2s.length === 0) continue;

    const g2 = validGhost2s[Math.floor(Math.random() * validGhost2s.length)];

    return { player: p, ghost1: g1, ghost2: g2 };
  }

  return bestSpawns;
}

// True BFS Shortest Path step finder with optional obstacle/ghost avoidance
function findBfsStep(
  maze: number[][],
  current: Point,
  target: Point,
  lastPos: Point | null,
  avoidPos?: Point | null
): Point {
  if (current.r === target.r && current.c === target.c) return current;

  const directions = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  const validMoves: Point[] = [];
  for (const d of directions) {
    const nr = current.r + d.r;
    const nc = current.c + d.c;
    if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && maze[nr][nc] !== 1) {
      validMoves.push({ r: nr, c: nc });
    }
  }

  if (validMoves.length === 0) return current;
  if (validMoves.length === 1) return validMoves[0];

  let candidates = validMoves;
  if (lastPos) {
    const nonReversals = validMoves.filter((m) => !(m.r === lastPos.r && m.c === lastPos.c));
    if (nonReversals.length > 0) {
      candidates = nonReversals;
    }
  }

  // Avoid clumping on other ghost if alternative path exists
  if (avoidPos && candidates.length > 1) {
    const nonAvoid = candidates.filter((m) => !(m.r === avoidPos.r && m.c === avoidPos.c));
    if (nonAvoid.length > 0) {
      candidates = nonAvoid;
    }
  }

  const queue: { pos: Point; firstMove: Point }[] = [];
  const visited = Array.from({ length: 9 }, () => Array(9).fill(false));
  visited[current.r][current.c] = true;

  for (const move of candidates) {
    visited[move.r][move.c] = true;
    queue.push({ pos: move, firstMove: move });
  }

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (item.pos.r === target.r && item.pos.c === target.c) {
      return item.firstMove;
    }

    for (const d of directions) {
      const nr = item.pos.r + d.r;
      const nc = item.pos.c + d.c;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && maze[nr][nc] !== 1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push({ pos: { r: nr, c: nc }, firstMove: item.firstMove });
      }
    }
  }

  let best = candidates[0];
  let minD = Infinity;
  for (const move of candidates) {
    const d = Math.abs(move.r - target.r) + Math.abs(move.c - target.c);
    if (d < minD) {
      minD = d;
      best = move;
    }
  }
  return best;
}

export const ByteRun: React.FC = () => {
  const initialSpawns = useRef(generateSpawns(BASE_MAZE)).current;

  // Render states
  const [maze, setMaze] = useState<number[][]>(() => {
    const grid = BASE_MAZE.map((row) => [...row]);
    grid[initialSpawns.player.r][initialSpawns.player.c] = 2;
    return grid;
  });

  const [player, setPlayer] = useState<Point>(initialSpawns.player);
  const [direction, setDirection] = useState<Direction>(null);

  // Ghost 1 (Chaser - Red)
  const [ghost1, setGhost1] = useState<Point>(initialSpawns.ghost1);
  const [ghost1Dir, setGhost1Dir] = useState<Direction>("UP");

  // Ghost 2 (Predictor - Cyan)
  const [ghost2, setGhost2] = useState<Point>(initialSpawns.ghost2);
  const [ghost2Dir, setGhost2Dir] = useState<Direction>("DOWN");

  // Ghost Count Mode ("TWO" vs "ONE")
  const [ghostMode, setGhostMode] = useState<"ONE" | "TWO">("TWO");

  // Game flow states
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "WON" | "LOST">("IDLE");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [scoreChip, setScoreChip] = useState<string | null>(null);

  // Master game loop reference decoupled from React render churn
  const loopRef = useRef({
    gameState: "IDLE" as "IDLE" | "PLAYING" | "WON" | "LOST",
    maze: BASE_MAZE.map((row) => [...row]),
    player: initialSpawns.player,
    playerPrev: null as Point | null,
    direction: null as Direction,
    nextDirection: null as Direction,
    ghost1: initialSpawns.ghost1,
    ghost1Prev: null as Point | null,
    ghost1Spawn: initialSpawns.ghost1,
    ghost2: initialSpawns.ghost2,
    ghost2Prev: null as Point | null,
    ghost2Spawn: initialSpawns.ghost2,
    ghost2Cycle: 0,
    score: 0,
    isProtected: true,
    overclockUntil: 0,
    ghostMode: "TWO" as "ONE" | "TWO",
    lastPlayerTime: 0,
    lastGhost1Time: 0,
    lastGhost2Time: 0,
    closeGhost: null as 1 | 2 | null,
    evasionCooldown: 0,
  });

  useEffect(() => {
    loopRef.current.ghostMode = ghostMode;
  }, [ghostMode]);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const chipTimeoutRef = useRef<NodeJS.Timeout>();

  // Subtle mobile haptic feedback
  const triggerHaptic = useCallback((pattern: number | number[] = 12) => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Haptics unavailable
    }
  }, []);

  // High score persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem("byte_run_high_score");
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      const best = Math.max(prev, newScore);
      try {
        localStorage.setItem("byte_run_high_score", best.toString());
      } catch {
        // Storage unavailable
      }
      return best;
    });
  }, []);

  // Floating score chip
  const triggerScoreChip = useCallback((text: string) => {
    setScoreChip(text);
    if (chipTimeoutRef.current) clearTimeout(chipTimeoutRef.current);
    chipTimeoutRef.current = setTimeout(() => {
      setScoreChip(null);
    }, 1200);
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    const spawns = generateSpawns(BASE_MAZE);
    const newMaze = BASE_MAZE.map((row) => [...row]);
    newMaze[spawns.player.r][spawns.player.c] = 2;

    const ref = loopRef.current;
    ref.gameState = "IDLE";
    ref.maze = newMaze;
    ref.player = spawns.player;
    ref.playerPrev = null;
    ref.direction = null;
    ref.nextDirection = null;
    ref.ghost1 = spawns.ghost1;
    ref.ghost1Prev = null;
    ref.ghost1Spawn = spawns.ghost1;
    ref.ghost2 = spawns.ghost2;
    ref.ghost2Prev = null;
    ref.ghost2Spawn = spawns.ghost2;
    ref.ghost2Cycle = 0;
    ref.score = 0;
    ref.isProtected = true;
    ref.overclockUntil = 0;
    ref.closeGhost = null;
    ref.evasionCooldown = 0;
    ref.lastPlayerTime = 0;
    ref.lastGhost1Time = 0;
    ref.lastGhost2Time = 0;

    setMaze(newMaze);
    setPlayer(spawns.player);
    setDirection(null);
    setGhost1(spawns.ghost1);
    setGhost1Dir("UP");
    setGhost2(spawns.ghost2);
    setGhost2Dir("DOWN");
    setScore(0);
    setGameState("IDLE");
    setIsProtected(true);
    setIsOverclocked(false);
    triggerHaptic(10);
    containerRef.current?.focus();
  }, [triggerHaptic]);

  // Spawn protection timer (3s)
  useEffect(() => {
    if (gameState === "PLAYING" && isProtected) {
      const timer = setTimeout(() => {
        setIsProtected(false);
        loopRef.current.isProtected = false;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, isProtected]);

  // Master Decoupled Game Loop
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    let animId: number;

    const gameLoop = (time: number) => {
      const ref = loopRef.current;

      if (ref.gameState !== "PLAYING") return;

      // Initialize frame timers on first frame
      if (ref.lastPlayerTime === 0) ref.lastPlayerTime = time;
      if (ref.lastGhost1Time === 0) ref.lastGhost1Time = time;
      if (ref.lastGhost2Time === 0) ref.lastGhost2Time = time;

      // Handle Overclock expiration
      if (ref.overclockUntil > 0 && time >= ref.overclockUntil) {
        ref.overclockUntil = 0;
        setIsOverclocked(false);
      }

      const isFleeing = time < ref.overclockUntil;

      // 1. PLAYER TICK (Every 190ms - Snappy & Responsive)
      if (time - ref.lastPlayerTime >= 190) {
        ref.lastPlayerTime = time;

        let dirToUse = ref.direction;

        // Try queued nextDirection
        if (ref.nextDirection) {
          let testR = ref.player.r;
          let testC = ref.player.c;
          if (ref.nextDirection === "UP") testR--;
          if (ref.nextDirection === "DOWN") testR++;
          if (ref.nextDirection === "LEFT") testC--;
          if (ref.nextDirection === "RIGHT") testC++;

          if (
            testR >= 0 &&
            testR < 9 &&
            testC >= 0 &&
            testC < 9 &&
            ref.maze[testR][testC] !== 1
          ) {
            dirToUse = ref.nextDirection;
            ref.direction = ref.nextDirection;
            setDirection(ref.nextDirection);
          }
        }

        if (dirToUse) {
          let nr = ref.player.r;
          let nc = ref.player.c;
          if (dirToUse === "UP") nr--;
          if (dirToUse === "DOWN") nr++;
          if (dirToUse === "LEFT") nc--;
          if (dirToUse === "RIGHT") nc++;

          if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && ref.maze[nr][nc] !== 1) {
            ref.playerPrev = ref.player;
            ref.player = { r: nr, c: nc };
            setPlayer({ r: nr, c: nc });

            // Immediate collision check on player step (direct hit and crossover swap)
            const hitG1Direct = ref.player.r === ref.ghost1.r && ref.player.c === ref.ghost1.c;
            const hitG1Crossover =
              ref.ghost1Prev &&
              ref.playerPrev &&
              ref.player.r === ref.ghost1Prev.r &&
              ref.player.c === ref.ghost1Prev.c &&
              ref.ghost1.r === ref.playerPrev.r &&
              ref.ghost1.c === ref.playerPrev.c;

            const hitG2Direct =
              ref.ghostMode === "TWO" &&
              ref.player.r === ref.ghost2.r &&
              ref.player.c === ref.ghost2.c;
            const hitG2Crossover =
              ref.ghostMode === "TWO" &&
              ref.ghost2Prev &&
              ref.playerPrev &&
              ref.player.r === ref.ghost2Prev.r &&
              ref.player.c === ref.ghost2Prev.c &&
              ref.ghost2.r === ref.playerPrev.r &&
              ref.ghost2.c === ref.playerPrev.c;

            if (hitG1Direct || hitG1Crossover) {
              if (isFleeing) {
                ref.ghost1 = ref.ghost1Spawn;
                ref.ghost1Prev = null;
                setGhost1(ref.ghost1Spawn);
                ref.score += 100;
                setScore(ref.score);
                updateHighScore(ref.score);
                triggerScoreChip("+100 REBOOT!");
                triggerHaptic([30, 80]);
              } else if (!ref.isProtected) {
                ref.gameState = "LOST";
                setGameState("LOST");
                updateHighScore(ref.score);
                triggerHaptic(40);
                return;
              }
            }

            if (hitG2Direct || hitG2Crossover) {
              if (isFleeing) {
                ref.ghost2 = ref.ghost2Spawn;
                ref.ghost2Prev = null;
                setGhost2(ref.ghost2Spawn);
                ref.score += 100;
                setScore(ref.score);
                updateHighScore(ref.score);
                triggerScoreChip("+100 REBOOT!");
                triggerHaptic([30, 80]);
              } else if (!ref.isProtected) {
                ref.gameState = "LOST";
                setGameState("LOST");
                updateHighScore(ref.score);
                triggerHaptic(40);
                return;
              }
            }

            // Collect dot / power-up
            const cellValue = ref.maze[nr][nc];
            if (cellValue === 0 || cellValue === 3) {
              const updatedMaze = ref.maze.map((row) => [...row]);
              updatedMaze[nr][nc] = 2;
              ref.maze = updatedMaze;
              setMaze(updatedMaze);

              const points = cellValue === 3 ? 50 : 10;
              ref.score += points;
              const newScore = ref.score;
              setScore(newScore);
              updateHighScore(newScore);

              if (cellValue === 3) {
                ref.overclockUntil = time + 6000;
                setIsOverclocked(true);
                triggerScoreChip("+50 OVERCLOCK!");
                triggerHaptic([25, 60, 25]);
              }

              // Win condition check
              const remaining = updatedMaze.flat().filter((c) => c === 0 || c === 3).length;
              if (remaining === 0) {
                ref.gameState = "WON";
                const winScore = ref.score + 100;
                ref.score = winScore;
                setScore(winScore);
                updateHighScore(winScore);
                setGameState("WON");
                triggerScoreChip("+100 WIN!");
                triggerHaptic([30, 60, 30, 60, 60]);
                return;
              }
            }

            setMouthOpen((prev) => !prev);
          }
        }
      }

      // 2. GHOST 1 (Chaser - Red Bug) TICK (300ms normal, 460ms when fleeing)
      const g1Interval = isFleeing ? 460 : 300;
      if (time - ref.lastGhost1Time >= g1Interval) {
        ref.lastGhost1Time = time;

        const target = isFleeing ? getFarthestCorner(ref.player) : ref.player;
        const next = findBfsStep(ref.maze, ref.ghost1, target, ref.ghost1Prev);

        if (next.r < ref.ghost1.r) setGhost1Dir("UP");
        else if (next.r > ref.ghost1.r) setGhost1Dir("DOWN");
        else if (next.c < ref.ghost1.c) setGhost1Dir("LEFT");
        else if (next.c > ref.ghost1.c) setGhost1Dir("RIGHT");

        ref.ghost1Prev = ref.ghost1;
        ref.ghost1 = next;
        setGhost1(next);

        // Immediate collision check (direct + crossover swap)
        const directHit = ref.player.r === next.r && ref.player.c === next.c;
        const crossoverHit =
          ref.playerPrev &&
          ref.playerPrev.r === next.r &&
          ref.playerPrev.c === next.c &&
          ref.player.r === ref.ghost1Prev.r &&
          ref.player.c === ref.ghost1Prev.c;

        if (directHit || crossoverHit) {
          if (isFleeing) {
            ref.ghost1 = ref.ghost1Spawn;
            ref.ghost1Prev = null;
            setGhost1(ref.ghost1Spawn);
            ref.score += 100;
            setScore(ref.score);
            updateHighScore(ref.score);
            triggerScoreChip("+100 REBOOT!");
            triggerHaptic([30, 80]);
          } else if (!ref.isProtected) {
            ref.gameState = "LOST";
            setGameState("LOST");
            updateHighScore(ref.score);
            triggerHaptic(40);
            return;
          }
        }

        // Evasion bonus check
        const d1 = getBfsDistance(ref.player, next, ref.maze);
        if (d1 === 1 && ref.closeGhost === null) {
          ref.closeGhost = 1;
        } else if (ref.closeGhost === 1 && d1 >= 3 && ref.evasionCooldown <= 0) {
          ref.score += 20;
          setScore(ref.score);
          updateHighScore(ref.score);
          triggerScoreChip("+20 EVADE");
          triggerHaptic(15);
          ref.closeGhost = null;
          ref.evasionCooldown = 8;
        }
      }

      // 3. GHOST 2 (Predictor - Cyan Bug) TICK (340ms normal, 500ms when fleeing, only in TWO mode)
      const g2Interval = isFleeing ? 500 : 340;
      if (ref.ghostMode === "TWO" && time - ref.lastGhost2Time >= g2Interval) {
        ref.lastGhost2Time = time;

        ref.ghost2Cycle++;
        const cycle = Math.floor(ref.ghost2Cycle / 8);
        const isIntercepting = cycle % 3 !== 2;

        let target: Point;

        if (isFleeing) {
          target = getFarthestCorner(ref.player, getFarthestCorner(ref.player));
        } else if (isIntercepting && ref.direction) {
          let pr = ref.player.r;
          let pc = ref.player.c;
          if (ref.direction === "UP") pr = Math.max(1, pr - 2);
          if (ref.direction === "DOWN") pr = Math.min(7, pr + 2);
          if (ref.direction === "LEFT") pc = Math.max(1, pc - 2);
          if (ref.direction === "RIGHT") pc = Math.min(7, pc + 2);

          if (ref.maze[pr][pc] !== 1) {
            target = { r: pr, c: pc };
          } else {
            target = ref.player;
          }
        } else {
          target = cycle % 2 === 0 ? { r: 1, c: 7 } : { r: 7, c: 1 };
        }

        // Avoid stepping onto Ghost 1's position to prevent merging
        const next = findBfsStep(ref.maze, ref.ghost2, target, ref.ghost2Prev, ref.ghost1);

        if (next.r < ref.ghost2.r) setGhost2Dir("UP");
        else if (next.r > ref.ghost2.r) setGhost2Dir("DOWN");
        else if (next.c < ref.ghost2.c) setGhost2Dir("LEFT");
        else if (next.c > ref.ghost2.c) setGhost2Dir("RIGHT");

        ref.ghost2Prev = ref.ghost2;
        ref.ghost2 = next;
        setGhost2(next);

        // Immediate collision check (direct + crossover swap)
        const directHit = ref.player.r === next.r && ref.player.c === next.c;
        const crossoverHit =
          ref.playerPrev &&
          ref.playerPrev.r === next.r &&
          ref.playerPrev.c === next.c &&
          ref.player.r === ref.ghost2Prev.r &&
          ref.player.c === ref.ghost2Prev.c;

        if (directHit || crossoverHit) {
          if (isFleeing) {
            ref.ghost2 = ref.ghost2Spawn;
            ref.ghost2Prev = null;
            setGhost2(ref.ghost2Spawn);
            ref.score += 100;
            setScore(ref.score);
            updateHighScore(ref.score);
            triggerScoreChip("+100 REBOOT!");
            triggerHaptic([30, 80]);
          } else if (!ref.isProtected) {
            ref.gameState = "LOST";
            setGameState("LOST");
            updateHighScore(ref.score);
            triggerHaptic(40);
            return;
          }
        }

        // Evasion check for Ghost 2
        const d2 = getBfsDistance(ref.player, next, ref.maze);
        if (d2 === 1 && ref.closeGhost === null) {
          ref.closeGhost = 2;
        } else if (ref.closeGhost === 2 && d2 >= 3 && ref.evasionCooldown <= 0) {
          ref.score += 20;
          setScore(ref.score);
          updateHighScore(ref.score);
          triggerScoreChip("+20 EVADE");
          triggerHaptic(15);
          ref.closeGhost = null;
          ref.evasionCooldown = 8;
        }
      }

      if (ref.evasionCooldown > 0) {
        ref.evasionCooldown--;
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, triggerHaptic, triggerScoreChip, updateHighScore]);

  // Player Mouth Angle & Direction Rotation
  const getPlayerRotation = () => {
    switch (direction) {
      case "UP": return -90;
      case "DOWN": return 90;
      case "LEFT": return 180;
      default: return 0;
    }
  };

  // Pupil offsets for smooth eye tracking
  const getPupilOffset = (dir: Direction) => {
    switch (dir) {
      case "UP": return { dx: 0, dy: -0.9 };
      case "DOWN": return { dx: 0, dy: 0.9 };
      case "LEFT": return { dx: -0.9, dy: 0 };
      default: return { dx: 0.9, dy: 0 };
    }
  };

  const g1Pupil = getPupilOffset(ghost1Dir);
  const g2Pupil = getPupilOffset(ghost2Dir);

  // Direction handler (auto-expands to comfortable play mode and starts immediately from IDLE)
  const handleDirButton = (dir: Direction) => {
    setIsFocused(true);
    setIsExpanded(true);
    containerRef.current?.focus();
    loopRef.current.nextDirection = dir;
    triggerHaptic(8);
    if (gameState === "IDLE") {
      loopRef.current.direction = dir;
      setDirection(dir);
      loopRef.current.gameState = "PLAYING";
      setGameState("PLAYING");
    }
  };

  // Keyboard navigation & Enter/Space to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        return;
      }

      // Enter, Space, or R restarts game immediately on loss or win
      if (e.key === "Enter" || e.key === " " || key === "r") {
        if (loopRef.current.gameState === "LOST" || loopRef.current.gameState === "WON") {
          e.preventDefault();
          resetGame();
          return;
        }
      }

      if (!isFocused && !isExpanded) return;

      const key = e.key.toLowerCase();
      let targetDir: Direction = null;

      if (e.key === "ArrowUp" || key === "w") targetDir = "UP";
      else if (e.key === "ArrowDown" || key === "s") targetDir = "DOWN";
      else if (e.key === "ArrowLeft" || key === "a") targetDir = "LEFT";
      else if (e.key === "ArrowRight" || key === "d") targetDir = "RIGHT";

      if (targetDir) {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(true);
        loopRef.current.nextDirection = targetDir;
        if (gameState === "IDLE") {
          loopRef.current.direction = targetDir;
          setDirection(targetDir);
          loopRef.current.gameState = "PLAYING";
          setGameState("PLAYING");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, isExpanded, gameState, resetGame]);

  // Touch handlers with real-time drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (Math.hypot(dx, dy) >= 14) {
      let targetDir: Direction = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        targetDir = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        targetDir = dy > 0 ? "DOWN" : "UP";
      }

      if (targetDir) {
        loopRef.current.nextDirection = targetDir;
        triggerHaptic(8);
        if (gameState === "IDLE") {
          loopRef.current.direction = targetDir;
          setDirection(targetDir);
          loopRef.current.gameState = "PLAYING";
          setGameState("PLAYING");
        }
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <>
      {/* Mobile Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-slate-950/45 dark:bg-black/65 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        ref={containerRef}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => {
          if (gameState === "IDLE" && !isExpanded) {
            setIsFocused(false);
          }
        }}
        onClick={() => setIsFocused(true)}
        className={`select-none outline-none transition-all duration-300 ease-out touch-manipulation relative z-40 ${
          isExpanded
            ? "fixed inset-x-2.5 bottom-3.5 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[360px] !z-50 origin-bottom-right"
            : "my-8 mx-auto w-[min(240px,calc(100vw-32px))] md:my-0 md:fixed md:bottom-5 md:right-5"
        }`}
        data-byte-run="true"
        aria-label="Byte Run mini arcade game widget"
      >
        <div
          className={`bg-white dark:bg-[#16171d] rounded-2xl border-3 transition-all duration-300 ${
            isExpanded ? "p-3 sm:p-4" : "p-3"
          } ${
            isFocused || isExpanded
              ? "border-yellow-400 dark:border-yellow-400 shadow-[6px_6px_0px_0px_#f59e0b]"
              : "border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#ffffff]"
          }`}
        >
          {/* Header: BYTE RUN • Score: 080 + Ghost Mode Toggle + Expand Toggle */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-800 pb-2 mb-2 font-mono-code text-[11px] gap-1">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-900 dark:text-white shrink-0">
              <span
                className={`w-2 h-2 rounded-full border border-slate-900 dark:border-white shrink-0 ${
                  gameState === "PLAYING"
                    ? isOverclocked
                      ? "bg-indigo-500 animate-ping"
                      : isProtected
                      ? "bg-amber-400 animate-ping"
                      : "bg-emerald-400 animate-pulse"
                    : gameState === "LOST"
                    ? "bg-red-500"
                    : "bg-yellow-400"
                }`}
              />
              <span className="text-[10px] sm:text-[11px]">BYTE RUN</span>
              {isOverclocked && (
                <span className="text-[8px] bg-indigo-600 text-white px-1 rounded font-bold animate-pulse">⚡FLEE</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white relative">
                <span className="text-slate-400 dark:text-slate-500 text-[9px]">•</span>
                <span className="text-[10px] sm:text-[11px]">Score:</span>
                <span className="text-amber-500 dark:text-yellow-400 font-extrabold font-mono-code text-[10px] sm:text-[11px]">
                  {score.toString().padStart(3, "0")}
                </span>
                {highScore > 0 && (
                  <span
                    className="ml-0.5 flex items-center text-amber-600 dark:text-amber-400 text-[9px]"
                    title={`Best: ${highScore}`}
                  >
                    <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline" />
                  </span>
                )}

                {/* Floating Score Feedback Chip */}
                {scoreChip && (
                  <span className="absolute -top-4 right-0 text-[8px] font-mono-code font-bold bg-amber-400 text-slate-950 px-1 py-0.2 rounded border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] animate-bounce z-10">
                    {scoreChip}
                  </span>
                )}
              </div>

              {/* Ghost Mode Toggle: 1 Bug vs 2 Bugs */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGhostMode((prev) => (prev === "TWO" ? "ONE" : "TWO"));
                  triggerHaptic(10);
                  containerRef.current?.focus();
                }}
                aria-label={ghostMode === "TWO" ? "Switch to 1 Ghost" : "Switch to 2 Ghosts"}
                title={ghostMode === "TWO" ? "Current: 2 Bugs (Tap for 1 Bug)" : "Current: 1 Bug (Tap for 2 Bugs)"}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold border transition-colors touch-manipulation cursor-pointer ${
                  ghostMode === "TWO"
                    ? "bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {ghostMode === "TWO" ? (
                  <span className="flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5" /> 2
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5">
                    <User className="w-2.5 h-2.5" /> 1
                  </span>
                )}
              </button>

              {/* Toggle Expand / Minimize Size */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => !prev);
                  setIsFocused(true);
                  triggerHaptic(10);
                  containerRef.current?.focus();
                }}
                aria-label={isExpanded ? "Collapse to mini size" : "Enlarge game screen"}
                title={isExpanded ? "Collapse (Esc)" : "Expand into larger playable screen"}
                className="p-1 sm:p-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all touch-manipulation cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 9x9 Maze Viewport with touchAction: none for smooth gesture scrolling */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              if (!isExpanded) setIsExpanded(true);
              setIsFocused(true);
            }}
            style={{ touchAction: "none" }}
            className={`relative mx-auto bg-slate-50 dark:bg-[#0c0d11] rounded-xl border-2 border-slate-900 dark:border-slate-700 overflow-hidden cursor-pointer transition-all duration-300 ease-out select-none ${
              isExpanded
                ? "w-full max-w-[270px] xs:max-w-[290px] sm:max-w-[316px] aspect-square"
                : "w-[180px] h-[180px]"
            }`}
          >
            <svg viewBox="0 0 180 180" className="w-full h-full block">
              {/* Walls & Collectible Bytes */}
              {maze.map((row, r) =>
                row.map((cell, c) => {
                  const x = c * CELL_SIZE;
                  const y = r * CELL_SIZE;

                  if (cell === 1) {
                    return (
                      <rect
                        key={`wall-${r}-${c}`}
                        x={x + 1}
                        y={y + 1}
                        width={CELL_SIZE - 2}
                        height={CELL_SIZE - 2}
                        rx="3.5"
                        className="fill-slate-200 dark:fill-slate-800 stroke-slate-350 dark:stroke-slate-700"
                        strokeWidth="1"
                      />
                    );
                  }

                  // Normal Byte (+10)
                  if (cell === 0) {
                    return (
                      <rect
                        key={`dot-${r}-${c}`}
                        x={x + CELL_SIZE / 2 - 1.5}
                        y={y + CELL_SIZE / 2 - 1.5}
                        width="3"
                        height="3"
                        rx="0.6"
                        className="fill-amber-500 dark:fill-yellow-400 opacity-80"
                      />
                    );
                  }

                  // Special Power-up Byte (+50)
                  if (cell === 3) {
                    return (
                      <g key={`power-${r}-${c}`}>
                        <circle
                          cx={x + CELL_SIZE / 2}
                          cy={y + CELL_SIZE / 2}
                          r="4"
                          className="fill-cyan-400 dark:fill-cyan-300 animate-pulse stroke-slate-900 dark:stroke-slate-950"
                          strokeWidth="0.8"
                        />
                      </g>
                    );
                  }

                  return null;
                })
              )}

              {/* Player: Minimalist Pac-Man */}
              <g
                style={{
                  transform: `translate(${player.c * CELL_SIZE + 10}px, ${player.r * CELL_SIZE + 10}px)`,
                  transition: gameState === "PLAYING" ? "transform 0.19s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                }}
              >
                <g
                  style={{
                    transform: `rotate(${getPlayerRotation()}deg)`,
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  {mouthOpen && direction ? (
                    <path
                      d="M 0 0 L 7 -4 A 8 8 0 1 0 7 4 Z"
                      className="fill-yellow-400 dark:fill-yellow-300 stroke-slate-900 dark:stroke-slate-950"
                      strokeWidth="1"
                    />
                  ) : (
                    <circle
                      r="8"
                      cx="0"
                      cy="0"
                      className="fill-yellow-400 dark:fill-yellow-300 stroke-slate-900 dark:stroke-slate-950"
                      strokeWidth="1"
                    />
                  )}
                  {/* Pacman Eye */}
                  <circle cx="1" cy="-4" r="1.1" fill="#0f172a" />
                </g>

                {/* Spawn Protection Ring */}
                {isProtected && gameState === "PLAYING" && (
                  <circle
                    r="10.5"
                    cx="0"
                    cy="0"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Ghost 1: The Chaser (Red Bug / Fleeing Indigo in Overclock) */}
              <g
                style={{
                  transform: `translate(${ghost1.c * CELL_SIZE + 10}px, ${ghost1.r * CELL_SIZE + 10}px)`,
                  transition: gameState === "PLAYING" ? (isOverclocked ? "transform 0.44s ease-out" : "transform 0.26s cubic-bezier(0.25, 0.1, 0.25, 1)") : "none",
                }}
              >
                {/* Antennae */}
                <line x1="-3" y1="-7" x2="-5" y2="-9" stroke={isOverclocked ? "#818cf8" : "#ef4444"} strokeWidth="1.2" strokeLinecap="round" />
                <line x1="3" y1="-7" x2="5" y2="-9" stroke={isOverclocked ? "#818cf8" : "#ef4444"} strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="-5" cy="-9" r="0.8" fill={isOverclocked ? "#818cf8" : "#ef4444"} />
                <circle cx="5" cy="-9" r="0.8" fill={isOverclocked ? "#818cf8" : "#ef4444"} />
                {/* Body & Wavy Skirt */}
                <path
                  d="M -7 7 L -7 0 A 7 7 0 0 1 7 0 L 7 7 L 4 5.2 L 1 7 L -2 5.2 L -4 7 Z"
                  className={`${isOverclocked ? "fill-indigo-500 animate-pulse" : "fill-red-500"} stroke-slate-900 dark:stroke-slate-950`}
                  strokeWidth="1"
                />
                {/* Eyes with smooth directional tracking */}
                <circle cx="-3" cy="-1" r="2.1" fill="#ffffff" />
                <circle cx="3" cy="-1" r="2.1" fill="#ffffff" />
                <circle
                  cx={-3 + g1Pupil.dx}
                  cy={-1 + g1Pupil.dy}
                  r="1.05"
                  fill="#0f172a"
                  style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
                />
                <circle
                  cx={3 + g1Pupil.dx}
                  cy={-1 + g1Pupil.dy}
                  r="1.05"
                  fill="#0f172a"
                  style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
                />
              </g>

              {/* Ghost 2: The Predictor (Cyan Bug / Fleeing Purple in Overclock) - active in TWO mode */}
              {ghostMode === "TWO" && (
                <g
                  style={{
                    transform: `translate(${ghost2.c * CELL_SIZE + 10}px, ${ghost2.r * CELL_SIZE + 10}px)`,
                    transition: gameState === "PLAYING" ? (isOverclocked ? "transform 0.48s ease-out" : "transform 0.29s cubic-bezier(0.25, 0.1, 0.25, 1)") : "none",
                  }}
                >
                  {/* Antennae */}
                  <line x1="-3" y1="-7" x2="-5" y2="-9" stroke={isOverclocked ? "#c084fc" : "#06b6d4"} strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="3" y1="-7" x2="5" y2="-9" stroke={isOverclocked ? "#c084fc" : "#06b6d4"} strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="-5" cy="-9" r="0.8" fill={isOverclocked ? "#c084fc" : "#06b6d4"} />
                  <circle cx="5" cy="-9" r="0.8" fill={isOverclocked ? "#c084fc" : "#06b6d4"} />
                  {/* Body & Wavy Skirt */}
                  <path
                    d="M -7 7 L -7 0 A 7 7 0 0 1 7 0 L 7 7 L 4 5.2 L 1 7 L -2 5.2 L -4 7 Z"
                    className={`${isOverclocked ? "fill-purple-500 animate-pulse" : "fill-cyan-500"} stroke-slate-900 dark:stroke-slate-950`}
                    strokeWidth="1"
                  />
                  {/* Eyes with smooth directional tracking */}
                  <circle cx="-3" cy="-1" r="2.1" fill="#ffffff" />
                  <circle cx="3" cy="-1" r="2.1" fill="#ffffff" />
                  <circle
                    cx={-3 + g2Pupil.dx}
                    cy={-1 + g2Pupil.dy}
                    r="1.05"
                    fill="#0f172a"
                    style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
                  />
                  <circle
                    cx={3 + g2Pupil.dx}
                    cy={-1 + g2Pupil.dy}
                    r="1.05"
                    fill="#0f172a"
                    style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
                  />
                </g>
              )}
            </svg>

            {/* Victory Overlay */}
            {gameState === "WON" && (
              <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[1px] animate-in fade-in duration-200 z-20">
                <span className={`font-black uppercase font-mono-code tracking-wider ${isExpanded ? "text-xs sm:text-sm" : "text-[10px]"}`}>
                  Challenge completed.
                </span>
                <span className={`font-mono-code mt-0.5 opacity-90 ${isExpanded ? "text-[11px] sm:text-xs" : "text-[9px]"}`}>
                  Score: {score} (+100 Bonus)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                    containerRef.current?.focus();
                  }}
                  className={`mt-2 font-mono-code font-bold uppercase bg-white text-slate-900 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-100 active:scale-95 transition-all touch-manipulation cursor-pointer relative z-30 ${
                    isExpanded ? "px-4 py-1.5 text-xs" : "px-2.5 py-0.5 text-[9px]"
                  }`}
                >
                  Play Again ↻
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === "LOST" && (
              <div className="absolute inset-0 bg-slate-900/90 dark:bg-black/95 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[1px] animate-in fade-in duration-200 z-20">
                <span className={`font-black uppercase font-mono-code text-red-400 tracking-wider ${isExpanded ? "text-xs sm:text-sm" : "text-[10px]"}`}>
                  Caught by a bug.
                </span>
                <span className={`font-mono-code mt-0.5 text-slate-300 ${isExpanded ? "text-[11px] sm:text-xs" : "text-[9px]"}`}>
                  Final Score: {score}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                    containerRef.current?.focus();
                  }}
                  className={`mt-2 font-mono-code font-bold uppercase bg-yellow-400 text-slate-950 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-300 active:scale-95 transition-all touch-manipulation cursor-pointer relative z-30 ${
                    isExpanded ? "px-4 py-1.5 text-xs" : "px-2.5 py-0.5 text-[9px]"
                  }`}
                >
                  Play Again ↻
                </button>
              </div>
            )}

            {/* Spawn Protection Active Hint */}
            {isProtected && gameState === "PLAYING" && (
              <div className="absolute top-2 inset-x-0 text-center pointer-events-none z-10">
                <span className={`inline-flex items-center gap-1 rounded font-mono-code font-bold bg-sky-500/90 text-white shadow-[1px_1px_0px_0px_#0f172a] ${
                  isExpanded ? "px-2.5 py-1 text-[9px] sm:text-[10px]" : "px-1.5 py-0.5 text-[8px]"
                }`}>
                  <Shield className={isExpanded ? "w-3 h-3 inline" : "w-2.5 h-2.5 inline"} /> SPAWN SHIELD
                </span>
              </div>
            )}

            {/* Overclock Active Hint */}
            {isOverclocked && gameState === "PLAYING" && (
              <div className="absolute top-2 inset-x-0 text-center pointer-events-none z-10">
                <span className={`inline-flex items-center gap-1 rounded font-mono-code font-bold bg-indigo-600/95 text-white shadow-[1px_1px_0px_0px_#0f172a] animate-pulse ${
                  isExpanded ? "px-2.5 py-1 text-[9px] sm:text-[10px]" : "px-1.5 py-0.5 text-[8px]"
                }`}>
                  <Zap className={isExpanded ? "w-3 h-3 inline" : "w-2.5 h-2.5 inline"} /> GHOSTS FLEEING
                </span>
              </div>
            )}

            {/* Idle Start Hint */}
            {gameState === "IDLE" && (
              <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                <span className={`rounded font-mono-code font-bold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] ${
                  isExpanded ? "px-2.5 py-0.5 text-[9px] sm:text-[10px]" : "px-1.5 py-0.5 text-[8px]"
                }`}>
                  Swipe or keys to move
                </span>
              </div>
            )}
          </div>

          {/* Footer: Large Thumb-friendly D-Pad on Mobile & Controls */}
          <div className={`flex items-center justify-between border-t border-slate-200 dark:border-slate-800 font-mono-code transition-all ${
            isExpanded ? "pt-2.5 mt-2.5 sm:pt-3 sm:mt-3 text-xs" : "pt-1.5 mt-2 text-[11px]"
          }`}>
            {/* Arrow Controls */}
            <div className={`flex items-center text-slate-800 dark:text-slate-200 font-bold ${
              isExpanded ? "gap-1.5 sm:gap-2" : "gap-1"
            }`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirButton("LEFT");
                }}
                aria-label="Move Left"
                className={`flex items-center justify-center rounded-lg border transition-all active:scale-90 touch-manipulation cursor-pointer ${
                  isExpanded
                    ? "w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] text-sm sm:text-base font-black bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-slate-600 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
                    : "w-6 h-6 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirButton("UP");
                }}
                aria-label="Move Up"
                className={`flex items-center justify-center rounded-lg border transition-all active:scale-90 touch-manipulation cursor-pointer ${
                  isExpanded
                    ? "w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] text-sm sm:text-base font-black bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-slate-600 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
                    : "w-6 h-6 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirButton("DOWN");
                }}
                aria-label="Move Down"
                className={`flex items-center justify-center rounded-lg border transition-all active:scale-90 touch-manipulation cursor-pointer ${
                  isExpanded
                    ? "w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] text-sm sm:text-base font-black bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-slate-600 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
                    : "w-6 h-6 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirButton("RIGHT");
                }}
                aria-label="Move Right"
                className={`flex items-center justify-center rounded-lg border transition-all active:scale-90 touch-manipulation cursor-pointer ${
                  isExpanded
                    ? "w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] text-sm sm:text-base font-black bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-slate-600 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
                    : "w-6 h-6 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                →
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                  containerRef.current?.focus();
                }}
                aria-label="Restart Game"
                className={`flex items-center gap-1 font-bold rounded-lg uppercase transition-all active:scale-95 touch-manipulation cursor-pointer ${
                  isExpanded
                    ? "px-3 py-2 text-[11px] sm:text-xs bg-yellow-400 dark:bg-yellow-400 text-slate-950 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-300"
                    : "text-[10px] text-slate-800 dark:text-slate-200 hover:text-amber-500 py-1"
                }`}
              >
                <span>Reset</span> <RotateCcw className={isExpanded ? "w-3 h-3 inline" : "w-2.5 h-2.5 inline"} />
              </button>
            </div>
          </div>

          {/* Tagline */}
          <div className={`font-mono-code text-center text-slate-400 dark:text-slate-500 uppercase tracking-tight ${
            isExpanded ? "text-[9px] mt-2" : "text-[8px] mt-1"
          }`}>
            A brief break from debugging.
          </div>
        </div>
      </div>
    </>
  );
};

export default ByteRun;
