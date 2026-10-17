/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AABB, Hazard, Platform } from './types.ts';

/**
 * Axis-Aligned Bounding Box (AABB) intersection check.
 */
export function checkAABB(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Point inside box check.
 */
export function pointInBox(px: number, py: number, box: AABB): boolean {
  return (
    px >= box.x &&
    px <= box.x + box.width &&
    py >= box.y &&
    py <= box.y + box.height
  );
}

/**
 * Circle vs AABB collision check.
 */
export function circleIntersectsAABB(
  cx: number,
  cy: number,
  radius: number,
  box: AABB
): boolean {
  const closestX = Math.max(box.x, Math.min(cx, box.x + box.width));
  const closestY = Math.max(box.y, Math.min(cy, box.y + box.height));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * Resolves vertical landing and horizontal wall contact on a platform.
 */
export function checkLandingOnPlatform(
  playerOldY: number,
  playerY: number,
  playerH: number,
  playerX: number,
  playerW: number,
  platform: Platform
): boolean {
  // Must overlap horizontally
  const horizontalOverlap =
    playerX + playerW > platform.x + 2 && playerX < platform.x + platform.width - 2;
  if (!horizontalOverlap) return false;

  const playerOldBottom = playerOldY + playerH;
  const playerBottom = playerY + playerH;

  // Moving downwards and passing top surface within a tolerance window
  if (playerOldBottom <= platform.y + 6 && playerBottom >= platform.y - 2) {
    return true;
  }
  return false;
}

/**
 * Wall jump velocity calculation based on wall direction.
 * wallDir: -1 means wall on the left (jump to the right), 1 means wall on right (jump to left).
 */
export function calculateWallJumpVelocity(wallDir: -1 | 1): { vx: number; vy: number } {
  const horizontalKick = 260;
  const verticalKick = -360;
  return {
    vx: -wallDir * horizontalKick,
    vy: verticalKick,
  };
}

/**
 * Calculate Coyote Time / Jump Buffer decision.
 * Returns true if jump should trigger.
 */
export function shouldExecuteJump(
  isGrounded: boolean,
  coyoteTimer: number,
  jumpBuffer: number,
  canDoubleJump: boolean
): { shouldJump: boolean; isDoubleJump: boolean } {
  if (jumpBuffer <= 0) {
    return { shouldJump: false, isDoubleJump: false };
  }

  // Ground or coyote jump
  if (isGrounded || coyoteTimer > 0) {
    return { shouldJump: true, isDoubleJump: false };
  }

  // Mid-air double jump
  if (canDoubleJump) {
    return { shouldJump: true, isDoubleJump: true };
  }

  return { shouldJump: false, isDoubleJump: false };
}

/**
 * Applies damage respecting invulnerability frame.
 */
export function calculateDamage(
  currentHp: number,
  damage: number,
  isInvulnerable: boolean
): { newHp: number; tookDamage: boolean } {
  if (isInvulnerable || currentHp <= 0) {
    return { newHp: currentHp, tookDamage: false };
  }
  const newHp = Math.max(0, currentHp - damage);
  return { newHp, tookDamage: true };
}

/**
 * Pendulum bob position and collision checking.
 */
export function getPendulumBobPos(
  pivotX: number,
  pivotY: number,
  length: number,
  angle: number
): { x: number; y: number } {
  return {
    x: pivotX + Math.sin(angle) * length,
    y: pivotY + Math.cos(angle) * length,
  };
}

/**
 * Check if a hazard damages the player.
 */
export function doesHazardHitPlayer(playerBox: AABB, hazard: Hazard): boolean {
  if (hazard.type === 'spike') {
    // Tight collision box for spikes (inner 80%)
    const spikeHitbox: AABB = {
      x: hazard.x + 3,
      y: hazard.y + 4,
      width: hazard.width - 6,
      height: hazard.height - 4,
    };
    return checkAABB(playerBox, spikeHitbox);
  }

  if (hazard.type === 'pendulum') {
    const bob = getPendulumBobPos(
      hazard.pivotX,
      hazard.pivotY,
      hazard.length,
      hazard.angle
    );
    return circleIntersectsAABB(bob.x, bob.y, hazard.bladeRadius, playerBox);
  }

  if (hazard.type === 'fire_jet') {
    if (hazard.state !== 'active') return false;
    return checkAABB(playerBox, hazard);
  }

  if (hazard.type === 'saw_blade') {
    const centerX = hazard.x + hazard.width / 2;
    const centerY = hazard.y + hazard.height / 2;
    return circleIntersectsAABB(centerX, centerY, hazard.radius, playerBox);
  }

  if (hazard.type === 'arrow_trap') {
    // The trap block itself is just a block, arrows are projectiles
    return false;
  }

  return false;
}

/**
 * Calculates score for level completion.
 */
export function calculateLevelScore(
  baseScore: number,
  scrolls: number,
  maxScrolls: number,
  timeElapsed: number,
  parTime: number,
  enemiesDefeated: number,
  damageTaken: number
): number {
  const scrollBonus = scrolls * 1000;
  const allScrollsBonus = scrolls === maxScrolls ? 1500 : 0;
  const timeBonus = Math.max(0, Math.round((parTime - timeElapsed) * 50));
  const enemyBonus = enemiesDefeated * 250;
  const perfectHpBonus = damageTaken === 0 ? 1000 : 0;

  return (
    baseScore +
    scrollBonus +
    allScrollsBonus +
    timeBonus +
    enemyBonus +
    perfectHpBonus
  );
}

/**
 * Calculates 1, 2, or 3 star rating.
 * 3 stars: all scrolls collected AND finished under par time or with low damage.
 * 2 stars: collected at least 2 scrolls or finished fast.
 * 1 star: cleared level.
 */
export function calculateStarRating(
  scrollsCollected: number,
  totalScrolls: number,
  timeElapsed: number,
  parTime: number,
  cleared: boolean
): number {
  if (!cleared) return 0;
  let stars = 1;

  if (scrollsCollected >= totalScrolls) {
    stars++;
  }

  if (timeElapsed <= parTime && scrollsCollected >= Math.max(1, totalScrolls - 1)) {
    stars++;
  } else if (scrollsCollected >= totalScrolls && stars === 2) {
    stars = 3;
  }

  return Math.min(3, Math.max(1, stars));
}
