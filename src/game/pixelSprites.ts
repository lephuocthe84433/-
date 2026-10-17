/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Enemy,
  Hazard,
  Platform,
  Player,
  Projectile,
  Collectible,
} from './types.ts';
import { getPendulumBobPos } from './rules.ts';

/**
 * Draws the Ninja Player with authentic 16-bit pixel aesthetics.
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  time: number
): void {
  ctx.save();

  // Position at player center
  const cx = Math.floor(player.x + player.width / 2);
  const cy = Math.floor(player.y + player.height / 2);

  ctx.translate(cx, cy);

  // Apply facing direction
  if (player.facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Apply squash and stretch
  ctx.scale(player.squashX, player.squashY);

  // Invulnerability flashing (blink every 0.1s)
  if (player.invulnerableTimer > 0 && Math.floor(time * 16) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Dash substitution trick: if dashing, render wood log + smoke trail
  if (player.dashTimer > 0) {
    // Wooden substitution log (Kawarimi)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(-8, -12, 16, 24);
    ctx.fillStyle = '#654321';
    ctx.fillRect(-6, -10, 4, 20);
    ctx.fillRect(2, -8, 3, 16);
    // Tree ring on top
    ctx.fillStyle = '#c89d68';
    ctx.beginPath();
    ctx.ellipse(0, -12, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Leaf sprout on log
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(4, -14, 4, 3);
    ctx.restore();
    return;
  }

  // Standard Ninja Sprite Drawing
  const isHurt = player.state === 'hurt';
  const suitColor = isHurt ? '#ef4444' : '#1e1b4b'; // Deep ninja navy or red if hurt
  const vestColor = isHurt ? '#f87171' : '#312e81'; // Shinobi vest
  const skinColor = '#fcd34d'; // Anime warm skin
  const headbandColor = '#dc2626'; // Red ninja headband
  const steelColor = '#e2e8f0';

  // Head bobbing offset
  let headY = -12;
  let bodyY = -2;
  let legOffset = 0;

  if (player.state === 'run') {
    // Naruto sprint lean forward
    ctx.rotate(0.12);
    legOffset = Math.sin(time * 18) * 5;
    headY += Math.sin(time * 18) * 1.5;
  } else if (player.state === 'jump') {
    legOffset = -3;
    headY -= 2;
  } else if (player.state === 'fall') {
    legOffset = 2;
  } else if (player.state === 'wallslide') {
    legOffset = 0;
  }

  // 1. Headband Tails (fluttering in wind)
  ctx.fillStyle = headbandColor;
  const tailWave1 = Math.sin(time * 12) * 3;
  const tailWave2 = Math.cos(time * 14) * 4;
  ctx.fillRect(-12 + tailWave1, headY - 1, 6, 3);
  ctx.fillRect(-16 + tailWave2, headY + 1, 6, 2.5);

  // 2. Ninja Legs / Boots
  ctx.fillStyle = '#0f172a';
  if (player.state === 'run') {
    // Running stride
    ctx.fillRect(-5, 6 + legOffset, 4, 7);
    ctx.fillRect(1, 6 - legOffset, 4, 7);
    // White wraps on shins
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-5, 8 + legOffset, 4, 2);
    ctx.fillRect(1, 8 - legOffset, 4, 2);
  } else if (player.state === 'wallslide') {
    // Sliding against wall
    ctx.fillRect(2, 6, 6, 6);
    ctx.fillRect(-4, 7, 4, 5);
  } else {
    // Standing or jumping
    ctx.fillRect(-5, 6, 4, 7);
    ctx.fillRect(1, 6, 4, 7);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-5, 8, 4, 2);
    ctx.fillRect(1, 8, 4, 2);
  }

  // 3. Ninja Body / Vest
  ctx.fillStyle = suitColor;
  ctx.fillRect(-6, bodyY, 12, 10);
  ctx.fillStyle = vestColor;
  ctx.fillRect(-5, bodyY + 1, 10, 8);
  // Belt / Obi sash with scroll pouch
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-6, bodyY + 7, 12, 2.5);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-2, bodyY + 7, 4, 2.5);

  // 4. Arms
  ctx.fillStyle = suitColor;
  if (player.state === 'slash') {
    // Slashing arm forward
    ctx.fillRect(2, bodyY + 2, 9, 3.5);
    // Sword Katana Slash Arc
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(14, bodyY + 2, 18, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#67e8f9';
    ctx.stroke();
    // Katana blade
    ctx.fillStyle = steelColor;
    ctx.fillRect(8, bodyY - 12, 3, 20);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(7, bodyY + 4, 5, 2);
  } else if (player.state === 'throw') {
    // Throwing pose
    ctx.fillRect(3, bodyY - 2, 8, 3.5);
    // Shuriken in hand
    ctx.fillStyle = steelColor;
    ctx.fillRect(10, bodyY - 4, 4, 4);
  } else if (player.state === 'run') {
    // Sprint arms back
    ctx.fillRect(-9, bodyY + 1, 5, 3);
    ctx.fillRect(3, bodyY + 3, 5, 3);
  } else if (player.state === 'wallslide') {
    // Wall touch
    ctx.fillRect(4, bodyY, 6, 3.5);
  } else {
    // Neutral arms
    ctx.fillRect(-7, bodyY + 2, 3, 6);
    ctx.fillRect(4, bodyY + 2, 3, 6);
  }

  // 5. Ninja Head & Face Mask
  ctx.fillStyle = suitColor;
  ctx.fillRect(-6, headY, 12, 10); // Ninja cowl/hood
  // Face opening
  ctx.fillStyle = skinColor;
  ctx.fillRect(-3, headY + 3, 8, 4);
  // Fierce Ninja Eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, headY + 4, 2.5, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(1, headY + 4, 1, 1);
  // Mask covering lower face
  ctx.fillStyle = vestColor;
  ctx.fillRect(-4, headY + 6, 9, 4);

  // 6. Red Headband Metal Plate
  ctx.fillStyle = headbandColor;
  ctx.fillRect(-6, headY + 1, 12, 2.5);
  // Leaf Shinobi Silver Plate
  ctx.fillStyle = steelColor;
  ctx.fillRect(-1, headY + 1, 5, 2);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(1, headY + 1.5, 2, 1);

  ctx.restore();
}

/**
 * Draws interactive or crumbling platforms.
 */
