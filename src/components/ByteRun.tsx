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

// Validated random spawn points with minimum 4-tile ghost separation in classic corners
function generateSpawns(maze: number[][]): {
  player: Point;
  blinky: Point;
  pinky: Point;
  inky: Point;
  clyde: Point;
} {
  const walkable = getWalkableCells(maze);
  const centerCandidates = [{ r: 4, c: 4 }, { r: 4, c: 3 }, { r: 4, c: 5 }, { r: 3, c: 4 }, { r: 5, c: 4 }]
    .filter((p) => maze[p.r][p.c] !== 1);
  const playerSpawn = centerCandidates.length > 0 ? centerCandidates[0] : walkable[0];

  // Blinky: Top-right quadrant
  const blinkyList = walkable.filter(
    (p) => p.r <= 3 && p.c >= 5 && getBfsDistance(playerSpawn, p, maze) >= 4
  );
  const blinky = blinkyList.length > 0 ? blinkyList[Math.floor(Math.random() * blinkyList.length)] : { r: 1, c: 7 };

  // Pinky: Top-left quadrant
  const pinkyList = walkable.filter(
    (p) => p.r <= 3 && p.c <= 3 && !(p.r === blinky.r && p.c === blinky.c) && getBfsDistance(playerSpawn, p, maze) >= 4
  );
  const pinky = pinkyList.length > 0 ? pinkyList[Math.floor(Math.random() * pinkyList.length)] : { r: 1, c: 1 };

  // Inky: Bottom-right quadrant
  const inkyList = walkable.filter(
    (p) => p.r >= 5 && p.c >= 5 && !(p.r === blinky.r && p.c === blinky.c) && getBfsDistance(playerSpawn, p, maze) >= 4
  );
  const inky = inkyList.length > 0 ? inkyList[Math.floor(Math.random() * inkyList.length)] : { r: 7, c: 7 };

  // Clyde: Bottom-left quadrant
  const clydeList = walkable.filter(
    (p) => p.r >= 5 && p.c <= 3 && !(p.r === pinky.r && p.c === pinky.c) && getBfsDistance(playerSpawn, p, maze) >= 4
  );
  const clyde = clydeList.length > 0 ? clydeList[Math.floor(Math.random() * clydeList.length)] : { r: 7, c: 1 };

  return { player: playerSpawn, blinky, pinky, inky, clyde };
}

