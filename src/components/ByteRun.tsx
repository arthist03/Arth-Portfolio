import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Trophy, Shield, Maximize2, Minimize2, Zap, Minus } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
type Point = { r: number; c: number };

const GRID_SIZE = 15;
const CELL_SIZE = 16; // 15 * 16 = 240px SVG viewBox

// 15x15 Authentic Pac-Man Mazes (3 Verified Connected Layouts, Wrap Tunnels on Row 7)
// 1 = Wall, 0 = Pac-Dot (+10), 2 = Empty path, 3 = Power Pellet (+50)
const MAZE_PRESETS: number[][][] = [
  // 0: Classic Double-Corridor with Center Vault & Side Tunnels
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // Wrap Tunnel Row
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 1: Center Cross & Open Ring with Side Tunnels
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Wrap Tunnel Row
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // 2: Wide Lanes, Inner Sanctuary & Dual Pillar Loops
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0], // Wrap Tunnel Row
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

// Scatter corners for the 4 classic ghosts
const SCATTER_CORNERS = {
  blinky: { r: 1, c: 13 }, // Red: Top-Right
  pinky: { r: 1, c: 1 },   // Pink: Top-Left
  inky: { r: 13, c: 13 },  // Cyan: Bottom-Right
  clyde: { r: 13, c: 1 },  // Orange: Bottom-Left
};

// Power Pellet Corners
const CORNERS: Point[] = [
  { r: 1, c: 1 },
  { r: 1, c: 13 },
  { r: 13, c: 1 },
  { r: 13, c: 13 },
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

// Fixed balanced spawns for 15x15 grid (verified walkable in all 3 mazes)
function getFixedSpawns(): {
  player: Point;
  blinky: Point;
  pinky: Point;
  inky: Point;
  clyde: Point;
} {
  return {
    player: { r: 11, c: 7 }, // Lower center
    blinky: { r: 3, c: 7 },  // Upper center (direct chase)
    pinky: { r: 4, c: 3 },   // Upper left (ambush ahead)
    inky: { r: 4, c: 11 },   // Upper right (vector intercept)
    clyde: { r: 10, c: 1 },  // Lower left (chase & retreat)
  };
}

// Tunnel-aware BFS step distance
function getBfsDistance(start: Point, end: Point, maze: number[][]): number {
  if (start.r === end.r && start.c === end.c) return 0;
  const queue: { r: number; c: number; d: number }[] = [{ r: start.r, c: start.c, d: 0 }];
  const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
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
      let nr = r + dir.r;
      let nc = c + dir.c;
      // Wrap tunnel on row 7
      if (r === 7 && nr === 7) {
        if (nc < 0) nc = GRID_SIZE - 1;
        else if (nc >= GRID_SIZE) nc = 0;
      }
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && maze[nr][nc] !== 1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push({ r: nr, c: nc, d: d + 1 });
      }
    }
  }
  return 999;
}