export function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  time: number
): void {
  if (p.isCollapsed) return;

  ctx.save();
  let offsetY = 0;
  if (p.isCrumbling && p.crumbleTimer) {
    // Shake wobbling when crumbling
    offsetY = Math.sin(time * 40) * 2;
  }

  const px = Math.floor(p.x);
  const py = Math.floor(p.y + offsetY);
  const pw = Math.floor(p.width);
  const ph = Math.floor(p.height);

  if (p.type === 'bamboo') {
    // Green bamboo logs
    ctx.fillStyle = '#15803d';
    ctx.fillRect(px, py, pw, ph);
    // Bamboo segment nodes
    ctx.fillStyle = '#22c55e';
    for (let x = px; x < px + pw; x += 16) {
      ctx.fillRect(x, py, 2, ph);
      ctx.fillRect(x + 4, py + 1, 10, 2);
    }
    // Bamboo top shine
    ctx.fillStyle = '#86efac';
    ctx.fillRect(px, py, pw, 2);
  } else if (p.type === 'crumbling') {
    // Decaying wooden planks with warning cracks
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
    // Cracks
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px + pw * 0.3, py);
    ctx.lineTo(px + pw * 0.45, py + ph);
    ctx.moveTo(px + pw * 0.7, py);
    ctx.lineTo(px + pw * 0.65, py + ph);
    ctx.stroke();

    // Crumble dust falling
    if (p.isCrumbling) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + pw * 0.5, py + ph + 2, 3, 3);
      ctx.fillRect(px + pw * 0.2, py + ph + 4, 2, 2);
    }
  } else if (p.type === 'spring') {
    // Ninja trampoline / spring pad
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px, py + 6, pw, ph - 6);
    // Red rubber pad on top
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + 2, py, pw - 4, 6);
    // Golden spring coil
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px + pw / 2 - 4, py + 6, 8, ph - 7);
  } else if (p.type === 'moving') {
    // Floating wooden cloud platform with brass gears
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
    // Brass runes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(px + 6, py + 4, pw - 12, 3);
  } else {
    // Solid Japanese stone / tatami / earth tile
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
    // Grass/moss edge on top
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(px, py, pw, 3);
  }

  ctx.restore();
}

/**
 * Draws deadly ninja hazards.
 */
