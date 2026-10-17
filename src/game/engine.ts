/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Collectible,
  Enemy,
  Hazard,
  LevelData,
  Particle,
  Platform,
  Player,
  Projectile,
  RunStats,
} from './types.ts';
import {
  checkAABB,
  calculateDamage,
  calculateLevelScore,
  calculateStarRating,
  calculateWallJumpVelocity,
  checkLandingOnPlatform,
  doesHazardHitPlayer,
  shouldExecuteJump,
} from './rules.ts';
import {
  drawCollectible,
  drawEnemy,
  drawHazard,
  drawPlatform,
  drawPlayer,
  drawProjectile,
  drawToriiGate,
} from './pixelSprites.ts';
import { sound } from './audio.ts';

const MAX_PARTICLES = 64;

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public level: LevelData;
  public player: Player;
  public platforms: Platform[] = [];
  public hazards: Hazard[] = [];
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  public collectibles: Collectible[] = [];
  public particles: Particle[] = [];
  public particleIndex: number = 0;

  public cameraX: number = 0;
  public cameraY: number = 0;
  public screenShake: number = 0;
  public hitstopTimer: number = 0;

  public timeElapsed: number = 0;
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;

  private lastTime: number = 0;
  private animationId: number | null = null;

  // Input state
  public keysHeld: Record<string, boolean> = {};
  public keysJustPressed: Record<string, boolean> = {};

  // Run statistics
  public score: number = 0;
  public scrollsCollected: number = 0;
  public enemiesDefeated: number = 0;
  public damageTaken: number = 0;

  // Callbacks
  public onStateChange?: (stats: RunStats) => void;
  public onHudUpdate?: (hud: {
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
  }) => void;

  constructor(canvas: HTMLCanvasElement, level: LevelData) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D Context failed to initialize');
    this.ctx = context;
    this.level = level;

    // Pre-allocate fixed particle pool (zero GC)
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#ffffff',
        size: 2,
        alpha: 1,
        life: 0,
        maxLife: 1,
        type: 'dust',
        rotation: 0,
        vRot: 0,
      });
    }

    this.player = this.createDefaultPlayer();
    this.loadLevel(level);
  }

  private createDefaultPlayer(): Player {
    return {
      x: this.level.playerSpawn.x,
      y: this.level.playerSpawn.y,
      width: 18,
      height: 28,
      vx: 0,
      vy: 0,
      facing: 'right',
      state: 'idle',
      hp: 100,
      maxHp: 100,
      chakra: 100,
      maxChakra: 100,
      shurikens: 15,
      maxShurikens: 25,
      isGrounded: false,
      isTouchingWall: false,
      wallDir: 0,
      coyoteTimer: 0,
      jumpBuffer: 0,
      canDoubleJump: true,
      dashTimer: 0,
      dashCooldown: 0,
      dashDir: 1,
      invulnerableTimer: 0,
      slashTimer: 0,
      throwTimer: 0,
      animTimer: 0,
      animFrame: 0,
      score: 0,
      scrollsCollected: 0,
      coinsCollected: 0,
      squashX: 1,
      squashY: 1,
    };
  }

  public loadLevel(level: LevelData): void {
    this.level = level;
    this.platforms = JSON.parse(JSON.stringify(level.platforms));
    this.hazards = JSON.parse(JSON.stringify(level.hazards));
    this.enemies = JSON.parse(JSON.stringify(level.enemies));
    this.collectibles = JSON.parse(JSON.stringify(level.collectibles));
    this.projectiles = [];
    this.timeElapsed = 0;
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    this.damageTaken = 0;
    this.enemiesDefeated = 0;
    this.scrollsCollected = 0;
    this.score = 0;

    this.player = this.createDefaultPlayer();
    this.cameraX = this.player.x - this.canvas.width / 2;
    this.cameraY = this.player.y - this.canvas.height / 2;
  }

  public emitParticle(
    x: number,
    y: number,
    vx: number,
    vy: number,
    color: string,
    size: number,
    life: number,
    type: Particle['type'] = 'dust'
  ): void {
    const p = this.particles[this.particleIndex];
    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.color = color;
    p.size = size;
    p.life = life;
    p.maxLife = life;
    p.alpha = 1;
    p.type = type;
    p.rotation = Math.random() * Math.PI * 2;
    p.vRot = (Math.random() - 0.5) * 8;

    this.particleIndex = (this.particleIndex + 1) % MAX_PARTICLES;
  }

  public triggerScreenShake(amount: number): void {
    this.screenShake = Math.min(15, this.screenShake + amount);
  }

  public triggerHitstop(seconds: number): void {
    this.hitstopTimer = Math.max(this.hitstopTimer, seconds);
  }

  public handleKeyDown(code: string): void {
    if (!this.keysHeld[code]) {
      this.keysJustPressed[code] = true;
    }
    this.keysHeld[code] = true;

    if (code === 'KeyP' || code === 'Escape') {
      this.togglePause();
    }
    if (code === 'KeyM') {
      sound.toggleMute();
    }
    if (code === 'KeyR' && (this.isGameOver || this.isVictory)) {
      this.loadLevel(this.level);
    }
  }

  public handleKeyUp(code: string): void {
    this.keysHeld[code] = false;
  }

  public clearInputs(): void {
    this.keysHeld = {};
    this.keysJustPressed = {};
  }

  public togglePause(): void {
    if (this.isGameOver || this.isVictory) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      document.body.dataset.state = 'paused';
    } else {
      document.body.dataset.state = 'playing';
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    document.body.dataset.state = 'playing';
    sound.startBGM();

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05); // clamped dt against tunnelling

      if (!this.isPaused && !this.isGameOver && !this.isVictory) {
        this.update(dt);
      }

      this.render();

      // Clear edge-triggered one-shot inputs at end of frame
      this.keysJustPressed = {};

      if (this.isRunning) {
        this.animationId = requestAnimationFrame(loop);
      }
    };

    this.animationId = requestAnimationFrame(loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    sound.stopBGM();
  }

  // ==============================================================
  // UPDATE LOOP
  // ==============================================================
  private update(dt: number): void {
    this.timeElapsed += dt;

    // Hitstop freeze
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // Natural Chakra regeneration
    if (this.player.chakra < this.player.maxChakra) {
      this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + dt * 8);
    }

    // Timers
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }
    if (this.player.slashTimer > 0) {
      this.player.slashTimer -= dt;
    }
    if (this.player.throwTimer > 0) {
      this.player.throwTimer -= dt;
    }
    if (this.player.dashCooldown > 0) {
      this.player.dashCooldown -= dt;
    }

    // Squash & Stretch decay to 1.0
    this.player.squashX += (1 - this.player.squashX) * dt * 10;
    this.player.squashY += (1 - this.player.squashY) * dt * 10;

    // 1. Process Player Input
    this.updatePlayerInput(dt);

    // 2. Player Physics & Collisions
    this.updatePlayerPhysics(dt);

    // 3. Update Platforms (moving & crumbling)
    this.updatePlatforms(dt);

    // 4. Update Hazards (pendulums, fire jets, arrow shooters)
    this.updateHazards(dt);

    // 5. Update Enemies
    this.updateEnemies(dt);

    // 6. Update Projectiles
    this.updateProjectiles(dt);

    // 7. Update Collectibles
    this.updateCollectibles();

    // 8. Update Particles
    this.updateParticles(dt);

    // 9. Camera Smoothing
    this.updateCamera(dt);

    // 10. Check Exit Gate or Death
    this.checkGameConditions();

    // 11. Notify HUD listener
    if (this.onHudUpdate) {
      const boss = this.enemies.find((e) => e.type === 'boss_ryu');
      this.onHudUpdate({
        hp: Math.round(this.player.hp),
        maxHp: this.player.maxHp,
        chakra: Math.round(this.player.chakra),
        maxChakra: this.player.maxChakra,
        shurikens: this.player.shurikens,
        maxShurikens: this.player.maxShurikens,
        score: this.score,
        scrolls: this.scrollsCollected,
        totalScrolls: 3,
        time: this.timeElapsed,
        levelName: this.level.name,
        bossHp: boss ? Math.round(boss.hp) : undefined,
        bossMaxHp: boss ? boss.maxHp : undefined,
      });
    }
  }

  private updatePlayerInput(dt: number): void {
    const p = this.player;

    const left = this.keysHeld['KeyA'] || this.keysHeld['ArrowLeft'];
    const right = this.keysHeld['KeyD'] || this.keysHeld['ArrowRight'];
    const jumpHeld =
      this.keysHeld['KeyW'] ||
      this.keysHeld['ArrowUp'] ||
      this.keysHeld['Space'];
    const jumpJustPressed =
      this.keysJustPressed['KeyW'] ||
      this.keysJustPressed['ArrowUp'] ||
      this.keysJustPressed['Space'];
    const slashJustPressed =
      this.keysJustPressed['KeyJ'] || this.keysJustPressed['KeyZ'];
    const throwJustPressed =
      this.keysJustPressed['KeyK'] || this.keysJustPressed['KeyX'];
    const dashJustPressed =
      this.keysJustPressed['KeyL'] ||
      this.keysJustPressed['ShiftLeft'] ||
      this.keysJustPressed['ShiftRight'];

    // Jump Buffering
    if (jumpJustPressed) {
      p.jumpBuffer = 0.14;
    } else if (p.jumpBuffer > 0) {
      p.jumpBuffer -= dt;
    }

    // Coyote Timer countdown
    if (p.isGrounded) {
      p.coyoteTimer = 0.1;
      p.canDoubleJump = true;
    } else if (p.coyoteTimer > 0) {
      p.coyoteTimer -= dt;
    }

    // DASH (Kawarimi substitution)
    if (dashJustPressed && p.dashCooldown <= 0 && p.chakra >= 20) {
      p.dashTimer = 0.18;
      p.dashCooldown = 0.6;
      p.dashDir = p.facing === 'right' ? 1 : -1;
      p.invulnerableTimer = 0.22;
      p.chakra -= 20;

      sound.playDash();
      // Smoke & wood chip particles
      for (let i = 0; i < 8; i++) {
        this.emitParticle(
          p.x + p.width / 2,
          p.y + p.height / 2,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80,
          '#d1d5db',
          5,
          0.3,
          'smoke'
        );
        this.emitParticle(
          p.x + p.width / 2,
          p.y + p.height / 2,
          (Math.random() - 0.5) * 100,
          -Math.random() * 80,
          '#b45309',
          4,
          0.4,
          'wood_chip'
        );
      }
    }

    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      p.vx = p.dashDir * 440;
      p.vy = 0;
      p.state = 'dash';
      return; // During dash, movement is locked forward
    }

    // KATANA SLASH
    if (slashJustPressed && p.slashTimer <= 0) {
      p.slashTimer = 0.22;
      p.state = 'slash';
      sound.playSlash();
      this.executeKatanaSlash();
    }

    // SHURIKEN THROW
    if (throwJustPressed && p.throwTimer <= 0 && (p.shurikens > 0 || p.chakra >= 15)) {
      p.throwTimer = 0.2;
      p.state = 'throw';

      if (p.shurikens > 0) {
        p.shurikens--;
      } else {
        p.chakra -= 15;
      }

      sound.playShuriken();
      const projDir = p.facing === 'right' ? 1 : -1;
      this.projectiles.push({
        id: `proj_${Date.now()}_${Math.random()}`,
        x: p.x + p.width / 2 + projDir * 12,
        y: p.y + p.height / 2 - 2,
        vx: projDir * 420,
        vy: 0,
        radius: 6,
        friendly: true,
        damage: 25,
        life: 1.5,
        maxLife: 1.5,
        type: 'shuriken',
        rotation: 0,
      });
    }

    // Horizontal Movement
    const moveSpeed = 210;
    const accel = p.isGrounded ? 1800 : 1200;
    const friction = p.isGrounded ? 1600 : 600;

    if (left && !right) {
      p.vx = Math.max(-moveSpeed, p.vx - accel * dt);
      p.facing = 'left';
    } else if (right && !left) {
      p.vx = Math.min(moveSpeed, p.vx + accel * dt);
      p.facing = 'right';
    } else {
      // Deceleration
      if (p.vx > 0) {
        p.vx = Math.max(0, p.vx - friction * dt);
      } else if (p.vx < 0) {
        p.vx = Math.min(0, p.vx + friction * dt);
      }
    }

    // JUMP Execution
    const jumpDecision = shouldExecuteJump(
      p.isGrounded,
      p.coyoteTimer,
      p.jumpBuffer,
      p.canDoubleJump
    );

    if (jumpDecision.shouldJump) {
      p.jumpBuffer = 0;
      p.coyoteTimer = 0;

      if (jumpDecision.isDoubleJump) {
        p.canDoubleJump = false;
        p.vy = -340;
        p.squashX = 0.8;
        p.squashY = 1.25;
        sound.playDoubleJump();
        // Wind swirl particles
        for (let i = 0; i < 6; i++) {
          this.emitParticle(
            p.x + p.width / 2,
            p.y + p.height,
            (Math.random() - 0.5) * 60,
            Math.random() * 40,
            '#38bdf8',
            3,
            0.25,
            'dust'
          );
        }
      } else {
        p.vy = -380;
        p.squashX = 0.82;
        p.squashY = 1.22;
        sound.playJump();
        for (let i = 0; i < 4; i++) {
          this.emitParticle(
            p.x + p.width / 2,
            p.y + p.height,
            (Math.random() - 0.5) * 40,
            -Math.random() * 20,
            '#a3e635',
            2.5,
            0.2,
            'dust'
          );
        }
      }
    }

    // WALL JUMP
    if (p.isTouchingWall && !p.isGrounded && jumpJustPressed && p.wallDir !== 0) {
      const wj = calculateWallJumpVelocity(p.wallDir as -1 | 1);
      p.vx = wj.vx;
      p.vy = wj.vy;
      p.facing = p.wallDir === -1 ? 'right' : 'left';
      p.squashX = 0.85;
      p.squashY = 1.2;
      sound.playJump();
    }

    // Variable jump height cut
    if (!jumpHeld && p.vy < -100) {
      p.vy *= 0.5;
    }
  }

  private updatePlayerPhysics(dt: number): void {
    const p = this.player;
    const oldY = p.y;

    // Gravity
    const gravity = 980;
    p.vy = Math.min(620, p.vy + gravity * dt);

    // Wall slide damping
    if (p.isTouchingWall && p.vy > 80 && !p.isGrounded) {
      p.vy = 90; // slow sliding down wall
      p.state = 'wallslide';
      // Wall slide sparks
      if (Math.random() < 0.4) {
        this.emitParticle(
          p.wallDir === -1 ? p.x : p.x + p.width,
          p.y + p.height * 0.7,
          p.wallDir * -30,
          -20,
          '#fbbf24',
          2,
          0.15,
          'spark'
        );
      }
    }

    // Apply Velocity
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Platform Collisions
    p.isGrounded = false;
    p.isTouchingWall = false;
    p.wallDir = 0;

    for (const plat of this.platforms) {
      if (plat.isCollapsed) continue;

      // Vertical landing
      if (p.vy >= 0 && checkLandingOnPlatform(oldY, p.y, p.height, p.x, p.width, plat)) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;

        // Land squash
        if (p.squashY > 0.95) {
          p.squashX = 1.18;
          p.squashY = 0.82;
        }

        // Spring platform trigger
        if (plat.type === 'spring') {
          p.vy = -560;
          p.squashX = 0.75;
          p.squashY = 1.35;
          sound.playSpring();
          for (let i = 0; i < 6; i++) {
            this.emitParticle(
              plat.x + plat.width / 2,
              plat.y,
              (Math.random() - 0.5) * 80,
              -Math.random() * 60,
              '#fbbf24',
              3,
              0.3,
              'spark'
            );
          }
        }

        // Crumbling platform trigger
        if (plat.type === 'crumbling' && !plat.isCrumbling) {
          plat.isCrumbling = true;
          plat.crumbleTimer = 0.65;
        }
      }

      // Solid walls for wall-sliding / blocking
      if (plat.type === 'solid') {
        // Horizontal left wall touch
        if (
          p.y + p.height > plat.y + 4 &&
          p.y < plat.y + plat.height - 4 &&
          p.x + p.width >= plat.x &&
          p.x + p.width <= plat.x + 10 &&
          p.vx > 0
        ) {
          p.x = plat.x - p.width;
          p.vx = 0;
          p.isTouchingWall = true;
          p.wallDir = 1;
        } else if (
          p.y + p.height > plat.y + 4 &&
          p.y < plat.y + plat.height - 4 &&
          p.x <= plat.x + plat.width &&
          p.x >= plat.x + plat.width - 10 &&
          p.vx < 0
        ) {
          p.x = plat.x + plat.width;
          p.vx = 0;
          p.isTouchingWall = true;
          p.wallDir = -1;
        }
      }
    }

    // Set player state
    if (p.dashTimer > 0) {
      p.state = 'dash';
    } else if (p.slashTimer > 0) {
      p.state = 'slash';
    } else if (p.throwTimer > 0) {
      p.state = 'throw';
    } else if (p.isTouchingWall && !p.isGrounded) {
      p.state = 'wallslide';
    } else if (!p.isGrounded) {
      p.state = p.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(p.vx) > 15) {
      p.state = 'run';
    } else {
      p.state = 'idle';
    }

    // Hazard Collisions
    for (const h of this.hazards) {
      if (doesHazardHitPlayer(p, h)) {
        this.damagePlayer(25, h.type === 'fire_jet' ? 'Lửa Thiêu' : 'Cạm Bẫy');
        // Upward knockback
        p.vy = -280;
        p.vx = p.facing === 'right' ? -150 : 150;
        break;
      }
    }

    // Keep player within level bounds
    p.x = Math.max(0, Math.min(this.level.width - p.width, p.x));

    // Fall into bottom abyss
    if (p.y > this.level.height + 40) {
      this.damagePlayer(100, 'Rơi Xuống Vực');
    }
  }

  private executeKatanaSlash(): void {
    const p = this.player;
    const slashRange = 36;
    const slashBox = {
      x: p.facing === 'right' ? p.x + p.width : p.x - slashRange,
      y: p.y - 4,
      width: slashRange,
      height: p.height + 8,
    };

    // Slash enemies
    for (const e of this.enemies) {
      if (e.isDead) continue;
      if (checkAABB(slashBox, e)) {
        e.hp -= 35;
        e.state = 'hurt';
        sound.playHit();
        this.triggerScreenShake(3);
        this.triggerHitstop(0.05);

        // Blood / spark burst
        for (let i = 0; i < 8; i++) {
          this.emitParticle(
            e.x + e.width / 2,
            e.y + e.height / 2,
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 100,
            '#ef4444',
            3.5,
            0.35,
            'spark'
          );
        }

        if (e.hp <= 0) {
          e.isDead = true;
          e.deadTimer = 0;
          this.enemiesDefeated++;
          this.score += e.type === 'boss_ryu' ? 5000 : 300;
          sound.playEnemyKilled();
        }
      }
    }

    // Deflect incoming enemy projectiles!
    for (const proj of this.projectiles) {
      if (!proj.friendly && checkAABB(slashBox, { x: proj.x - 6, y: proj.y - 6, width: 12, height: 12 })) {
        proj.friendly = true;
        proj.vx = -proj.vx * 1.2;
        sound.playHit();
        this.score += 50;
      }
    }
  }

  private damagePlayer(damage: number, _cause: string): void {
    const res = calculateDamage(this.player.hp, damage, this.player.invulnerableTimer > 0);
    if (res.tookDamage) {
      this.player.hp = res.newHp;
      this.player.invulnerableTimer = 1.0;
      this.damageTaken += damage;
      sound.playHurt();
      this.triggerScreenShake(8);
      this.triggerHitstop(0.06);

      // Hurt particles
      for (let i = 0; i < 10; i++) {
        this.emitParticle(
          this.player.x + this.player.width / 2,
          this.player.y + this.player.height / 2,
          (Math.random() - 0.5) * 90,
          (Math.random() - 0.5) * 90,
          '#ef4444',
          3,
          0.3,
          'spark'
        );
      }

      if (this.player.hp <= 0) {
        this.handleGameOver();
      }
    }
  }

  private updatePlatforms(dt: number): void {
    for (const plat of this.platforms) {
      // Moving platforms
      if (plat.type === 'moving' && plat.speed && plat.dir) {
        if (plat.axis === 'y' && plat.minY !== undefined && plat.maxY !== undefined) {
          plat.y += plat.speed * plat.dir * dt;
          if (plat.y <= plat.minY) {
            plat.y = plat.minY;
            plat.dir = 1;
          } else if (plat.y >= plat.maxY) {
            plat.y = plat.maxY;
            plat.dir = -1;
          }
        } else if (plat.minX !== undefined && plat.maxX !== undefined) {
          plat.x += plat.speed * plat.dir * dt;
          if (plat.x <= plat.minX) {
            plat.x = plat.minX;
            plat.dir = 1;
          } else if (plat.x >= plat.maxX) {
            plat.x = plat.maxX;
            plat.dir = -1;
          }
        }
      }

      // Crumbling platforms
      if (plat.isCrumbling && plat.crumbleTimer !== undefined) {
        plat.crumbleTimer -= dt;
        if (plat.crumbleTimer <= 0) {
          plat.isCrumbling = false;
          plat.isCollapsed = true;
          plat.respawnTimer = 2.8;
          sound.playEnemyKilled();
        }
      } else if (plat.isCollapsed && plat.respawnTimer !== undefined) {
        plat.respawnTimer -= dt;
        if (plat.respawnTimer <= 0) {
          plat.isCollapsed = false;
          plat.crumbleTimer = undefined;
        }
      }
    }
  }

  private updateHazards(dt: number): void {
    for (const h of this.hazards) {
      // Pendulum swing oscillation
      if (h.type === 'pendulum') {
        h.angle = h.maxAngle * Math.sin(this.timeElapsed * h.speed);
      }

      // Fire jet periodic cycle
      else if (h.type === 'fire_jet') {
        h.timer = (h.timer + dt) % h.cycleTime;
        if (h.timer < h.cycleTime - h.warningDuration - h.activeDuration) {
          h.state = 'idle';
        } else if (h.timer < h.cycleTime - h.activeDuration) {
          h.state = 'warning';
        } else {
          h.state = 'active';
        }
      }

      // Arrow Trap periodic firing
      else if (h.type === 'arrow_trap') {
        h.timer -= dt;
        if (h.timer <= 0) {
          h.timer = h.interval;
          // Spawn arrow projectile
          this.projectiles.push({
            id: `arrow_${Date.now()}_${Math.random()}`,
            x: h.shootDir === 1 ? h.x + h.width : h.x,
            y: h.y + h.height / 2,
            vx: h.shootDir * 280,
            vy: 0,
            radius: 4,
            friendly: false,
            damage: 20,
            life: 3.5,
            maxLife: 3.5,
            type: 'arrow',
            rotation: h.shootDir === 1 ? 0 : Math.PI,
          });
        }
      }

      // Saw blade patrol
      else if (h.type === 'saw_blade') {
        h.rotation += dt * 15;
        h.x += h.speed * h.dir * dt;
        if (h.x <= h.minX) {
          h.x = h.minX;
          h.dir = 1;
        } else if (h.x >= h.maxX) {
          h.x = h.maxX;
          h.dir = -1;
        }
      }
    }
  }

  private updateEnemies(dt: number): void {
    const p = this.player;

    for (const e of this.enemies) {
      if (e.isDead) {
        e.deadTimer += dt;
        continue;
      }

      // Hurt recovery
      if (e.state === 'hurt') {
        e.state = 'patrol';
      }

      // 1. DUMMY: does nothing, just absorbs hits
      if (e.type === 'dummy') {
        continue;
      }

      // 2. BAT: aerial patrol and dive
      if (e.type === 'bat') {
        e.x += e.vx * dt;
        e.y += Math.sin(this.timeElapsed * 4) * 25 * dt;

        if (e.x <= e.patrolMinX) {
          e.x = e.patrolMinX;
          e.vx = Math.abs(e.vx);
          e.facing = 'right';
        } else if (e.x >= e.patrolMaxX) {
          e.x = e.patrolMaxX;
          e.vx = -Math.abs(e.vx);
          e.facing = 'left';
        }

        // Contact damage
        if (checkAABB(p, e)) {
          this.damagePlayer(15, 'Dơi Cắn');
        }
      }

      // 3. BANDIT: Patrols, shoots shuriken when player is in sight
      else if (e.type === 'bandit') {
        const distToPlayer = Math.hypot(p.x - e.x, p.y - e.y);

        if (e.attackTimer > 0) {
          e.attackTimer -= dt;
        }

        // Check line of sight
        const inLine = Math.abs(p.y - e.y) < 40 && distToPlayer < 320;
        if (inLine && e.attackTimer <= 0) {
          e.facing = p.x < e.x ? 'left' : 'right';
          e.telegraphTimer = 0.5;
          e.attackTimer = e.attackCooldown;
        }

        if (e.telegraphTimer > 0) {
          e.telegraphTimer -= dt;
          if (e.telegraphTimer <= 0) {
            // Shoot enemy shuriken
            sound.playShuriken();
            const sDir = e.facing === 'right' ? 1 : -1;
            this.projectiles.push({
              id: `shur_${Date.now()}_${Math.random()}`,
              x: e.x + e.width / 2 + sDir * 14,
              y: e.y + e.height / 2,
              vx: sDir * 290,
              vy: 0,
              radius: 5,
              friendly: false,
              damage: 20,
              life: 2.5,
              maxLife: 2.5,
              type: 'enemy_shuriken',
              rotation: 0,
            });
          }
        } else {
          // Patrol
          e.x += (e.facing === 'right' ? 1 : -1) * e.speed * dt;
          if (e.x <= e.patrolMinX) {
            e.x = e.patrolMinX;
            e.facing = 'right';
          } else if (e.x >= e.patrolMaxX) {
            e.x = e.patrolMaxX;
            e.facing = 'left';
          }
        }

        if (checkAABB(p, e)) {
          this.damagePlayer(20, 'Ninja Địch Tấn Công');
        }
      }

      // 4. KITSUNE: Quick spirit pounces
      else if (e.type === 'kitsune') {
        e.x += (e.facing === 'right' ? 1 : -1) * e.speed * dt;
        if (e.x <= e.patrolMinX) {
          e.x = e.patrolMinX;
          e.facing = 'right';
        } else if (e.x >= e.patrolMaxX) {
          e.x = e.patrolMaxX;
          e.facing = 'left';
        }

        if (checkAABB(p, e)) {
          this.damagePlayer(25, 'Cáo Lửa Cắn');
        }
      }

      // 5. BOSS MASTER RYU: Multi-phase master combat
      else if (e.type === 'boss_ryu') {
        const dist = Math.hypot(p.x - e.x, p.y - e.y);
        e.facing = p.x < e.x ? 'left' : 'right';

        if (e.attackTimer > 0) {
          e.attackTimer -= dt;
        }

        // Special attack timer (telegraphed shuriken storm or shadow dash)
        if (e.bossSpecialTimer !== undefined) {
          e.bossSpecialTimer -= dt;
          if (e.bossSpecialTimer <= 0) {
            e.bossSpecialTimer = e.hp < e.maxHp * 0.5 ? 2.5 : 3.8;
            e.telegraphTimer = 0.6;
          }
        }

        if (e.telegraphTimer > 0) {
          e.telegraphTimer -= dt;
          if (e.telegraphTimer <= 0) {
            // Unleash 3-way shuriken barrage!
            sound.playShuriken();
            const bDir = e.facing === 'right' ? 1 : -1;
            const angles = [-0.2, 0, 0.2];
            angles.forEach((ang) => {
              this.projectiles.push({
                id: `boss_p_${Date.now()}_${Math.random()}`,
                x: e.x + e.width / 2 + bDir * 18,
                y: e.y + e.height / 2,
                vx: Math.cos(ang) * bDir * 320,
                vy: Math.sin(ang) * 320,
                radius: 6,
                friendly: false,
                damage: 25,
                life: 3,
                maxLife: 3,
                type: 'enemy_shuriken',
                rotation: 0,
              });
            });
          }
        } else {
          // Dynamic chase/patrol
          if (dist > 140) {
            e.x += (e.facing === 'right' ? 1 : -1) * e.speed * dt;
          }
          e.x = Math.max(e.patrolMinX, Math.min(e.patrolMaxX, e.x));
        }

        // Melee clash
        if (checkAABB(p, e)) {
          this.damagePlayer(30, 'Song Kiếm Của Thầy Ryu');
        }
      }
    }
  }

  private updateProjectiles(dt: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.rotation += dt * 25;
      proj.life -= dt;

      if (proj.life <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Friendly projectile hits enemies
      if (proj.friendly) {
        for (const e of this.enemies) {
          if (e.isDead) continue;
          if (
            checkAABB(
              { x: proj.x - proj.radius, y: proj.y - proj.radius, width: proj.radius * 2, height: proj.radius * 2 },
              e
            )
          ) {
            e.hp -= proj.damage;
            e.state = 'hurt';
            sound.playHit();
            this.projectiles.splice(i, 1);

            for (let s = 0; s < 5; s++) {
              this.emitParticle(
                proj.x,
                proj.y,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                '#38bdf8',
                3,
                0.2,
                'spark'
              );
            }

            if (e.hp <= 0) {
              e.isDead = true;
              e.deadTimer = 0;
              this.enemiesDefeated++;
              this.score += e.type === 'boss_ryu' ? 5000 : 300;
              sound.playEnemyKilled();
            }
            break;
          }
        }
      } else {
        // Enemy projectile hits player
        if (
          checkAABB(
            { x: proj.x - proj.radius, y: proj.y - proj.radius, width: proj.radius * 2, height: proj.radius * 2 },
            this.player
          )
        ) {
          this.damagePlayer(proj.damage, 'Trúng Phi Tiêu Địch');
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  private updateCollectibles(): void {
    for (const c of this.collectibles) {
      if (c.collected) continue;

      if (checkAABB(this.player, c)) {
        c.collected = true;

        if (c.type === 'scroll') {
          this.scrollsCollected++;
          this.score += 1000;
          sound.playScroll();
          for (let i = 0; i < 12; i++) {
            this.emitParticle(
              c.x + c.width / 2,
              c.y + c.height / 2,
              (Math.random() - 0.5) * 90,
              (Math.random() - 0.5) * 90,
              '#fbbf24',
              3.5,
              0.4,
              'spark'
            );
          }
        } else if (c.type === 'onigiri') {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
          sound.playCoin();
        } else if (c.type === 'coin') {
          this.score += 100;
          this.player.coinsCollected++;
          sound.playCoin();
        } else if (c.type === 'shuriken_pack') {
          this.player.shurikens = Math.min(this.player.maxShurikens, this.player.shurikens + 5);
          sound.playCoin();
        }
      }
    }
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.vRot * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        p.active = false;
      }
    }
  }

  private updateCamera(dt: number): void {
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;

    // Smooth camera interpolation
    this.cameraX += (targetX - this.cameraX) * dt * 6;
    this.cameraY += (targetY - this.cameraY) * dt * 6;

    // Clamp camera within level bounds
    const maxCamX = Math.max(0, this.level.width - this.canvas.width);
    const maxCamY = Math.max(0, this.level.height - this.canvas.height);

    this.cameraX = Math.max(0, Math.min(maxCamX, this.cameraX));
    this.cameraY = Math.max(0, Math.min(maxCamY, this.cameraY));
  }

  private checkGameConditions(): void {
    // Check Torii Exit Gate
    if (checkAABB(this.player, this.level.exitGate)) {
      // If level 4 has boss, boss must be defeated
      const boss = this.enemies.find((e) => e.type === 'boss_ryu');
      if (boss && !boss.isDead) {
        return; // Boss must be defeated first!
      }

      this.handleVictory();
    }
  }

  private handleVictory(): void {
    if (this.isVictory) return;
    this.isVictory = true;
    document.body.dataset.state = 'gameover';
    sound.playVictory();

    const finalScore = calculateLevelScore(
      this.score,
      this.scrollsCollected,
      3,
      this.timeElapsed,
      this.level.parTime,
      this.enemiesDefeated,
      this.damageTaken
    );

    const stars = calculateStarRating(
      this.scrollsCollected,
      3,
      this.timeElapsed,
      this.level.parTime,
      true
    );

    const stats: RunStats = {
      levelId: this.level.id,
      levelName: this.level.name,
      cleared: true,
      timeTaken: Math.round(this.timeElapsed),
      score: finalScore,
      scrollsCollected: this.scrollsCollected,
      totalScrolls: 3,
      stars,
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: Math.round(this.damageTaken),
    };

    if (this.onStateChange) {
      this.onStateChange(stats);
    }
  }

  private handleGameOver(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;
    document.body.dataset.state = 'gameover';
    sound.playGameOver();

    const stats: RunStats = {
      levelId: this.level.id,
      levelName: this.level.name,
      cleared: false,
      timeTaken: Math.round(this.timeElapsed),
      score: this.score,
      scrollsCollected: this.scrollsCollected,
      totalScrolls: 3,
      stars: 0,
      enemiesDefeated: this.enemiesDefeated,
      damageTaken: Math.round(this.damageTaken),
    };

    if (this.onStateChange) {
      this.onStateChange(stats);
    }
  }

  // ==============================================================
  // RENDERING
  // ==============================================================
  public render(): void {
    const { ctx, canvas } = this;
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Screen Shake Offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShake;
      shakeY = (Math.random() - 0.5) * this.screenShake;
    }

    // 1. Draw Parallax Background
    this.drawParallaxBackground(cw, ch);

    // 2. World Camera Transform
    ctx.save();
    ctx.translate(
      Math.floor(-this.cameraX + shakeX),
      Math.floor(-this.cameraY + shakeY)
    );

    // 3. Draw Torii Exit Gate
    drawToriiGate(ctx, this.level.exitGate, this.timeElapsed);

    // 4. Draw Platforms
    for (const plat of this.platforms) {
      drawPlatform(ctx, plat, this.timeElapsed);
    }

    // 5. Draw Hazards
    for (const hazard of this.hazards) {
      drawHazard(ctx, hazard, this.timeElapsed);
    }

    // 6. Draw Collectibles
    for (const item of this.collectibles) {
      drawCollectible(ctx, item, this.timeElapsed);
    }

    // 7. Draw Enemies
    for (const enemy of this.enemies) {
      drawEnemy(ctx, enemy, this.timeElapsed);
    }

    // 8. Draw Projectiles
    for (const proj of this.projectiles) {
      drawProjectile(ctx, proj);
    }

    // 9. Draw Player
    drawPlayer(ctx, this.player, this.timeElapsed);

    // 10. Draw Particles
    this.drawParticles(ctx);

    ctx.restore();
  }

  private drawParallaxBackground(cw: number, ch: number): void {
    const { ctx, theme } = this;

    // Sky gradient based on theme
    const sky = ctx.createLinearGradient(0, 0, 0, ch);
    if (theme === 'bamboo') {
      sky.addColorStop(0, '#022c22'); // Forest night sky
      sky.addColorStop(0.6, '#064e3b');
      sky.addColorStop(1, '#065f46');
    } else if (theme === 'cavern') {
      sky.addColorStop(0, '#1c1917'); // Molten cavern
      sky.addColorStop(0.6, '#451a03');
      sky.addColorStop(1, '#7c2d12');
    } else if (theme === 'dusk') {
      sky.addColorStop(0, '#311042'); // Dusk violet
      sky.addColorStop(0.5, '#701a75');
      sky.addColorStop(1, '#9a3412');
    } else {
      sky.addColorStop(0, '#09090b'); // Moonlit Pagoda night
      sky.addColorStop(0.6, '#1e1b4b');
      sky.addColorStop(1, '#312e81');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch);

    // Glowing Moon
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cw * 0.82 - this.cameraX * 0.02, 90, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    ctx.beginPath();
    ctx.arc(cw * 0.82 - this.cameraX * 0.02, 90, 56, 0, Math.PI * 2);
    ctx.fill();

    // Distant Pagoda silhouettes & Mountains (Layer 1 - slow parallax 0.1)
    ctx.fillStyle = theme === 'cavern' ? '#292524' : '#042f2e';
    const layer1X = -(this.cameraX * 0.1) % 400;
    for (let x = layer1X - 400; x < cw + 400; x += 380) {
      // Mountain peak
      ctx.beginPath();
      ctx.moveTo(x, ch);
      ctx.lineTo(x + 190, ch - 220);
      ctx.lineTo(x + 380, ch);
      ctx.fill();

      // Pagoda roof silhouette
      ctx.fillRect(x + 140, ch - 240, 60, 20);
      ctx.fillRect(x + 120, ch - 260, 100, 10);
      ctx.fillRect(x + 135, ch - 275, 70, 8);
    }

    // Mid-ground Bamboo forest silhouettes (Layer 2 - parallax 0.25)
    ctx.fillStyle = theme === 'cavern' ? 'rgba(67, 20, 7, 0.6)' : 'rgba(6, 78, 59, 0.6)';
    const layer2X = -(this.cameraX * 0.25) % 180;
    for (let x = layer2X - 200; x < cw + 200; x += 40) {
      ctx.fillRect(x, ch - 300, 8, 300);
      // Leaves
      ctx.beginPath();
      ctx.moveTo(x + 4, ch - 260);
      ctx.lineTo(x + 24, ch - 280);
      ctx.lineTo(x + 4, ch - 270);
      ctx.fill();
    }

    // Floating sakura blossom petals / fire sparks drifting
    for (let i = 0; i < 18; i++) {
      const px = ((i * 137 + this.timeElapsed * 35) % (cw + 40)) - 20;
      const py = ((i * 93 + Math.sin(this.timeElapsed + i) * 30 + this.timeElapsed * 20) % ch);
      ctx.fillStyle = theme === 'cavern' ? '#f97316' : '#f472b6';
      ctx.fillRect(px, py, 3, 3);
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (!p.active) continue;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(Math.floor(p.x), Math.floor(p.y));
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }
}
