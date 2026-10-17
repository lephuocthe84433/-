/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkAABB,
  circleIntersectsAABB,
  calculateWallJumpVelocity,
  shouldExecuteJump,
  calculateDamage,
  getPendulumBobPos,
  doesHazardHitPlayer,
  calculateLevelScore,
  calculateStarRating,
  checkLandingOnPlatform,
} from './rules.ts';
import type { Hazard, Platform } from './types.ts';

test('AABB intersection detects overlapping boxes and separates distant boxes', () => {
  const boxA = { x: 10, y: 10, width: 20, height: 20 };
  const boxB = { x: 25, y: 25, width: 20, height: 20 };
  const boxC = { x: 100, y: 100, width: 10, height: 10 };

  assert.equal(checkAABB(boxA, boxB), true);
  assert.equal(checkAABB(boxA, boxC), false);
});

test('Circle intersects AABB properly', () => {
  const box = { x: 50, y: 50, width: 30, height: 30 };
  // Circle center near box edge
  assert.equal(circleIntersectsAABB(45, 50, 10, box), true);
  // Circle far away
  assert.equal(circleIntersectsAABB(10, 10, 5, box), false);
});

test('Platform landing detection handles downward contact', () => {
  const platform: Platform = {
    id: 'p1',
    x: 100,
    y: 200,
    width: 100,
    height: 20,
    type: 'solid',
  };

  // Falling onto top of platform
  const lands = checkLandingOnPlatform(175, 185, 20, 120, 16, platform);
  assert.equal(lands, true);

  // Far to the left, misses platform
  const misses = checkLandingOnPlatform(175, 185, 20, 50, 16, platform);
  assert.equal(misses, false);
});

test('Wall jump pushes opposite to wall direction', () => {
  const leftWallJump = calculateWallJumpVelocity(-1);
  assert.ok(leftWallJump.vx > 0, 'Wall on left should kick rightwards');
  assert.ok(leftWallJump.vy < 0, 'Wall jump should propel upwards');

  const rightWallJump = calculateWallJumpVelocity(1);
  assert.ok(rightWallJump.vx < 0, 'Wall on right should kick leftwards');
  assert.ok(rightWallJump.vy < 0, 'Wall jump should propel upwards');
});

test('Coyote time and jump buffer logic', () => {
  // Ground jump with buffer
  const res1 = shouldExecuteJump(true, 0, 0.1, false);
  assert.deepEqual(res1, { shouldJump: true, isDoubleJump: false });

  // Airborne but within coyote window
  const res2 = shouldExecuteJump(false, 0.08, 0.1, false);
  assert.deepEqual(res2, { shouldJump: true, isDoubleJump: false });

  // Airborne, coyote expired, has double jump
  const res3 = shouldExecuteJump(false, 0, 0.1, true);
  assert.deepEqual(res3, { shouldJump: true, isDoubleJump: true });

  // Airborne, no buffer
  const res4 = shouldExecuteJump(false, 0, 0, true);
  assert.deepEqual(res4, { shouldJump: false, isDoubleJump: false });
});

test('Damage calculation handles invulnerability and health clamping', () => {
  // Normal damage
  const hit1 = calculateDamage(100, 25, false);
  assert.equal(hit1.newHp, 75);
  assert.equal(hit1.tookDamage, true);

  // Invulnerable iframe
  const hit2 = calculateDamage(75, 25, true);
  assert.equal(hit2.newHp, 75);
  assert.equal(hit2.tookDamage, false);

  // Overkill clamps to 0
  const hit3 = calculateDamage(10, 50, false);
  assert.equal(hit3.newHp, 0);
  assert.equal(hit3.tookDamage, true);
});

test('Pendulum bob position math calculates correct oscillation positions', () => {
  const pivotX = 100;
  const pivotY = 50;
  const length = 80;

  // At angle = 0 (straight down)
  const straightDown = getPendulumBobPos(pivotX, pivotY, length, 0);
  assert.equal(Math.round(straightDown.x), 100);
  assert.equal(Math.round(straightDown.y), 130);

  // At angle = PI / 2 (90 deg to right)
  const rightSwing = getPendulumBobPos(pivotX, pivotY, length, Math.PI / 2);
  assert.equal(Math.round(rightSwing.x), 180);
  assert.equal(Math.round(rightSwing.y), 50);
});

test('Hazard collision correctly detects spikes and inactive vs active fire jets', () => {
  const player = { x: 50, y: 100, width: 16, height: 24 };

  const spike: Hazard = {
    id: 'spk1',
    type: 'spike',
    x: 48,
    y: 110,
    width: 24,
    height: 16,
    orientation: 'up',
  };
  assert.equal(doesHazardHitPlayer(player, spike), true);

  const fireJetInactive: Hazard = {
    id: 'fj1',
    type: 'fire_jet',
    x: 50,
    y: 90,
    width: 16,
    height: 32,
    state: 'idle',
    timer: 0,
    cycleTime: 3,
    warningDuration: 0.6,
    activeDuration: 1.2,
    direction: 'up',
  };
  assert.equal(doesHazardHitPlayer(player, fireJetInactive), false);

  const fireJetActive: Hazard = {
    ...fireJetInactive,
    state: 'active',
  };
  assert.equal(doesHazardHitPlayer(player, fireJetActive), true);
});

test('Scoring and star ratings award master performance correctly', () => {
  const score = calculateLevelScore(500, 3, 3, 25, 45, 4, 0);
  assert.ok(score > 3500, 'Score with all scrolls, par time, and no damage should be substantial');

  // 3 stars for all scrolls and fast clear
  const stars3 = calculateStarRating(3, 3, 30, 45, true);
  assert.equal(stars3, 3);

  // 1 star for basic clear with only 1 scroll
  const stars1 = calculateStarRating(1, 3, 60, 45, true);
  assert.equal(stars1, 1);

  // 0 stars if failed
  const stars0 = calculateStarRating(3, 3, 30, 45, false);
  assert.equal(stars0, 0);
});