// Tunnel-aware BFS next-step finder
function findBfsStep(
  maze: number[][],
  current: Point,
  target: Point,
  lastPos: Point | null,
  avoidPos?: Point[] | null
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
    let nr = current.r + d.r;
    let nc = current.c + d.c;
    // Wrap tunnel on row 7
    if (current.r === 7 && nr === 7) {
      if (nc < 0) nc = GRID_SIZE - 1;
      else if (nc >= GRID_SIZE) nc = 0;
    }
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && maze[nr][nc] !== 1) {
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

  // Avoid other ghosts if alternative exists
  if (avoidPos && avoidPos.length > 0 && candidates.length > 1) {
    const nonAvoid = candidates.filter((m) => !avoidPos.some((a) => a.r === m.r && a.c === m.c));
    if (nonAvoid.length > 0) {
      candidates = nonAvoid;
    }
  }

  const queue: { pos: Point; firstMove: Point }[] = [];
  const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
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
      let nr = item.pos.r + d.r;
      let nc = item.pos.c + d.c;
      if (item.pos.r === 7 && nr === 7) {
        if (nc < 0) nc = GRID_SIZE - 1;
        else if (nc >= GRID_SIZE) nc = 0;
      }
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && maze[nr][nc] !== 1 && !visited[nr][nc]) {
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

// 1. Blinky (Red) – Direct Chase
function getBlinkyTarget(player: Point): Point {
  return player;
}

// 2. Pinky (Pink) – Ambush: 3 tiles ahead in movement direction
function getPinkyTarget(player: Point, direction: Direction): Point {
  if (!direction) return player;
  const dr = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
  const dc = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;
  return {
    r: Math.max(0, Math.min(GRID_SIZE - 1, player.r + dr * 3)),
    c: Math.max(0, Math.min(GRID_SIZE - 1, player.c + dc * 3)),
  };
}

// 3. Inky (Cyan) – Intercept: 2 spaces ahead doubled from Blinky
function getInkyTarget(player: Point, direction: Direction, blinky: Point): Point {
  const dr = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
  const dc = direction === "LEFT" ? -1 : direction === "RIGHT" ? 1 : 0;
  const pivotR = player.r + dr * 2;
  const pivotC = player.c + dc * 2;
  return {
    r: Math.max(0, Math.min(GRID_SIZE - 1, pivotR + (pivotR - blinky.r))),
    c: Math.max(0, Math.min(GRID_SIZE - 1, pivotC + (pivotC - blinky.c))),
  };
}

// 4. Clyde (Orange) – Chase and Retreat: Chases when far (>4 tiles), retreats to corner when close
function getClydeTarget(player: Point, clyde: Point, maze: number[][]): Point {
  const dist = getBfsDistance(clyde, player, maze);
  if (dist > 4) {
    return player;
  }
  return SCATTER_CORNERS.clyde;
}

function getPupilOffset(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case "UP": return { dx: 0, dy: -0.8 };
    case "DOWN": return { dx: 0, dy: 0.8 };
    case "LEFT": return { dx: -0.8, dy: 0 };
    case "RIGHT": return { dx: 0.8, dy: 0 };
    default: return { dx: 0, dy: 0 };
  }
}

// Scaled Ghost SVG Renderer for 16x16 grid cell
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
        transform: `translate(${pos.c * CELL_SIZE + 8}px, ${pos.r * CELL_SIZE + 8}px)`,
        transition: isPlaying
          ? isOverclocked
            ? "transform 0.44s ease-out"
            : "transform 0.26s cubic-bezier(0.25, 0.1, 0.25, 1)"
          : "none",
      }}
    >
      {/* Antennae */}
      <line
        x1="-2.5"
        y1="-5.5"
        x2="-4"
        y2="-7.5"
        stroke={isOverclocked ? "#818cf8" : color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="2.5"
        y1="-5.5"
        x2="4"
        y2="-7.5"
        stroke={isOverclocked ? "#818cf8" : color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="-4" cy="-7.5" r="0.7" fill={isOverclocked ? "#818cf8" : color} />
      <circle cx="4" cy="-7.5" r="0.7" fill={isOverclocked ? "#818cf8" : color} />
      {/* Ghost Body */}
      <path
        d="M -5.5 5.5 L -5.5 0 A 5.5 5.5 0 0 1 5.5 0 L 5.5 5.5 L 3.2 4.2 L 1 5.5 L -1.2 4.2 L -3.4 5.5 Z"
        fill={isOverclocked ? "#4f46e5" : color}
        className={`${isOverclocked ? "animate-pulse" : ""} stroke-slate-900 dark:stroke-slate-950`}
        strokeWidth="0.9"
      />
      {/* Ghost Eyes */}
      <circle cx="-2.3" cy="-0.8" r="1.7" fill="#ffffff" />
      <circle cx="2.3" cy="-0.8" r="1.7" fill="#ffffff" />
      <circle
        cx={-2.3 + pupil.dx}
        cy={-0.8 + pupil.dy}
        r="0.85"
        fill="#0f172a"
        style={{ transition: "cx 0.12s ease, cy 0.12s ease" }}
      />
      <circle
        cx={2.3 + pupil.dx}
        cy={-0.8 + pupil.dy}
        r="0.85"
        fill="#0f172a"
        style={{ transition: "cx 0.12s ease, cy 0.12s ease" }}
      />
    </g>
  );
};

