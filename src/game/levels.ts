/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelData } from './types.ts';

export const LEVELS: LevelData[] = [
  // -------------------------------------------------------------
  // MÀN 1: NHẬP MÔN RỪNG TRÚC (Bamboo Forest Induction)
  // -------------------------------------------------------------
  {
    id: 1,
    name: 'Nhập Môn Rừng Trúc',
    japaneseTitle: '竹林の道',
    subtitle: 'Thử thách cơ bản: Nhảy đôi, leo tường và thu thập bí kíp',
    description: 'Luyện tập các kỹ năng nhẫn giả căn bản tại rừng trúc Hirosaki. Tránh chông gai và chém bia mộc nhân để qua ải.',
    parTime: 45,
    width: 2000,
    height: 600,
    playerSpawn: { x: 60, y: 440 },
    exitGate: { x: 1880, y: 390, width: 48, height: 64 },
    platforms: [
      // Main Ground
      { id: 'g1', type: 'solid', x: 0, y: 500, width: 500, height: 100 },
      // Spike pit gap
      { id: 'g2', type: 'solid', x: 640, y: 500, width: 450, height: 100 },
      // Second gap
      { id: 'g3', type: 'solid', x: 1200, y: 500, width: 800, height: 100 },

      // Training elevated bamboo steps
      { id: 'b1', type: 'bamboo', x: 200, y: 420, width: 90, height: 16 },
      { id: 'b2', type: 'bamboo', x: 330, y: 350, width: 90, height: 16 },
      { id: 'b3', type: 'bamboo', x: 460, y: 280, width: 90, height: 16 },

      // High secret branch for Scroll 1
      { id: 'b4', type: 'bamboo', x: 260, y: 200, width: 120, height: 16 },

      // Over the first spike pit: moving platform
      {
        id: 'm1',
        type: 'moving',
        x: 520,
        y: 450,
        width: 80,
        height: 16,
        minX: 510,
        maxX: 620,
        speed: 60,
        dir: 1,
        axis: 'x',
      },

      // Wall-jump vertical shaft
      { id: 'w1', type: 'solid', x: 800, y: 240, width: 24, height: 260 },
      { id: 'w2', type: 'solid', x: 920, y: 240, width: 24, height: 260 },
      // Top platform above wall-jump shaft
      { id: 'b5', type: 'bamboo', x: 800, y: 230, width: 144, height: 16 },

      // Bamboo bridge
      { id: 'b6', type: 'bamboo', x: 1000, y: 360, width: 140, height: 16 },

      // Spring board
      { id: 'sp1', type: 'spring', x: 1220, y: 488, width: 32, height: 12 },

      // Floating bamboo islands to exit
      { id: 'b7', type: 'bamboo', x: 1350, y: 360, width: 110, height: 16 },
      { id: 'b8', type: 'bamboo', x: 1530, y: 340, width: 110, height: 16 },
      { id: 'b9', type: 'bamboo', x: 1720, y: 410, width: 100, height: 16 },
    ],
    hazards: [
      // Spike pit 1
      {
        id: 'spk1',
        type: 'spike',
        x: 500,
        y: 530,
        width: 140,
        height: 30,
        orientation: 'up',
      },
      // Spike pit 2
      {
        id: 'spk2',
        type: 'spike',
        x: 1090,
        y: 530,
        width: 110,
        height: 30,
        orientation: 'up',
      },
      // Small spike on ground
      {
        id: 'spk3',
        type: 'spike',
        x: 1420,
        y: 476,
        width: 40,
        height: 24,
        orientation: 'up',
      },
    ],
    enemies: [
      // Training Dummy 1 (Learn Slash)
      {
        id: 'e1',
        type: 'dummy',
        name: 'Mộc Nhân 1',
        hp: 30,
        maxHp: 30,
        x: 380,
        y: 468,
        width: 20,
        height: 32,
        vx: 0,
        vy: 0,
        facing: 'left',
        state: 'idle',
        patrolMinX: 380,
        patrolMaxX: 380,
        speed: 0,
        attackTimer: 0,
        attackCooldown: 999,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Training Dummy 2 (High branch)
      {
        id: 'e2',
        type: 'dummy',
        name: 'Mộc Nhân 2',
        hp: 30,
        maxHp: 30,
        x: 500,
        y: 248,
        width: 20,
        height: 32,
        vx: 0,
        vy: 0,
        facing: 'left',
        state: 'idle',
        patrolMinX: 500,
        patrolMaxX: 500,
        speed: 0,
        attackTimer: 0,
        attackCooldown: 999,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Forest Bat (flying above pit)
      {
        id: 'e3',
        type: 'bat',
        name: 'Dơi Rừng',
        hp: 20,
        maxHp: 20,
        x: 1050,
        y: 310,
        width: 24,
        height: 18,
        vx: -40,
        vy: 0,
        facing: 'left',
        state: 'patrol',
        patrolMinX: 1010,
        patrolMaxX: 1140,
        speed: 45,
        attackTimer: 0,
        attackCooldown: 2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Training Dummy 3
      {
        id: 'e4',
        type: 'dummy',
        name: 'Mộc Nhân 3',
        hp: 30,
        maxHp: 30,
        x: 1600,
        y: 468,
        width: 20,
        height: 32,
        vx: 0,
        vy: 0,
        facing: 'left',
        state: 'idle',
        patrolMinX: 1600,
        patrolMaxX: 1600,
        speed: 0,
        attackTimer: 0,
        attackCooldown: 999,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
    ],
    collectibles: [
      // 3 Secret Scrolls (Bí Kíp)
      { id: 'sc1', type: 'scroll', x: 300, y: 160, width: 16, height: 20, collected: false, floatOffset: 0 },
      { id: 'sc2', type: 'scroll', x: 860, y: 190, width: 16, height: 20, collected: false, floatOffset: 1 },
      { id: 'sc3', type: 'scroll', x: 1570, y: 300, width: 16, height: 20, collected: false, floatOffset: 2 },

      // Onigiri heal
      { id: 'og1', type: 'onigiri', x: 860, y: 460, width: 16, height: 16, collected: false, floatOffset: 3 },
      { id: 'og2', type: 'onigiri', x: 1390, y: 330, width: 16, height: 16, collected: false, floatOffset: 4 },

      // Shuriken packs & Coins
      { id: 'sh1', type: 'shuriken_pack', x: 240, y: 380, width: 16, height: 16, collected: false, floatOffset: 1 },
      { id: 'c1', type: 'coin', x: 150, y: 460, width: 12, height: 12, collected: false, floatOffset: 0.5 },
      { id: 'c2', type: 'coin', x: 370, y: 310, width: 12, height: 12, collected: false, floatOffset: 1.5 },
      { id: 'c3', type: 'coin', x: 700, y: 460, width: 12, height: 12, collected: false, floatOffset: 2.5 },
      { id: 'c4', type: 'coin', x: 1220, y: 360, width: 12, height: 12, collected: false, floatOffset: 3.5 },
    ],
    theme: 'bamboo',
  },

  // -------------------------------------------------------------
  // MÀN 2: THUNG LŨNG CẠM BẪY (Chasm of Perilous Traps)
  // -------------------------------------------------------------
  {
    id: 2,
    name: 'Thung Lũng Cạm Bẫy',
    japaneseTitle: '罠の渓谷',
    subtitle: 'Thử thách tốc độ: Quả cầu gai đu đưa, ván gỗ sụp lở và ninja địch',
    description: 'Thung lũng ngập tràn bẫy con lắc tử thần và những thanh gỗ mục có thể rơi bất cứ lúc nào. Cẩn trọng trước ninja hắc ám!',
    parTime: 60,
    width: 2400,
    height: 650,
    playerSpawn: { x: 70, y: 470 },
    exitGate: { x: 2280, y: 420, width: 48, height: 64 },
    platforms: [
      // Starting ground
      { id: 'g1', type: 'solid', x: 0, y: 530, width: 350, height: 120 },

      // Series of crumbling timber planks
      { id: 'cr1', type: 'crumbling', x: 410, y: 490, width: 64, height: 14 },
      { id: 'cr2', type: 'crumbling', x: 530, y: 460, width: 64, height: 14 },
      { id: 'cr3', type: 'crumbling', x: 650, y: 430, width: 64, height: 14 },

      // Intermediate rock plateau
      { id: 'g2', type: 'solid', x: 780, y: 420, width: 280, height: 230 },

      // High pillars for wall jumps
      { id: 'w1', type: 'solid', x: 1140, y: 220, width: 30, height: 350 },
      { id: 'w2', type: 'solid', x: 1280, y: 220, width: 30, height: 350 },
      { id: 'b_top', type: 'bamboo', x: 1140, y: 210, width: 170, height: 14 },

      // Moving pendulum chasm platforms
      {
        id: 'm1',
        type: 'moving',
        x: 1380,
        y: 400,
        width: 70,
        height: 14,
        minY: 340,
        maxY: 460,
        speed: 55,
        dir: 1,
        axis: 'y',
      },
      {
        id: 'm2',
        type: 'moving',
        x: 1530,
        y: 360,
        width: 70,
        height: 14,
        minX: 1490,
        maxX: 1610,
        speed: 65,
        dir: 1,
        axis: 'x',
      },

      // Crumbling bridge under dart shooter
      { id: 'cr4', type: 'crumbling', x: 1670, y: 390, width: 60, height: 14 },
      { id: 'cr5', type: 'crumbling', x: 1770, y: 410, width: 60, height: 14 },

      // Final plateau
      { id: 'g3', type: 'solid', x: 1900, y: 490, width: 500, height: 160 },
      { id: 'sp_final', type: 'spring', x: 2020, y: 478, width: 32, height: 12 },
      { id: 'b_high', type: 'bamboo', x: 2080, y: 320, width: 100, height: 14 },
    ],
    hazards: [
      // Deep Spike Abyss 1
      { id: 'spk1', type: 'spike', x: 350, y: 580, width: 430, height: 40, orientation: 'up' },

      // Swinging Pendulum 1 (over crumbling planks)
      {
        id: 'pen1',
        type: 'pendulum',
        x: 520,
        y: 200,
        width: 28,
        height: 28,
        pivotX: 530,
        pivotY: 210,
        length: 190,
        angle: 0.8,
        maxAngle: 0.9,
        speed: 1.8,
        bladeRadius: 14,
      },

      // Swinging Pendulum 2 (in moving platform gap)
      {
        id: 'pen2',
        type: 'pendulum',
        x: 1460,
        y: 180,
        width: 32,
        height: 32,
        pivotX: 1460,
        pivotY: 180,
        length: 170,
        angle: -0.85,
        maxAngle: 0.95,
        speed: 2.1,
        bladeRadius: 16,
      },

      // Deep Spike Abyss 2
      { id: 'spk2', type: 'spike', x: 1060, y: 580, width: 840, height: 40, orientation: 'up' },

      // Arrow Trap shooting from right wall
      {
        id: 'arr1',
        type: 'arrow_trap',
        x: 1880,
        y: 380,
        width: 20,
        height: 24,
        shootDir: -1,
        interval: 2.2,
        timer: 1.0,
      },
    ],
    enemies: [
      // Bandit Ninja on plateau 1
      {
        id: 'e1',
        type: 'bandit',
        name: 'Ninja Hắc Ám 1',
        hp: 45,
        maxHp: 45,
        x: 880,
        y: 385,
        width: 20,
        height: 34,
        vx: 30,
        vy: 0,
        facing: 'right',
        state: 'patrol',
        patrolMinX: 800,
        patrolMaxX: 1000,
        speed: 40,
        attackTimer: 0,
        attackCooldown: 2.5,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Bat lurking in wall jump shaft
      {
        id: 'e2',
        type: 'bat',
        name: 'Dơi Huyết Tộc',
        hp: 25,
        maxHp: 25,
        x: 1210,
        y: 280,
        width: 24,
        height: 18,
        vx: 0,
        vy: 40,
        facing: 'left',
        state: 'patrol',
        patrolMinX: 1180,
        patrolMaxX: 1240,
        speed: 40,
        attackTimer: 0,
        attackCooldown: 2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Bandit Ninja guarding final gate
      {
        id: 'e3',
        type: 'bandit',
        name: 'Ninja Hắc Ám 2',
        hp: 50,
        maxHp: 50,
        x: 2150,
        y: 455,
        width: 20,
        height: 34,
        vx: -35,
        vy: 0,
        facing: 'left',
        state: 'patrol',
        patrolMinX: 2100,
        patrolMaxX: 2260,
        speed: 45,
        attackTimer: 0,
        attackCooldown: 2.2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
    ],
    collectibles: [
      // Scroll 1 (high in bamboo above crumbling bridge)
      { id: 'sc1', type: 'scroll', x: 540, y: 330, width: 16, height: 20, collected: false, floatOffset: 0 },
      // Scroll 2 (at the summit of the vertical shaft)
      { id: 'sc2', type: 'scroll', x: 1210, y: 160, width: 16, height: 20, collected: false, floatOffset: 1 },
      // Scroll 3 (perched on high bamboo ledge before exit)
      { id: 'sc3', type: 'scroll', x: 2120, y: 270, width: 16, height: 20, collected: false, floatOffset: 2 },

      { id: 'og1', type: 'onigiri', x: 920, y: 385, width: 16, height: 16, collected: false, floatOffset: 0.5 },
      { id: 'sh1', type: 'shuriken_pack', x: 1140, y: 170, width: 16, height: 16, collected: false, floatOffset: 1.5 },
      { id: 'c1', type: 'coin', x: 440, y: 440, width: 12, height: 12, collected: false, floatOffset: 0.2 },
      { id: 'c2', type: 'coin', x: 560, y: 410, width: 12, height: 12, collected: false, floatOffset: 0.8 },
      { id: 'c3', type: 'coin', x: 1560, y: 310, width: 12, height: 12, collected: false, floatOffset: 1.2 },
    ],
    theme: 'dusk',
  },

  // -------------------------------------------------------------
  // MÀN 3: HANG ĐỘNG HỎA DIỆM (Fire Cavern & Magma Vaults)
  // -------------------------------------------------------------
  {
    id: 3,
    name: 'Hang Động Hỏa Diệm',
    japaneseTitle: '火炎の洞窟',
    subtitle: 'Thử thách căn giờ: Bẫy lửa phun định kỳ và Cáo lửa nhanh nhẹn',
    description: 'Hang động nham thạch bỏng rát. Căn chuẩn thời gian vượt bẫy lửa phun, tận dụng thuật lướt Thế Thân để né đòn!',
    parTime: 70,
    width: 2600,
    height: 700,
    playerSpawn: { x: 70, y: 520 },
    exitGate: { x: 2480, y: 460, width: 48, height: 64 },
    platforms: [
      { id: 'g1', type: 'solid', x: 0, y: 580, width: 380, height: 120 },

      // Fire trap steps
      { id: 's1', type: 'solid', x: 440, y: 540, width: 100, height: 160 },
      { id: 's2', type: 'solid', x: 600, y: 500, width: 100, height: 200 },
      { id: 's3', type: 'solid', x: 760, y: 460, width: 100, height: 240 },

      // High cavern ceiling bridge
      { id: 'b1', type: 'bamboo', x: 920, y: 380, width: 180, height: 16 },

      // Crumbling steps over lava lake
      { id: 'cr1', type: 'crumbling', x: 1160, y: 440, width: 64, height: 14 },
      { id: 'cr2', type: 'crumbling', x: 1280, y: 410, width: 64, height: 14 },
      { id: 'cr3', type: 'crumbling', x: 1400, y: 380, width: 64, height: 14 },

      // Magma island
      { id: 'g2', type: 'solid', x: 1520, y: 440, width: 220, height: 260 },

      // Moving flame elevator
      {
        id: 'm1',
        type: 'moving',
        x: 1800,
        y: 420,
        width: 80,
        height: 16,
        minY: 300,
        maxY: 480,
        speed: 70,
        dir: 1,
        axis: 'y',
      },

      // High wall jump to exit
      { id: 'w1', type: 'solid', x: 1960, y: 220, width: 26, height: 340 },
      { id: 'w2', type: 'solid', x: 2100, y: 220, width: 26, height: 340 },
      { id: 'b_top', type: 'bamboo', x: 1960, y: 210, width: 170, height: 16 },

      // Exit cavern hall
      { id: 'g3', type: 'solid', x: 2200, y: 530, width: 400, height: 170 },
    ],
    hazards: [
      // Magma lake below
      { id: 'spk1', type: 'spike', x: 380, y: 640, width: 1820, height: 60, orientation: 'up' },

      // Fire Geysers
      {
        id: 'fj1',
        type: 'fire_jet',
        x: 470,
        y: 470,
        width: 36,
        height: 70,
        state: 'idle',
        timer: 0.5,
        cycleTime: 2.8,
        warningDuration: 0.7,
        activeDuration: 1.1,
        direction: 'up',
      },
      {
        id: 'fj2',
        type: 'fire_jet',
        x: 630,
        y: 430,
        width: 36,
        height: 70,
        state: 'idle',
        timer: 1.8,
        cycleTime: 2.8,
        warningDuration: 0.7,
        activeDuration: 1.1,
        direction: 'up',
      },
      {
        id: 'fj3',
        type: 'fire_jet',
        x: 1580,
        y: 370,
        width: 36,
        height: 70,
        state: 'idle',
        timer: 1.0,
        cycleTime: 2.6,
        warningDuration: 0.6,
        activeDuration: 1.0,
        direction: 'up',
      },

      // Moving Saw Blade rolling along exit hall
      {
        id: 'saw1',
        type: 'saw_blade',
        x: 2260,
        y: 504,
        width: 26,
        height: 26,
        radius: 13,
        minX: 2240,
        maxX: 2420,
        speed: 85,
        dir: 1,
        rotation: 0,
      },
    ],
    enemies: [
      // Kitsune 1 (Fast ground pouncer)
      {
        id: 'e1',
        type: 'kitsune',
        name: 'Cáo Lửa Hỏa Linh',
        hp: 40,
        maxHp: 40,
        x: 960,
        y: 350,
        width: 26,
        height: 22,
        vx: 50,
        vy: 0,
        facing: 'right',
        state: 'patrol',
        patrolMinX: 930,
        patrolMaxX: 1070,
        speed: 60,
        attackTimer: 0,
        attackCooldown: 2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
      // Bat in wall jump shaft
      {
        id: 'e2',
        type: 'bat',
        name: 'Dơi Nham Thạch',
        hp: 25,
        maxHp: 25,
        x: 2030,
        y: 320,
        width: 24,
        height: 18,
        vx: 0,
        vy: 45,
        facing: 'left',
        state: 'patrol',
        patrolMinX: 1990,
        patrolMaxX: 2070,
        speed: 45,
        attackTimer: 0,
        attackCooldown: 2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },
    ],
    collectibles: [
      { id: 'sc1', type: 'scroll', x: 640, y: 350, width: 16, height: 20, collected: false, floatOffset: 0 },
      { id: 'sc2', type: 'scroll', x: 1300, y: 320, width: 16, height: 20, collected: false, floatOffset: 1 },
      { id: 'sc3', type: 'scroll', x: 2030, y: 160, width: 16, height: 20, collected: false, floatOffset: 2 },

      { id: 'og1', type: 'onigiri', x: 1680, y: 400, width: 16, height: 16, collected: false, floatOffset: 0.5 },
      { id: 'sh1', type: 'shuriken_pack', x: 1020, y: 340, width: 16, height: 16, collected: false, floatOffset: 1.5 },
      { id: 'c1', type: 'coin', x: 800, y: 420, width: 12, height: 12, collected: false, floatOffset: 0.3 },
      { id: 'c2', type: 'coin', x: 1420, y: 340, width: 12, height: 12, collected: false, floatOffset: 0.9 },
    ],
    theme: 'cavern',
  },

  // -------------------------------------------------------------
  // MÀN 4: ĐẠI THI TỐT NGHIỆP: THÁP NHẪN GIẢ (Graduation Exam: Shinobi Tower)
  // -------------------------------------------------------------
  {
    id: 4,
    name: 'Đại Thi Tốt Nghiệp: Tháp Nhẫn Giả',
    japaneseTitle: '卒業試験・忍の塔',
    subtitle: 'Thử thách đỉnh cao: Vượt chướng ngại liên hoàn & Đấu trùm Thầy Ryu',
    description: 'Kỳ thi tốt nghiệp nhẫn giả tại đỉnh Tháp Làng Gió. Vượt qua mọi cạm bẫy phối hợp và chiến thắng Đại Sư Ryu để nhận ấn danh hiệu Thượng Nhẫn (Jonin)!',
    parTime: 90,
    width: 2800,
    height: 700,
    playerSpawn: { x: 70, y: 520 },
    exitGate: { x: 2680, y: 470, width: 48, height: 64 },
    platforms: [
      // Starting deck
      { id: 'g1', type: 'solid', x: 0, y: 580, width: 300, height: 120 },

      // Multi-tier pagoda climb
      { id: 'p1', type: 'bamboo', x: 360, y: 510, width: 80, height: 14 },
      { id: 'p2', type: 'bamboo', x: 480, y: 440, width: 80, height: 14 },
      { id: 'p3', type: 'bamboo', x: 600, y: 370, width: 80, height: 14 },

      // Spring to upper pagoda roof
      { id: 'sp1', type: 'spring', x: 730, y: 568, width: 32, height: 12 },
      { id: 'g2', type: 'solid', x: 700, y: 580, width: 120, height: 120 },

      // Pagoda Upper Ridge
      { id: 'roof1', type: 'solid', x: 860, y: 280, width: 340, height: 20 },

      // Crumbling descent
      { id: 'cr1', type: 'crumbling', x: 1250, y: 320, width: 60, height: 14 },
      { id: 'cr2', type: 'crumbling', x: 1350, y: 370, width: 60, height: 14 },
      { id: 'cr3', type: 'crumbling', x: 1450, y: 420, width: 60, height: 14 },

      // Grand Arena for Boss Battle
      { id: 'arena_floor', type: 'solid', x: 1600, y: 540, width: 1200, height: 160 },

      // Boss Arena tactical platforms
      { id: 'a_plat1', type: 'bamboo', x: 1750, y: 430, width: 100, height: 14 },
      { id: 'a_plat2', type: 'bamboo', x: 2000, y: 360, width: 120, height: 14 },
      { id: 'a_plat3', type: 'bamboo', x: 2280, y: 430, width: 100, height: 14 },
    ],
    hazards: [
      // Spike ground below pagoda climb
      { id: 'spk1', type: 'spike', x: 300, y: 640, width: 400, height: 60, orientation: 'up' },

      // Swinging pendulum on the pagoda roof
      {
        id: 'pen1',
        type: 'pendulum',
        x: 1020,
        y: 100,
        width: 32,
        height: 32,
        pivotX: 1020,
        pivotY: 100,
        length: 160,
        angle: 0.9,
        maxAngle: 0.95,
        speed: 2.2,
        bladeRadius: 16,
      },

      // Spike pit below crumbling descent
      { id: 'spk2', type: 'spike', x: 1200, y: 640, width: 400, height: 60, orientation: 'up' },

      // Dart launcher in roof corridor
      {
        id: 'arr1',
        type: 'arrow_trap',
        x: 1200,
        y: 260,
        width: 20,
        height: 24,
        shootDir: -1,
        interval: 2.0,
        timer: 0.8,
      },
    ],
    enemies: [
      // Bandit patrol on roof
      {
        id: 'e1',
        type: 'bandit',
        name: 'Trợ Giảng Hắc Ám',
        hp: 50,
        maxHp: 50,
        x: 940,
        y: 245,
        width: 20,
        height: 34,
        vx: 35,
        vy: 0,
        facing: 'right',
        state: 'patrol',
        patrolMinX: 880,
        patrolMaxX: 1060,
        speed: 40,
        attackTimer: 0,
        attackCooldown: 2.2,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
      },

      // GRAND BOSS: MASTER RYU
      {
        id: 'boss1',
        type: 'boss_ryu',
        name: 'Đại Sư Ryu',
        hp: 250,
        maxHp: 250,
        x: 2150,
        y: 490,
        width: 28,
        height: 48,
        vx: -60,
        vy: 0,
        facing: 'left',
        state: 'patrol',
        patrolMinX: 1720,
        patrolMaxX: 2450,
        speed: 65,
        attackTimer: 0,
        attackCooldown: 2.5,
        telegraphTimer: 0,
        isDead: false,
        deadTimer: 0,
        animTimer: 0,
        animFrame: 0,
        bossPhase: 1,
        bossSpecialTimer: 4.0,
      },
    ],
    collectibles: [
      { id: 'sc1', type: 'scroll', x: 500, y: 390, width: 16, height: 20, collected: false, floatOffset: 0 },
      { id: 'sc2', type: 'scroll', x: 1020, y: 220, width: 16, height: 20, collected: false, floatOffset: 1 },
      { id: 'sc3', type: 'scroll', x: 2050, y: 310, width: 16, height: 20, collected: false, floatOffset: 2 },

      { id: 'og1', type: 'onigiri', x: 880, y: 240, width: 16, height: 16, collected: false, floatOffset: 0.5 },
      { id: 'og2', type: 'onigiri', x: 1780, y: 390, width: 16, height: 16, collected: false, floatOffset: 1.0 },
      { id: 'sh1', type: 'shuriken_pack', x: 1980, y: 320, width: 16, height: 16, collected: false, floatOffset: 1.5 },
      { id: 'sh2', type: 'shuriken_pack', x: 2300, y: 390, width: 16, height: 16, collected: false, floatOffset: 2.0 },
    ],
    theme: 'pagoda',
  },
];