export function drawHazard(
  ctx: CanvasRenderingContext2D,
  h: Hazard,
  time: number
): void {
  ctx.save();

  if (h.type === 'spike') {
    // Bamboo spike bed with blood-stained sharpened tips
    const sx = Math.floor(h.x);
    const sy = Math.floor(h.y);
    const sw = Math.floor(h.width);
    const sh = Math.floor(h.height);

    ctx.fillStyle = '#451a03'; // Spike base
    ctx.fillRect(sx, sy + sh - 4, sw, 4);

    const spikeCount = Math.max(2, Math.floor(sw / 10));
    const step = sw / spikeCount;

    for (let i = 0; i < spikeCount; i++) {
      const tipX = sx + i * step + step / 2;
      ctx.fillStyle = '#a16207'; // Wooden body
      ctx.beginPath();
      ctx.moveTo(sx + i * step, sy + sh - 4);
      ctx.lineTo(tipX, sy);
      ctx.lineTo(sx + (i + 1) * step, sy + sh - 4);
      ctx.closePath();
      ctx.fill();

      // Sharp steel tip
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(tipX - 2, sy + 6);
      ctx.lineTo(tipX, sy);
      ctx.lineTo(tipX + 2, sy + 6);
      ctx.closePath();
      ctx.fill();

      // Crimson poison tip
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tipX - 1, sy, 2, 3);
    }
  } else if (h.type === 'pendulum') {
    const bob = getPendulumBobPos(h.pivotX, h.pivotY, h.length, h.angle);

    // Pivot mount
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(h.pivotX, h.pivotY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Iron chain links
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(h.pivotX, h.pivotY);
    ctx.lineTo(bob.x, bob.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Spiky iron ball
    ctx.save();
    ctx.translate(bob.x, bob.y);
    ctx.rotate(time * 5); // Spinning ball

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, h.bladeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spikes protruding from ball
    ctx.fillStyle = '#ef4444';
    for (let i = 0; i < 8; i++) {
      const rad = (i * Math.PI) / 4;
      const x1 = Math.cos(rad) * (h.bladeRadius - 2);
      const y1 = Math.sin(rad) * (h.bladeRadius - 2);
      const xTip = Math.cos(rad) * (h.bladeRadius + 7);
      const yTip = Math.sin(rad) * (h.bladeRadius + 7);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(xTip, yTip);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
  } else if (h.type === 'fire_jet') {
    // Stone gargoyle / dragon nozzle
    ctx.fillStyle = '#334155';
    ctx.fillRect(h.x, h.y + h.height - 10, h.width, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(h.x + 4, h.y + h.height - 8, h.width - 8, 8);

    if (h.state === 'warning') {
      // Glow and rising sparks
      ctx.fillStyle = '#f97316';
      ctx.fillRect(h.x + 4, h.y + h.height - 12, h.width - 8, 4);
      // Spark particles
      for (let s = 0; s < 3; s++) {
        const sx = h.x + Math.random() * h.width;
        const sy = h.y + h.height - 16 - Math.random() * 15;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(sx, sy, 2, 2);
      }
    } else if (h.state === 'active') {
      // Full roaring flame column!
      const flameHeight = h.height - 10;
      const gradient = ctx.createLinearGradient(
        h.x,
        h.y + h.height - 10,
        h.x,
        h.y
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, '#fde047');
      gradient.addColorStop(0.6, '#f97316');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = gradient;
      // Wavy flame column
      ctx.beginPath();
      const wave = Math.sin(time * 25) * 4;
      ctx.moveTo(h.x + 2, h.y + h.height - 10);
      ctx.lineTo(h.x + h.width / 2 + wave, h.y);
      ctx.lineTo(h.x + h.width - 2, h.y + h.height - 10);
      ctx.closePath();
      ctx.fill();

      // Outer orange flame aura
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(h.x + 2 + wave * 0.5, h.y + 10, h.width - 4, flameHeight - 20);
    }
  } else if (h.type === 'saw_blade') {
    ctx.save();
    const cx = h.x + h.width / 2;
    const cy = h.y + h.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(h.rotation);

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(0, 0, h.radius, 0, Math.PI * 2);
    ctx.fill();

    // Saw teeth
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (h.radius - 3), Math.sin(a) * (h.radius - 3));
      ctx.lineTo(Math.cos(a + 0.2) * (h.radius + 6), Math.sin(a + 0.2) * (h.radius + 6));
      ctx.lineTo(Math.cos(a + 0.4) * (h.radius - 3), Math.sin(a + 0.4) * (h.radius - 3));
      ctx.fill();
    }

    // Center rivet
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws enemies with distinctive sprites and behavior indicators.
 */
export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  e: Enemy,
  time: number
): void {
  ctx.save();
  const cx = Math.floor(e.x + e.width / 2);
  const cy = Math.floor(e.y + e.height / 2);

  ctx.translate(cx, cy);

  if (e.facing === 'left') {
    ctx.scale(-1, 1);
  }

  if (e.isDead) {
    // Defeated topple / dissolve animation
    ctx.rotate(Math.PI * 0.45);
    ctx.globalAlpha = Math.max(0, 1 - e.deadTimer / 0.5);
  }

  if (e.state === 'hurt') {
    ctx.filter = 'brightness(2) drop-shadow(0 0 4px red)';
  }

  // 1. DUMMY (Mộc Nhân luyện võ)
  if (e.type === 'dummy') {
    // Wooden pole
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-6, -14, 12, 28);
    // Straw target wrapping
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-8, -6, 16, 12);
    // Red bullseye painted on chest
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    // Wooden cross arms
    ctx.fillStyle = '#713f12';
    ctx.fillRect(-12, -4, 24, 4);
    // Straw headband on top
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-7, -13, 14, 3);
  }

  // 2. BAT (Dơi Huyết Tộc)
  else if (e.type === 'bat') {
    const flap = Math.sin(time * 16) * 8;
    // Body
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crimson red glowing eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(1, -3, 2, 2);
    // Leathery wings flapping
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(3, -2);
    ctx.lineTo(16, -6 + flap);
    ctx.lineTo(10, 4 + flap * 0.5);
    ctx.lineTo(2, 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(-14, -6 + flap);
    ctx.lineTo(-8, 4 + flap * 0.5);
    ctx.lineTo(-2, 2);
    ctx.closePath();
    ctx.fill();
  }

  // 3. BANDIT NINJA (Ninja Hắc Ám)
  else if (e.type === 'bandit') {
    // Attack windup telegraph indicator (red exclamation / glow)
    if (e.telegraphTimer > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('!', -3, -18);
    }

    // Black & Crimson Assassin Garb
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-6, -10, 12, 20);
    // Crimson sash
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-6, 2, 12, 3);
    // Fierce glowing eyes
    ctx.fillStyle = '#f87171';
    ctx.fillRect(1, -6, 3, 2);
    // Twin Kunai daggers
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(6, -2, 8, 2);
    ctx.fillRect(6, 4, 8, 2);
  }

  // 4. KITSUNE (Cáo Lửa Hỏa Linh)
  else if (e.type === 'kitsune') {
    // Orange fox body
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-10, -4, 20, 10);
    // White chest fur
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(4, -2, 5, 8);
    // Fox ears
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(6, -4);
    ctx.lineTo(9, -12);
    ctx.lineTo(12, -4);
    ctx.fill();
    // Flame Tail waving
    const tailWave = Math.sin(time * 12) * 4;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(-14, -2 + tailWave, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Blue spirit flame on tail tip
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-19, -3 + tailWave, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. BOSS MASTER RYU (Hiệu Trưởng - Đại Cao Thủ Ryu)
  else if (e.type === 'boss_ryu') {
    // Dramatic Boss Aura
    ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
    ctx.beginPath();
    ctx.arc(0, 0, 26 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Golden Dragon Headband & Long Master Haori
    ctx.fillStyle = '#020617';
    ctx.fillRect(-10, -18, 20, 36);
    // Golden embroidery trim
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-10, -4, 20, 4);
    ctx.fillRect(-8, -18, 16, 3);
    // Dual legendary blades
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(10, -16, 3, 28);
    ctx.fillRect(-13, -16, 3, 28);
    // Dragon Crest
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-3, -17, 6, 4);

    // Boss attack telegraph laser/line
    if (e.telegraphTimer > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(60, 0);
      ctx.stroke();
    }
  }

  ctx.restore();

  // Health bar above enemy (if damaged or boss)
  if (!e.isDead && (e.hp < e.maxHp || e.type === 'boss_ryu')) {
    const barW = Math.max(24, e.width);
    const barX = Math.floor(e.x + e.width / 2 - barW / 2);
    const barY = Math.floor(e.y - 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(barX, barY, barW, 4);
    const fillW = Math.max(0, Math.floor((e.hp / e.maxHp) * barW));
    ctx.fillStyle = e.type === 'boss_ryu' ? '#eab308' : '#ef4444';
    ctx.fillRect(barX, barY, fillW, 4);
  }
}