export const ByteRun: React.FC = () => {
  const initialMazeIdx = useRef(Math.floor(Math.random() * MAZE_PRESETS.length)).current;
  const initialSpawns = useRef(getFixedSpawns()).current;

  // Render states
  const [mazeIdx, setMazeIdx] = useState(initialMazeIdx);
  const [maze, setMaze] = useState<number[][]>(() => {
    const grid = MAZE_PRESETS[initialMazeIdx].map((row) => [...row]);
    grid[initialSpawns.player.r][initialSpawns.player.c] = 2;
    return grid;
  });

  const [player, setPlayer] = useState<Point>(initialSpawns.player);
  const [direction, setDirection] = useState<Direction>(null);

  // All 4 Classic Ghosts
  const [blinky, setBlinky] = useState<Point>(initialSpawns.blinky);
  const [blinkyDir, setBlinkyDir] = useState<Direction>("UP");

  const [pinky, setPinky] = useState<Point>(initialSpawns.pinky);
  const [pinkyDir, setPinkyDir] = useState<Direction>("DOWN");

  const [inky, setInky] = useState<Point>(initialSpawns.inky);
  const [inkyDir, setInkyDir] = useState<Direction>("UP");

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
  const [autoMinimizeCountdown, setAutoMinimizeCountdown] = useState<number | null>(null);
  const [mouthOpen, setMouthOpen] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [scoreChip, setScoreChip] = useState<string | null>(null);

  // Decoupled master game loop reference
  const loopRef = useRef({
    gameState: "IDLE" as "IDLE" | "PLAYING" | "WON" | "LOST",
    mazeIdx: initialMazeIdx,
    maze: MAZE_PRESETS[initialMazeIdx].map((row) => [...row]),
    player: initialSpawns.player,
    playerPrev: null as Point | null,
    direction: null as Direction,
    nextDirection: null as Direction,
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
    lastPlayerTime: 0,
    lastBlinkyTime: 0,
    lastPinkyTime: 0,
    lastInkyTime: 0,
    lastClydeTime: 0,
    closeGhost: null as "blinky" | "pinky" | "inky" | "clyde" | null,
    evasionCooldown: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const chipTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Haptic Feedback
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
      const saved = localStorage.getItem("pacman_arcade_high_score");
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
        localStorage.setItem("pacman_arcade_high_score", best.toString());
      } catch {
        // Storage unavailable
      }
      return best;
    });
  }, []);

  // Floating score feedback
  const triggerScoreChip = useCallback((text: string) => {
    setScoreChip(text);
    if (chipTimeoutRef.current) clearTimeout(chipTimeoutRef.current);
    chipTimeoutRef.current = setTimeout(() => {
      setScoreChip(null);
    }, 1200);
  }, []);

  // Reset Game: Pick a DIFFERENT 15x15 maze preset
  const resetGame = useCallback(() => {
    const nextIdx = (loopRef.current.mazeIdx + 1 + Math.floor(Math.random() * (MAZE_PRESETS.length - 1))) % MAZE_PRESETS.length;
    const nextBase = MAZE_PRESETS[nextIdx];
    const spawns = getFixedSpawns();
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
  }, [triggerHaptic]);

  // Game Start Trigger
  const triggerGameStart = useCallback(
    (initialDir: Direction = "RIGHT") => {
      if (!isExpanded) {
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
    [isExpanded, triggerHaptic]
  );

  // Auto-minimize after 5 seconds upon game finish
  useEffect(() => {
    if ((gameState === "WON" || gameState === "LOST") && isExpanded) {
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
  }, [gameState, isExpanded]);

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

      if (ref.lastPlayerTime === 0) ref.lastPlayerTime = time;
      if (ref.lastBlinkyTime === 0) ref.lastBlinkyTime = time;
      if (ref.lastPinkyTime === 0) ref.lastPinkyTime = time;
      if (ref.lastInkyTime === 0) ref.lastInkyTime = time;
      if (ref.lastClydeTime === 0) ref.lastClydeTime = time;

      // Check Power Pellet expiration
      if (ref.overclockUntil > 0 && time >= ref.overclockUntil) {
        ref.overclockUntil = 0;
        setIsOverclocked(false);
      }

      const isFleeing = time < ref.overclockUntil;
      const elapsed = ref.gameStartTime > 0 ? time - ref.gameStartTime : 0;
      // First 4.5 seconds: Ghosts in SCATTER mode
      const isScatter = elapsed < 4500;

      // Speed configuration: balanced for 15x15 maze
      const blinkyInterval = isFleeing ? 460 : isScatter ? 350 : 280;
      const pinkyInterval = isFleeing ? 470 : isScatter ? 360 : 295;
      const inkyInterval = isFleeing ? 480 : isScatter ? 370 : 310;
      const clydeInterval = isFleeing ? 500 : isScatter ? 390 : 325;

      // Collision helper
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
            ref.score += 200;
            setScore(ref.score);
            updateHighScore(ref.score);
            triggerScoreChip("+200 GHOST!");
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

      // 1. PLAYER TICK (Every 165ms)
      if (time - ref.lastPlayerTime >= 165) {
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

          // Handle wrap tunnel row 7 for player test
          if (ref.player.r === 7 && testR === 7) {
            if (testC < 0) testC = GRID_SIZE - 1;
            else if (testC >= GRID_SIZE) testC = 0;
          }

          if (
            testR >= 0 &&
            testR < GRID_SIZE &&
            testC >= 0 &&
            testC < GRID_SIZE &&
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

          // Handle wrap tunnel on row 7
          if (ref.player.r === 7 && nr === 7) {
            if (nc < 0) nc = GRID_SIZE - 1;
            else if (nc >= GRID_SIZE) nc = 0;
          }

          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && ref.maze[nr][nc] !== 1) {
            ref.playerPrev = ref.player;
            ref.player = { r: nr, c: nc };
            setPlayer({ r: nr, c: nc });

            // Immediate player collision check with all 4 ghosts
            const currentGhosts = [
              { key: "blinky" as const, pos: ref.blinky, prev: ref.blinkyPrev, spawn: ref.blinkySpawn, set: setBlinky },
              { key: "pinky" as const, pos: ref.pinky, prev: ref.pinkyPrev, spawn: ref.pinkySpawn, set: setPinky },
              { key: "inky" as const, pos: ref.inky, prev: ref.inkyPrev, spawn: ref.inkySpawn, set: setInky },
              { key: "clyde" as const, pos: ref.clyde, prev: ref.clydePrev, spawn: ref.clydeSpawn, set: setClyde },
            ];

            for (const g of currentGhosts) {
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
                  ref.score += 200;
                  setScore(ref.score);
                  updateHighScore(ref.score);
                  triggerScoreChip("+200 GHOST!");
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
                ref.overclockUntil = time + 6500;
                setIsOverclocked(true);
                triggerScoreChip("+50 POWER!");
                triggerHaptic([25, 60, 25]);
              }

              // Win condition check: all dots eaten
              const remaining = updatedMaze.flat().filter((c) => c === 0 || c === 3).length;
              if (remaining === 0) {
                ref.gameState = "WON";
                const winScore = ref.score + 500;
                ref.score = winScore;
                setScore(winScore);
                updateHighScore(winScore);
                setGameState("WON");
                triggerScoreChip("+500 CLEAR!");
                triggerHaptic([30, 60, 30, 60, 60]);
                return;
              }
            }

            setMouthOpen((prev) => !prev);
          }
        }
      }

      // 2. GHOST 1: BLINKY (Red) – Direct Chase Policy
      if (time - ref.lastBlinkyTime >= blinkyInterval) {
        ref.lastBlinkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = SCATTER_CORNERS.blinky;
        } else {
          target = getBlinkyTarget(ref.player);
        }

        const avoid: Point[] = [ref.pinky, ref.inky, ref.clyde];
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

      // 3. GHOST 2: PINKY (Pink) – Ambush Policy (Ahead 3 tiles)
      if (time - ref.lastPinkyTime >= pinkyInterval) {
        ref.lastPinkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = SCATTER_CORNERS.pinky;
        } else {
          target = getPinkyTarget(ref.player, ref.direction);
        }

        const avoid: Point[] = [ref.blinky, ref.inky, ref.clyde];
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

      // 4. GHOST 3: INKY (Cyan) – Vector Intercept Policy
      if (time - ref.lastInkyTime >= inkyInterval) {
        ref.lastInkyTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player, getFarthestCorner(ref.player));
        } else if (isScatter) {
          target = SCATTER_CORNERS.inky;
        } else {
          target = getInkyTarget(ref.player, ref.direction, ref.blinky);
        }

        const avoid: Point[] = [ref.blinky, ref.pinky, ref.clyde];
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

      // 5. GHOST 4: CLYDE (Orange) – Chase & Retreat Policy
      if (time - ref.lastClydeTime >= clydeInterval) {
        ref.lastClydeTime = time;

        let target: Point;
        if (isFleeing) {
          target = getFarthestCorner(ref.player);
        } else if (isScatter) {
          target = SCATTER_CORNERS.clyde;
        } else {
          target = getClydeTarget(ref.player, ref.clyde, ref.maze);
        }

        const avoid: Point[] = [ref.blinky, ref.pinky, ref.inky];
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

      // Evasion bonus check
      const allGhosts = [
        { key: "blinky" as const, pos: ref.blinky },
        { key: "pinky" as const, pos: ref.pinky },
        { key: "inky" as const, pos: ref.inky },
        { key: "clyde" as const, pos: ref.clyde },
      ];

      for (const g of allGhosts) {
        const d = getBfsDistance(ref.player, g.pos, ref.maze);
        if (d === 1 && ref.closeGhost === null) {
          ref.closeGhost = g.key;
        } else if (ref.closeGhost === g.key && d >= 3 && ref.evasionCooldown <= 0) {
          ref.score += 25;
          setScore(ref.score);
          updateHighScore(ref.score);
          triggerScoreChip("+25 EVADE!");
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

  const getPlayerRotation = () => {
    switch (direction) {
      case "UP": return -90;
      case "DOWN": return 90;
      case "LEFT": return 180;
      default: return 0;
    }
  };

  const handleDirButton = (dir: Direction) => {
    setIsFocused(true);
    containerRef.current?.focus();
    loopRef.current.nextDirection = dir;
    triggerHaptic(8);
    if (gameState === "IDLE") {
      triggerGameStart(dir);
    }
  };

  // Keyboard navigation & restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        return;
      }

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

  // Touch handlers
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
        aria-label="Open Pac-Man mini arcade"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-yellow-400 dark:bg-yellow-400 text-slate-900 border-2 border-slate-900 dark:border-white rounded-xl font-mono-code text-[11px] sm:text-xs font-black uppercase shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer active:scale-95"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border border-slate-900 shrink-0" />
        <span className="font-extrabold tracking-wide">PAC-MAN</span>
        <span className="text-[9px] bg-slate-900 text-yellow-300 px-1.5 py-0.5 rounded font-mono-code font-bold">
          {score > 0 ? score : "PLAY"}
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
            ? "w-[calc(100vw-24px)] xs:w-[380px] sm:w-[500px] md:w-[540px] max-w-[540px] max-h-[calc(100dvh-24px)] sm:max-h-[min(94vh,860px)] flex flex-col justify-end"
            : "w-[245px] sm:w-[260px]"
        } ${isRubberAnimating ? "animate-rubber-elastic" : ""}`}
        data-byte-run="true"
        aria-label="Pac-Man arcade mini game"
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
          {/* Streamlined Header Bar - No Cluttered ML Toggles */}
          <div className="flex items-center justify-between border-b border-slate-900/80 dark:border-slate-800 pb-1.5 mb-1.5 font-mono-code text-[11px] gap-1">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-900 dark:text-white shrink-0">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-slate-900 dark:border-white shrink-0 ${
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
              <span className="text-[11px] sm:text-xs font-black tracking-wide">PAC-MAN</span>
              {isOverclocked && (
                <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black animate-pulse">
                  ⚡ POWERED
                </span>
              )}
            </div>

            {/* Quick Sizing Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Toggle Expand / Normal Size */}
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
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>

              {/* Minimize to dock pill */}
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
                <Minus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Clean Score & High Score Strip */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1 mb-1.5 px-0.5 text-[9px] sm:text-[10px] font-mono-code font-bold text-slate-600 dark:text-slate-400 relative">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white">
              <span>SCORE:</span>
              <span className="text-amber-500 dark:text-yellow-400 font-extrabold text-[10px] sm:text-[11px]">
                {score.toString().padStart(4, "0")}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Trophy className="w-3 h-3 text-amber-500 inline" />
              <span>HIGH:</span>
              <span className="text-slate-900 dark:text-white font-extrabold">
                {highScore.toString().padStart(4, "0")}
              </span>
            </div>

            {/* Floating Score Feedback Chip */}
            {scoreChip && (
              <span className="absolute -top-3.5 right-0 text-[8px] font-mono-code font-black bg-yellow-400 text-slate-950 px-1 py-0.2 rounded border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] animate-bounce z-20">
                {scoreChip}
              </span>
            )}
          </div>

          {/* 15x15 Maze Viewport with Wrap Tunnels */}
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
                ? "w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[480px] aspect-square"
                : "w-[200px] h-[200px] sm:w-[215px] sm:h-[215px]"
            }`}
          >
            <svg viewBox="0 0 240 240" className="w-full h-full block">
              {/* Warp Tunnel Indicators on Row 7 */}
              <text x="3" y="125" fontSize="7" fill="#64748b" fontFamily="monospace" fontWeight="bold">◀</text>
              <text x="230" y="125" fontSize="7" fill="#64748b" fontFamily="monospace" fontWeight="bold">▶</text>

              {/* Walls & Collectible Dots */}
              {maze.map((row, r) =>
                row.map((cell, c) => {
                  const x = c * CELL_SIZE;
                  const y = r * CELL_SIZE;

                  // Wall
                  if (cell === 1) {
                    return (
                      <rect
                        key={`wall-${r}-${c}`}
                        x={x + 1}
                        y={y + 1}
                        width={CELL_SIZE - 2}
                        height={CELL_SIZE - 2}
                        rx="2.5"
                        className="fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
                        strokeWidth="0.8"
                      />
                    );
                  }

                  // Normal Pac-Dot (+10)
                  if (cell === 0) {
                    return (
                      <rect
                        key={`dot-${r}-${c}`}
                        x={x + CELL_SIZE / 2 - 1.1}
                        y={y + CELL_SIZE / 2 - 1.1}
                        width="2.2"
                        height="2.2"
                        rx="0.5"
                        className="fill-amber-500 dark:fill-yellow-400 opacity-85"
                      />
                    );
                  }

                  // Power Pellet (+50)
                  if (cell === 3) {
                    return (
                      <g key={`power-${r}-${c}`}>
                        <circle
                          cx={x + CELL_SIZE / 2}
                          cy={y + CELL_SIZE / 2}
                          r="3.8"
                          className="fill-cyan-400 dark:fill-cyan-300 animate-pulse stroke-slate-900 dark:stroke-slate-950"
                          strokeWidth="0.8"
                        />
                        <circle
                          cx={x + CELL_SIZE / 2}
                          cy={y + CELL_SIZE / 2}
                          r="5.5"
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

              {/* Player: Pac-Man */}
              <g
                style={{
                  transform: `translate(${player.c * CELL_SIZE + 8}px, ${player.r * CELL_SIZE + 8}px)`,
                  transition: gameState === "PLAYING" ? "transform 0.17s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                }}
              >
                <g
                  style={{
                    transform: `rotate(${getPlayerRotation()}deg)`,
                    transition: "transform 0.14s ease-out",
                  }}
                >
                  {mouthOpen && direction ? (
                    <path
                      d="M 0 0 L 5.5 -3.2 A 6.5 6.5 0 1 0 5.5 3.2 Z"
                      className="fill-yellow-400 dark:fill-yellow-300 stroke-slate-900 dark:stroke-slate-950"
                      strokeWidth="0.9"
                    />
                  ) : (
                    <circle
                      r="6.5"
                      cx="0"
                      cy="0"
                      className="fill-yellow-400 dark:fill-yellow-300 stroke-slate-900 dark:stroke-slate-950"
                      strokeWidth="0.9"
                    />
                  )}
                  {/* Eye */}
                  <circle cx="1" cy="-3.2" r="0.9" fill="#0f172a" />
                </g>

                {/* Spawn Shield Indicator */}
                {isProtected && gameState === "PLAYING" && (
                  <circle
                    r="9"
                    cx="0"
                    cy="0"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.1"
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

              {/* 2. Pinky (Pink) – Ambush */}
              <GhostSvg
                pos={pinky}
                dir={pinkyDir}
                color="#ec4899"
                isOverclocked={isOverclocked}
                isPlaying={gameState === "PLAYING"}
              />

              {/* 3. Inky (Cyan) – Vector Intercept */}
              <GhostSvg
                pos={inky}
                dir={inkyDir}
                color="#06b6d4"
                isOverclocked={isOverclocked}
                isPlaying={gameState === "PLAYING"}
              />

              {/* 4. Clyde (Orange) – Chase and Retreat */}
              <GhostSvg
                pos={clyde}
                dir={clydeDir}
                color="#f97316"
                isOverclocked={isOverclocked}
                isPlaying={gameState === "PLAYING"}
              />
            </svg>

            {/* Victory Overlay */}
            {gameState === "WON" && (
              <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[1px] animate-in fade-in duration-200 z-20">
                <span className={`font-black uppercase font-mono-code tracking-wider ${isExpanded ? "text-sm sm:text-base" : "text-xs"}`}>
                  STAGE CLEARED!
                </span>
                <span className={`font-mono-code mt-0.5 opacity-90 ${isExpanded ? "text-xs sm:text-sm" : "text-[10px]"}`}>
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
                <span className={`font-black uppercase font-mono-code text-red-400 tracking-wider ${isExpanded ? "text-sm sm:text-base" : "text-xs"}`}>
                  GAME OVER
                </span>
                <span className={`font-mono-code mt-0.5 text-slate-300 ${isExpanded ? "text-xs sm:text-sm" : "text-[10px]"}`}>
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
                  Swipe or tap keys to move
                </span>
              </div>
            )}
          </div>

          {/* Footer Controls: D-Pad and Reset */}
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
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[8.5px] font-mono-code">
              <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400" title="Blinky: Direct Chase towards Pac-Man">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Blinky: Chase
              </span>
              <span className="flex items-center gap-1 font-bold text-pink-600 dark:text-pink-400" title="Pinky: Ambush 3 tiles ahead">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block" /> Pinky: Ambush
              </span>
              <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400" title="Inky: Vector Intercept from Blinky">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" /> Inky: Intercept
              </span>
              <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400" title="Clyde: Chase when far, retreat to corner when close">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" /> Clyde: Retreat
              </span>
            </div>
          )}

          {/* Tagline */}
          <div className={`font-mono-code text-center text-slate-400 dark:text-slate-500 uppercase tracking-tight ${
            isExpanded ? "text-[9px] mt-2" : "text-[8px] mt-1"
          }`}>
            // CLASSIC PAC-MAN ARCADE
          </div>
        </div>
      </div>
    </>
  );
};

export default ByteRun;