// True BFS Shortest Path step finder with optional obstacle/ghost avoidance
function findBfsStep(
  maze: number[][],
  current: Point,
  target: Point,
  lastPos: Point | null,
  avoidPos?: Point | Point[] | null
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

  // Avoid clumping on other ghosts if alternative path exists
  if (avoidPos && candidates.length > 1) {
    const avoids = Array.isArray(avoidPos) ? avoidPos : [avoidPos];
    const nonAvoid = candidates.filter((m) => !avoids.some((a) => a.r === m.r && a.c === m.c));
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

// ==========================================
// AUTHENTIC PAC-MAN GHOST AI TARGETING
// ==========================================

// 1. Blinky (Red) – Direct Chase: Always targets Pac-Man's current position
function getBlinkyTarget(player: Point): Point {
  return player;
}

// 2. Pinky (Pink) – Ambush: Targets a position 3 tiles ahead of Pac-Man in movement direction
function getPinkyTarget(player: Point, direction: Direction): Point {
  if (!direction) return player;
  let dr = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
  let dc = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;
  return {
    r: Math.max(0, Math.min(8, player.r + dr * 3)),
    c: Math.max(0, Math.min(8, player.c + dc * 3)),
  };
}

// 3. Inky (Cyan) – Intercept: Uses Pac-Man's position and Blinky's position to calculate target.
// Selects the tile 2 spaces ahead of Pac-Man, and doubles the vector from Blinky!
function getInkyTarget(player: Point, direction: Direction, blinky: Point): Point {
  let dr = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
  let dc = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;
  const pivotR = player.r + dr * 2;
  const pivotC = player.c + dc * 2;
  return {
    r: Math.max(0, Math.min(8, pivotR + (pivotR - blinky.r))),
    c: Math.max(0, Math.min(8, pivotC + (pivotC - blinky.c))),
  };
}

// 4. Clyde (Orange) – Chase and Retreat: Chases Pac-Man when far away (>3 tiles),
// retreats toward its home corner (7, 1) when close (<=3 tiles).
function getClydeTarget(player: Point, clyde: Point, maze: number[][]): Point {
  const dist = getBfsDistance(clyde, player, maze);
  if (dist > 3) {
    return player; // Chases when far
  }
  return { r: 7, c: 1 }; // Retreats to bottom-left corner
}

// Pupil offsets for smooth eye tracking
function getPupilOffset(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case "UP": return { dx: 0, dy: -0.9 };
    case "DOWN": return { dx: 0, dy: 0.9 };
    case "LEFT": return { dx: -0.9, dy: 0 };
    case "RIGHT": return { dx: 0.9, dy: 0 };
    default: return { dx: 0, dy: 0 };
  }
}

// Reusable Ghost SVG Renderer
const GhostSvg: React.FC<{
  pos: Point;
  dir: Direction;
  color: string;
  isOverclocked: boolean;
  isPlaying: boolean;
}> = ({ pos, dir, color, isOverclocked, isPlaying }) => {
  const pupil = getPupilOffset(dir);
  return (
    <g
      style={{
        transform: `translate(${pos.c * CELL_SIZE + 10}px, ${pos.r * CELL_SIZE + 10}px)`,
        transition: isPlaying
          ? isOverclocked
            ? "transform 0.46s ease-out"
            : "transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1)"
          : "none",
      }}
    >
      {/* Antennae */}
      <line
        x1="-3"
        y1="-7"
        x2="-5"
        y2="-9"
        stroke={isOverclocked ? "#818cf8" : color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="-7"
        x2="5"
        y2="-9"
        stroke={isOverclocked ? "#818cf8" : color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="-5" cy="-9" r="0.8" fill={isOverclocked ? "#818cf8" : color} />
      <circle cx="5" cy="-9" r="0.8" fill={isOverclocked ? "#818cf8" : color} />
      {/* Body & Wavy Skirt */}
      <path
        d="M -7 7 L -7 0 A 7 7 0 0 1 7 0 L 7 7 L 4 5.2 L 1 7 L -2 5.2 L -4 7 Z"
        fill={isOverclocked ? "#6366f1" : color}
        className={`${isOverclocked ? "animate-pulse" : ""} stroke-slate-900 dark:stroke-slate-950`}
        strokeWidth="1"
      />
      {/* Eyes with smooth directional tracking */}
      <circle cx="-3" cy="-1" r="2.1" fill="#ffffff" />
      <circle cx="3" cy="-1" r="2.1" fill="#ffffff" />
      <circle
        cx={-3 + pupil.dx}
        cy={-1 + pupil.dy}
        r="1.05"
        fill="#0f172a"
        style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
      />
      <circle
        cx={3 + pupil.dx}
        cy={-1 + pupil.dy}
        r="1.05"
        fill="#0f172a"
        style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
      />
    </g>
  );
};

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

  // Active Ghost Count (1 to 4 ghosts, defaults to 2: Blinky & Inky)
  const [ghostCount, setGhostCount] = useState<number>(2);

  // 1. Blinky (Red - Direct Chase)
  const [blinky, setBlinky] = useState<Point>(initialSpawns.blinky);
  const [blinkyDir, setBlinkyDir] = useState<Direction>("UP");

  // 2. Pinky (Pink - 4-Tile Ambush)
  const [pinky, setPinky] = useState<Point>(initialSpawns.pinky);
  const [pinkyDir, setPinkyDir] = useState<Direction>("DOWN");

  // 3. Inky (Cyan - Vector Intercept)
  const [inky, setInky] = useState<Point>(initialSpawns.inky);
  const [inkyDir, setInkyDir] = useState<Direction>("UP");

  // 4. Clyde (Orange - Chase & Retreat)
  const [clyde, setClyde] = useState<Point>(initialSpawns.clyde);
  const [clydeDir, setClydeDir] = useState<Direction>("LEFT");

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
    ghostCount: 2,
    blinky: initialSpawns.blinky,
    blinkyPrev: null as Point | null,
    blinkySpawn: initialSpawns.blinky,
    pinky: initialSpawns.pinky,
    pinkyPrev: null as Point | null,
    pinkySpawn: initialSpawns.pinky,
    inky: initialSpawns.inky,
    inkyPrev: null as Point | null,
    inkySpawn: initialSpawns.inky,
    clyde: initialSpawns.clyde,
    clydePrev: null as Point | null,
    clydeSpawn: initialSpawns.clyde,
    score: 0,
    isProtected: true,
    overclockUntil: 0,
    gameStartTime: 0,
    aiMode: "NEURAL" as AiMode,
    lastPlayerTime: 0,
    lastBlinkyTime: 0,
    lastPinkyTime: 0,
    lastInkyTime: 0,
    lastClydeTime: 0,
    closeGhost: null as "blinky" | "pinky" | "inky" | "clyde" | null,
    evasionCooldown: 0,
  });

  useEffect(() => {
    loopRef.current.ghostCount = ghostCount;
  }, [ghostCount]);

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
    let base = aiMode === "OVERFIT" ? 270 : aiMode === "HEURISTIC" ? 340 : 300;
    if (isOverclocked) return base + 160;
    return Math.max(200, base - speedBoost);
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

    ref.blinky = spawns.blinky;
    ref.blinkyPrev = null;
    ref.blinkySpawn = spawns.blinky;

    ref.pinky = spawns.pinky;
    ref.pinkyPrev = null;
    ref.pinkySpawn = spawns.pinky;

    ref.inky = spawns.inky;
    ref.inkyPrev = null;
    ref.inkySpawn = spawns.inky;

    ref.clyde = spawns.clyde;
    ref.clydePrev = null;
    ref.clydeSpawn = spawns.clyde;

    ref.score = 0;
    ref.isProtected = true;
    ref.overclockUntil = 0;
    ref.gameStartTime = 0;
    ref.closeGhost = null;
    ref.evasionCooldown = 0;
    ref.lastPlayerTime = 0;
    ref.lastBlinkyTime = 0;
    ref.lastPinkyTime = 0;
    ref.lastInkyTime = 0;
    ref.lastClydeTime = 0;
    ref.aiMode = aiMode;

    setMazeIdx(nextIdx);
    setMaze(newMaze);
    setPlayer(spawns.player);
    setDirection(null);

    setBlinky(spawns.blinky);
    setBlinkyDir("UP");

    setPinky(spawns.pinky);
    setPinkyDir("DOWN");

    setInky(spawns.inky);
    setInkyDir("UP");

    setClyde(spawns.clyde);
    setClydeDir("LEFT");

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
      if (ref.lastBlinkyTime === 0) ref.lastBlinkyTime = time;
      if (ref.lastPinkyTime === 0) ref.lastPinkyTime = time;
      if (ref.lastInkyTime === 0) ref.lastInkyTime = time;
      if (ref.lastClydeTime === 0) ref.lastClydeTime = time;

      // Handle Overclock expiration
      if (ref.overclockUntil > 0 && time >= ref.overclockUntil) {
        ref.overclockUntil = 0;
        setIsOverclocked(false);
      }

      const isFleeing = time < ref.overclockUntil;
      const elapsed = ref.gameStartTime > 0 ? time - ref.gameStartTime : 0;
      // First 5 seconds: Ghosts in SCATTER mode (patrol corners) to give player comfortable setup
      const isScatter = elapsed < 5000;

      // Dynamic Speed & Progressive Training Convergence Calculation
      const curDotsRemaining = ref.maze.flat().filter((c) => c === 0 || c === 3).length;
      const curLoss = Math.max(0, curDotsRemaining / 35);
      const curSpeedBoost = Math.round((1 - curLoss) * 40);

      // In scatter mode (first 5s), ghosts are relaxed (360ms/380ms) to give player comfortable setup
      let baseBlinky = isScatter ? 360 : 300;
      let basePinky = isScatter ? 370 : 315;
      let baseInky = isScatter ? 380 : 330;
      let baseClyde = isScatter ? 400 : 345;

      if (ref.aiMode === "OVERFIT") {
        baseBlinky = isScatter ? 330 : 270;
        basePinky = isScatter ? 340 : 285;
        baseInky = isScatter ? 350 : 300;
        baseClyde = isScatter ? 370 : 315;
      } else if (ref.aiMode === "HEURISTIC") {
        baseBlinky = isScatter ? 390 : 340;
        basePinky = isScatter ? 400 : 355;
        baseInky = isScatter ? 410 : 370;
        baseClyde = isScatter ? 430 : 385;
      }

      const blinkyInterval = isFleeing ? 450 : Math.max(200, baseBlinky - curSpeedBoost);
      const inkyInterval = isFleeing ? 470 : Math.max(220, baseInky - curSpeedBoost);
      const pinkyInterval = isFleeing ? 460 : Math.max(215, basePinky - curSpeedBoost);
      const clydeInterval = isFleeing ? 490 : Math.max(235, baseClyde - curSpeedBoost);

      // Helper for collision checking
      const handleCollision = (
        nextPos: Point,
        ghostPrev: Point | null,
        ghostSpawn: Point,
        setGhostPos: (p: Point) => void,
        key: "blinky" | "pinky" | "inky" | "clyde"
      ): boolean => {
        const directHit = ref.player.r === nextPos.r && ref.player.c === nextPos.c;
        const crossoverHit =
          ref.playerPrev &&
          ghostPrev &&
          ref.playerPrev.r === nextPos.r &&
          ref.playerPrev.c === nextPos.c &&
          ref.player.r === ghostPrev.r &&
          ref.player.c === ghostPrev.c;

        if (directHit || crossoverHit) {
          if (isFleeing) {
            if (key === "blinky") { ref.blinky = ghostSpawn; ref.blinkyPrev = null; }
            else if (key === "pinky") { ref.pinky = ghostSpawn; ref.pinkyPrev = null; }
            else if (key === "inky") { ref.inky = ghostSpawn; ref.inkyPrev = null; }
            else if (key === "clyde") { ref.clyde = ghostSpawn; ref.clydePrev = null; }
            setGhostPos(ghostSpawn);
            ref.score += 100;
            setScore(ref.score);
            updateHighScore(ref.score);
            triggerScoreChip("+100 REBOOT!");
            triggerHaptic([30, 80]);
            return false;
          } else if (!ref.isProtected) {
            ref.gameState = "LOST";
            setGameState("LOST");
            updateHighScore(ref.score);
            triggerHaptic(40);
            return true;
          }
        }
        return false;
      };

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

            // Immediate collision check on player step against all active ghosts
            const currentActiveGhosts = [
              { key: "blinky" as const, pos: ref.blinky, prev: ref.blinkyPrev, spawn: ref.blinkySpawn, set: setBlinky },
              ...(ref.ghostCount >= 2 ? [{ key: "inky" as const, pos: ref.inky, prev: ref.inkyPrev, spawn: ref.inkySpawn, set: setInky }] : []),
              ...(ref.ghostCount >= 3 ? [{ key: "pinky" as const, pos: ref.pinky, prev: ref.pinkyPrev, spawn: ref.pinkySpawn, set: setPinky }] : []),
              ...(ref.ghostCount >= 4 ? [{ key: "clyde" as const, pos: ref.clyde, prev: ref.clydePrev, spawn: ref.clydeSpawn, set: setClyde }] : []),
            ];

            for (const g of currentActiveGhosts) {
              const hitDirect = ref.player.r === g.pos.r && ref.player.c === g.pos.c;
              const hitCrossover =
                g.prev &&
                ref.playerPrev &&
                ref.player.r === g.prev.r &&
                ref.player.c === g.prev.c &&
                g.pos.r === ref.playerPrev.r &&
                g.pos.c === ref.playerPrev.c;

              if (hitDirect || hitCrossover) {
                if (isFleeing) {
                  if (g.key === "blinky") { ref.blinky = g.spawn; ref.blinkyPrev = null; }
                  else if (g.key === "pinky") { ref.pinky = g.spawn; ref.pinkyPrev = null; }
                  else if (g.key === "inky") { ref.inky = g.spawn; ref.inkyPrev = null; }
                  else if (g.key === "clyde") { ref.clyde = g.spawn; ref.clydePrev = null; }
                  g.set(g.spawn);
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

      // 2. GHOST 1: BLINKY (Red) – Direct Chase Policy TICK
      if (time - ref.lastBlinkyTime >= blinkyInterval) {
        ref.lastBlinkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = { r: 1, c: 7 }; // Blinky scatter corner: top-right
        } else {
          target = getBlinkyTarget(ref.player); // Direct Chase
        }

        const avoid: Point[] = [];
        if (ref.ghostCount >= 2) avoid.push(ref.inky);
        if (ref.ghostCount >= 3) avoid.push(ref.pinky);
        if (ref.ghostCount >= 4) avoid.push(ref.clyde);

        const next = findBfsStep(ref.maze, ref.blinky, target, ref.blinkyPrev, avoid);

        if (next.r < ref.blinky.r) setBlinkyDir("UP");
        else if (next.r > ref.blinky.r) setBlinkyDir("DOWN");
        else if (next.c < ref.blinky.c) setBlinkyDir("LEFT");
        else if (next.c > ref.blinky.c) setBlinkyDir("RIGHT");

        ref.blinkyPrev = ref.blinky;
        ref.blinky = next;
        setBlinky(next);

        if (handleCollision(next, ref.blinkyPrev, ref.blinkySpawn, setBlinky, "blinky")) return;
      }

      // 3. GHOST 2: INKY (Cyan) – Vector Interception Policy TICK
      if (ref.ghostCount >= 2 && time - ref.lastInkyTime >= inkyInterval) {
        ref.lastInkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player, getFarthestCorner(ref.player));
        } else if (isScatter) {
          target = { r: 7, c: 7 }; // Inky scatter corner: bottom-right
        } else {
          target = getInkyTarget(ref.player, ref.direction, ref.blinky); // Vector Intercept
        }

        const avoid: Point[] = [ref.blinky];
        if (ref.ghostCount >= 3) avoid.push(ref.pinky);
        if (ref.ghostCount >= 4) avoid.push(ref.clyde);

        const next = findBfsStep(ref.maze, ref.inky, target, ref.inkyPrev, avoid);

        if (next.r < ref.inky.r) setInkyDir("UP");
        else if (next.r > ref.inky.r) setInkyDir("DOWN");
        else if (next.c < ref.inky.c) setInkyDir("LEFT");
        else if (next.c > ref.inky.c) setInkyDir("RIGHT");

        ref.inkyPrev = ref.inky;
        ref.inky = next;
        setInky(next);

        if (handleCollision(next, ref.inkyPrev, ref.inkySpawn, setInky, "inky")) return;
      }

      // 4. GHOST 3: PINKY (Pink) – 4-Tile Ambush Policy TICK
      if (ref.ghostCount >= 3 && time - ref.lastPinkyTime >= pinkyInterval) {
        ref.lastPinkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = { r: 1, c: 1 }; // Pinky scatter corner: top-left
        } else {
          target = getPinkyTarget(ref.player, ref.direction); // Ambush ahead
        }

        const avoid: Point[] = [ref.blinky, ref.inky];
        if (ref.ghostCount >= 4) avoid.push(ref.clyde);

        const next = findBfsStep(ref.maze, ref.pinky, target, ref.pinkyPrev, avoid);

        if (next.r < ref.pinky.r) setPinkyDir("UP");
        else if (next.r > ref.pinky.r) setPinkyDir("DOWN");
        else if (next.c < ref.pinky.c) setPinkyDir("LEFT");
        else if (next.c > ref.pinky.c) setPinkyDir("RIGHT");

        ref.pinkyPrev = ref.pinky;
        ref.pinky = next;
        setPinky(next);

        if (handleCollision(next, ref.pinkyPrev, ref.pinkySpawn, setPinky, "pinky")) return;
      }

      // 5. GHOST 4: CLYDE (Orange) – Chase and Retreat Policy TICK
      if (ref.ghostCount >= 4 && time - ref.lastClydeTime >= clydeInterval) {
        ref.lastClydeTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = { r: 7, c: 1 }; // Clyde scatter corner: bottom-left
        } else {
          target = getClydeTarget(ref.player, ref.clyde, ref.maze); // Chase if far, retreat if close
        }

        const avoid: Point[] = [ref.blinky, ref.inky, ref.pinky];

        const next = findBfsStep(ref.maze, ref.clyde, target, ref.clydePrev, avoid);

        if (next.r < ref.clyde.r) setClydeDir("UP");
        else if (next.r > ref.clyde.r) setClydeDir("DOWN");
        else if (next.c < ref.clyde.c) setClydeDir("LEFT");
        else if (next.c > ref.clyde.c) setClydeDir("RIGHT");

        ref.clydePrev = ref.clyde;
        ref.clyde = next;
        setClyde(next);

        if (handleCollision(next, ref.clydePrev, ref.clydeSpawn, setClyde, "clyde")) return;
      }

      // Evasion bonus check across all active ghosts
      const allActiveGhosts = [
        { key: "blinky" as const, pos: ref.blinky },
        ...(ref.ghostCount >= 2 ? [{ key: "inky" as const, pos: ref.inky }] : []),
        ...(ref.ghostCount >= 3 ? [{ key: "pinky" as const, pos: ref.pinky }] : []),
        ...(ref.ghostCount >= 4 ? [{ key: "clyde" as const, pos: ref.clyde }] : []),
      ];

      for (const g of allActiveGhosts) {
        const d = getBfsDistance(ref.player, g.pos, ref.maze);
        if (d === 1 && ref.closeGhost === null) {
          ref.closeGhost = g.key;
        } else if (ref.closeGhost === g.key && d >= 3 && ref.evasionCooldown <= 0) {
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

              {/* Ghost Count Toggle: 1 to 4 Authentic Pac-Man Ghosts */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGhostCount((prev) => (prev >= 4 ? 1 : prev + 1));
                  triggerHaptic(10);
                  containerRef.current?.focus();
                }}
                aria-label={`Ghosts active: ${ghostCount}. Tap to cycle 1-4.`}
                title={
                  ghostCount === 1
                    ? "1 Ghost: Blinky (Direct Chase)"
                    : ghostCount === 2
                    ? "2 Ghosts: Blinky (Chase) & Inky (Intercept)"
                    : ghostCount === 3
                    ? "3 Ghosts: Blinky (Chase), Inky (Intercept), Pinky (Ambush)"
                    : "4 Ghosts: All 4 Pac-Man Ghosts (Blinky, Inky, Pinky, Clyde)"
                }
                className="px-1 py-0.5 rounded text-[8.5px] font-mono-code font-bold border transition-colors touch-manipulation cursor-pointer bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300"
              >
                <span className="flex items-center gap-0.5">
                  {ghostCount === 1 ? <User className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />} {ghostCount}
                </span>
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

              {/* 1. Blinky (Red) – Direct Chase */}
              <GhostSvg
                pos={blinky}
                dir={blinkyDir}
                color="#ef4444"
                isOverclocked={isOverclocked}
                isPlaying={gameState === "PLAYING"}
              />

              {/* 2. Inky (Cyan) – Intercept (active when ghostCount >= 2) */}
              {ghostCount >= 2 && (
                <GhostSvg
                  pos={inky}
                  dir={inkyDir}
                  color="#06b6d4"
                  isOverclocked={isOverclocked}
                  isPlaying={gameState === "PLAYING"}
                />
              )}

              {/* 3. Pinky (Pink) – Ambush (active when ghostCount >= 3) */}
              {ghostCount >= 3 && (
                <GhostSvg
                  pos={pinky}
                  dir={pinkyDir}
                  color="#ec4899"
                  isOverclocked={isOverclocked}
                  isPlaying={gameState === "PLAYING"}
                />
              )}

              {/* 4. Clyde (Orange) – Chase and Retreat (active when ghostCount >= 4) */}
              {ghostCount >= 4 && (
                <GhostSvg
                  pos={clyde}
                  dir={clydeDir}
                  color="#f97316"
                  isOverclocked={isOverclocked}
                  isPlaying={gameState === "PLAYING"}
                />
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

          {/* Pac-Man Ghost AI Strategy Legend (Expanded Mode) */}
          {isExpanded && (
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[8.5px] font-mono-code">
              <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400" title="Blinky: Direct Chase towards Pac-Man">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Blinky: Chase
              </span>
              {ghostCount >= 2 && (
                <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400" title="Inky: Vector Intercept from Blinky">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" /> Inky: Intercept
                </span>
              )}
              {ghostCount >= 3 && (
                <span className="flex items-center gap-1 font-bold text-pink-600 dark:text-pink-400" title="Pinky: Ambush 3 tiles ahead">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block" /> Pinky: Ambush
                </span>
              )}
              {ghostCount >= 4 && (
                <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400" title="Clyde: Chase when far, retreat to corner when close">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" /> Clyde: Retreat
                </span>
              )}
            </div>
          )}

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