/**
 * Draws collectibles like Secret Scrolls, Onigiri, and Coins.
 */
export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  c: Collectible,
  time: number
): void {
  if (c.collected) return;

  ctx.save();
  const floatY = Math.sin(time * 6 + c.floatOffset) * 3;
  const cx = Math.floor(c.x + c.width / 2);
  const cy = Math.floor(c.y + c.height / 2 + floatY);

  ctx.translate(cx, cy);

  if (c.type === 'scroll') {
    // Secret Scroll (Mật Bí Kíp Cổ)
    // Golden halo glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Scroll parchment body
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-7, -9, 14, 18);
    // Wooden scroll rods at top and bottom
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-9, -11, 18, 3);
    ctx.fillRect(-9, 8, 18, 3);
    // Crimson ribbon tie & ninja seal
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7, -2, 14, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, -2, 4, 4);
  } else if (c.type === 'onigiri') {
    // Rice ball wrapped in nori
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(8, 7);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();
    // Dark seaweed wrapper
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-3, 0, 6, 7);
  } else if (c.type === 'coin') {
    // Gold Mon coin with square hole
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Square hole in center
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-1.5, -1.5, 3, 3);
  } else if (c.type === 'shuriken_pack') {
    // Shuriken pack bundle
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-4, -4, 8, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-6, -1, 12, 2);
  }

  ctx.restore();
}

