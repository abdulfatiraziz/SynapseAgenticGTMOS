"use client";

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  User, 
  Zap,
  Terminal,
  Users,
  Moon,
  Sun
} from 'lucide-react';

// Tile types:
// G: Grass (walkable)
// T: Pine Tree (blocked)
// F: Fruit Tree (blocked)
// W: Wall (blocked)
// A: Admin Cabin Floor (walkable)
// E: Executive Suite Floor (walkable)
// M: Marketing Bay Floor (walkable)
// L: Sales Bay Floor (walkable)
// O: Ops Hub Floor (walkable)
// C: CS Cabin Floor (walkable)
// I: Lobby Corridor (walkable)
// D: Sliding Doorway (walkable)
// P: Outside wood path (walkable)

const mapGrid: string[][] = [
  // Rows 0-1: Outside Grass & Trees
  ["T", "T", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "T", "T"],
  ["T", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "T"],
  
  // Row 2: Building Top Wall
  ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
  
  // Rows 3-6: Senior Private Cabins (E: Executive Cabins Floor, I: Corridor, M: Bullpen)
  ["W", "E", "E", "E", "E", "E", "E", "E", "I", "E", "E", "E", "E", "E", "E", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "E", "E", "E", "E", "E", "E", "E", "I", "E", "E", "E", "E", "E", "E", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "E", "E", "E", "E", "E", "E", "E", "I", "E", "E", "E", "E", "E", "E", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "E", "E", "E", "E", "E", "E", "E", "I", "E", "E", "E", "E", "E", "E", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  
  // Row 7: North Walkway
  ["W", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "W"],
  
  // Rows 8-9: Central Breakouts (C: Canteen, I: Corridor/Lounge, L: Lobby, M: Bullpen)
  ["W", "C", "C", "C", "C", "C", "I", "I", "I", "L", "L", "L", "L", "L", "L", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "C", "C", "C", "C", "C", "I", "I", "I", "L", "L", "L", "L", "L", "L", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  
  // Row 10: South Walkway
  ["W", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "I", "W"],
  
  // Rows 11-14: Cabins (A: Admin Cabin, E: Critic Cabin, B: Boardroom, M: Bullpen)
  ["W", "A", "A", "A", "A", "A", "E", "E", "I", "B", "B", "B", "B", "B", "B", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "A", "A", "A", "A", "A", "E", "E", "I", "B", "B", "B", "B", "B", "B", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "A", "A", "A", "A", "A", "E", "E", "I", "B", "B", "B", "B", "B", "B", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  ["W", "A", "A", "A", "A", "A", "E", "E", "I", "B", "B", "B", "B", "B", "B", "I", "M", "M", "M", "M", "M", "M", "M", "W"],
  
  // Row 15: Bottom Wall with Entrance doors at Col 11, 12
  ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "D", "D", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
  
  // Rows 16-17: Outside Path & Grass
  ["T", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "T"],
  ["T", "T", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "T", "T"]
];

interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  description: string;
  tools: string[];
  logic: string;
  kpis: string[];
  initials: string;
  color: string;
  hairColor: string;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  status: string;
  battery: number;
  dialogue: string | null;
  dialogueTimer: number;
  activity: string;
  shortLabel: string;
}

// 2D Projection settings
const TILE_WIDTH = 40;
const TILE_HEIGHT = 40;

const projectIso = (x: number, y: number) => {
  const isoX = x * TILE_WIDTH;
  const isoY = y * TILE_HEIGHT;
  return { isoX, isoY };
};

interface Furniture {
  x: number;
  y: number;
  type: string;
  path: string;
  w: number;
  h: number;
}

// Fixed positions for furniture & desks (X, Y) using target crops
const furnitureItems: Furniture[] = [
  // Canteen Breakout (Cols 1-5, Rows 7-9)
  { x: 1, y: 8, type: 'kitchen_island', path: '', w: 2, h: 2 },
  { x: 4, y: 8, type: 'canteen_table_1', path: '', w: 1, h: 2 }, // Moved from (3, 7) to unblock entryway corridor at Col 3

  // Lounge Breakout (Cols 6-8, Rows 7-9)
  { x: 6, y: 8, type: 'cozy_lounge_rug', path: '', w: 2, h: 2 },
  { x: 4, y: 12, type: 'cowhide_rug', path: '', w: 1.5, h: 1.5 },

  // Lobby/Reception (Center)
  { x: 10, y: 8, type: 'reception_desk', path: '', w: 2.5, h: 1.5 },

  // Boardroom (Bottom-Center)
  { x: 9, y: 11, type: 'boardroom_rug_table', path: '', w: 3.5, h: 3.8 },

  // Open Bullpen with Straight-line workstations facing towards the walls
  // Marketing Bay (Top-Left, along Col 16 wall)
  { x: 16, y: 3, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  { x: 16, y: 4, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  { x: 16, y: 5, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  // Sales Hub (Top-Right, along Col 22 wall)
  { x: 22, y: 3, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  { x: 22, y: 4, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  { x: 22, y: 5, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  // Operations Hub (Bottom-Left, along Col 16 wall)
  { x: 16, y: 11, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  { x: 16, y: 12, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  { x: 16, y: 13, type: 'bullpen_desk_left', path: '', w: 1, h: 1 },
  // CX Success Hub (Bottom-Right, along Col 22 wall)
  { x: 22, y: 11, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  { x: 22, y: 12, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  { x: 22, y: 13, type: 'bullpen_desk_right', path: '', w: 1, h: 1 },
  { x: 19, y: 8, type: 'pool_table', path: '', w: 2, h: 1.5 }, // Pool table in the center of the bullpen

  // Senior Desks (in private cabins):
  { x: 2, y: 4, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // CMO desk
  { x: 4, y: 4, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // VP Sales desk
  { x: 6, y: 4, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // VP PMM desk
  { x: 9, y: 4, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // VP CS desk
  { x: 12, y: 4, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // VP Partnerships desk
  { x: 6, y: 12, type: 'office_desk_senior', path: '', w: 1.0, h: 1 }, // Critic desk (w: 1.0 to clear pathfinding in Column 7)
  { x: 1, y: 12, type: 'office_desk_senior', path: '', w: 1.5, h: 1 }, // Player desk

  // Decorative Plants:
  { x: 1, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 7, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 9, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 14, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 1, y: 11, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 6, y: 11, type: 'plant_potted', path: '', w: 1, h: 1 },
  { x: 14, y: 11, type: 'plant_potted', path: '', w: 1, h: 1 },
  // Additional plants as requested:
  { x: 19, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 }, // Top-center bullpen
  { x: 19, y: 13, type: 'plant_potted', path: '', w: 1, h: 1 }, // Bottom-center bullpen
  { x: 5, y: 8, type: 'plant_potted', path: '', w: 1, h: 1 }, // Canteen walkway divider
  { x: 8, y: 3, type: 'plant_potted', path: '', w: 1, h: 1 }, // Corridor corner
];

const isTileWalkable = (x: number, y: number) => {
  if (y < 0 || y >= mapGrid.length) return false;
  if (x < 0 || x >= mapGrid[y].length) return false;
  const tile = mapGrid[y][x];
  return tile !== 'W' && tile !== 'T' && tile !== 'F';
};

// Helper to determine if a cell contains collidable furniture
const isCellBlocked = (cx: number, cy: number) => {
  if (!isTileWalkable(cx, cy)) return true;
  
  // Check if cell is covered by any blocking furniture item
  return furnitureItems.some(item => {
    // Rugs are completely walkable
    if (item.type.includes('rug')) return false;

    if (item.type === 'boardroom_rug_table') {
      // Only the boardroom table in the center blocks
      return cx >= 10 && cx <= 11 && cy >= 12 && cy <= 13;
    }
    
    // Removed clover desk center checks
    
    // Default bounding box calculation
    const xStart = item.x;
    const xEnd = item.x + Math.ceil(item.w) - 1;
    const yStart = item.y;
    const yEnd = item.y + Math.ceil(item.h) - 1;
    
    return cx >= xStart && cx <= xEnd && cy >= yStart && cy <= yEnd;
  });
};

// Check if movement is allowed between two adjacent cells (avoids walking through thin partition walls)
const canMoveBetween = (x1: number, y1: number, x2: number, y2: number) => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // Vertical movement (crossing horizontal walls)
  if (minX === maxX && minY + 1 === maxY) {
    // Row 6 <-> Row 7
    if (minY === 6) {
      if (minX === 1 || minX === 2) return false;
      if (minX === 4 || minX === 6) return false;
      if (minX === 9 || minX === 11) return false;
      if (minX === 12 || minX === 14) return false;
    }
    // Row 10 <-> Row 11
    if (minY === 10) {
      if (minX === 1 || minX === 2 || minX === 4 || minX === 5) return false;
      if (minX === 6) return false;
      if (minX >= 9 && minX <= 14) return false;
    }
  }

  // Horizontal movement (crossing vertical walls)
  if (minY === maxY && minX + 1 === maxX) {
    if (minX === 3 && minY >= 3 && minY <= 6) return false;
    if (minX === 5 && minY >= 3 && minY <= 6) return false;
    if (minX === 7 && minY >= 3 && minY <= 6) return false;
    if (minX === 8 && minY >= 3 && minY <= 6) return false;
    if (minX === 11 && minY >= 3 && minY <= 6) return false;
    if (minX === 14 && minY >= 3 && minY <= 6) return false;

    if (minX === 5 && minY >= 11 && minY <= 14) return false;
    if (minX === 7 && minY >= 11 && minY <= 14) return false;
    if (minX === 8 && minY >= 11 && minY <= 14) return false;
    
    // Boardroom right wall: Col 14 <-> 15
    if (minX === 14 && minY >= 11 && minY <= 14 && minY !== 12) return false;

    // Bullpen left wall: Col 15 <-> 16
    if (minX === 15 && minY >= 3 && minY <= 14 && minY !== 7) return false;
  }

  return true;
};

// BFS Pathfinding from start to target coordinates
const findPath = (startX: number, startY: number, targetX: number, targetY: number): {x: number, y: number}[] => {
  if (startX === targetX && startY === targetY) return [];
  if (isCellBlocked(targetX, targetY)) return [];

  const queue: { x: number, y: number, path: {x: number, y: number}[] }[] = [
    { x: startX, y: startY, path: [] }
  ];
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);

  const dirs = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }   // right
  ];

  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;

    if (curr.x === targetX && curr.y === targetY) {
      return curr.path;
    }

    for (const d of dirs) {
      const nx = curr.x + d.dx;
      const ny = curr.y + d.dy;
      const key = `${nx},${ny}`;

      if (nx >= 0 && nx < 24 && ny >= 0 && ny < 18) {
        if (!visited.has(key) && !isCellBlocked(nx, ny) && canMoveBetween(curr.x, curr.y, nx, ny)) {
          visited.add(key);
          queue.push({
            x: nx,
            y: ny,
            path: [...curr.path, { x: nx, y: ny }]
          });
        }
      }
    }
  }
  return []; // No path found
};

// SVG Assets for 2D top-down projection
const PineTreeSVG = () => (
  <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
    <circle cx="20" cy="20" r="18" fill="#14532d" opacity="0.35" />
    <circle cx="20" cy="20" r="15" fill="#166534" />
    <polygon points="20,4 25,13 34,12 28,20 34,28 25,27 20,36 15,27 6,28 12,20 6,12 15,13" fill="#15803d" />
    <circle cx="20" cy="20" r="8" fill="#22c55e" />
  </svg>
);

const FruitTreeSVG = () => (
  <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
    <circle cx="20" cy="20" r="18" fill="#14532d" opacity="0.35" />
    <circle cx="20" cy="20" r="16" fill="#166534" />
    <circle cx="20" cy="20" r="12" fill="#15803d" />
    {/* Little red fruits */}
    <circle cx="13" cy="15" r="2.5" fill="#ef4444" />
    <circle cx="27" cy="14" r="2.5" fill="#ef4444" />
    <circle cx="15" cy="27" r="2.5" fill="#ef4444" />
    <circle cx="25" cy="26" r="2.5" fill="#ef4444" />
    <circle cx="20" cy="20" r="2.5" fill="#ef4444" />
  </svg>
);

const renderFurnitureSVG = (type: string, theme: 'day' | 'night') => {
  switch (type) {
    case 'bullpen_desk_left':
      return (
        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="36" height="32" rx="3" fill={theme === 'night' ? '#2d251e' : '#d7ccc8'} stroke={theme === 'night' ? '#d97706' : '#8d6e63'} strokeWidth="1.5" />
          <rect x="6" y="10" width="4" height="20" rx="1" fill="#37474f" />
          <rect x="4" y="6" width="2" height="28" rx="0.5" fill="#111" />
          <rect x="16" y="12" width="6" height="16" rx="1" fill="#eceff1" stroke="#b0bec5" strokeWidth="0.5" />
          <circle cx="18" cy="30" r="1.5" fill="#37474f" />
        </svg>
      );

    case 'bullpen_desk_right':
      return (
        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="36" height="32" rx="3" fill={theme === 'night' ? '#2d251e' : '#d7ccc8'} stroke={theme === 'night' ? '#d97706' : '#8d6e63'} strokeWidth="1.5" />
          <rect x="30" y="10" width="4" height="20" rx="1" fill="#37474f" />
          <rect x="34" y="6" width="2" height="28" rx="0.5" fill="#111" />
          <rect x="18" y="12" width="6" height="16" rx="1" fill="#eceff1" stroke="#b0bec5" strokeWidth="0.5" />
          <circle cx="20" cy="30" r="1.5" fill="#37474f" />
        </svg>
      );

    case 'canteen_table_1':
    case 'canteen_table_2':
    case 'canteen_table_3':
      return (
        <svg width="100%" height="100%" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="24" width="28" height="32" rx="14" fill="#000" fillOpacity="0.1" />
          <circle cx="20" cy="12" r="8" fill={theme === 'night' ? '#1e293b' : '#475569'} stroke="#334155" strokeWidth="1" />
          <path d="M14 10C16 7 24 7 26 10" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="68" r="8" fill={theme === 'night' ? '#1e293b' : '#475569'} stroke="#334155" strokeWidth="1" />
          <path d="M14 70C16 73 24 73 26 70" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="22" width="24" height="36" rx="12" fill={theme === 'night' ? '#2d251e' : '#d7ccc8'} stroke={theme === 'night' ? '#d97706' : '#8d6e63'} strokeWidth="2" />
          <circle cx="20" cy="31" r="3" fill="#fff" opacity="0.8" />
          <circle cx="20" cy="49" r="3" fill="#fff" opacity="0.8" />
          <circle cx="20" cy="40" r="1.5" fill="#4caf50" />
        </svg>
      );
    
    case 'kitchen_island':
      return (
        <svg width="100%" height="100%" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="72" height="84" rx="8" fill="#000" fillOpacity="0.15" />
          <rect x="8" y="12" width="64" height="76" rx="6" fill={theme === 'night' ? '#1e1b18' : '#efebe9'} stroke={theme === 'night' ? '#3e2723' : '#b0bec5'} strokeWidth="3" />
          <rect x="11" y="15" width="58" height="70" rx="3" fill={theme === 'night' ? '#2b2723' : '#fcfbfb'} />
          <rect x="20" y="24" width="40" height="20" rx="2" fill={theme === 'night' ? '#121212' : '#cfd8dc'} stroke="#78909c" />
          <path d="M40 20V26M38 20H42" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="56" width="20" height="22" rx="2" fill="#37474f" />
          <rect x="20" y="66" width="12" height="4" fill="#cfd8dc" />
          <circle cx="26" cy="62" r="2" fill="#d84315" />
          <circle cx="68" cy="28" r="6" fill="#3e2723" stroke="#b0bec5" />
          <circle cx="68" cy="50" r="6" fill="#3e2723" stroke="#b0bec5" />
          <circle cx="68" cy="72" r="6" fill="#3e2723" stroke="#b0bec5" />
        </svg>
      );

    case 'pool_table':
      return (
        <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="72" height="52" rx="6" fill="#000" fillOpacity="0.2" />
          <rect x="6" y="6" width="68" height="48" rx="4" fill={theme === 'night' ? '#3e2723' : '#5d4037'} stroke="#271c19" strokeWidth="2" />
          <rect x="10" y="10" width="60" height="40" rx="2" fill="#2e7d32" />
          <circle cx="11" cy="11" r="2.5" fill="#111" />
          <circle cx="40" cy="10" r="2" fill="#111" />
          <circle cx="69" cy="11" r="2.5" fill="#111" />
          <circle cx="11" cy="49" r="2.5" fill="#111" />
          <circle cx="40" cy="50" r="2" fill="#111" />
          <circle cx="69" cy="49" r="2.5" fill="#111" />
          <polygon points="50,30 55,27 55,33" fill="#fff" stroke="#ffeb3b" strokeWidth="0.5" />
          <circle cx="24" cy="30" r="1" fill="#fff" />
          <line x1="16" y1="16" x2="36" y2="28" stroke="#d7ccc8" strokeWidth="1" />
          <line x1="15" y1="44" x2="35" y2="32" stroke="#d7ccc8" strokeWidth="1" />
        </svg>
      );

    case 'elevator_shaft':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="136" height="136" rx="8" fill={theme === 'night' ? '#1e293b' : '#e2e8f0'} stroke={theme === 'night' ? '#334155' : '#cbd5e1'} strokeWidth="4" />
          <rect x="16" y="20" width="46" height="100" rx="4" fill="#37474f" />
          <rect x="18" y="24" width="20" height="92" fill="#78909c" />
          <rect x="40" y="24" width="20" height="92" fill="#78909c" />
          <line x1="39.5" y1="24" x2="39.5" y2="116" stroke="#37474f" strokeWidth="1" />
          <path d="M36 12L40 8L44 12" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="78" y="20" width="46" height="100" rx="4" fill="#37474f" />
          <rect x="80" y="24" width="20" height="92" fill="#78909c" />
          <rect x="102" y="24" width="20" height="92" fill="#78909c" />
          <line x1="101.5" y1="24" x2="101.5" y2="116" stroke="#37474f" strokeWidth="1" />
          <path d="M98 10L102 14L106 10" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="66" y="60" width="8" height="16" rx="2" fill="#455a64" />
          <circle cx="70" cy="64" r="1.5" fill="#ffeb3b" />
          <circle cx="70" cy="72" r="1.5" fill="#aaa" />
        </svg>
      );

    case 'restrooms':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="96" height="176" rx="8" fill={theme === 'night' ? '#121824' : '#eceff1'} stroke={theme === 'night' ? '#1e293b' : '#b0bec5'} strokeWidth="4" />
          <line x1="2" y1="36" x2="98" y2="36" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <line x1="2" y1="72" x2="98" y2="72" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <line x1="2" y1="108" x2="98" y2="108" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <line x1="2" y1="144" x2="98" y2="144" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <line x1="33" y1="2" x2="33" y2="178" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <line x1="66" y1="2" x2="66" y2="178" stroke={theme === 'night' ? '#1d2736' : '#cfd8dc'} />
          <rect x="2" y="88" width="96" height="6" fill={theme === 'night' ? '#1e293b' : '#90a4ae'} />
          <line x1="45" y1="2" x2="45" y2="44" stroke="#90a4ae" strokeWidth="2" />
          <line x1="2" y1="44" x2="45" y2="44" stroke="#90a4ae" strokeWidth="2" />
          <rect x="12" y="8" width="14" height="20" rx="4" fill="#fff" stroke="#90a4ae" />
          <ellipse cx="19" cy="22" rx="5" ry="6" fill="#fff" stroke="#90a4ae" />
          <line x1="45" y1="136" x2="45" y2="178" stroke="#90a4ae" strokeWidth="2" />
          <line x1="2" y1="136" x2="45" y2="136" stroke="#90a4ae" strokeWidth="2" />
          <rect x="12" y="152" width="14" height="20" rx="4" fill="#fff" stroke="#90a4ae" />
          <ellipse cx="19" cy="158" rx="5" ry="6" fill="#fff" stroke="#90a4ae" />
          <rect x="76" y="12" width="16" height="24" rx="2" fill="#fff" stroke="#90a4ae" />
          <circle cx="84" cy="24" r="4.5" fill="#e0f2f1" stroke="#b2dfdb" />
          <circle cx="84" cy="16" r="1.5" fill="#78909c" />
          <rect x="76" y="144" width="16" height="24" rx="2" fill="#fff" stroke="#90a4ae" />
          <circle cx="84" cy="156" r="4.5" fill="#e0f2f1" stroke="#b2dfdb" />
          <circle cx="84" cy="164" r="1.5" fill="#78909c" />
          <circle cx="70" cy="50" r="6" fill="#3b82f6" opacity="0.8" />
          <path d="M68 47H72M70 47V53" stroke="#fff" strokeWidth="1" />
          <circle cx="70" cy="130" r="6" fill="#db2777" opacity="0.8" />
          <circle cx="70" cy="128" r="1.5" fill="#fff" />
          <path d="M70 130V134" stroke="#fff" strokeWidth="1" />
        </svg>
      );

    case 'reception_desk':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20C10 12 90 12 90 20V45H10V20Z" fill="#000" fillOpacity="0.12" />
          <path d="M12 24C12 16 88 16 88 24V40C88 40 70 48 50 48C30 48 12 40 12 40V24Z" fill={theme === 'night' ? '#3e2723' : '#8d6e63'} stroke="#271c19" strokeWidth="2.5" />
          <path d="M15 22C15 17 85 17 85 22V28C85 28 68 34 50 34C32 34 15 28 15 28V22Z" fill={theme === 'night' ? '#2b2d30' : '#f5f5f5'} stroke={theme === 'night' ? '#4e5154' : '#e0e0e0'} strokeWidth="1.5" />
          <rect x="42" y="21" width="16" height="1.5" rx="0.5" fill="#111" />
          <rect x="40" y="22" width="20" height="2" rx="0.5" fill="#222" />
          <rect x="24" y="24" width="10" height="6" fill="#fff" stroke="#cfd8dc" />
          <line x1="29" y1="24" x2="29" y2="30" stroke="#90a4ae" />
          <circle cx="72" cy="24" r="2.5" fill="#8d6e63" />
          <circle cx="72" cy="24" r="1.5" fill="#4caf50" />
        </svg>
      );

    case 'cozy_lounge_rug':
      return (
        <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="72" height="72" rx="16" fill={theme === 'night' ? '#272522' : '#f5ebd9'} stroke={theme === 'night' ? '#b45309' : '#d7ccc8'} strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="12" y="16" width="48" height="12" rx="3" fill={theme === 'night' ? '#1e293b' : '#37474f'} stroke="#263238" strokeWidth="1.5" />
          <rect x="12" y="28" width="12" height="32" rx="3" fill={theme === 'night' ? '#1e293b' : '#37474f'} stroke="#263238" strokeWidth="1.5" />
          <rect x="15" y="20" width="42" height="6" fill={theme === 'night' ? '#334155' : '#4f5b66'} />
          <rect x="15" y="28" width="6" height="28" fill={theme === 'night' ? '#334155' : '#4f5b66'} />
          <rect x="16" y="20" width="6" height="4" rx="1" fill="#ffb74d" />
          <rect x="48" y="20" width="6" height="4" rx="1" fill="#4db6ac" />
          <circle cx="48" cy="48" r="12" fill={theme === 'night' ? '#3e2723' : '#a1887f'} stroke="#5d4037" strokeWidth="1.5" />
          <circle cx="48" cy="48" r="9" fill={theme === 'night' ? '#4e342e' : '#bcaaa4'} />
          <circle cx="45" cy="46" r="1.5" fill="#d84315" />
          <circle cx="68" cy="18" r="4.5" fill="#5d4037" />
          <circle cx="68" cy="18" r="3.5" fill="#4caf50" />
        </svg>
      );

    case 'cowhide_rug':
      return (
        <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20C8 10 24 6 30 10C36 6 52 10 50 20C54 30 46 44 38 42C30 46 22 52 18 42C10 44 6 30 10 20Z" fill={theme === 'night' ? '#2d2925' : '#eae3d2'} stroke={theme === 'night' ? '#3e352f' : '#d7ccc8'} strokeWidth="1" />
          <path d="M12 18C14 16 18 20 16 22C14 24 10 22 12 18Z" fill="#3e2723" opacity="0.7" />
          <path d="M40 28C44 26 42 34 38 32C34 30 36 32 40 28Z" fill="#3e2723" opacity="0.7" />
          <path d="M22 36C26 38 28 42 24 44C20 46 20 40 22 36Z" fill="#3e2723" opacity="0.7" />
          <rect x="20" y="16" width="22" height="20" rx="4" fill="#a1887f" stroke="#5d4037" strokeWidth="1.5" />
          <rect x="22" y="20" width="18" height="14" rx="2" fill="#8d6e63" />
          <rect x="18" y="18" width="3" height="16" rx="1" fill="#70544f" />
          <rect x="41" y="18" width="3" height="16" rx="1" fill="#70544f" />
        </svg>
      );

    case 'boardroom_rug_table':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 152" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="128" height="140" rx="12" fill={theme === 'night' ? '#1a1829' : '#e8eaf6'} stroke={theme === 'night' ? '#3f51b5' : '#c5cae9'} strokeWidth="2" />
          {/* Top Chairs */}
          <circle cx="50" cy="20" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M44 18C46 15 54 15 56 18" stroke="#111" strokeWidth="2.5" />
          <circle cx="90" cy="20" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M84 18C86 15 94 15 96 18" stroke="#111" strokeWidth="2.5" />
          {/* Left/Right Chairs */}
          <circle cx="22" cy="76" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M24 70C21 72 21 80 24 82" stroke="#111" strokeWidth="2.5" />
          <circle cx="118" cy="76" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M116 70C119 72 119 80 116 82" stroke="#111" strokeWidth="2.5" />
          {/* Bottom Chairs */}
          <circle cx="50" cy="132" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M44 134C46 137 54 137 56 134" stroke="#111" strokeWidth="2.5" />
          <circle cx="90" cy="132" r="8" fill={theme === 'night' ? '#121212' : '#37474f'} stroke="#1e293b" />
          <path d="M84 134C86 137 94 137 96 134" stroke="#111" strokeWidth="2.5" />
          {/* Table */}
          <rect x="34" y="32" width="72" height="88" rx="36" fill="#000" fillOpacity="0.15" />
          <rect x="36" y="30" width="68" height="92" rx="34" fill={theme === 'night' ? '#3e2723' : '#5d4037'} stroke={theme === 'night' ? '#b45309' : '#3e2723'} strokeWidth="3.5" />
          <rect x="42" y="36" width="56" height="80" rx="28" fill={theme === 'night' ? '#4e342e' : '#8d6e63'} />
          {/* Conference Speaker Phone */}
          <rect x="66" y="52" width="8" height="48" rx="2" fill={theme === 'night' ? '#212121' : '#cfd8dc'} stroke={theme === 'night' ? '#424242' : '#90a4ae'} />
          <circle cx="70" cy="62" r="1.5" fill="#111" />
          <circle cx="70" cy="76" r="1.5" fill="#111" />
          <circle cx="70" cy="90" r="1.5" fill="#111" />
        </svg>
      );

    case 'clover_desk_top':
    case 'clover_desk_1':
    case 'clover_desk_2':
    case 'clover_desk_3':
    case 'clover_desk_4':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 12C16 8 84 8 84 12V76C84 80 16 80 16 76V12Z" fill="#000" fillOpacity="0.08" />
          <circle cx="50" cy="14" r="7.5" fill={theme === 'night' ? '#1a1a1a' : '#455a64'} stroke="#263238" />
          <path d="M44 12C46 9 54 9 56 12" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="50" cy="74" r="7.5" fill={theme === 'night' ? '#1a1a1a' : '#455a64'} stroke="#263238" />
          <path d="M44 76C46 79 54 79 56 76" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="16" cy="44" r="7.5" fill={theme === 'night' ? '#1a1a1a' : '#455a64'} stroke="#263238" />
          <path d="M14 38C11 40 11 48 14 50" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="84" cy="44" r="7.5" fill={theme === 'night' ? '#1a1a1a' : '#455a64'} stroke="#263238" />
          <path d="M86 38C89 40 89 48 86 50" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M32 20C40 24 60 24 68 20C72 28 72 60 68 68C60 64 40 64 32 68C28 60 28 28 32 20Z" fill={theme === 'night' ? '#252a36' : '#eceff1'} stroke={theme === 'night' ? '#334155' : '#b0bec5'} strokeWidth="3.5" />
          <path d="M34 23C40 26 60 26 66 23C69 30 69 58 66 65C60 62 40 62 34 65C31 58 31 30 34 23Z" fill={theme === 'night' ? '#1e222b' : '#f8fafc'} />
          <line x1="50" y1="24" x2="50" y2="64" stroke={theme === 'night' ? '#475569' : '#cfd8dc'} strokeWidth="2.5" />
          <line x1="30" y1="44" x2="70" y2="44" stroke={theme === 'night' ? '#475569' : '#cfd8dc'} strokeWidth="2.5" />
          <circle cx="50" cy="44" r="4.5" fill={theme === 'night' ? '#f59e0b' : '#3b82f6'} />
          <rect x="42" y="29" width="16" height="1.5" rx="0.5" fill="#111" />
          <rect x="40" y="30" width="20" height="2" rx="0.5" fill="#222" />
          <rect x="42" y="57" width="16" height="1.5" rx="0.5" fill="#111" />
          <rect x="40" y="56" width="20" height="2" rx="0.5" fill="#222" />
          <rect x="35" y="36" width="1.5" height="16" rx="0.5" fill="#111" />
          <rect x="36" y="34" width="2" height="20" rx="0.5" fill="#222" />
          <rect x="63.5" y="36" width="1.5" height="16" rx="0.5" fill="#111" />
          <rect x="62" y="34" width="2" height="20" rx="0.5" fill="#222" />
          <rect x="44" y="25" width="12" height="2" fill="#555" />
          <rect x="44" y="61" width="12" height="2" fill="#555" />
          <rect x="27" y="38" width="2" height="12" fill="#555" />
          <rect x="71" y="38" width="2" height="12" fill="#555" />
        </svg>
      );

    case 'office_desk_senior':
      return (
        <svg width="100%" height="100%" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="52" height="28" rx="2" fill="#000" fillOpacity="0.1" />
          <rect x="6" y="8" width="48" height="24" rx="3" fill={theme === 'night' ? '#3e2723' : '#a1887f'} stroke={theme === 'night' ? '#271c19' : '#8d6e63'} strokeWidth="2" />
          <rect x="18" y="24" width="20" height="4" rx="0.5" fill="#37474f" />
          <circle cx="42" cy="26" r="1" fill="#37474f" />
          <rect x="14" y="12" width="28" height="2" rx="0.5" fill="#111" />
          <rect x="12" y="13" width="32" height="3" rx="0.5" fill="#222" />
          <circle cx="44" cy="14" r="2" fill="#8d6e63" />
          <circle cx="44" cy="14" r="1.2" fill="#4caf50" />
        </svg>
      );

    case 'plant_potted':
      return (
        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="22" r="8" fill="#000" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="7" fill="#d84315" stroke="#bf360c" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="5" fill="#5d4037" />
          <path d="M20 20C20 12 14 8 14 8C14 8 18 14 20 20Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.5" />
          <path d="M20 20C20 12 26 8 26 8C26 8 22 14 20 20Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.5" />
          <path d="M20 20C12 20 8 14 8 14C8 14 14 18 20 20Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.5" />
          <path d="M20 20C28 20 32 14 32 14C32 14 26 18 20 20Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="2" fill="#4caf50" />
        </svg>
      );

    default:
      return null;
  }
};

const ChairSVG = ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
  let rotation = 0;
  if (direction === 'left') rotation = 270;
  if (direction === 'right') rotation = 90;
  if (direction === 'up') rotation = 0;
  if (direction === 'down') rotation = 180;
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      style={{ 
        width: '100%', 
        height: '100%', 
        transform: `rotate(${rotation}deg)`, 
        transition: 'transform 0.15s' 
      }}
    >
      {/* 2D Top-Down Office Chair */}
      {/* 5-star base legs */}
      <path d="M12,12 L12,4 M12,12 L20,8 M12,12 L17,17 M12,12 L7,17 M12,12 L4,8" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      {/* Seat cushion */}
      <circle cx="12" cy="12" r="7.5" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      {/* Backrest */}
      <path d="M4.5,17.5 C8,19.5 16,19.5 19.5,17.5" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      {/* Armrests */}
      <path d="M3.5,10 L3.5,14 M20.5,10 L20.5,14" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};


const DoorSwing = ({ 
  left, 
  top, 
  dir, 
  color = '#854d0e', 
  angle = 45 
}: { 
  left: string; 
  top: string; 
  dir: 'up-left' | 'up-right' | 'down-left' | 'down-right' | 'left-up' | 'left-down' | 'right-up' | 'right-down'; 
  color?: string; 
  angle?: number; 
}) => {
  const swingBorder = '1.5px dashed #64748b';
  let transform = '';
  let origin = '';
  let swingStyle: React.CSSProperties = {};

  if (dir === 'up-right') {
    transform = `rotate(${angle}deg)`;
    origin = 'top left';
    swingStyle = { borderRight: swingBorder, borderBottom: swingBorder, borderRadius: '0 0 36px 0' };
  } else if (dir === 'up-left') {
    transform = `rotate(-${angle}deg)`;
    origin = 'top right';
    swingStyle = { borderLeft: swingBorder, borderBottom: swingBorder, borderRadius: '0 0 0 36px' };
  } else if (dir === 'down-right') {
    transform = `rotate(-${angle}deg)`;
    origin = 'bottom left';
    swingStyle = { borderRight: swingBorder, borderTop: swingBorder, borderRadius: '0 36px 0 0' };
  } else if (dir === 'down-left') {
    transform = `rotate(${angle}deg)`;
    origin = 'bottom right';
    swingStyle = { borderLeft: swingBorder, borderTop: swingBorder, borderRadius: '36px 0 0 0' };
  } else if (dir === 'left-down') {
    transform = `rotate(${angle}deg)`;
    origin = 'top left';
    swingStyle = { borderRight: swingBorder, borderBottom: swingBorder, borderRadius: '0 0 36px 0' };
  } else if (dir === 'left-up') {
    transform = `rotate(-${angle}deg)`;
    origin = 'bottom left';
    swingStyle = { borderRight: swingBorder, borderTop: swingBorder, borderRadius: '0 36px 0 0' };
  } else if (dir === 'right-down') {
    transform = `rotate(-${angle}deg)`;
    origin = 'top right';
    swingStyle = { borderLeft: swingBorder, borderBottom: swingBorder, borderRadius: '0 0 0 36px' };
  } else if (dir === 'right-up') {
    transform = `rotate(${angle}deg)`;
    origin = 'bottom right';
    swingStyle = { borderLeft: swingBorder, borderTop: swingBorder, borderRadius: '36px 0 0 0' };
  }

  return (
    <div style={{ position: 'absolute', left, top, width: '40px', height: '40px', overflow: 'visible', pointerEvents: 'none' }}>
      {/* Door leaf */}
      <div 
        style={{ 
          position: 'absolute', 
          left: dir.startsWith('right') || dir.endsWith('left') ? 'auto' : '0px', 
          right: dir.startsWith('right') || dir.endsWith('left') ? '0px' : 'auto', 
          top: dir.startsWith('down') || dir.endsWith('up') ? 'auto' : '0px', 
          bottom: dir.startsWith('down') || dir.endsWith('up') ? '0px' : 'auto', 
          width: dir.startsWith('left') || dir.startsWith('right') ? '36px' : '4px', 
          height: dir.startsWith('left') || dir.startsWith('right') ? '4px' : '36px', 
          backgroundColor: color, 
          borderRadius: '2px', 
          transform, 
          transformOrigin: origin, 
          boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
          zIndex: 5
        }} 
      />
      {/* Swing arc */}
      <div 
        style={{ 
          position: 'absolute', 
          left: '2px', 
          top: '2px', 
          width: '36px', 
          height: '36px', 
          opacity: 0.4,
          ...swingStyle,
          zIndex: 4
        }} 
      />
    </div>
  );
};

const AgentAvatar = ({ 
  id, 
  isMoving = false, 
  direction = 'down' 
}: { 
  id: string; 
  isMoving?: boolean; 
  direction?: 'up' | 'down' | 'left' | 'right'; 
}) => {
  let gender = 'male';
  let hairType = 'short';
  let hairColor = '#3b2f2f'; // dark brown
  let skinTone = '#fed7aa'; // peach-200
  let shirtColor = '#3b82f6';
  let pantColor = '#1e293b'; // dark slate pants by default
  let hasGlasses = false;
  let hasBeard = false;

  if (id === 'pa') { // Eva
    gender = 'female';
    hairType = 'bob';
    hairColor = '#f59e0b'; // orange-gold
    skinTone = '#ffedd5'; // peach-100
    shirtColor = '#db2777'; // pink
    pantColor = '#475569';
    hasGlasses = true;
  } else if (id === 'cmo') {
    gender = 'female';
    hairType = 'long';
    hairColor = '#7c2d12'; // dark auburn
    skinTone = '#ffedd5';
    shirtColor = '#6366f1'; // indigo
    pantColor = '#334155';
  } else if (id === 'vp_sales') {
    gender = 'male';
    hairType = 'sidepart';
    hairColor = '#1e3a8a'; // navy
    skinTone = '#fdba74'; // orange-300
    shirtColor = '#10b981'; // emerald
    pantColor = '#0f172a';
    hasGlasses = true;
  } else if (id === 'vp_cs') {
    gender = 'female';
    hairType = 'curly';
    hairColor = '#172554';
    skinTone = '#fed7aa';
    shirtColor = '#fb7185';
    pantColor = '#475569';
  } else if (id === 'vp_partnerships') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#b45309';
    skinTone = '#fdba74';
    shirtColor = '#fbbf24';
    pantColor = '#334155';
  } else if (id === 'critic') {
    gender = 'male';
    hairType = 'sidepart';
    hairColor = '#0f172a';
    skinTone = '#ffedd5';
    shirtColor = '#f43f5e';
    pantColor = '#1e293b';
    hasBeard = true;
  } else if (id === 'seo') {
    gender = 'female';
    hairType = 'bob';
    hairColor = '#451a03';
    skinTone = '#ffedd5';
    shirtColor = '#c084fc';
    pantColor = '#334155';
  } else if (id === 'demand_gen') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#0284c7';
    skinTone = '#fdba74';
    shirtColor = '#7c3aed';
    pantColor = '#1e293b';
  } else if (id === 'vp_pmm') {
    gender = 'female';
    hairType = 'long';
    hairColor = '#b45309';
    skinTone = '#ffedd5';
    shirtColor = '#a855f7';
    pantColor = '#475569';
  } else if (id === 'market_intel') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#1e293b';
    skinTone = '#ffedd5';
    shirtColor = '#fcd34d';
    pantColor = '#334155';
  } else if (id === 'sdr_mgr') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#1e293b';
    skinTone = '#fed7aa';
    shirtColor = '#34d399';
    pantColor = '#1e293b';
  } else if (id === 'outbound_sdr') {
    gender = 'female';
    hairType = 'curly';
    hairColor = '#1e3a8a';
    skinTone = '#fdba74';
    shirtColor = '#059669';
    pantColor = '#475569';
  } else if (id === 'expansion_ae') {
    gender = 'male';
    hairType = 'sidepart';
    hairColor = '#475569';
    skinTone = '#ffedd5';
    shirtColor = '#0284c7';
    pantColor = '#1e293b';
    hasGlasses = true;
  } else if (id === 'revops') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#0f172a';
    skinTone = '#fdba74';
    shirtColor = '#2563eb';
    pantColor = '#334155';
    hasBeard = true;
  } else if (id === 'plg') {
    gender = 'female';
    hairType = 'bob';
    hairColor = '#b45309';
    skinTone = '#ffedd5';
    shirtColor = '#3b82f6';
    pantColor = '#475569';
  } else if (id === 'broker') {
    gender = 'male';
    hairType = 'sidepart';
    hairColor = '#3b2f2f';
    skinTone = '#fed7aa';
    shirtColor = '#60a5fa';
    pantColor = '#1e293b';
  } else if (id === 'csm') {
    gender = 'female';
    hairType = 'curly';
    hairColor = '#172554';
    skinTone = '#ffedd5';
    shirtColor = '#fb7185';
    pantColor = '#475569';
    hasGlasses = true;
  } else if (id === 'renewals') {
    gender = 'male';
    hairType = 'short';
    hairColor = '#7c2d12';
    skinTone = '#fdba74';
    shirtColor = '#e11d48';
    pantColor = '#334155';
  } else if (id === 'community') {
    gender = 'female';
    hairType = 'long';
    hairColor = '#451a03';
    skinTone = '#ffedd5';
    shirtColor = '#f43f5e';
    pantColor = '#475569';
  } else {
    // Player
    gender = 'male';
    hairType = 'sidepart';
    hairColor = '#1e293b';
    skinTone = '#fed7aa';
    shirtColor = '#2563eb';
    pantColor = '#0f172a';
    hasGlasses = true;
  }

  return (
    <svg viewBox="0 0 44 44" style={{ width: '100%', height: '100%', overflow: 'visible', background: 'transparent' }}>
      <defs>
        <style>{`
          @keyframes walk-l {
            0% { transform: translateY(0); }
            100% { transform: translateY(-3.5px); }
          }
          @keyframes walk-r {
            0% { transform: translateY(-3.5px); }
            100% { transform: translateY(0); }
          }
          .l-leg-anim {
            animation: walk-l 0.22s infinite alternate ease-in-out;
          }
          .r-leg-anim {
            animation: walk-r 0.22s infinite alternate ease-in-out;
          }
          .full-avatar-group {
            transform-origin: 22px 22px;
            transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        `}</style>
      </defs>

      <g className="full-avatar-group">
        <ellipse cx="22" cy="36" rx="11" ry="5" fill="#000" fillOpacity="0.25" />

        <g className={isMoving ? "l-leg-anim" : ""}>
          <rect x="15" y="30" width="5" height="10" rx="2" fill={pantColor} />
          <rect x="14" y="38" width="7" height="4" rx="1.5" fill="#111" />
        </g>
        <g className={isMoving ? "r-leg-anim" : ""}>
          <rect x="24" y="30" width="5" height="10" rx="2" fill={pantColor} />
          <rect x="23" y="38" width="7" height="4" rx="1.5" fill="#111" />
        </g>

        <rect 
          x="9" y="16" width="4" height="15" rx="2" 
          fill={shirtColor} 
          className={isMoving ? "r-leg-anim" : ""} 
          style={{ transformOrigin: '11px 16px' }}
        />
        <circle cx="11" cy="30" r="2" fill={skinTone} className={isMoving ? "r-leg-anim" : ""} />
        <rect 
          x="31" y="16" width="4" height="15" rx="2" 
          fill={shirtColor} 
          className={isMoving ? "l-leg-anim" : ""} 
          style={{ transformOrigin: '33px 16px' }}
        />
        <circle cx="33" cy="30" r="2" fill={skinTone} className={isMoving ? "l-leg-anim" : ""} />

        <rect x="12" y="14" width="20" height="18" rx="5" fill={shirtColor} stroke="#000" strokeOpacity="0.05" strokeWidth="0.5" />
        <rect x="19" y="10" width="6" height="6" rx="1" fill={skinTone} />
        <circle cx="22" cy="11" r="7.5" fill={skinTone} />

        {/* Upright directionality: hide face if facing up, translate if left/right */}
        {direction !== 'up' && (
          <g style={{ 
            transform: direction === 'left' ? 'translateX(-2px)' : direction === 'right' ? 'translateX(2px)' : 'none',
            transformOrigin: '22px 11px',
            transition: 'transform 0.15s'
          }}>
            <circle cx="19.5" cy="11.5" r="0.75" fill="#1e293b" />
            <circle cx="24.5" cy="11.5" r="0.75" fill="#1e293b" />

            <path d="M17.5 9.5C18.5 9 19.5 9.5 19.5 9.5" stroke={hairColor} strokeWidth="0.75" fill="none" />
            <path d="M24.5 9.5C24.5 9.5 25.5 9 26.5 9.5" stroke={hairColor} strokeWidth="0.75" fill="none" />
            <path d="M20.5 14.5C21 15.2 23 15.2 23.5 14.5" stroke="#e11d48" strokeWidth="0.75" strokeLinecap="round" fill="none" />

            {hasBeard && (
              <path d="M15 11C15 15.5 22 17 29 15C29 12.5 29 11 29 11Z" fill={hairColor} opacity="0.45" />
            )}

            {hasGlasses && (
              <g stroke="#1e293b" strokeWidth="0.75" fill="none">
                <circle cx="19.5" cy="11.5" r="2.2" />
                <circle cx="24.5" cy="11.5" r="2.2" />
                <line x1="21.7" y1="11.5" x2="22.3" y2="11.5" />
              </g>
            )}
          </g>
        )}

        {hairType === 'short' && (
          <path d="M14.5 8C13.5 5 17.5 2 22 2C26.5 2 30.5 5 29.5 8C28.5 6.5 25.5 5 22 5C18.5 5 15.5 6.5 14.5 8Z" fill={hairColor} />
        )}
        {hairType === 'sidepart' && (
          <path d="M14 8C14 4 18 1.5 23 1.5C28 1.5 30 4 30 6.5C28.5 4.5 25 3.5 22 5C18.5 6.5 16 6 14 8Z" fill={hairColor} />
        )}
        {hairType === 'bob' && (
          <path d="M14 11C13.5 7 16 4 22 4C28 4 30.5 7 30 11C30.5 11 31 14 31 14L29 14C29 11.5 28.5 6.5 22 6.5C15.5 6.5 15 11.5 15 14L13 14C13 14 13.5 11 14 11Z" fill={hairColor} />
        )}
        {hairType === 'long' && (
          <path d="M14 10C13.5 6 15 4 22 4C29 4 30.5 6 30 10C29.5 10 30.5 16 30.5 19.5C29 19.5 29 17 29 13.5C29 10.5 28.5 6.5 22 6.5C15.5 6.5 15 10.5 15 13.5C15 17 15 19.5 13.5 19.5C13.5 16 14.5 10 14 10Z" fill={hairColor} />
        )}
        {hairType === 'curly' && (
          <g fill={hairColor}>
            <path d="M14.5 8C13 5 16.5 2.5 22 2.5C27.5 2.5 31 5 29.5 8C28 6.5 25 5.5 22 5.5C19 5.5 16 6.5 14.5 8Z" />
            <circle cx="15.5" cy="5.5" r="2" />
            <circle cx="18.5" cy="3.5" r="2" />
            <circle cx="22" cy="2.5" r="2" />
            <circle cx="25.5" cy="3.5" r="2" />
            <circle cx="28.5" cy="5.5" r="2" />
            <circle cx="13.5" cy="8" r="2" />
            <circle cx="30.5" cy="8" r="2" />
            <circle cx="13.5" cy="10.5" r="1.5" />
            <circle cx="30.5" cy="10.5" r="1.5" />
          </g>
        )}
      </g>
    </svg>
  );
};

// 18 Agents grouped as per department categorization
const initialAgents: Agent[] = [
  { 
    id: "cmo", 
    name: "CMO Agent", 
    role: "Chief Marketing Officer", 
    department: "C-Suite", 
    description: "Aligns marketing strategy, lockers ICPs, and allocates ad budgets.",
    tools: ["HubSpot", "MarketIntel", "Notion", "Slack"],
    logic: "IF Console routes GTM instruction → Trigger Organic and Paid alignment",
    kpis: ["Marketing pipeline value", "CAC", "Win-rate %"],
    initials: "CM", 
    color: "#818cf8",
    hairColor: "#7c2d12",
    x: 2, y: 5, homeX: 2, homeY: 5, direction: 'up', isMoving: false, status: "working", battery: 94, dialogue: null, dialogueTimer: 0,
    activity: "Synthesizing executive marketing forecasts",
    shortLabel: "CMO"
  },
  { 
    id: "vp_sales", 
    name: "VP Sales Agent", 
    role: "VP of Sales (SLG)", 
    department: "C-Suite", 
    description: "Oversees enterprise accounts, sales pipeline, and Outbound SDR quotas.",
    tools: ["Apollo", "Clay", "HubSpot", "Slack"],
    logic: "IF Console routes GTM instruction → Trigger SDR sequences updates in Sales Bay",
    kpis: ["Meetings booked", "Sales cycle length", "Pipeline ARR"],
    initials: "VS", 
    color: "#34d399",
    hairColor: "#1e3a8a",
    x: 4, y: 5, homeX: 4, homeY: 5, direction: 'up', isMoving: false, status: "talking", battery: 90, dialogue: null, dialogueTimer: 0,
    activity: "Reviewing outbound pipeline models",
    shortLabel: "VP Sales"
  },
  { 
    id: "vp_cs", 
    name: "VP CS Agent", 
    role: "VP of Customer Success", 
    department: "C-Suite", 
    description: "Maintains Net Revenue Retention (NRR), save cycles, and CSM allocations.",
    tools: ["HubSpot", "PostHog", "Notion"],
    logic: "IF health index drops below 50 → Assign CS save target in Support Cabin",
    kpis: ["NRR (target 110%+)", "Retention rate", "Time-to-onboard"],
    initials: "VC", 
    color: "#fb7185",
    hairColor: "#111827",
    x: 10, y: 5, homeX: 10, homeY: 5, direction: 'up', isMoving: false, status: "idle", battery: 85, dialogue: null, dialogueTimer: 0,
    activity: "Reviewing renewals forecast briefs",
    shortLabel: "VP CS"
  },
  { 
    id: "vp_partnerships", 
    name: "VP Partnerships Agent", 
    role: "VP of Partnerships", 
    department: "C-Suite", 
    description: "Designs co-sell alliances, Crossbeam maps, and warm partner intro systems.",
    tools: ["Crossbeam", "HubSpot", "Slack"],
    logic: "IF active deal → Initiate Crossbeam partner overlapping scans",
    kpis: ["Partner revenue %", "Alliance count"],
    initials: "VP", 
    color: "#fcd34d",
    hairColor: "#b45309",
    x: 13, y: 5, homeX: 13, homeY: 5, direction: 'up', isMoving: false, status: "talking", battery: 96, dialogue: null, dialogueTimer: 0,
    activity: "Mapping Crossbeam partner overlaps",
    shortLabel: "VP Partner"
  },
  { 
    id: "critic", 
    name: "Critic Agent", 
    role: "Strategy Evaluator", 
    department: "C-Suite", 
    description: "Audits feasibility of GTM playbooks and runs red-team system diagnostics.",
    tools: ["VertexAI", "Notion", "Slack"],
    logic: "IF alignment playbook proposed → Score feasibility & detect pipeline faults",
    kpis: ["Vulnerability detection rate", "Playbook accuracy"],
    initials: "CR", 
    color: "#f43f5e",
    hairColor: "#0f172a",
    x: 6, y: 13, homeX: 6, homeY: 13, direction: 'up', isMoving: false, status: "working", battery: 92, dialogue: null, dialogueTimer: 0,
    activity: "Red-teaming marketing campaign copy",
    shortLabel: "Critic"
  },
  { 
    id: "seo", 
    name: "SEO Agent", 
    role: "Organic SEO Specialist", 
    department: "Marketing", 
    description: "Monitors search queries, posts daily articles, and drives organic traffic.",
    tools: ["LinkedIn", "MarketIntel", "GoogleAnalytics"],
    logic: "IF CMO routes task → Optimize organic search keywords and LinkedIn posting",
    kpis: ["Organic traffic growth", "Inbound lead count"],
    initials: "SE", 
    color: "#a855f7",
    hairColor: "#7c2d12",
    x: 17, y: 3, homeX: 17, homeY: 3, direction: 'left', isMoving: false, status: "idle", battery: 93, dialogue: null, dialogueTimer: 0,
    activity: "Optimizing organic query rankings",
    shortLabel: "SEO"
  },
  { 
    id: "demand_gen", 
    name: "Demand Gen Agent", 
    role: "Demand Gen Manager", 
    department: "Marketing", 
    description: "Deploys search engine ad copy, monitors campaign budgets, and paid channels ROI.",
    tools: ["GoogleAds", "MetaAds", "GoogleAnalytics"],
    logic: "IF CAC exceeds $500 threshold → Pause LinkedIn paid groups",
    kpis: ["MQL volume", "ROAS target", "Cost per lead"],
    initials: "DG", 
    color: "#34d399",
    hairColor: "#b45309",
    x: 17, y: 5, homeX: 17, homeY: 5, direction: 'left', isMoving: false, status: "working", battery: 88, dialogue: null, dialogueTimer: 0,
    activity: "Optimizing Google Search campaign bids",
    shortLabel: "Demand"
  },
  { 
    id: "vp_pmm", 
    name: "VP PMM Agent", 
    role: "VP of Product Marketing", 
    department: "C-Suite", 
    description: "Creates market battlecards, pricing models, and GTM positioning playbooks.",
    tools: ["Notion", "MarketIntel", "Slack"],
    logic: "IF competitor pivots features → Auto-update sales battlecard script",
    kpis: ["Win-rate on competitor deals", "Asset usage %"],
    initials: "PM", 
    color: "#60a5fa",
    hairColor: "#111827",
    x: 6, y: 5, homeX: 6, homeY: 5, direction: 'up', isMoving: false, status: "working", battery: 95, dialogue: null, dialogueTimer: 0,
    activity: "Refining competitor pricing battlecards",
    shortLabel: "VP PMM"
  },
  { 
    id: "market_intel", 
    name: "Market Intel Agent", 
    role: "Market Analyst", 
    department: "Marketing", 
    description: "Runs real-time grounded search to track competitor updates and pricing strategies.",
    tools: ["MarketIntel", "Google", "Notion"],
    logic: "ALWAYS search competitor profiles every 24h",
    kpis: ["ICP match rate", "Competitive win-rate trend"],
    initials: "MI", 
    color: "#fcd34d",
    hairColor: "#1e293b",
    x: 17, y: 4, homeX: 17, homeY: 4, direction: 'left', isMoving: false, status: "idle", battery: 80, dialogue: null, dialogueTimer: 0,
    activity: "Scraping industry news indexes",
    shortLabel: "Market"
  },
  { 
    id: "sdr_mgr", 
    name: "SDR Manager Agent", 
    role: "SDR Manager Lead", 
    department: "Sales", 
    description: "Orchestrates cold emailing sequences, Clay lead enrichment, and booked meetings.",
    tools: ["Apollo", "Clay", "HubSpot", "Slack"],
    logic: "IF VP Sales routes task → Launch sequence and personalization scripts in Sales Bay",
    kpis: ["Meetings booked", "Outbound reply rate"],
    initials: "SD", 
    color: "#34d399",
    hairColor: "#1e3a8a",
    x: 21, y: 4, homeX: 21, homeY: 4, direction: 'right', isMoving: false, status: "working", battery: 89, dialogue: null, dialogueTimer: 0,
    activity: "Personalizing cold email template for enterprise lead",
    shortLabel: "SDR Mgr"
  },
  { 
    id: "outbound_sdr", 
    name: "Outbound SDR", 
    role: "Outbound outreach coordinator", 
    department: "Sales", 
    description: "Executes automated sequencing, email delivery, and follow-ups.",
    tools: ["Apollo", "Clay", "HubSpot"],
    logic: "IF contact matches ICP -> Enqueue in daily email send campaign list",
    kpis: ["Email delivery count", "Meeting book rate %"],
    initials: "OS", 
    color: "#34d399",
    hairColor: "#b45309",
    x: 21, y: 3, homeX: 21, homeY: 3, direction: 'right', isMoving: false, status: "working", battery: 88, dialogue: null, dialogueTimer: 0,
    activity: "Injecting enriched lead payloads to HubSpot",
    shortLabel: "Outbound"
  },
  { 
    id: "expansion_ae", 
    name: "Expansion AE Agent", 
    role: "Expansion Account Executive", 
    department: "Sales", 
    description: "Identifies seat limits, triggers cross-sell, and manages contract expansions.",
    tools: ["HubSpot", "Apollo", "LinkedIn"],
    logic: "IF customer seats reach 90% limit → Draft upsell contract proposal",
    kpis: ["Expansion ARR", "Upsell win rate", "Contract amendment speed"],
    initials: "EX", 
    color: "#34d399",
    hairColor: "#1e3a8a",
    x: 21, y: 5, homeX: 21, homeY: 5, direction: 'right', isMoving: false, status: "idle", battery: 84, dialogue: null, dialogueTimer: 0,
    activity: "Standby for upsell triggers",
    shortLabel: "Expansion"
  },
  { 
    id: "revops", 
    name: "RevOps Agent", 
    role: "Revenue Operations Specialist", 
    department: "Operations", 
    description: "Maintains CRM syncing gateways, lead routing algorithms, and API integrations.",
    tools: ["Make", "Gumloop", "HubSpot", "Supabase"],
    logic: "IF signup source = 'Webinar' → Route lead immediately to CSM pipeline",
    kpis: ["Lead routing speed", "CRM completeness", "Integration uptime %"],
    initials: "RO", 
    color: "#60a5fa",
    hairColor: "#047857",
    x: 17, y: 12, homeX: 17, homeY: 12, direction: 'left', isMoving: false, status: "working", battery: 92, dialogue: null, dialogueTimer: 0,
    activity: "Auditing HubSpot webhook sync triggers",
    shortLabel: "RevOps"
  },
  { 
    id: "plg", 
    name: "PLG Agent", 
    role: "Head of Product-Led Growth", 
    department: "Operations", 
    description: "Computes user activation metrics, identifies PQL spikes, and triggers Slack alerts.",
    tools: ["PostHog", "HubSpot", "Slack", "Notion"],
    logic: "IF workspace invites > 3 teammates → Flag PQL and alert Sales representatives",
    kpis: ["Activation rate", "PQL to SQL rate", "Product sourced revenue %"],
    initials: "PL", 
    color: "#c084fc",
    hairColor: "#b45309",
    x: 17, y: 11, homeX: 17, homeY: 11, direction: 'left', isMoving: false, status: "working", battery: 85, dialogue: null, dialogueTimer: 0,
    activity: "Scaffolding PostHog onboarding custom triggers",
    shortLabel: "PLG"
  },
  { 
    id: "broker", 
    name: "Broker Agent", 
    role: "System Handoff Coordinator", 
    department: "Operations", 
    description: "Acts as a central communication relay between disparate agent networks.",
    tools: ["Make", "Gumloop", "Supabase"],
    logic: "IF agent payload received → Relay and check integration parameters",
    kpis: ["Relay latency", "Sync efficiency", "Database updates"],
    initials: "SB", 
    color: "#94a3b8",
    hairColor: "#334155",
    x: 17, y: 13, homeX: 17, homeY: 13, direction: 'left', isMoving: false, status: "working", battery: 99, dialogue: null, dialogueTimer: 0,
    activity: "Routing message signals through system gateway",
    shortLabel: "Broker"
  },
  { 
    id: "csm", 
    name: "CSM Agent", 
    role: "Customer Success Manager", 
    department: "Support", 
    description: "Automates customer onboarding, schedules check-ins, and manages renewals.",
    tools: ["HubSpot", "Slack", "Zoom"],
    logic: "IF usage drops 20% → Route priority support ticket to renewals manager",
    kpis: ["Renewal rate", "CSAT score", "Average health score"],
    initials: "CS", 
    color: "#fb7185",
    hairColor: "#0f172a",
    x: 21, y: 11, homeX: 21, homeY: 11, direction: 'right', isMoving: false, status: "idle", battery: 91, dialogue: null, dialogueTimer: 0,
    activity: "Lounging at Customer support desk",
    shortLabel: "CSM"
  },
  { 
    id: "renewals", 
    name: "Renewals Agent", 
    role: "Renewals Manager", 
    department: "Support", 
    description: "Manages contract expiries, forecasts NRR defense, and protects accounts.",
    tools: ["HubSpot", "Notion", "Slack"],
    logic: "IF renewal within 90 days → Initiate multi-year contract dialogue",
    kpis: ["NRR defense", "Renewal rate", "Negotiation speed"],
    initials: "RN", 
    color: "#fb7185",
    hairColor: "#1e3a8a",
    x: 21, y: 12, homeX: 21, homeY: 12, direction: 'right', isMoving: false, status: "idle", battery: 84, dialogue: null, dialogueTimer: 0,
    activity: "Standby for account renewals checks",
    shortLabel: "Renewals"
  },
  { 
    id: "community", 
    name: "Community Agent", 
    role: "Community Signals Analyst", 
    department: "Support", 
    description: "Listens to public Slack and LinkedIn channels for intent keyword mentions.",
    tools: ["Slack", "LinkedIn", "Notion"],
    logic: "IF keyword 'pricing' is detected in Slack → Route alert to CSM queue",
    kpis: ["Community DAU", "Brand sentiment score", "Referral lead count"],
    initials: "CO", 
    color: "#a1a1aa",
    hairColor: "#b45309",
    x: 21, y: 13, homeX: 21, homeY: 13, direction: 'right', isMoving: false, status: "working", battery: 97, dialogue: null, dialogueTimer: 0,
    activity: "Scanning Slack public channel signals",
    shortLabel: "Community"
  }
];

const GTM_MOTIONS = {
  "Admin Support": { title: "Admin Cabin", color: "#e2e8f0" },
  "C-Suite": { title: "Executive Suite", color: "#818cf8" },
  "Marketing": { title: "Marketing Bay", color: "#c084fc" },
  "Sales": { title: "Sales Bay", color: "#34d399" },
  "Operations": { title: "Operations Hub", color: "#60a5fa" },
  "Support": { title: "Customer Success Cabin", color: "#fb7185" }
};

const liveWinLogs = [
  "SDR Agent booked a demo with CTO at Stripe.com (SLA: 12s).",
  "CMO Agent optimized budget allocation: assigned $8k to high-intent paid search.",
  "Outbound SDR Agent automatically personalized and delivered 42 emails.",
  "Market Intel Analyst detected competitor price drop; auto-alerted C-Suite.",
  "SDR Manager Agent verified Clay data enrichment matches: 98.4% density secured.",
  "Partnership Lead Agent mapped 18 new Crossbeam overlaps with Snowflake.",
  "VP CS Agent flagged contract renewal alert: auto-generated renewal brief.",
  "PLG Agent triaged 14 high-intent user signups, mapping them automatically to HubSpot CRM."
];

export default function AgentsOfficePage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [player, setPlayer] = useState({
    x: 2,
    y: 12,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
    isMoving: false,
    name: "Admin (You)",
    color: "#3b82f6",
    hairColor: "#0f172a"
  });
  
  const [playerPath, setPlayerPath] = useState<{ x: number, y: number }[]>([]);
  const [clickRipple, setClickRipple] = useState<{ x: number, y: number, id: number } | null>(null);
  
  const [themeMode, setThemeMode] = useState<'day' | 'night'>('day');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [proximityAgentId, setProximityAgentId] = useState<string | null>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 30, y: 40 });
  
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "2D office virtual space initialized. Move around with WASD/Arrows.",
    "Categorized 17 agents into departments: Executive, Marketing, Sales, Operations, and Customer Success.",
    "GTM Direct Action Console initialized. Submit GTM alignments via the Chat Console below."
  ]);
  const [simRunning, setSimRunning] = useState<boolean>(true);

  // Interactive bubble states
  const [activeAgentChats, setActiveAgentChats] = useState<Record<string, Array<{sender: 'user' | 'agent', text: string}>>>({});
  const [agentThinkingState, setAgentThinkingState] = useState<Record<string, boolean>>({});
  const [bubbleInputs, setBubbleInputs] = useState<Record<string, string>>({});

  // Boardroom debate & Live office states
  const [agentPaths, setAgentPaths] = useState<Record<string, { x: number; y: number }[]>>({});
  const [boardroomState, setBoardroomState] = useState<'idle' | 'gathering' | 'in_meeting' | 'dispersing'>('idle');
  const [debateHistory, setDebateHistory] = useState<Array<{ role: string; text: string }>>([]);
  const [debateSpeakerIndex, setDebateSpeakerIndex] = useState<number>(-1);
  const [debateTopic, setDebateTopic] = useState<string>('');
  const [activeObjectInteraction, setActiveObjectInteraction] = useState<'espresso' | 'pool' | null>(null);

  // Chat interface states
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'console', text: string }>>([
    { sender: 'console', text: "GTM Direct Action Console ready. Type any GTM instruction below to broadcast it directly to C-Suite executives." }
  ]);
  
  // Delegation pipeline states
  const [delegationState, setDelegationState] = useState<'idle' | 'exec_consulting' | 'exec_walking_to_dept' | 'dept_aligning' | 'returning'>('idle');
  const [activeInstruction, setActiveInstruction] = useState<string>('');

  const handleBubbleSubmit = async (agentId: string, text: string) => {
    if (!text.trim()) return;

    // Clear input
    setBubbleInputs(prev => ({ ...prev, [agentId]: '' }));

    // Set loading state
    setAgentThinkingState(prev => ({ ...prev, [agentId]: true }));

    // Add user message to history
    const userMsg = { sender: 'user' as const, text };
    const history = activeAgentChats[agentId] || [];
    const updatedHistory = [...history, userMsg];
    setActiveAgentChats(prev => ({
      ...prev,
      [agentId]: updatedHistory
    }));

    // Set agent dialogue temporarily to what user said
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          dialogue: `💬 User: "${text}"`,
          dialogueTimer: 10,
          status: 'talking'
        };
      }
      return a;
    }));

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          message: text,
          history: history
        }),
      });

      const data = await response.json();

      if (data.reply) {
        // Add agent reply to history
        setActiveAgentChats(prev => ({
          ...prev,
          [agentId]: [...(prev[agentId] || []), { sender: 'agent' as const, text: data.reply }]
        }));

        // Update agent's visible dialogue and status
        setAgents(prev => prev.map(a => {
          if (a.id === agentId) {
            return {
              ...a,
              dialogue: data.reply,
              dialogueTimer: 15,
              status: 'talking'
            };
          }
          return a;
        }));

        const agentName = agents.find(a => a.id === agentId)?.name || agentId;
        addLog(`💬 Chat: ${agentName} replied: "${data.reply}"`);
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply = `I am ready to help, but I had trouble reaching our strategy backend. Let me know what else I can optimize for our KPIs!`;

      setActiveAgentChats(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), { sender: 'agent' as const, text: fallbackReply }]
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === agentId) {
          return {
            ...a,
            dialogue: fallbackReply,
            dialogueTimer: 10,
            status: 'talking'
          };
        }
        return a;
      }));
    } finally {
      setAgentThinkingState(prev => ({ ...prev, [agentId]: false }));
    }
  };

  // Helper to assign walking paths to multiple agents
  const walkMultipleAgents = (targets: { id: string; x: number; y: number }[]) => {
    setAgentPaths(prev => {
      const nextPaths = { ...prev };
      
      setAgents(prevAgents => {
        return prevAgents.map(a => {
          const target = targets.find(t => t.id === a.id);
          if (target) {
            const path = findPath(a.x, a.y, target.x, target.y);
            if (path && path.length > 0) {
              nextPaths[a.id] = path;
            }
          }
          return a;
        });
      });
      
      return nextPaths;
    });
  };

  // Agent Pathfinding Walker Loop (cell-by-cell moves based on queued paths)
  useEffect(() => {
    if (Object.keys(agentPaths).length === 0) return;

    const intervalTime = 180 / simSpeed;
    const agentWalkInterval = setInterval(() => {
      let hasActivePaths = false;

      setAgentPaths(prevPaths => {
        const nextPaths = { ...prevPaths };
        
        setAgents(prevAgents => {
          let updated = false;
          const nextAgents = prevAgents.map(a => {
            const path = nextPaths[a.id];
            if (path && path.length > 0) {
              const nextStep = path[0];
              const remaining = path.slice(1);
              if (remaining.length === 0) {
                delete nextPaths[a.id];
              } else {
                nextPaths[a.id] = remaining;
                hasActivePaths = true;
              }

              let dir = a.direction;
              if (nextStep.x > a.x) dir = 'right';
              else if (nextStep.x < a.x) dir = 'left';
              else if (nextStep.y > a.y) dir = 'down';
              else if (nextStep.y < a.y) dir = 'up';

              updated = true;
              return {
                ...a,
                x: nextStep.x,
                y: nextStep.y,
                direction: dir,
                isMoving: true
              };
            } else if (a.isMoving) {
              updated = true;
              return { ...a, isMoving: false };
            }
            return a;
          });

          return updated ? nextAgents : prevAgents;
        });

        if (!hasActivePaths) return {};
        return nextPaths;
      });
    }, intervalTime);

    return () => clearInterval(agentWalkInterval);
  }, [agentPaths, simSpeed]);

  // Boardroom Meeting gathering detector: triggers 'in_meeting' once VPs arrive
  useEffect(() => {
    if (boardroomState !== 'gathering') return;

    const vps = ['cmo', 'vp_sales', 'vp_cs', 'vp_partnerships', 'vp_pmm'];
    const vpDestinations: Record<string, {x: number, y: number}> = {
      cmo: { x: 9, y: 12 },
      vp_sales: { x: 9, y: 13 },
      vp_cs: { x: 12, y: 12 },
      vp_partnerships: { x: 12, y: 13 },
      vp_pmm: { x: 11, y: 11 }
    };

    const allArrived = vps.every(id => {
      const agent = agents.find(a => a.id === id);
      const dest = vpDestinations[id];
      return agent && agent.x === dest.x && agent.y === dest.y;
    });

    if (allArrived) {
      setBoardroomState('in_meeting');
      addLog("👔 Boardroom: C-Suite VPs have gathered around the table. Seeding debate console.");
      setAgents(prev => prev.map(a => {
        if (vps.includes(a.id)) {
          return {
            ...a,
            status: 'talking',
            dialogue: "Ready for GTM sync.",
            dialogueTimer: 4
          };
        }
        return a;
      }));
    }
  }, [agents, boardroomState]);

  // Boardroom Meeting dispersal detector: returns state to idle once VPs reach home cabins
  useEffect(() => {
    if (boardroomState !== 'dispersing') return;

    const vps = ['cmo', 'vp_sales', 'vp_cs', 'vp_partnerships', 'vp_pmm'];
    const allReturned = vps.every(id => {
      const agent = agents.find(a => a.id === id);
      return agent && agent.x === agent.homeX && agent.y === agent.homeY;
    });

    if (allReturned) {
      setBoardroomState('idle');
      addLog("👔 Boardroom: Alignment complete. VPs back to work cabins.");
    }
  }, [agents, boardroomState]);

  // Boardroom debate turn runner: handles sequential speaking using Gemini API
  useEffect(() => {
    if (boardroomState !== 'in_meeting' || debateSpeakerIndex < 0 || debateSpeakerIndex >= 5) return;

    const runDebateTurn = async () => {
      const vps = ['cmo', 'vp_sales', 'vp_cs', 'vp_pmm', 'vp_partnerships'];
      const speakerId = vps[debateSpeakerIndex];
      const speaker = agents.find(a => a.id === speakerId);
      if (!speaker) return;

      // Set thinking state for speaker
      setAgentThinkingState(prev => ({ ...prev, [speakerId]: true }));

      // Format previous debate history for Gemini
      const previousComments = debateHistory.map(d => `[${d.role}]: "${d.text}"`).join('\n');
      const seedPrompt = `We are having a boardroom debate regarding the GTM directive: "${debateTopic}".
Preceding comments in the debate:
${previousComments || "(No comments yet. You are starting the debate.)"}

Please provide your response to this GTM directive and any preceding comments from the perspective of your role: ${speaker.role}.
Keep your response to exactly 1 or 2 concise, impactful sentences representing your department's view. Do not use JSON or markdown. Just output clean speech text.`;

      try {
        const response = await fetch('/api/agents/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentId: speakerId,
            message: seedPrompt,
            history: []
          })
        });

        const data = await response.json();
        
        if (data.reply) {
          // Update speaker's speech bubble and clear other VPs' bubbles
          setAgents(prev => prev.map(a => {
            if (a.id === speakerId) {
              return {
                ...a,
                dialogue: data.reply,
                dialogueTimer: 10,
                status: 'talking'
              };
            }
            if (vps.includes(a.id)) {
              return {
                ...a,
                dialogue: null,
                dialogueTimer: 0,
                status: 'working'
              };
            }
            return a;
          }));

          // Add to debate history log
          setDebateHistory(prev => [...prev, { role: speaker.shortLabel, text: data.reply }]);
          addLog(`👔 Debate: [${speaker.shortLabel}] spoken: "${data.reply}"`);
        }
      } catch (err) {
        console.error('Debate turn error:', err);
      } finally {
        setAgentThinkingState(prev => ({ ...prev, [speakerId]: false }));
        
        // Wait 10 seconds for the user to read the bubble, then proceed to the next speaker!
        setTimeout(() => {
          setDebateSpeakerIndex(prev => prev + 1);
        }, 10000);
      }
    };

    runDebateTurn();
  }, [debateSpeakerIndex, boardroomState]);

  // Ambient Breaks Loop: occasionally walks random agents to Canteen, Lounge, or Pool Table
  useEffect(() => {
    if (!simRunning || boardroomState !== 'idle' || delegationState !== 'idle') return;

    const interval = setInterval(() => {
      // 12% chance every 20s to trigger a break
      if (Math.random() > 0.12) return;

      const nonCSuiteAgents = agents.filter(a => a.department !== 'C-Suite' && a.department !== 'Support');
      if (nonCSuiteAgents.length === 0) return;
      const agent = nonCSuiteAgents[Math.floor(Math.random() * nonCSuiteAgents.length)];

      // Make sure they are currently at home workstation
      if (agent.x !== agent.homeX || agent.y !== agent.homeY) return;

      // Select break area: 0 = Espresso Bar, 1 = Sofa, 2 = Pool Table
      const breakType = Math.floor(Math.random() * 3);
      let breakX = 1;
      let breakY = 8;
      let breakName = "Espresso Island";
      let breakMsg = "Grabbing an espresso shot... ☕";

      if (breakType === 1) {
        breakX = 6;
        breakY = 8;
        breakName = "Cozy Lounge";
        breakMsg = "Taking a lounge break on the sofa... 🛋️";
      } else if (breakType === 2) {
        breakX = 19;
        breakY = 8;
        breakName = "Pool Table";
        breakMsg = "Playing a quick game of pool... 🎱";
      }

      const path = findPath(agent.x, agent.y, breakX, breakY);
      if (path && path.length > 0) {
        addLog(`Ambient Break: ${agent.name} is walking to ${breakName}.`);
        setAgentPaths(prev => ({ ...prev, [agent.id]: path }));

        setAgents(prev => prev.map(a => {
          if (a.id === agent.id) {
            return {
              ...a,
              status: 'talking',
              dialogue: breakMsg,
              dialogueTimer: 6
            };
          }
          return a;
        }));

        // Hang out for 15 seconds, then return
        setTimeout(() => {
          setAgents(prev => prev.map(a => {
            if (a.id === agent.id) {
              const returnPath = findPath(a.x, a.y, a.homeX, a.homeY);
              if (returnPath && returnPath.length > 0) {
                setAgentPaths(prevP => ({ ...prevP, [agent.id]: returnPath }));
              }
              return {
                ...a,
                status: 'working',
                dialogue: "Return to work.",
                dialogueTimer: 4
              };
            }
            return a;
          }));
        }, 15000);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [simRunning, boardroomState, delegationState, agents]);

  // Proximity to Interactive Objects Tracker
  useEffect(() => {
    // Espresso Island: cols 1-2, rows 8-9
    // Pool Table: cols 19-20, rows 8-9
    const isNearEspresso = Math.abs(player.x - 1.5) <= 1.5 && Math.abs(player.y - 8.5) <= 1.5;
    const isNearPool = Math.abs(player.x - 19.5) <= 1.5 && Math.abs(player.y - 8.5) <= 1.5;
    
    if (isNearEspresso) {
      setActiveObjectInteraction('espresso');
    } else if (isNearPool) {
      setActiveObjectInteraction('pool');
    } else {
      setActiveObjectInteraction(null);
    }
  }, [player.x, player.y]);

  const handleBrewEspresso = () => {
    addLog("☕ Espresso: Brewing a dark roasted double espresso shot. Player battery fully recharged!");
    
    setAgents(prev => prev.map(a => {
      const dist = Math.sqrt(Math.pow(a.x - player.x, 2) + Math.pow(a.y - player.y, 2));
      if (dist <= 3) {
        return {
          ...a,
          battery: Math.min(100, a.battery + 15),
          dialogue: "Mmm, fresh espresso! ☕ Thanks!",
          dialogueTimer: 4
        };
      }
      return a;
    }));
  };

  const handlePlayPool = () => {
    addLog("🎱 Pool Table: Strike! You hit a perfect cue-stick shot and pocketed the solid 8-ball.");
    
    setAgents(prev => prev.map(a => {
      const dist = Math.sqrt(Math.pow(a.x - player.x, 2) + Math.pow(a.y - player.y, 2));
      if (dist <= 3) {
        const cheerMsgs = ["Nice shot! 🎱", "Whoa, solid side pocket!", "What a spin! 🚀", "Unbelievable angle!"];
        return {
          ...a,
          dialogue: cheerMsgs[Math.floor(Math.random() * cheerMsgs.length)],
          dialogueTimer: 4
        };
      }
      return a;
    }));
  };



  const activeAgentId = selectedAgentId || proximityAgentId;
  const activeAgent = agents.find(a => a.id === activeAgentId);

  // Active voice status check
  const isNearActive = activeAgent ? proximityAgentId === activeAgent.id : false;

  // Appends a new simulation log
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSimulationLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 25)]);
  };

  // Keyboard Movement Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      if (!simRunning) return;
      if (delegationState !== 'idle') return; // Disable movement during active delegation animation

      let dx = 0;
      let dy = 0;
      let dir: 'up' | 'down' | 'left' | 'right' = 'down';

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        dy = -1;
        dir = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        dy = 1;
        dir = 'down';
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx = -1;
        dir = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx = 1;
        dir = 'right';
      }

      if (dx !== 0 || dy !== 0) {
        setPlayerPath([]);

        setPlayer(prev => {
          const nextX = Math.max(0, Math.min(23, prev.x + dx));
          const nextY = Math.max(0, Math.min(17, prev.y + dy));
          
          if (!isCellBlocked(nextX, nextY) && canMoveBetween(prev.x, prev.y, nextX, nextY)) {
            return {
              ...prev,
              x: nextX,
              y: nextY,
              direction: dir,
              isMoving: true
            };
          }
          return { ...prev, direction: dir, isMoving: false };
        });

        setTimeout(() => {
          setPlayer(prev => ({ ...prev, isMoving: false }));
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simRunning, delegationState]);

  // Click-to-Move Pathing Walk Interval (strict BFS path execution)
  useEffect(() => {
    if (playerPath.length === 0) return;

    const intervalTime = 180 / simSpeed;
    const walkInterval = setInterval(() => {
      setPlayerPath(prevPath => {
        if (prevPath.length === 0) return prevPath;
        
        const nextStep = prevPath[0];
        const remainingPath = prevPath.slice(1);

        setPlayer(prevPlayer => {
          let dir = prevPlayer.direction;
          if (nextStep.x > prevPlayer.x) dir = 'right';
          else if (nextStep.x < prevPlayer.x) dir = 'left';
          else if (nextStep.y > prevPlayer.y) dir = 'down';
          else if (nextStep.y < prevPlayer.y) dir = 'up';

          return {
            ...prevPlayer,
            x: nextStep.x,
            y: nextStep.y,
            direction: dir,
            isMoving: true
          };
        });

        setTimeout(() => {
          setPlayer(prevPlayer => ({ ...prevPlayer, isMoving: false }));
        }, 100);

        return remainingPath;
      });
    }, intervalTime);

    return () => clearInterval(walkInterval);
  }, [playerPath, simSpeed]);

  // Proximity Checker (distance <= 2 tiles)
  useEffect(() => {
    let closestAgentId: string | null = null;
    let minDistance = 999;

    agents.forEach(agent => {
      const distance = Math.sqrt(Math.pow(player.x - agent.x, 2) + Math.pow(player.y - agent.y, 2));
      if (distance <= 2 && distance < minDistance) {
        minDistance = distance;
        closestAgentId = agent.id;
      }
    });

    if (closestAgentId !== proximityAgentId) {
      setProximityAgentId(closestAgentId);
      if (closestAgentId) {
        const name = agents.find(a => a.id === closestAgentId)?.name;
        addLog(`💬 Proximity: Connected to private voice channel with ${name}.`);
      }
    }
  }, [player.x, player.y, agents, proximityAgentId]);

  // Spotlight sweep animation in Night Mode
  useEffect(() => {
    if (themeMode !== 'night') return;

    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.04;
      const x = 50 + Math.cos(angle) * 30;
      const y = 50 + Math.sin(angle) * 30;
      setSpotlightPos({ x, y });
    }, 80);

    return () => clearInterval(interval);
  }, [themeMode]);

  // Dialogue countdown timer loop: decrements dialogue timers and auto-clears dialogue when expired
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(a => {
        if (a.dialogueTimer > 0) {
          const nextTimer = a.dialogueTimer - 1;
          return {
            ...a,
            dialogueTimer: nextTimer,
            dialogue: nextTimer === 0 ? null : a.dialogue
          };
        }
        return a;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Submit Chat to C-Suite
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    if (delegationState !== 'idle') return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');
    setActiveInstruction(userText);
    setDelegationState('exec_consulting');
    addLog(`✉️ Instruction: Submitted GTM request directly to C-Suite: "${userText}"`);

    // Step 1: Execs consult immediately in their cabins
    setAgents(prev => prev.map(a => {
      if (a.id === 'cmo') {
        return {
          ...a,
          status: 'talking',
          dialogue: `Broadcast received: "${userText}". CMO coordinating marketing.`,
          dialogueTimer: 4
        };
      }
      if (a.id === 'vp_sales') {
        return {
          ...a,
          status: 'talking',
          dialogue: `Understood. Customizing outreach sequences.`,
          dialogueTimer: 4
        };
      }
      return a;
    }));
  };

  // Chat Delegation State Machine Pipeline Loops
  useEffect(() => {
    if (delegationState === 'idle') return;

    let timerId: NodeJS.Timeout;

    if (delegationState === 'exec_consulting') {
      // Step 2: Execs walk to their department bays
      timerId = setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === 'cmo') {
            return {
              ...a,
              x: 17,
              y: 7,
              direction: 'up',
              dialogue: "SEO Manager, optimize search key phrases for Admin's goal.",
              dialogueTimer: 5,
              isMoving: true
            };
          }
          if (a.id === 'vp_sales') {
            return {
              ...a,
              x: 21,
              y: 7,
              direction: 'up',
              dialogue: "SDR fleet, personalize sequence cadences immediately.",
              dialogueTimer: 5,
              isMoving: true
            };
          }
          return a;
        }));
        setDelegationState('exec_walking_to_dept');
      }, 4000);
    } else if (delegationState === 'exec_walking_to_dept') {
      // Step 3: Department leads respond and execute
      timerId = setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === 'cmo' || a.id === 'vp_sales') {
            return { ...a, isMoving: false, dialogue: null, dialogueTimer: 0 };
          }
          if (a.id === 'seo') {
            return {
              ...a,
              status: 'working',
              dialogue: "Organic search queries updated! Keywords index live.",
              dialogueTimer: 4,
              battery: Math.max(10, a.battery - 15)
            };
          }
          if (a.id === 'sdr_mgr') {
            return {
              ...a,
              status: 'working',
              dialogue: "Outbound cadences customized. Emails enqueued! 🚀",
              dialogueTimer: 4,
              battery: Math.max(10, a.battery - 12)
            };
          }
          return a;
        }));
        addLog("🏆 GTM Task: SEO keywords optimized and cold outreach emails delivered.");
        setDelegationState('dept_aligning');
      }, 4000);
    } else if (delegationState === 'dept_aligning') {
      // Step 4: Return delegates back to home seats
      timerId = setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === 'cmo' || a.id === 'vp_sales') {
            return {
              ...a,
              x: a.homeX,
              y: a.homeY,
              direction: a.id === 'cmo' ? 'down' : 'right',
              isMoving: true
            };
          }
          return a;
        }));
        setDelegationState('returning');
      }, 4500);
    } else if (delegationState === 'returning') {
      // Step 5: Transition back to idle
      timerId = setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === 'cmo' || a.id === 'vp_sales') {
            return { ...a, isMoving: false, dialogue: null, dialogueTimer: 0 };
          }
          return a;
        }));
        setChatHistory(prev => [...prev, { sender: 'console', text: "The C-Suite execs have aligned and delegated the organic/outbound outreach tasks to the departments. Active execution is in progress!" }]);
        setDelegationState('idle');
      }, 3500);
    }

    return () => clearTimeout(timerId);
  }, [delegationState, activeInstruction, simSpeed]);

  // Global command overrides
  const walkAllToCafe = () => {
    addLog("☕ Coffee Break: Walking all agents to the Cafeteria.");
    const targets = agents.map((a, idx) => {
      const cafeX = 1 + (idx % 4);
      const cafeY = 8 + (idx % 2);
      return { id: a.id, x: cafeX, y: cafeY };
    });
    
    setAgents(prev => prev.map((a, idx) => ({
      ...a,
      status: 'talking',
      dialogue: idx % 3 === 0 ? "Walk to cafe! ☕" : null,
      dialogueTimer: 4
    })));
    
    walkMultipleAgents(targets);
  };

  const walkAllToDesks = () => {
    addLog("⚙️ Reset Desks: Walking all agents back to their cabins.");
    const targets = agents.map(a => ({ id: a.id, x: a.homeX, y: a.homeY }));
    
    setAgents(prev => prev.map(a => ({
      ...a,
      status: 'working',
      dialogue: "Heading back to work.",
      dialogueTimer: 3
    })));
    
    walkMultipleAgents(targets);
  };

  const startBoardroomMeeting = () => {
    setBoardroomState('gathering');
    setDebateHistory([]);
    setDebateSpeakerIndex(-1);
    addLog("👔 Boardroom: Calling VPs to gather around the boardroom table.");
    
    const vpSeats = [
      { id: 'cmo', x: 9, y: 12 },
      { id: 'vp_sales', x: 9, y: 13 },
      { id: 'vp_cs', x: 12, y: 12 },
      { id: 'vp_partnerships', x: 12, y: 13 },
      { id: 'vp_pmm', x: 11, y: 11 }
    ];
    
    setAgents(prev => prev.map(a => {
      const isVp = vpSeats.some(v => v.id === a.id);
      if (isVp) {
        return {
          ...a,
          status: 'talking',
          dialogue: "Sync in boardroom. Walking.",
          dialogueTimer: 4
        };
      }
      return a;
    }));
    
    walkMultipleAgents(vpSeats);
  };

  const endBoardroomMeeting = () => {
    setBoardroomState('dispersing');
    addLog("👔 Boardroom: Adjourning boardroom meeting. VPs returning to cabins.");
    
    const homeSeats = [
      { id: 'cmo', x: 2, y: 5 },
      { id: 'vp_sales', x: 4, y: 5 },
      { id: 'vp_cs', x: 10, y: 5 },
      { id: 'vp_partnerships', x: 13, y: 5 },
      { id: 'vp_pmm', x: 6, y: 5 }
    ];
    
    setAgents(prev => prev.map(a => {
      const isVp = homeSeats.some(h => h.id === a.id);
      if (isVp) {
        return {
          ...a,
          status: 'working',
          dialogue: "Meeting complete.",
          dialogueTimer: 3
        };
      }
      return a;
    }));
    
    walkMultipleAgents(homeSeats);
  };

  const forceTaskDispatch = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: 'working',
          dialogue: "Executing priority GTM task! ⚡",
          dialogueTimer: 5,
          battery: Math.max(10, a.battery - 5)
        };
      }
      return a;
    }));
    const name = agents.find(a => a.id === agentId)?.name;
    addLog(`⚡ Manual Override: Dispatched autonomous task logic for ${name}.`);
  };

  const forceAllHands = () => {
    startBoardroomMeeting();
  };

  const forceCoffee = () => {
    walkAllToCafe();
  };

  const forceHome = () => {
    walkAllToDesks();
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Background Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
          top: '-150px',
          right: '-100px',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Users size={16} color="var(--accent-color)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              2D Floor Plan Workspace
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.85rem', fontWeight: 700, margin: 0, textShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}>
            AI Agent Office Simulator
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            High-fidelity 2D Cabin layouts for C-Suite Execs, Marketing, Sales, Operations, and CS. Broadcast GTM instructions using the Chat Console below.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              setThemeMode(p => p === 'day' ? 'night' : 'day');
              addLog(`Office theme shifted to ${themeMode === 'day' ? 'Night Mode' : 'Day Mode'}.`);
            }}
            style={{
              background: 'rgba(22, 25, 35, 0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
          >
            {themeMode === 'day' ? <Moon size={14} color="#a855f7" /> : <Sun size={14} color="#f59e0b" />}
            {themeMode === 'day' ? "Night Mode" : "Day Mode"}
          </button>

          {/* Speed settings */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(22, 25, 35, 0.55)',
              backdropFilter: 'blur(8px)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '2px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={() => { setSimRunning(p => !p); addLog(simRunning ? "Simulation paused." : "Simulation resumed."); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px 12px',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {simRunning ? <Pause size={12} /> : <Play size={12} />}
              {simRunning ? "Pause" : "Run"}
            </button>
            <div style={{ width: '1px', height: '16px', background: 'var(--border-color)' }} />
            <select
              value={simSpeed}
              onChange={(e) => {
                const spd = Number(e.target.value);
                setSimSpeed(spd);
                addLog(`Simulation speed scaled to ${spd}x.`);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="1">1.0x (Normal)</option>
              <option value="2">2.0x (Fast)</option>
              <option value="3">3.0x (Overdrive)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1.2fr)', 
          gap: '24px', 
          position: 'relative', 
          zIndex: 10 
        }}
      >
        {/* Left: Pixel Art Map Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main 2D Board Container */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '680px',
              background: '#090d16',
              border: `1.5px solid ${themeMode === 'night' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
              overflow: 'auto',
              padding: '16px'
            }}
          >
            {/* 2D Map Canvas Wrapper */}
            <div 
              style={{
                position: 'relative',
                width: '960px',
                height: '720px',
                margin: '0 auto',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                // Continuous Oak wood flooring with staggered joints
                backgroundColor: themeMode === 'night' ? '#452d1a' : '#f5e6d3',
                backgroundImage: themeMode === 'night'
                  ? 'linear-gradient(90deg, rgba(30, 20, 10, 0.15) 1px, transparent 1px), linear-gradient(180deg, rgba(30, 20, 10, 0.1) 1px, transparent 1px), linear-gradient(90deg, transparent 159px, rgba(30, 20, 10, 0.25) 1px, transparent 1px)'
                  : 'linear-gradient(90deg, rgba(139, 92, 26, 0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(139, 92, 26, 0.04) 1px, transparent 1px), linear-gradient(90deg, transparent 159px, rgba(139, 92, 26, 0.12) 1px, transparent 1px)',
                backgroundSize: '160px 40px',
                transition: 'background-color 0.4s ease'
              }}
            >
              {/* 1. Continuous Grass Layer */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '960px',
                  height: '80px',
                  backgroundColor: themeMode === 'night' ? '#14301c' : '#76db76',
                  backgroundImage: themeMode === 'night'
                    ? 'radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)'
                    : 'radial-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                  borderBottom: `2.5px solid ${themeMode === 'night' ? '#0f2415' : '#5db35d'}`,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '640px',
                  left: 0,
                  width: '960px',
                  height: '80px',
                  backgroundColor: themeMode === 'night' ? '#14301c' : '#76db76',
                  backgroundImage: themeMode === 'night'
                    ? 'radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)'
                    : 'radial-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                  borderTop: `2.5px solid ${themeMode === 'night' ? '#0f2415' : '#5db35d'}`,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* 2. Cabin Carpets (Rugs) */}
              {/* CMO & VP Sales Cabin Carpet: rows 3-6, cols 1-7 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '120px',
                  width: '280px',
                  height: '160px',
                  backgroundColor: themeMode === 'night' ? '#1c1917' : '#f8fafc',
                  border: `1.5px solid ${themeMode === 'night' ? '#292524' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* VP CS & VP Partnerships Cabin Carpet: rows 3-6, cols 9-14 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '360px',
                  top: '120px',
                  width: '240px',
                  height: '160px',
                  backgroundColor: themeMode === 'night' ? '#1e1b4b' : '#e0e7ff',
                  border: `1.5px solid ${themeMode === 'night' ? '#2e1b5b' : '#c5cae9'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Canteen Breakout: rows 8-9, cols 1-5 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '320px',
                  width: '200px',
                  height: '80px',
                  backgroundColor: themeMode === 'night' ? '#1f2937' : '#f3f4f6',
                  border: `1.5px solid ${themeMode === 'night' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Cozy Lounge Breakout: rows 8-9, cols 6-8 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '240px',
                  top: '320px',
                  width: '120px',
                  height: '80px',
                  backgroundColor: themeMode === 'night' ? '#272522' : '#f5ebd9',
                  border: `1.5px solid ${themeMode === 'night' ? '#b45309' : '#d7ccc8'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Lobby Reception: rows 8-9, cols 9-14 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '360px',
                  top: '320px',
                  width: '240px',
                  height: '80px',
                  backgroundColor: themeMode === 'night' ? '#1e293b' : '#f1f5f9',
                  border: `1.5px solid ${themeMode === 'night' ? '#334155' : '#cbd5e1'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Admin/PA Cabin: rows 11-14, cols 1-5 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '440px',
                  width: '200px',
                  height: '160px',
                  backgroundColor: themeMode === 'night' ? '#111827' : '#f1f5f9',
                  border: `1.5px solid ${themeMode === 'night' ? '#1f2937' : '#cbd5e1'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Critic Cabin: rows 11-14, cols 6-7 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '240px',
                  top: '440px',
                  width: '80px',
                  height: '160px',
                  backgroundColor: themeMode === 'night' ? '#1e1b4c' : '#e0e7ff',
                  border: `1.5px solid ${themeMode === 'night' ? '#2e1b5b' : '#c5cae9'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* C-Suite Boardroom: rows 11-14, cols 9-14 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '360px',
                  top: '440px',
                  width: '240px',
                  height: '160px',
                  backgroundColor: themeMode === 'night' ? '#1e1b4b' : '#e0e7ff',
                  border: '1.5px solid #d97706',
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Open Bullpen: rows 3-14, cols 16-22 */}
              <div 
                style={{
                  position: 'absolute',
                  left: '640px',
                  top: '120px',
                  width: '280px',
                  height: '480px',
                  backgroundColor: themeMode === 'night' ? '#0f172a' : '#f8fafc',
                  border: `1.5px solid ${themeMode === 'night' ? '#1e293b' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* Floor Name Decals (Subtle room label prints) */}
              {(() => {
                const decalStyle = (left: string, top: string, width: string): React.CSSProperties => ({
                  position: 'absolute',
                  left,
                  top,
                  width,
                  fontFamily: 'var(--font-sora)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: themeMode === 'night' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                  zIndex: 4,
                  lineHeight: '1.3',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                });
                return (
                  <>
                    <div style={decalStyle('40px', '236px', '120px')}>
                      <span>CMO</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('160px', '236px', '80px')}>
                      <span>VP SALES</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('240px', '236px', '80px')}>
                      <span>VP PMM</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('360px', '236px', '120px')}>
                      <span>VP CS</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('480px', '236px', '120px')}>
                      <span>VP PARTNER</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    
                    <div style={decalStyle('40px', '554px', '200px')}>
                      <span>ADMIN</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('240px', '554px', '80px')}>
                      <span>CRITIC</span>
                      <span style={{ fontSize: '0.52rem', opacity: 0.8, marginTop: '2px' }}>CABIN</span>
                    </div>
                    <div style={decalStyle('480px', '560px', '120px')}>
                      <span>BOARDROOM</span>
                    </div>
                    
                    <div style={decalStyle('40px', '408px', '200px')}>
                      <span>CAFETERIA</span>
                    </div>
                    <div style={decalStyle('220px', '384px', '160px')}>
                      <span>COZY LOUNGE</span>
                    </div>
                    <div style={decalStyle('360px', '384px', '240px')}>
                      <span>RECEPTION LOBBY</span>
                    </div>
                    
                    {/* Specific Bullpen Bay Floor Decals */}
                    <div style={decalStyle('660px', '255px', '120px')}>MARKETING BAY</div>
                    <div style={decalStyle('780px', '255px', '120px')}>SALES HUB</div>
                    <div style={decalStyle('780px', '575px', '120px')}>CX SUCCESS HUB</div>
                    <div style={decalStyle('660px', '575px', '120px')}>OPERATIONS HUB</div>
                  </>
                );
              })()}

              {/* 3. Continuous Wall Partitions (with thickness & shadow) */}
              {(() => {
                const WallSegment = ({ style }: { style: React.CSSProperties }) => (
                  <div
                    style={{
                      backgroundColor: themeMode === 'night' ? '#1e293b' : '#ffffff',
                      border: `1.5px solid ${themeMode === 'night' ? '#4f46e5' : '#64748b'}`,
                      boxShadow: themeMode === 'night' ? '0 0 8px rgba(79, 70, 229, 0.5)' : '0 1.5px 3px rgba(0, 0, 0, 0.1)',
                      borderRadius: '4px',
                      ...style
                    }}
                  />
                );
                
                return (
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                    {/* Outer boundaries */}
                    {/* Top wall: row 2 */}
                    <WallSegment style={{ position: 'absolute', left: '38px', top: '116px', width: '884px', height: '8px' }} />
                    {/* Bottom wall: row 15 */}
                    <WallSegment style={{ position: 'absolute', left: '38px', top: '596px', width: '884px', height: '8px' }} />
                    {/* Left wall: col 0 */}
                    <WallSegment style={{ position: 'absolute', left: '38px', top: '116px', width: '8px', height: '488px' }} />
                    {/* Right wall: col 23 */}
                    <WallSegment style={{ position: 'absolute', left: '914px', top: '116px', width: '8px', height: '488px' }} />

                    {/* Internal Vertical Partitions for Top Cabins (Rows 3-6) */}
                    {/* CMO and VP Sales Divider (between Col 3 and Col 4) */}
                    <WallSegment style={{ position: 'absolute', left: '156px', top: '118px', width: '8px', height: '162px' }} />
                    {/* VP Sales and VP PMM Divider (between Col 5 and Col 6) */}
                    <WallSegment style={{ position: 'absolute', left: '236px', top: '118px', width: '8px', height: '162px' }} />
                    {/* VP PMM and Corridor Divider (between Col 7 and Col 8) */}
                    <WallSegment style={{ position: 'absolute', left: '316px', top: '118px', width: '8px', height: '162px' }} />
                    {/* Corridor and VP CS Divider (between Col 8 and Col 9) */}
                    <WallSegment style={{ position: 'absolute', left: '356px', top: '118px', width: '8px', height: '162px' }} />
                    {/* VP CS and VP Partnerships Divider (between Col 11 and Col 12) */}
                    <WallSegment style={{ position: 'absolute', left: '476px', top: '118px', width: '8px', height: '162px' }} />
                    {/* VP Partnerships and Corridor Divider (between Col 14 and Col 15) */}
                    <WallSegment style={{ position: 'absolute', left: '596px', top: '118px', width: '8px', height: '162px' }} />

                    {/* Internal Horizontal Divider Walls for Top Cabins (Row 6/7 boundary) */}
                    {/* CMO bottom wall: Col 1-2 (door at Col 3) */}
                    <WallSegment style={{ position: 'absolute', left: '40px', top: '276px', width: '80px', height: '8px' }} />
                    {/* VP Sales bottom wall: Col 4 (door at Col 5) */}
                    <WallSegment style={{ position: 'absolute', left: '160px', top: '276px', width: '40px', height: '8px' }} />
                    {/* VP PMM bottom wall: Col 6 (door at Col 7) */}
                    <WallSegment style={{ position: 'absolute', left: '240px', top: '276px', width: '40px', height: '8px' }} />
                    {/* VP CS bottom wall: Col 9 & Col 11 (door at Col 10) */}
                    <WallSegment style={{ position: 'absolute', left: '360px', top: '276px', width: '40px', height: '8px' }} />
                    <WallSegment style={{ position: 'absolute', left: '440px', top: '276px', width: '40px', height: '8px' }} />
                    {/* VP Partnerships bottom wall: Col 12 & Col 14 (door at Col 13) */}
                    <WallSegment style={{ position: 'absolute', left: '480px', top: '276px', width: '40px', height: '8px' }} />
                    <WallSegment style={{ position: 'absolute', left: '560px', top: '276px', width: '40px', height: '8px' }} />

                    {/* Internal Vertical Partitions for Bottom Cabins (Rows 11-14) */}
                    {/* Admin and Critic Divider (between Col 5 and Col 6) */}
                    <WallSegment style={{ position: 'absolute', left: '236px', top: '438px', width: '8px', height: '162px' }} />
                    {/* Critic and Corridor Divider (between Col 7 and Col 8) */}
                    <WallSegment style={{ position: 'absolute', left: '316px', top: '438px', width: '8px', height: '162px' }} />
                    {/* Corridor and Boardroom Divider (between Col 8 and Col 9) */}
                    <WallSegment style={{ position: 'absolute', left: '356px', top: '438px', width: '8px', height: '162px' }} />
                    {/* Boardroom right wall with doorway at Row 12 */}
                    <WallSegment style={{ position: 'absolute', left: '596px', top: '438px', width: '8px', height: '44px' }} />
                    <WallSegment style={{ position: 'absolute', left: '596px', top: '520px', width: '8px', height: '80px' }} />

                    {/* Internal Horizontal Divider Walls for Bottom Cabins (Row 10/11 boundary) */}
                    {/* Admin Cabin top: Col 1-2 & Col 4-5 (door at Col 3) */}
                    <WallSegment style={{ position: 'absolute', left: '40px', top: '436px', width: '80px', height: '8px' }} />
                    <WallSegment style={{ position: 'absolute', left: '160px', top: '436px', width: '80px', height: '8px' }} />
                    {/* Critic Cabin top: Col 6 (door at Col 7) */}
                    <WallSegment style={{ position: 'absolute', left: '240px', top: '436px', width: '40px', height: '8px' }} />
                    {/* Boardroom top: closed wall since top doors were removed */}
                    <WallSegment style={{ position: 'absolute', left: '360px', top: '436px', width: '240px', height: '8px' }} />

                    {/* Col 15 Divider (Bullpen left wall, entry at Row 7, Row 11 completed) */}
                    <WallSegment style={{ position: 'absolute', left: '636px', top: '118px', width: '8px', height: '162px' }} />
                    <WallSegment style={{ position: 'absolute', left: '636px', top: '320px', width: '8px', height: '280px' }} />
                  </div>
                );
              })()}

              {/* 4. Open Doors Layer (Visual Swing Indicators) */}
              {(() => {
                return (
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                    {/* CMO Cabin Door */}
                    <DoorSwing left="120px" top="280px" dir="up-right" />
                    {/* VP Sales Cabin Door */}
                    <DoorSwing left="200px" top="280px" dir="up-right" />
                    {/* VP PMM Cabin Door */}
                    <DoorSwing left="280px" top="280px" dir="up-right" />
                    {/* VP CS Cabin Door */}
                    <DoorSwing left="400px" top="280px" dir="up-right" />
                    {/* VP Partnerships Cabin Door */}
                    <DoorSwing left="520px" top="280px" dir="up-right" />

                    {/* Admin Cabin Door */}
                    <DoorSwing left="120px" top="440px" dir="up-right" />
                    {/* Critic Cabin Door */}
                    <DoorSwing left="280px" top="440px" dir="up-right" />

                    {/* Bullpen Entries */}
                    <DoorSwing left="600px" top="280px" dir="right-down" />
                  </div>
                );
              })()}

              {/* Tile rendering (transparent click grid overlay) */}
              {mapGrid.map((row, y) => 
                row.map((cell, x) => {
                  const { isoX, isoY } = projectIso(x, y);
                  const isWalkable = isTileWalkable(x, y) && !isCellBlocked(x, y);
                  
                  return (
                    <div 
                      key={`tile-${x}-${y}`}
                      onClick={() => {
                        if (isWalkable && delegationState === 'idle') {
                          const path = findPath(player.x, player.y, x, y);
                          if (path.length > 0) {
                            setPlayerPath(path);
                            setClickRipple({ x, y, id: Math.random() });
                            setTimeout(() => setClickRipple(null), 500);
                          }
                        }
                      }}
                      style={{
                        position: 'absolute',
                        left: `${isoX}px`,
                        top: `${isoY}px`,
                        width: `${TILE_WIDTH}px`,
                        height: `${TILE_HEIGHT}px`,
                        backgroundColor: 'transparent',
                        border: 'none',
                        zIndex: isWalkable ? 2 : 1,
                        cursor: isWalkable ? 'pointer' : 'default'
                      }}
                    />
                  );
                })
              )}

              {/* Click Ripple Indicator Overlay */}
              {clickRipple && (() => {
                const { isoX, isoY } = projectIso(clickRipple.x, clickRipple.y);
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${isoX + TILE_WIDTH/2}px`,
                      top: `${isoY + TILE_HEIGHT/2}px`,
                      transform: 'translate(-50%, -50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2.5px solid var(--accent-color)',
                      boxShadow: '0 0 12px var(--accent-color)',
                      zIndex: 8,
                      animation: 'click-ripple-anim 0.5s ease-out forwards',
                      pointerEvents: 'none'
                    }}
                  />
                );
              })()}

              {/* Walking path dots */}
              {playerPath.map((cell, idx) => {
                const { isoX, isoY } = projectIso(cell.x, cell.y);
                return (
                  <div
                    key={`dot-${idx}`}
                    style={{
                      position: 'absolute',
                      left: `${isoX + TILE_WIDTH/2 - 2}px`,
                      top: `${isoY + TILE_HEIGHT/2 - 2}px`,
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-color)',
                      boxShadow: '0 0 6px var(--accent-color)',
                      zIndex: 5,
                      animation: 'pulse 1s infinite alternate'
                    }}
                  />
                );
              })}

              {/* Steaming Espresso particles */}
              {(() => {
                const { isoX, isoY } = projectIso(6, 5); // Canteen Kitchen Island
                return (
                  <div style={{ position: 'absolute', left: `${isoX + 20}px`, top: `${isoY + 5}px`, pointerEvents: 'none', zIndex: 6 }}>
                    <div className="steam-line" style={{ animationDelay: '0s', left: '-4px' }} />
                    <div className="steam-line" style={{ animationDelay: '0.4s', left: '0px' }} />
                    <div className="steam-line" style={{ animationDelay: '0.8s', left: '4px' }} />
                  </div>
                );
              })()}

              {/* Spotlight sweep in Night Mode */}
              {themeMode === 'night' && (() => {
                const xPos = (spotlightPos.x / 100) * 960 - 120;
                const yPos = (spotlightPos.y / 100) * 720 - 90;
                return (
                  <div 
                    style={{
                      position: 'absolute',
                      left: `${xPos}px`,
                      top: `${yPos}px`,
                      width: '240px',
                      height: '180px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
                      pointerEvents: 'none',
                      zIndex: 9,
                      mixBlendMode: 'screen',
                      transition: 'left 0.1s ease, top 0.1s ease'
                    }}
                  />
                );
              })()}

              {/* Static Obstacles & Furniture rendering layer */}
              {mapGrid.map((row, y) => 
                row.map((cell, x) => {
                  const { isoX, isoY } = projectIso(x, y);

                  // Renders Trees
                  if (cell === 'T') {
                    return (
                      <div 
                        key={`pine-${x}-${y}`} 
                        style={{
                          position: 'absolute',
                          left: `${isoX}px`,
                          top: `${isoY}px`,
                          width: `${TILE_WIDTH}px`,
                          height: `${TILE_HEIGHT}px`,
                          zIndex: 4
                        }}
                      >
                        <PineTreeSVG />
                      </div>
                    );
                  } else if (cell === 'F') {
                    return (
                      <div 
                        key={`fruit-${x}-${y}`} 
                        style={{
                          position: 'absolute',
                          left: `${isoX}px`,
                          top: `${isoY}px`,
                          width: `${TILE_WIDTH}px`,
                          height: `${TILE_HEIGHT}px`,
                          zIndex: 4
                        }}
                      >
                        <FruitTreeSVG />
                      </div>
                    );
                  }
                  return null;
                })
              )}

              {/* High-Fidelity Cropped Furniture Assets Rendering */}
              {furnitureItems.map((item, idx) => {
                const { isoX, isoY } = projectIso(item.x, item.y);
                const widthPx = item.w * TILE_WIDTH;
                const heightPx = item.h * TILE_HEIGHT;
                
                return (
                  <div
                    key={`furn-${idx}`}
                    style={{
                      position: 'absolute',
                      left: `${isoX}px`,
                      top: `${isoY}px`,
                      width: `${widthPx}px`,
                      height: `${heightPx}px`,
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  >
                    {renderFurnitureSVG(item.type, themeMode)}
                  </div>
                );
              })}

              {/* Dynamic Agents Avatars layer (ordered by y-coordinate for correct depth sorting) */}
              {agents.slice().sort((a, b) => a.y - b.y).map(agent => {
                const { isoX, isoY } = projectIso(agent.x, agent.y);
                const isClosest = proximityAgentId === agent.id;
                const isSelected = selectedAgentId === agent.id;
                const isHighlighted = isClosest || isSelected;

                // Pulsing status dot color mapping
                let statusColor = '#94a3b8'; // idle
                let isPulsing = false;
                if (agent.status === 'working') { statusColor = '#10b981'; isPulsing = true; }
                else if (agent.status === 'talking') { statusColor = '#3b82f6'; isPulsing = true; }
                else if (agent.status === 'recharging') { statusColor = '#f59e0b'; isPulsing = true; }
                else if (agent.status === 'sleeping') { statusColor = '#a855f7'; }

                return (
                  <div
                    key={`agent-avatar-${agent.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgentId(agent.id);
                      addLog(`🔍 Selected Agent: ${agent.name} (${agent.role})`);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${isoX - 4}px`, // centered on 40x40 cell
                      top: `${isoY - 12}px`,
                      width: '48px',
                      height: '44px',
                      transition: `left 0.22s linear, top 0.22s linear`,
                      zIndex: 10 + agent.y, // dynamic depth sorting
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >

                    {/* Transparent Character Container */}
                    <div 
                      style={{ 
                        width: '44px', 
                        height: '44px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        animation: isHighlighted ? 'badge-float 2s infinite ease-in-out' : 'none',
                        transition: 'transform 0.2s'
                      }}
                    >
                      {/* Selection/Highlight glow under the feet */}
                      {isHighlighted && (
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            width: '32px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                            border: '1.5px solid rgba(59, 130, 246, 0.7)',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.7)',
                            zIndex: 1,
                            animation: 'pulse 1s infinite alternate'
                          }}
                        />
                      )}
                      
                      <AgentAvatar id={agent.id} isMoving={agent.isMoving} direction={agent.direction} />

                      {/* Floating Status Dot */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '8px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: statusColor,
                          border: '1.5px solid white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          animation: isPulsing ? 'pulse 1s infinite alternate' : 'none',
                          zIndex: 12
                        }}
                      />
                      
                      {agent.status === 'sleeping' && (
                        <div className="zzz-particle" style={{ top: '0px', right: '4px' }}>Zzz</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Agents Name Badges layer (rendered as overlay) */}
              {agents.map(agent => {
                const { isoX, isoY } = projectIso(agent.x, agent.y);
                const isClosest = proximityAgentId === agent.id;
                const isSelected = selectedAgentId === agent.id;
                const isHighlighted = isClosest || isSelected;

                return (
                  <div
                    key={`agent-badge-${agent.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgentId(agent.id);
                      addLog(`🔍 Selected Agent: ${agent.name} (${agent.role})`);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${isoX - 4}px`,
                      top: `${isoY + 32}px`, // below 44px avatar
                      width: '48px',
                      height: '20px',
                      transition: `left 0.22s linear, top 0.22s linear`,
                      zIndex: 30, // draws above all avatars
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: 'white',
                        background: isHighlighted ? '#2563eb' : 'rgba(15, 23, 42, 0.85)',
                        border: `1px solid ${isHighlighted ? '#3b82f6' : 'rgba(255,255,255,0.15)'}`,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                      }}
                    >
                      {agent.shortLabel}
                    </span>
                  </div>
                );
              })}

              {/* Dynamic Agents Speech Bubbles layer (rendered as overlay above all avatars) */}
              {agents.map(agent => {
                const { isoX, isoY } = projectIso(agent.x, agent.y);
                const isClosest = proximityAgentId === agent.id;

                if (!((agent.dialogue && !isClosest) || isClosest)) return null;

                const isLeftAligned = agent.x < 4;
                const isRightAligned = agent.x > 19;
                
                const bubbleStyle: React.CSSProperties = {
                  position: 'absolute',
                  bottom: '48px',
                  background: themeMode === 'night' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  border: themeMode === 'night' ? `1.5px solid #334155` : `1.5px solid #e2e8f0`,
                  borderRadius: '12px',
                  padding: '8px 12px',
                  color: themeMode === 'night' ? '#f8fafc' : '#1e293b',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  lineHeight: '1.35',
                  minWidth: isClosest ? '240px' : '120px',
                  maxWidth: isClosest ? '280px' : '180px',
                  textAlign: 'left',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.1)',
                  zIndex: 100,
                  pointerEvents: 'auto', // enable clicks inside the bubble
                  left: isLeftAligned ? '0px' : (isRightAligned ? 'auto' : '50%'),
                  right: isRightAligned ? '0px' : 'auto',
                  transform: isLeftAligned || isRightAligned ? 'none' : 'translateX(-50%)',
                  animation: isLeftAligned 
                    ? 'bubble-pop-left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
                    : (isRightAligned 
                        ? 'bubble-pop-right 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
                        : 'bubble-pop-center 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards')
                };

                const arrowStyle: React.CSSProperties = {
                  position: 'absolute',
                  bottom: '-5px',
                  width: '8px',
                  height: '8px',
                  background: themeMode === 'night' ? '#1e293b' : '#ffffff',
                  borderRight: themeMode === 'night' ? `1.5px solid #334155` : `1.5px solid #e2e8f0`,
                  borderBottom: themeMode === 'night' ? `1.5px solid #334155` : `1.5px solid #e2e8f0`,
                  left: isLeftAligned ? '20px' : (isRightAligned ? 'auto' : '50%'),
                  right: isRightAligned ? '20px' : 'auto',
                  transform: isLeftAligned || isRightAligned ? 'rotate(45deg)' : 'translateX(-50%) rotate(45deg)'
                };

                return (
                  <div
                    key={`agent-bubble-container-${agent.id}`}
                    style={{
                      position: 'absolute',
                      left: `${isoX - 4}px`,
                      top: `${isoY - 12}px`,
                      width: '48px',
                      height: '44px',
                      transition: `left 0.22s linear, top 0.22s linear`,
                      zIndex: 40, // Rendered as overlay above all avatars and desks
                      pointerEvents: 'none'
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={bubbleStyle}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.65rem', opacity: 0.8, color: agent.color }}>
                          {agent.name} • {agent.role}
                        </div>
                        <div style={{ minHeight: '16px' }}>
                          {agentThinkingState[agent.id] ? (
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px', paddingLeft: '4px' }}>
                              <span className="dot-bounce-1" style={{ width: '4px', height: '4px', background: agent.color, borderRadius: '50%', display: 'inline-block' }} />
                              <span className="dot-bounce-2" style={{ width: '4px', height: '4px', background: agent.color, borderRadius: '50%', display: 'inline-block' }} />
                              <span className="dot-bounce-3" style={{ width: '4px', height: '4px', background: agent.color, borderRadius: '50%', display: 'inline-block' }} />
                            </div>
                          ) : (
                            isClosest
                              ? (activeAgentChats[agent.id] && activeAgentChats[agent.id].length > 0
                                  ? activeAgentChats[agent.id][activeAgentChats[agent.id].length - 1].text
                                  : `Hello! I am ready to collaborate. Type below to sync.`)
                              : agent.dialogue
                          )}
                        </div>
                      </div>

                      {isClosest && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const inputVal = bubbleInputs[agent.id] || '';
                            if (inputVal.trim()) {
                              handleBubbleSubmit(agent.id, inputVal);
                            }
                          }}
                          style={{
                            marginTop: '8px',
                            borderTop: themeMode === 'night' ? '1px solid #334155' : '1px solid #e2e8f0',
                            paddingTop: '6px',
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center'
                          }}
                        >
                          <input
                            type="text"
                            placeholder={`Type message to ${agent.shortLabel}...`}
                            value={bubbleInputs[agent.id] || ''}
                            onChange={(e) => {
                              setBubbleInputs(prev => ({ ...prev, [agent.id]: e.target.value }));
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              flex: 1,
                              background: themeMode === 'night' ? '#0f172a' : '#f8fafc',
                              border: themeMode === 'night' ? '1px solid #475569' : '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.65rem',
                              color: themeMode === 'night' ? '#f8fafc' : '#0f172a',
                              outline: 'none'
                            }}
                            disabled={agentThinkingState[agent.id]}
                          />
                          <button
                            type="submit"
                            disabled={agentThinkingState[agent.id] || !(bubbleInputs[agent.id] || '').trim()}
                            style={{
                              background: agent.color,
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              opacity: (bubbleInputs[agent.id] || '').trim() ? 1 : 0.6,
                              transition: 'opacity 0.2s'
                            }}
                          >
                            Send
                          </button>
                        </form>
                      )}

                      <div style={arrowStyle} />
                    </div>
                  </div>
                );
              })}

              {/* Renders Player (You) */}
              {(() => {
                const { isoX, isoY } = projectIso(player.x, player.y);

                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${isoX - 4}px`,
                      top: `${isoY - 12}px`,
                      width: '48px',
                      height: '68px',
                      transition: `left 0.18s linear, top 0.18s linear`,
                      zIndex: 25,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    {activeObjectInteraction && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeObjectInteraction === 'espresso') handleBrewEspresso();
                          else if (activeObjectInteraction === 'pool') handlePlayPool();
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '68px',
                          background: '#10b981',
                          color: '#fff',
                          border: '1.5px solid #34d399',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                          cursor: 'pointer',
                          zIndex: 1000,
                          animation: 'badge-float 1.5s infinite ease-in-out'
                        }}
                      >
                        {activeObjectInteraction === 'espresso' ? "☕ Brew Espresso" : "🎱 Play Pool"}
                      </div>
                    )}

                    {/* Transparent Player Container */}
                    <div 
                      style={{ 
                        width: '44px', 
                        height: '44px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* Active green glow under player's feet */}
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          width: '32px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                          border: '1.5px solid rgba(16, 185, 129, 0.6)',
                          boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                          zIndex: 1
                        }}
                      />
                      
                      <AgentAvatar id="player" isMoving={player.isMoving} direction={player.direction} />

                      {/* Active green status dot */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '8px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          border: '1.5px solid white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          animation: 'pulse 1s infinite alternate',
                          zIndex: 12
                        }}
                      />
                    </div>

                    {/* Player Name badge */}
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, var(--accent-color), #2563eb)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        marginTop: '4px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      Admin (You)
                    </span>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Interactive Chat interface HUD with PA */}
          <div 
            style={{ 
              background: 'rgba(22, 25, 35, 0.45)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '20px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}
          >
            {boardroomState !== 'idle' ? (
              // Boardroom debate HUD console
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                      C-Suite Boardroom debate
                    </span>
                  </div>
                  <button 
                    onClick={endBoardroomMeeting}
                    disabled={boardroomState === 'gathering'}
                    style={{ 
                      fontSize: '0.65rem', 
                      padding: '3px 8px', 
                      background: 'rgba(239,68,68,0.15)', 
                      border: '1px solid rgba(239,68,68,0.3)', 
                      color: '#fca5a5', 
                      borderRadius: '6px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Adjourn Meeting 👔
                  </button>
                </div>

                {/* Debate log */}
                <div 
                  style={{
                    height: '110px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {boardroomState === 'gathering' ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <span className="dot-bounce-1" style={{ width: '4px', height: '4px', background: '#fbbf24', borderRadius: '50%' }} />
                      <span>Executive VPs are gathering in the boardroom...</span>
                    </div>
                  ) : boardroomState === 'dispersing' ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <span>VPs are dispersing and returning to home cabins...</span>
                    </div>
                  ) : debateHistory.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', padding: '0 10px' }}>
                      Seed a GTM directive below to trigger the C-Suite debate sequence.
                    </div>
                  ) : (
                    debateHistory.map((debate, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'flex-start',
                          maxWidth: '100%'
                        }}
                      >
                        <span style={{ fontSize: '0.55rem', color: '#fbbf24', marginBottom: '2px', fontWeight: 600 }}>
                          {debate.role}
                        </span>
                        <div 
                          style={{
                            background: 'rgba(251, 191, 36, 0.08)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            color: 'white',
                            maxWidth: '90%',
                            lineHeight: '1.4'
                          }}
                        >
                          {debate.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Debate input seed form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!debateTopic.trim()) return;
                    setDebateHistory([]);
                    setDebateSpeakerIndex(0); // Start with CMO
                  }} 
                  style={{ display: 'flex', gap: '10px' }}
                >
                  <input 
                    type="text"
                    value={debateTopic}
                    onChange={(e) => setDebateTopic(e.target.value)}
                    placeholder={
                      debateSpeakerIndex >= 0 && debateSpeakerIndex < 5
                        ? "Debate in progress... Please listen."
                        : "Seed debate topic (e.g. Raise prices by 15% to defend ARR)..."
                    }
                    disabled={debateSpeakerIndex >= 0 && debateSpeakerIndex < 5 || boardroomState !== 'in_meeting'}
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      color: 'white',
                      fontSize: '0.75rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={debateSpeakerIndex >= 0 && debateSpeakerIndex < 5 || !debateTopic.trim() || boardroomState !== 'in_meeting'}
                    style={{
                      background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                      border: 'none',
                      color: '#000',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: (debateSpeakerIndex >= 0 && debateSpeakerIndex < 5 || !debateTopic.trim() || boardroomState !== 'in_meeting') ? 'not-allowed' : 'pointer',
                      opacity: (debateSpeakerIndex >= 0 && debateSpeakerIndex < 5 || !debateTopic.trim() || boardroomState !== 'in_meeting') ? 0.5 : 1,
                      boxShadow: '0 2px 8px rgba(251, 191, 36, 0.25)'
                    }}
                  >
                    Debate
                  </button>
                </form>
              </>
            ) : (
              // Original console HUD
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--accent-color)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      GTM Direct Action Console
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={forceAllHands}
                      style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#a5b4fc', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      🚨 Boardroom Sync
                    </button>
                    <button 
                      onClick={forceCoffee}
                      style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)', color: '#fda4af', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      ☕ Coffee break
                    </button>
                    <button 
                      onClick={forceHome}
                      style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      ⚙️ Reset desks
                    </button>
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div 
                  style={{
                    height: '110px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {chatHistory.map((chat, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '100%'
                      }}
                    >
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        {chat.sender === 'user' ? "Admin" : "GTM Console"}
                      </span>
                      <div 
                        style={{
                          background: chat.sender === 'user' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${chat.sender === 'user' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          color: 'white',
                          maxWidth: '80%',
                          lineHeight: '1.4'
                        }}
                      >
                        {chat.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Send Form */}
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={
                      delegationState === 'idle'
                        ? "Broadcast GTM instruction to C-Suite... (e.g. Aligns outbound lead search sequences)"
                        : "Delegation animation active. Please wait..."
                    }
                    disabled={delegationState !== 'idle'}
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      color: 'white',
                      fontSize: '0.75rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={delegationState !== 'idle'}
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-color), #2563eb)',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: (delegationState === 'idle') ? 'pointer' : 'not-allowed',
                      opacity: (delegationState === 'idle') ? 1 : 0.5,
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
                    }}
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right Panel: Operations Dossier HUD & Console with Premium Glassmorphism */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Agent Inspector Panel */}
          <div 
            style={{ 
              background: 'rgba(22, 25, 35, 0.45)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '20px', 
              padding: '20px',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            {activeAgent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Proximity Light Badge */}
                {isNearActive && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      color: 'var(--accent-color)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.15)'
                    }}
                  >
                    <span className="pulsing-blue-dot" />
                    Voice Active
                  </div>
                )}

                {/* Agent Header */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', color: activeAgent.color }}>
                      {activeAgent.department.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontWeight: 600 }}>
                      BATTERY: {activeAgent.battery}%
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.15rem', fontWeight: 600, marginTop: '8px', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                    {activeAgent.name}
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {activeAgent.role}
                  </span>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                {/* Persona Objectives */}
                <div>
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Operational Activity
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 500, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeAgent.status === 'working' ? '#10b981' : '#f59e0b', animation: 'pulse 1s infinite' }} />
                    {activeAgent.activity}
                  </p>
                </div>

                {/* Connected Tools */}
                <div>
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Integration Tools
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {activeAgent.tools.map((t: string, idx: number) => (
                      <span key={idx} style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Execution Logic */}
                <div>
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    GTM Decision Logic
                  </h4>
                  <pre style={{ margin: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflowX: 'auto' }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#fcd34d', whiteSpace: 'pre-wrap' }}>
                      {activeAgent.logic}
                    </code>
                  </pre>
                </div>

                {/* Override Dispatch Button */}
                <button
                  onClick={() => forceTaskDispatch(activeAgent.id)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)',
                    transition: 'all 0.2s',
                    marginTop: '4px'
                  }}
                >
                  <Zap size={12} />
                  Force Override Dispatch Task
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <User size={32} color="rgba(255,255,255,0.06)" style={{ marginBottom: '12px' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Walk Close to Connect</span>
                <p style={{ fontSize: '0.7rem', marginTop: '4px', maxWidth: '200px' }}>
                  Walk your character near any agent workstation to trigger private voice connection and load their active GTM logic.
                </p>
              </div>
            )}
          </div>

          {/* Scrolling Activity Console Terminal with Glassmorphism */}
          <div 
            style={{ 
              background: 'rgba(22, 25, 35, 0.45)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '20px', 
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              maxHeight: '300px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={14} color="var(--accent-color)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'white' }}>
                    Simulator Console
                  </span>
                </div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              </div>

              {/* Scrollable logs */}
              <div 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: 'var(--text-primary)',
                  paddingRight: '6px'
                }}
              >
                {simulationLogs.map((log, index) => {
                  const isAward = log.includes('🏆');
                  const isAlert = log.includes('🔋') || log.includes('🚨');
                  const isManual = log.includes('⚡');
                  
                  let color = 'var(--text-secondary)';
                  if (isAward) color = '#34d399';
                  else if (isAlert) color = '#fb7185';
                  else if (isManual) color = '#fcd34d';

                  return (
                    <div 
                      key={index} 
                      style={{ 
                        lineHeight: '1.4', 
                        borderBottom: '1px solid rgba(255,255,255,0.015)', 
                        paddingBottom: '4px',
                        color
                      }}
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                Map: 2D Floor Plan · 17 Mapped Agents
              </span>
              <button 
                onClick={() => setSimulationLogs([`Console cleared. [${new Date().toLocaleTimeString()}]`])}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.6rem', textDecoration: 'underline' }}
              >
                Clear logs
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Global CSS Styles for Keyframes & Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .pulsing-blue-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-color);
          box-shadow: 0 0 8px var(--accent-color);
          display: inline-block;
          margin-right: 4px;
        }
        /* Click Ripple Keyframes in 2D plane */
        @keyframes click-ripple-anim {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        /* Screen scanlines pulsing */
        @keyframes screen-pulse {
          0% { filter: brightness(0.85) contrast(1.1); }
          100% { filter: brightness(1.15) contrast(0.9); }
        }
        /* Coffee Steaming Smoke effect */
        @keyframes steam-rise {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          40% { opacity: 0.4; }
          100% { transform: translateY(-12px) scale(1.25); opacity: 0; }
        }
        .steam-line {
          position: absolute;
          bottom: 12px;
          width: 2.5px;
          height: 7px;
          background-color: rgba(255,255,255,0.22);
          border-radius: 50%;
          animation: steam-rise 2s infinite ease-out;
        }
        /* Speech Bubble Pop-in animation */
        @keyframes bubble-pop-left {
          0% { transform: translateY(10px) scale(0.85); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes bubble-pop-right {
          0% { transform: translateY(10px) scale(0.85); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes bubble-pop-center {
          0% { transform: translate(-50%, 10px) scale(0.85); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .dot-bounce-1 { animation: dot-bounce 0.8s infinite 0ms; }
        .dot-bounce-2 { animation: dot-bounce 0.8s infinite 150ms; }
        .dot-bounce-3 { animation: dot-bounce 0.8s infinite 300ms; }
        /* Zzz Sleep Floating Particle keyframes */
        @keyframes zzz-float {
          0% { transform: translate(5px, -2px) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(12px, -15px) scale(1.1); opacity: 0; }
        }
        .zzz-particle {
          position: absolute;
          top: -6px;
          right: -4px;
          font-size: 0.55rem;
          color: #a855f7;
          font-weight: 800;
          animation: zzz-float 2.5s infinite ease-in-out;
        }
        /* Custom Premium Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    </div>
  );
}
