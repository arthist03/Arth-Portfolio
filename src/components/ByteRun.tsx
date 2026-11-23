import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { RotateCcw, Trophy, Shield, Maximize2, Minimize2, Users, User, Zap, Minus, Brain, Activity } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
type Point = { r: number; c: number };
type AiMode = "NEURAL" | "OVERFIT" | "HEURISTIC";

// 9x9 Balanced Connected Mazes (6 Distinct Layouts, 0 Dead Ends, 100% Reachable)
// 1 = Wall, 0 = Normal Byte (+10), 2 = Empty path, 3 = Power-up Byte (+50)
const MAZE_PRESETS: number[][][] = [
  // 0: Four Neobrutal Blocks
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 1: Center Diamond & Cross
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 2: Dual Central Pillars & Loops
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 3: The Sanctuary / Inner Orbit
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 4: Four L-Brackets
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 5: Double Horizon
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
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

function getWalkableCells(maze: number[][]): Point[] {
  const cells: Point[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (maze[r][c] !== 1) {
        cells.push({ r, c });
      }
    }
  }
  return cells;
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

// Validated random spawn points with minimum 5-tile ghost separation
function generateSpawns(maze: number[][]): { player: Point; ghost1: Point; ghost2: Point } {
  const walkable = getWalkableCells(maze);
  const MIN_PLAYER_GHOST_DIST = 5;
  const MIN_GHOST_GHOST_DIST = 3;

  const centerCandidates = [{ r: 4, c: 4 }, { r: 4, c: 3 }, { r: 4, c: 5 }, { r: 3, c: 4 }, { r: 5, c: 4 }]
    .filter((p) => maze[p.r][p.c] !== 1);
  const playerSpawn = centerCandidates.length > 0 ? centerCandidates[0] : walkable[0];

  const validGhost1s = walkable.filter(
    (cell) =>
      !(cell.r === playerSpawn.r && cell.c === playerSpawn.c) &&
      getBfsDistance(playerSpawn, cell, maze) >= MIN_PLAYER_GHOST_DIST
  );

  const g1 = validGhost1s.length > 0
    ? validGhost1s[Math.floor(Math.random() * validGhost1s.length)]
    : { r: 1, c: 1 };

  const validGhost2s = walkable.filter(
    (cell) =>
      !(cell.r === playerSpawn.r && cell.c === playerSpawn.c) &&
      !(cell.r === g1.r && cell.c === g1.c) &&
      getBfsDistance(playerSpawn, cell, maze) >= MIN_PLAYER_GHOST_DIST &&
      getBfsDistance(g1, cell, maze) >= MIN_GHOST_GHOST_DIST
  );

  const g2 = validGhost2s.length > 0
    ? validGhost2s[Math.floor(Math.random() * validGhost2s.length)]
    : { r: 7, c: 7 };

  return { player: playerSpawn, ghost1: g1, ghost2: g2 };
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

// Modern AI Vector Interception: projects player momentum through corridor intersections
function predictInterceptTarget(
  maze: number[][],
  player: Point,
  direction: Direction,
  lead: number = 2
): Point {
  if (!direction) return player;
  let dr = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
  let dc = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;

  let curr = player;
  for (let s = 1; s <= lead; s++) {
    const nr = curr.r + dr;
    const nc = curr.c + dc;
    if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9 && maze[nr][nc] !== 1) {
      curr = { r: nr, c: nc };
    } else {
      // Hit a corner or intersection wall: check orthogonal turn branches
      const turns = [
        { r: -dc, c: -dr },
        { r: dc, c: dr },
      ];
      for (const t of turns) {
        const tr = curr.r + t.r;
        const tc = curr.c + t.c;
        if (tr >= 0 && tr < 9 && tc >= 0 && tc < 9 && maze[tr][tc] !== 1) {
          curr = { r: tr, c: tc };
          dr = t.r;
          dc = t.c;
          break;
        }
      }
      break;
    }
  }
  return curr;
}

export const ByteRun: React.FC = () => {
  // Start with a random maze preset
  const initialMazeIdx = useRef(Math.floor(Math.random() * MAZE_PRESETS.length)).current;
  const initialSpawns = useRef(generateSpawns(MAZE_PRESETS[initialMazeIdx])).current;

  // Render states
  const [mazeIdx, setMazeIdx] = useState(initialMazeIdx);
  const [maze, setMaze] = useState<number[][]>(() => {
    const grid = MAZE_PRESETS[initialMazeIdx].map((row) => [...row]);
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRubberAnimating, setIsRubberAnimating] = useState(false);
  const [autoResize, setAutoResize] = useState(true);
  const [autoMinimizeCountdown, setAutoMinimizeCountdown] = useState<number | null>(null);
  const [aiMode, setAiMode] = useState<AiMode>("NEURAL");
  const [mouthOpen, setMouthOpen] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [scoreChip, setScoreChip] = useState<string | null>(null);

  // Master game loop reference decoupled from React render churn
  const loopRef = useRef({
    gameState: "IDLE" as "IDLE" | "PLAYING" | "WON" | "LOST",
    mazeIdx: initialMazeIdx,
    maze: MAZE_PRESETS[initialMazeIdx].map((row) => [...row]),
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
    gameStartTime: 0,
    ghostMode: "TWO" as "ONE" | "TWO",
    aiMode: "NEURAL" as AiMode,
    lastPlayerTime: 0,
    lastGhost1Time: 0,
    lastGhost2Time: 0,
    closeGhost: null as 1 | 2 | null,
    evasionCooldown: 0,
  });

  useEffect(() => {
    loopRef.current.ghostMode = ghostMode;
  }, [ghostMode]);

  useEffect(() => {
    loopRef.current.aiMode = aiMode;
  }, [aiMode]);

  // Dynamic Telemetry Metrics
  const dotsRemaining = maze.flat().filter((c) => c === 0 || c === 3).length;
  const initialDots = useMemo(() => MAZE_PRESETS[mazeIdx].flat().filter((c) => c === 0 || c === 3).length, [mazeIdx]);
  const lossValue = Math.max(0, dotsRemaining / (initialDots || 35));
  const lossDisplay = lossValue.toFixed(2);
  const speedBoost = Math.round((1 - lossValue) * 45);

  const currentGhostSpeed = useMemo(() => {
    let base = aiMode === "OVERFIT" ? 280 : aiMode === "HEURISTIC" ? 340 : 310;
    if (isOverclocked) return base + 160;
    return Math.max(210, base - speedBoost);
  }, [aiMode, isOverclocked, speedBoost]);

  const cycleAiMode = useCallback(() => {
    setAiMode((prev) => {
      const next: AiMode = prev === "NEURAL" ? "OVERFIT" : prev === "OVERFIT" ? "HEURISTIC" : "NEURAL";
      loopRef.current.aiMode = next;
      return next;
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const chipTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

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

  // Reset Game: always picks a DIFFERENT maze layout!
  const resetGame = useCallback(() => {
    const nextIdx = (loopRef.current.mazeIdx + 1 + Math.floor(Math.random() * (MAZE_PRESETS.length - 1))) % MAZE_PRESETS.length;
    const nextBase = MAZE_PRESETS[nextIdx];
    const spawns = generateSpawns(nextBase);
    const newMaze = nextBase.map((row) => [...row]);
    newMaze[spawns.player.r][spawns.player.c] = 2;

    const ref = loopRef.current;
    ref.gameState = "IDLE";
    ref.mazeIdx = nextIdx;
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
    ref.gameStartTime = 0;
    ref.closeGhost = null;
    ref.evasionCooldown = 0;
    ref.lastPlayerTime = 0;
    ref.lastGhost1Time = 0;
    ref.lastGhost2Time = 0;
    ref.aiMode = aiMode;

    setMazeIdx(nextIdx);
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
    setAutoMinimizeCountdown(null);
    setIsRubberAnimating(false);
    triggerHaptic(10);
    containerRef.current?.focus();
  }, [aiMode, triggerHaptic]);

  // Game Launch: starts immediately, only rubber-springs if expanding from compact mode
  const triggerGameStart = useCallback(
    (initialDir: Direction = "RIGHT") => {
      // Only spring-stretch when expanding from compact mode
      if (autoResize && !isExpanded) {
        setIsExpanded(true);
        setIsRubberAnimating(true);
        setTimeout(() => setIsRubberAnimating(false), 750);
      }

      loopRef.current.gameStartTime = performance.now();
      loopRef.current.direction = initialDir;
      loopRef.current.nextDirection = initialDir;
      setDirection(initialDir);
      loopRef.current.gameState = "PLAYING";
      setGameState("PLAYING");
      triggerHaptic(12);
    },
    [autoResize, isExpanded, triggerHaptic]
  );

  // Auto-minimize after 5 seconds on game end (WON or LOST)
  useEffect(() => {
    if ((gameState === "WON" || gameState === "LOST") && isExpanded && autoResize) {
      setAutoMinimizeCountdown(5);
      const interval = setInterval(() => {
        setAutoMinimizeCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setIsExpanded(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setAutoMinimizeCountdown(null);
    }
  }, [gameState, isExpanded, autoResize]);

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
      const elapsed = ref.gameStartTime > 0 ? time - ref.gameStartTime : 0;
      // First 5 seconds: Ghosts in SCATTER mode (patrol corners) to give player comfortable setup
      const isScatter = elapsed < 5000;

      // 1. PLAYER TICK (Every 175ms - Snappy & Responsive)
      if (time - ref.lastPlayerTime >= 175) {
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
                ref.overclockUntil = time + 5500;
                setIsOverclocked(true);
                triggerScoreChip("+50 LR BOOST!");
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

      // Dynamic Speed & Progressive Training Convergence Calculation
      const curDotsRemaining = ref.maze.flat().filter((c) => c === 0 || c === 3).length;
      const curLoss = Math.max(0, curDotsRemaining / 35);
      const curSpeedBoost = Math.round((1 - curLoss) * 45);

      // In scatter mode (first 5s), ghosts are relaxed (360ms/380ms) to give player comfortable setup
      let baseG1 = isScatter ? 360 : 310;
      let baseG2 = isScatter ? 380 : 330;
      let fleeG1 = 450;
      let fleeG2 = 490;

      if (ref.aiMode === "OVERFIT") {
        baseG1 = isScatter ? 330 : 275;
        baseG2 = isScatter ? 350 : 290;
      } else if (ref.aiMode === "HEURISTIC") {
        baseG1 = isScatter ? 390 : 340;
        baseG2 = isScatter ? 410 : 365;
      }

      const g1Interval = isFleeing ? fleeG1 : Math.max(215, baseG1 - curSpeedBoost);
      const g2Interval = isFleeing ? fleeG2 : Math.max(230, baseG2 - curSpeedBoost);

      // 2. GHOST 1 (Chaser - Gradient Pursuit / Scatter Policy) TICK
      if (time - ref.lastGhost1Time >= g1Interval) {
        ref.lastGhost1Time = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = { r: 1, c: 1 }; // Scatter: patrol top-left corner
        } else {
          target = ref.player; // Chase player
        }

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

      // 3. GHOST 2 (Predictor & Flanker - Vector Interception / Scatter Policy) TICK
      if (ref.ghostMode === "TWO" && time - ref.lastGhost2Time >= g2Interval) {
        ref.lastGhost2Time = time;

        let target: Point;

        if (isFleeing) {
          target = getFarthestCorner(ref.player, getFarthestCorner(ref.player));
        } else if (isScatter) {
          target = { r: 7, c: 7 }; // Scatter: patrol bottom-right corner
        } else if (ref.aiMode === "HEURISTIC") {
          ref.ghost2Cycle++;
          const cycle = Math.floor(ref.ghost2Cycle / 8);
          target = cycle % 2 === 0 ? ref.player : (cycle % 4 === 1 ? { r: 1, c: 7 } : { r: 7, c: 1 });
        } else {
          // NEURAL and OVERFIT: gentle flank
          const lead = ref.aiMode === "OVERFIT" ? 2 : 1;
          target = predictInterceptTarget(ref.maze, ref.player, ref.direction, lead);
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

  // Direction handler (starts immediately with 2s launch & elastic stretch from IDLE)
  const handleDirButton = (dir: Direction) => {
    setIsFocused(true);
    containerRef.current?.focus();
    loopRef.current.nextDirection = dir;
    triggerHaptic(8);
    if (gameState === "IDLE") {
      triggerGameStart(dir);
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
      if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "r") {
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
        loopRef.current.nextDirection = targetDir;
        if (gameState === "IDLE") {
          triggerGameStart(targetDir);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, isExpanded, gameState, resetGame, triggerGameStart]);

  // Touch handlers with real-time drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsFocused(true);
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
          triggerGameStart(targetDir);
        }
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsMinimized(false);
          setIsFocused(true);
        }}
        aria-label="Open Byte Run mini game"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-yellow-400 dark:bg-yellow-400 text-slate-900 border-2 border-slate-900 dark:border-white rounded-xl font-mono-code text-[11px] sm:text-xs font-black uppercase shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-slate-900 shrink-0" />
        <span className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" />
          <span>BYTE RUN</span>
        </span>
        <span className="text-[9px] bg-slate-900 text-yellow-300 px-1.5 py-0.5 rounded font-mono-code font-bold">
          {aiMode}
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Mobile Backdrop when expanded on very small screens */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-slate-950/45 dark:bg-black/65 backdrop-blur-[2px] z-40 sm:hidden animate-in fade-in duration-200"
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
        className={`select-none outline-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] touch-manipulation fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 origin-bottom-right ${
          isExpanded
            ? "w-[calc(100vw-24px)] xs:w-[380px] sm:w-[500px] md:w-[560px] max-w-[560px] max-h-[calc(100dvh-24px)] sm:max-h-[min(92vh,800px)] flex flex-col justify-end"
            : "w-[215px] sm:w-[225px]"
        } ${isRubberAnimating ? "animate-rubber-elastic" : ""}`}
        data-byte-run="true"
        aria-label="Byte Run mini arcade game widget"
      >
        <div
          className={`bg-white dark:bg-[#16171d] rounded-2xl border-3 transition-all duration-500 ${
            isExpanded ? "p-3 sm:p-5" : "p-3"
          } ${
            isFocused || isExpanded
              ? "border-yellow-400 dark:border-yellow-400 shadow-[6px_6px_0px_0px_#f59e0b] sm:shadow-[8px_8px_0px_0px_#f59e0b]"
              : "border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#ffffff]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-900/80 dark:border-slate-800 pb-1.5 mb-1.5 font-mono-code text-[11px] gap-1">
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
                <span className="text-[7.5px] sm:text-[8px] bg-indigo-600 text-white px-1 py-0.2 rounded font-bold animate-pulse">⚡LR-BOOST</span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Only show advanced AI and Auto buttons in expanded mode so compact mode never overflows */}
              {isExpanded && (
                <>
                  {/* Auto / Manual Resize Mode Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAutoResize((prev) => !prev);
                      triggerHaptic(8);
                      containerRef.current?.focus();
                    }}
                    aria-label={`Current resize mode: ${autoResize ? "AUTO" : "MANUAL"}. Tap to toggle.`}
                    title={
                      autoResize
                        ? "Mode: AUTO (Auto-expands on play, auto-minimizes 5s after game). Tap for Manual."
                        : "Mode: MANUAL (Resize only via manual buttons). Tap for Auto."
                    }
                    className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono-code font-black border flex items-center gap-0.5 transition-all active:scale-95 cursor-pointer touch-manipulation ${
                      autoResize
                        ? "bg-amber-50 dark:bg-amber-950/70 border-amber-500 text-amber-700 dark:text-amber-300"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500"
                    }`}
                  >
                    <span>{autoResize ? "AUTO" : "MANUAL"}</span>
                  </button>

                  {/* AI Policy Mode Toggle (Neural / Overfit / Heuristic) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleAiMode();
                      triggerHaptic(10);
                      containerRef.current?.focus();
                    }}
                    aria-label={`Current AI mode: ${aiMode}. Tap to cycle.`}
                    title={`AI Policy: ${aiMode} (Tap to cycle Neural / Overfit / Heuristic)`}
                    className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono-code font-black border flex items-center gap-0.5 transition-all active:scale-95 cursor-pointer touch-manipulation ${
                      aiMode === "NEURAL"
                        ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                        : aiMode === "OVERFIT"
                        ? "bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-700 dark:text-rose-300"
                        : "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    <Brain className="w-2.5 h-2.5 inline" />
                    <span>{aiMode}</span>
                  </button>
                </>
              )}

              {/* Ghost Count Toggle: 1 Bug vs 2 Bugs */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGhostMode((prev) => (prev === "TWO" ? "ONE" : "TWO"));
                  triggerHaptic(10);
                  containerRef.current?.focus();
                }}
                aria-label={ghostMode === "TWO" ? "Switch to 1 Ghost" : "Switch to 2 Ghosts"}
                title={ghostMode === "TWO" ? "2 Bugs Active (Tap for 1)" : "1 Bug Active (Tap for 2)"}
                className={`px-1 py-0.5 rounded text-[8.5px] font-mono-code font-bold border transition-colors touch-manipulation cursor-pointer ${
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

              {/* Toggle Expand / Normal Size (Manual Option) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => {
                    const next = !prev;
                    if (next) {
                      setIsRubberAnimating(true);
                      setTimeout(() => setIsRubberAnimating(false), 750);
                    }
                    return next;
                  });
                  setIsFocused(true);
                  triggerHaptic(10);
                  containerRef.current?.focus();
                }}
                aria-label={isExpanded ? "Collapse to compact size" : "Enlarge game screen"}
                title={isExpanded ? "Collapse size (Esc)" : "Expand into large screen"}
                className="p-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all touch-manipulation cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
              </button>

              {/* Minimize to dock pill (Manual Option) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                  triggerHaptic(10);
                }}
                aria-label="Minimize game to badge"
                title="Minimize to floating pill"
                className="p-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all touch-manipulation cursor-pointer"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>

          {/* AI Telemetry & Score Strip */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1 mb-1.5 px-0.5 text-[8.5px] font-mono-code font-bold text-slate-500 dark:text-slate-400 relative">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white">
              <span>SCORE:</span>
              <span className="text-amber-500 dark:text-yellow-400 font-extrabold text-[9.5px]">
                {score.toString().padStart(3, "0")}
              </span>
              {highScore > 0 && (
                <span className="flex items-center text-amber-600 dark:text-amber-400 text-[8px]" title={`Best: ${highScore}`}>
                  <Trophy className="w-2.5 h-2.5 inline" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <Activity className="w-2.5 h-2.5 text-indigo-500 inline" />
                <span>LOSS:</span>
                <span className="text-indigo-650 dark:text-indigo-300 font-extrabold">{lossDisplay}</span>
              </span>
              <span>
                SPD:<span className="text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">{currentGhostSpeed}ms</span>
              </span>
            </div>

            {/* Floating Score Feedback Chip */}
            {scoreChip && (
              <span className="absolute -top-3.5 right-0 text-[8px] font-mono-code font-black bg-yellow-400 text-slate-950 px-1 py-0.2 rounded border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] animate-bounce z-20">
                {scoreChip}
              </span>
            )}
          </div>

          {/* 9x9 Maze Viewport with touchAction: none for smooth gesture scrolling */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              setIsFocused(true);
              if (gameState === "IDLE") {
                triggerGameStart("RIGHT");
              }
            }}
            style={{ touchAction: "none" }}
            className={`relative mx-auto bg-slate-50 dark:bg-[#0c0d11] rounded-xl border-2 border-slate-900 dark:border-slate-700 overflow-hidden cursor-pointer transition-all duration-500 ease-out select-none ${
              isExpanded
                ? "w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[420px] md:max-w-[460px] aspect-square"
                : "w-[168px] h-[168px]"
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
                          r="4.5"
                          className="fill-cyan-400 dark:fill-cyan-300 animate-pulse stroke-slate-900 dark:stroke-slate-950"
                          strokeWidth="0.8"
                        />
                        <circle
                          cx={x + CELL_SIZE / 2}
                          cy={y + CELL_SIZE / 2}
                          r="6.5"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="0.6"
                          strokeDasharray="2 2"
                          className="animate-spin"
                          opacity="0.6"
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
                  Model Converged.
                </span>
                <span className={`font-mono-code mt-0.5 opacity-90 ${isExpanded ? "text-[11px] sm:text-xs" : "text-[9px]"}`}>
                  Score: {score} (+100) • Loss: 0.00
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                    containerRef.current?.focus();
                  }}
                  className={`mt-2 font-mono-code font-bold uppercase bg-yellow-400 text-slate-950 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-300 active:scale-95 transition-all touch-manipulation cursor-pointer relative z-30 ${
                    isExpanded ? "px-4 py-1.5 text-xs" : "px-3 py-1 text-[9px]"
                  }`}
                >
                  Play Again ↻
                </button>
                {autoMinimizeCountdown !== null && (
                  <div className="mt-2.5 flex items-center gap-2 bg-slate-900/60 dark:bg-black/60 px-2.5 py-1 rounded-md border border-white/20">
                    <span className="font-mono-code text-[9px] sm:text-[10px] text-white">
                      Auto-minimizing in <span className="font-bold text-yellow-300">{autoMinimizeCountdown}s</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAutoMinimizeCountdown(null);
                        setAutoResize(false);
                      }}
                      className="font-mono-code text-[8.5px] font-bold uppercase text-yellow-300 hover:underline ml-1 cursor-pointer"
                    >
                      Stay
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === "LOST" && (
              <div className="absolute inset-0 bg-slate-900/90 dark:bg-black/95 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[1px] animate-in fade-in duration-200 z-20">
                <span className={`font-black uppercase font-mono-code text-red-400 tracking-wider ${isExpanded ? "text-xs sm:text-sm" : "text-[10px]"}`}>
                  Caught by a Bug.
                </span>
                <span className={`font-mono-code mt-0.5 text-slate-300 ${isExpanded ? "text-[11px] sm:text-xs" : "text-[9px]"}`}>
                  Final Score: {score} • Loss: {lossDisplay}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                    containerRef.current?.focus();
                  }}
                  className={`mt-2 font-mono-code font-bold uppercase bg-yellow-400 text-slate-950 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-300 active:scale-95 transition-all touch-manipulation cursor-pointer relative z-30 ${
                    isExpanded ? "px-4 py-1.5 text-xs" : "px-3 py-1 text-[9px]"
                  }`}
                >
                  Play Again ↻
                </button>
                {autoMinimizeCountdown !== null && (
                  <div className="mt-2.5 flex items-center gap-2 bg-slate-900/80 dark:bg-black/85 px-2.5 py-1 rounded-md border border-slate-700">
                    <span className="font-mono-code text-[9px] sm:text-[10px] text-slate-300">
                      Auto-minimizing in <span className="font-bold text-yellow-400">{autoMinimizeCountdown}s</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAutoMinimizeCountdown(null);
                        setAutoResize(false);
                      }}
                      className="font-mono-code text-[8.5px] font-bold uppercase text-yellow-400 hover:underline ml-1 cursor-pointer"
                    >
                      Stay
                    </button>
                  </div>
                )}
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
                  isExpanded ? "px-3 py-1 text-[10px] sm:text-xs" : "px-1.5 py-0.5 text-[8px]"
                }`}>
                  Swipe, tap keys, or click to play
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
                    ? "w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] text-base sm:text-lg font-black bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-600 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
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
                    ? "w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] text-base sm:text-lg font-black bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-600 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
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
                    ? "w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] text-base sm:text-lg font-black bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-600 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
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
                    ? "w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] text-base sm:text-lg font-black bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-600 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 active:translate-x-[1px] active:translate-y-[1px]"
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
                    ? "px-4 py-2.5 text-xs sm:text-sm bg-yellow-400 dark:bg-yellow-400 text-slate-950 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] hover:bg-yellow-300"
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
            // AUTONOMOUS AGENT SIMULATION
          </div>
        </div>
      </div>
    </>
  );
};

export default ByteRun;