/**
 * Draws flying projectiles (Shurikens, Arrows, Fireballs).
 */
export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  p: Projectile
): void {
  ctx.save();
  ctx.translate(Math.floor(p.x), Math.floor(p.y));
  ctx.rotate(p.rotation);

  if (p.type === 'shuriken' || p.type === 'enemy_shuriken') {
    // 4-pointed razor ninja star
    ctx.fillStyle = p.type === 'shuriken' ? '#e2e8f0' : '#f87171';
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(0, p.radius + 2);
      ctx.lineTo(2, 0);
      ctx.closePath();
      ctx.fill();
    }
    // Shuriken center hole
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'arrow') {
    // Dart / arrow
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-10, -1, 16, 2);
    // Arrowhead
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(6, -3);
    ctx.lineTo(10, 0);
    ctx.lineTo(6, 3);
    ctx.fill();
  } else if (p.type === 'fireball') {
    // Magma flame orb
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 0, p.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws the legendary Torii Gate (Exit checkpoint).
 */
export function drawToriiGate(
  ctx: CanvasRenderingContext2D,
  gate: { x: number; y: number; width: number; height: number },
  time: number
): void {
  const gx = Math.floor(gate.x);
  const gy = Math.floor(gate.y);
  const gw = Math.floor(gate.width);
  const gh = Math.floor(gate.height);

  ctx.save();

  // Torii gate pillars (Vermilion shrine red)
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(gx, gy + 10, 8, gh - 10);
  ctx.fillRect(gx + gw - 8, gy + 10, 8, gh - 10);

  // Black stone bases
  ctx.fillStyle = '#18181b';
  ctx.fillRect(gx - 2, gy + gh - 6, 12, 6);
  ctx.fillRect(gx + gw - 10, gy + gh - 6, 12, 6);

  // Top crossbeam (Kasagi) with upturned edges
  ctx.fillStyle = '#18181b';
  ctx.fillRect(gx - 8, gy, gw + 16, 7);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(gx - 4, gy + 7, gw + 8, 5);

  // Shinto talisman in center (Shinobi seal of completion)
  const pulse = Math.sin(time * 5) * 0.2 + 0.8;
  ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
  ctx.fillRect(gx + gw / 2 - 6, gy + 14, 12, 16);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(gx + gw / 2 - 3, gy + 18, 6, 8);

  // Glowing portal aura between pillars
  ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + Math.sin(time * 3) * 0.05})`;
  ctx.fillRect(gx + 8, gy + 12, gw - 16, gh - 12);

  ctx.restore();
}
