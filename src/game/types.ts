/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type EntityFacing = 'left' | 'right';

export type PlayerActionState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'wallslide'
  | 'slash'
  | 'throw'
  | 'dash'
  | 'hurt';

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends AABB {
  vx: number;
  vy: number;
  facing: EntityFacing;
  state: PlayerActionState;
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  shurikens: number;
  maxShurikens: number;
  isGrounded: boolean;
  isTouchingWall: boolean;
  wallDir: -1 | 0 | 1; // -1: wall is to the left, 1: wall is to the right
  coyoteTimer: number;
  jumpBuffer: number;
  canDoubleJump: boolean;
  dashTimer: number;
  dashCooldown: number;
  dashDir: number;
  invulnerableTimer: number;
  slashTimer: number;
  throwTimer: number;
  animTimer: number;
  animFrame: number;
  score: number;
  scrollsCollected: number;
  coinsCollected: number;
  squashX: number;
  squashY: number;
}

export type PlatformType =
  | 'solid'
  | 'bamboo'
  | 'one_way'
  | 'crumbling'
  | 'moving'
  | 'spring';

export interface Platform extends AABB {
  id: string;
  type: PlatformType;
  isCrumbling?: boolean;
  crumbleTimer?: number;
  respawnTimer?: number;
  isCollapsed?: boolean;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  speed?: number;
  dir?: number;
  axis?: 'x' | 'y';
  springTriggered?: boolean;
}

export type HazardType = 'spike' | 'pendulum' | 'fire_jet' | 'arrow_trap' | 'saw_blade';

export interface BaseHazard extends AABB {
  id: string;
  type: HazardType;
}

export interface SpikeHazard extends BaseHazard {
  type: 'spike';
  orientation: 'up' | 'down' | 'left' | 'right';
}

export interface PendulumHazard extends BaseHazard {
  type: 'pendulum';
  pivotX: number;
  pivotY: number;
  length: number;
  angle: number;
  maxAngle: number;
  speed: number;
  bladeRadius: number;
}

export interface FireJetHazard extends BaseHazard {
  type: 'fire_jet';
  state: 'idle' | 'warning' | 'active';
  timer: number;
  cycleTime: number; // total cycle e.g. 3s
  warningDuration: number; // 0.6s
  activeDuration: number; // 1.2s
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface ArrowTrapHazard extends BaseHazard {
  type: 'arrow_trap';
  shootDir: -1 | 1;
  interval: number;
  timer: number;
}

export interface SawBladeHazard extends BaseHazard {
  type: 'saw_blade';
  radius: number;
  minX: number;
  maxX: number;
  speed: number;
  dir: number;
  rotation: number;
}

export type Hazard =
  | SpikeHazard
  | PendulumHazard
  | FireJetHazard
  | ArrowTrapHazard
  | SawBladeHazard;

export type EnemyType = 'dummy' | 'bat' | 'bandit' | 'kitsune' | 'boss_ryu';

export interface Enemy extends AABB {
  id: string;
  type: EnemyType;
  name: string;
  hp: number;
  maxHp: number;
  vx: number;
  vy: number;
  facing: EntityFacing;
  state: 'idle' | 'patrol' | 'alert' | 'attack' | 'hurt' | 'dead';
  patrolMinX: number;
  patrolMaxX: number;
  speed: number;
  attackTimer: number;
  attackCooldown: number;
  telegraphTimer: number;
  isDead: boolean;
  deadTimer: number;
  animTimer: number;
  animFrame: number;
  bossPhase?: number;
  bossSpecialTimer?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  friendly: boolean;
  damage: number;
  life: number;
  maxLife: number;
  type: 'shuriken' | 'enemy_shuriken' | 'arrow' | 'fireball';
  rotation: number;
}

export type CollectibleType = 'scroll' | 'onigiri' | 'coin' | 'shuriken_pack';

export interface Collectible {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  floatOffset: number;
}

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'spark' | 'smoke' | 'sakura' | 'blood' | 'wood_chip' | 'slash';
  rotation: number;
  vRot: number;
}

export interface LevelData {
  id: number;
  name: string;
  japaneseTitle: string;
  subtitle: string;
  description: string;
  parTime: number; // in seconds
  width: number;
  height: number;
  playerSpawn: { x: number; y: number };
  exitGate: AABB;
  platforms: Platform[];
  hazards: Hazard[];
  enemies: Enemy[];
  collectibles: Collectible[];
  theme: 'bamboo' | 'cavern' | 'dusk' | 'pagoda';
}

export interface RunStats {
  levelId: number;
  levelName: string;
  cleared: boolean;
  timeTaken: number;
  score: number;
  scrollsCollected: number;
  totalScrolls: number;
  stars: number;
  enemiesDefeated: number;
  damageTaken: number;
}
