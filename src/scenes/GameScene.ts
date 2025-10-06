import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Vegetable } from '../entities/Vegetable';
import { Hazard } from '../entities/Hazard';
import { Obstacle } from '../entities/Obstacle';
import { Collectible } from '../entities/Collectible';
import { LevelManager } from '../systems/LevelManager';
import { GAME_CONSTANTS } from '../config';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  private vegetables: Vegetable[] = [];
  private hazards: Hazard[] = [];
  private obstacles: Obstacle[] = [];
  private collectibles: Collectible[] = [];

  private levelManager!: LevelManager;
  private keysCollected: number = 0;
  private coinsCollected: number = 0;
  private score: number = 0;
  private startTime: number = 0;

  // UI Elements
  private healthText!: Phaser.GameObjects.Text;
  private sizeText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private keysText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private healthBar!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Initialize level manager
    this.levelManager = new LevelManager();
    this.startTime = Date.now();

    // Create cage background
    this.createBackground();

    // Add cage bars (visual)
    this.createCageBars();

    // Create player
    this.player = new Player(this, width / 2, height / 2);

    // Setup controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Create UI
    this.createUI();

    // Load first level
    this.loadLevel();
  }

  private createBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create cage background with wood texture
    const cage = this.add.rectangle(0, 0, width, height, 0x8b7355);
    cage.setOrigin(0, 0);

    // Add some straw/bedding visual effect
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const straw = this.add.rectangle(x, y, Phaser.Math.Between(20, 50), 2, 0xdaa520, 0.3);
      straw.setRotation(Phaser.Math.FloatBetween(0, Math.PI));
    }
  }

  private createCageBars(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const barWidth = 10;
    const spacing = 50;

    // Vertical bars
    for (let x = 0; x < width; x += spacing) {
      const bar = this.add.rectangle(x, 0, barWidth, height, 0x4a4a4a);
      bar.setOrigin(0, 0);
      bar.setDepth(100);

      const highlight = this.add.rectangle(x + 2, 0, 2, height, 0x666666, 0.5);
      highlight.setOrigin(0, 0);
      highlight.setDepth(100);
    }

    // Horizontal bars (top and bottom)
    const topBar = this.add.rectangle(0, 0, width, 25, 0x3a3a3a);
    topBar.setOrigin(0, 0);
    topBar.setDepth(100);

    const bottomBar = this.add.rectangle(0, height - 25, width, 25, 0x3a3a3a);
    bottomBar.setOrigin(0, 0);
    bottomBar.setDepth(100);

    // Exit zone
    const exitZone = this.add.rectangle(width - 100, 5, 80, 40, 0x00ff00, 0.2);
    exitZone.setStrokeStyle(3, 0x00ff00);
    exitZone.setDepth(100);

    const exitText = this.add.text(width - 60, 25, 'EXIT', {
      font: 'bold 16px Arial',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    });
    exitText.setOrigin(0.5);
    exitText.setDepth(100);

    this.tweens.add({
      targets: [exitZone, exitText],
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  private createUI(): void {
    // Health bar
    const healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000);
    healthBarBg.setOrigin(0, 0);
    healthBarBg.setDepth(1000);

    this.healthBar = this.add.rectangle(22, 22, 196, 16, 0x00ff00);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(1000);

    // Text UI
    this.healthText = this.add.text(20, 48, 'Health: 100', {
      font: '14px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.healthText.setDepth(1000);

    this.sizeText = this.add.text(20, 68, 'Size: Small', {
      font: '14px Arial',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.sizeText.setDepth(1000);

    this.levelText = this.add.text(400, 20, 'Level 1', {
      font: 'bold 20px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setDepth(1000);

    this.keysText = this.add.text(250, 20, '🔑 Keys: 0', {
      font: '16px Arial',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.keysText.setDepth(1000);

    this.coinsText = this.add.text(250, 45, '🪙 Coins: 0', {
      font: '16px Arial',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.coinsText.setDepth(1000);

    this.scoreText = this.add.text(550, 20, 'Score: 0', {
      font: '16px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.scoreText.setDepth(1000);

    this.timerText = this.add.text(550, 45, 'Time: 0:00', {
      font: '16px Arial',
      color: '#00ffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.timerText.setDepth(1000);
  }

  private loadLevel(): void {
    // Clear existing entities
    this.vegetables.forEach(v => v.destroy());
    this.hazards.forEach(h => h.destroy());
    this.obstacles.forEach(o => o.destroy());
    this.collectibles.forEach(c => c.destroy());

    this.vegetables = [];
    this.hazards = [];
    this.obstacles = [];
    this.collectibles = [];
    this.keysCollected = 0;

    const level = this.levelManager.getCurrentLevel();

    // Show level intro
    this.showLevelIntro(level.name, level.description);

    // Spawn vegetables
    level.vegetables.forEach(v => {
      const veg = new Vegetable(this, v.x, v.y, v.type);
      this.vegetables.push(veg);
    });

    // Spawn hazards
    level.hazards.forEach(h => {
      const hazard = new Hazard(this, h.x, h.y, h.type);
      this.hazards.push(hazard);
    });

    // Spawn obstacles
    level.obstacles.forEach(o => {
      const obstacle = new Obstacle(this, o.x, o.y, o.width, o.height, o.type);
      this.obstacles.push(obstacle);
      this.physics.add.collider(this.player.sprite, obstacle.sprite);
    });

    // Spawn collectibles
    level.collectibles.forEach(c => {
      const collectible = new Collectible(this, c.x, c.y, c.type);
      this.collectibles.push(collectible);
    });

    // Update UI
    this.levelText.setText(`Level ${this.levelManager.getCurrentLevelNumber()}`);
  }

  private showLevelIntro(name: string, description: string): void {
    const bg = this.add.rectangle(400, 300, 600, 200, 0x000000, 0.8);
    bg.setDepth(2000);

    const nameText = this.add.text(400, 260, name, {
      font: 'bold 32px Arial',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 5
    });
    nameText.setOrigin(0.5);
    nameText.setDepth(2000);

    const descText = this.add.text(400, 320, description, {
      font: '20px Arial',
      color: '#ffffff'
    });
    descText.setOrigin(0.5);
    descText.setDepth(2000);

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: [bg, nameText, descText],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          bg.destroy();
          nameText.destroy();
          descText.destroy();
        }
      });
    });
  }

  update(time: number, delta: number): void {
    // Handle player movement
    const input = {
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown,
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown
    };

    this.player.update(input);

    // Check vegetable collisions
    this.checkVegetableCollisions();

    // Check hazard collisions
    this.checkHazardCollisions();

    // Check collectible collisions
    this.checkCollectibleCollisions();

    // Check win condition
    this.checkWinCondition();

    // Update UI
    this.updateUI();
  }

  private checkVegetableCollisions(): void {
    const playerPos = this.player.getPosition();
    const playerRadius = 15 + (this.player.size - 1) * 10;

    this.vegetables.forEach((veg, index) => {
      const dx = veg.sprite.x - playerPos.x;
      const dy = veg.sprite.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius + 15) {
        const stats = veg.getStats();
        this.player.grow(stats.growth);
        this.player.heal(stats.health);

        if ('speedBoost' in stats && stats.speedBoost) {
          this.player.applySpeedBoost(stats.speedBoost, stats.duration!);
        }

        this.score += 50;
        veg.collect();
        this.vegetables.splice(index, 1);
      }
    });
  }

  private checkHazardCollisions(): void {
    const playerPos = this.player.getPosition();
    const playerRadius = 15 + (this.player.size - 1) * 10;

    this.hazards.forEach((hazard, index) => {
      if (!hazard.isActive) return;

      const dx = hazard.sprite.x - playerPos.x;
      const dy = hazard.sprite.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const hazardRadius = hazard.type === 'BOMB' ? 20 : 25;

      if (distance < playerRadius + hazardRadius) {
        const damage = hazard.trigger();
        this.player.takeDamage(damage);
        this.hazards.splice(index, 1);

        if (this.player.health <= 0) {
          this.gameOver();
        }
      }
    });
  }

  private checkCollectibleCollisions(): void {
    const playerPos = this.player.getPosition();
    const playerRadius = 15 + (this.player.size - 1) * 10;

    this.collectibles.forEach((col, index) => {
      const dx = col.sprite.x - playerPos.x;
      const dy = col.sprite.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius + 15) {
        if (col.type === 'KEY') {
          this.keysCollected++;
          this.unlockNearestCrate(playerPos);
          this.score += 100;
        } else if (col.type === 'COIN') {
          this.coinsCollected++;
          this.score += 25;
        } else if (col.type === 'STAR') {
          this.score += 200;
        }

        col.collect();
        this.collectibles.splice(index, 1);
      }
    });
  }

  private unlockNearestCrate(playerPos: { x: number; y: number }): void {
    const lockedCrates = this.obstacles.filter(obs => obs.type === 'LOCKED_CRATE' && obs.isLocked);

    if (lockedCrates.length === 0) return;

    let nearestCrate = lockedCrates[0];
    let nearestDist = Infinity;

    lockedCrates.forEach(crate => {
      const dx = crate.sprite.x - playerPos.x;
      const dy = crate.sprite.y - playerPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestCrate = crate;
      }
    });

    nearestCrate.unlock();
    this.obstacles = this.obstacles.filter(o => o !== nearestCrate);
  }

  private checkWinCondition(): void {
    const level = this.levelManager.getCurrentLevel();

    if (this.player.canEscape() && this.player.size >= level.requiredSize) {
      const playerPos = this.player.getPosition();
      const width = this.cameras.main.width;

      if (playerPos.x > width - 100 && playerPos.y < 50) {
        this.nextLevel();
      }
    }
  }

  private nextLevel(): void {
    this.score += 500;
    const hasNext = this.levelManager.nextLevel();

    if (hasNext) {
      this.loadLevel();
    } else {
      this.gameWin();
    }
  }

  private gameOver(): void {
    const bg = this.add.rectangle(400, 300, 600, 300, 0x000000, 0.9);
    bg.setDepth(3000);

    const gameOverText = this.add.text(400, 250, 'GAME OVER', {
      font: 'bold 64px Arial',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(3000);

    const finalScore = this.add.text(400, 330, `Final Score: ${this.score}`, {
      font: '24px Arial',
      color: '#ffffff'
    });
    finalScore.setOrigin(0.5);
    finalScore.setDepth(3000);

    const restartText = this.add.text(400, 380, 'Press ENTER to restart', {
      font: '20px Arial',
      color: '#00ff00'
    });
    restartText.setOrigin(0.5);
    restartText.setDepth(3000);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.restart();
    });
  }

  private gameWin(): void {
    const bg = this.add.rectangle(400, 300, 700, 400, 0x000000, 0.9);
    bg.setDepth(3000);

    const winText = this.add.text(400, 200, 'YOU ESCAPED!', {
      font: 'bold 72px Arial',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 8
    });
    winText.setOrigin(0.5);
    winText.setDepth(3000);

    const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    const statsText = this.add.text(400, 300,
      `Final Score: ${this.score}\nTime: ${minutes}:${seconds.toString().padStart(2, '0')}\nCoins: ${this.coinsCollected}`, {
      font: '24px Arial',
      color: '#ffdd00',
      align: 'center',
      lineSpacing: 10
    });
    statsText.setOrigin(0.5);
    statsText.setDepth(3000);

    const playAgainText = this.add.text(400, 420, 'Press ENTER to play again', {
      font: '20px Arial',
      color: '#00ffff'
    });
    playAgainText.setOrigin(0.5);
    playAgainText.setDepth(3000);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.restart();
    });
  }

  private updateUI(): void {
    // Health
    const healthPercent = Math.max(0, this.player.health / GAME_CONSTANTS.PLAYER.INITIAL_HEALTH);
    this.healthBar.width = 196 * healthPercent;
    this.healthBar.fillColor = healthPercent > 0.5 ? 0x00ff00 : (healthPercent > 0.25 ? 0xffaa00 : 0xff0000);
    this.healthText.setText(`Health: ${Math.round(this.player.health)}`);

    // Size
    const sizeNames = ['Tiny', 'Small', 'Medium', 'Large', 'HUGE'];
    const sizeIndex = Math.min(Math.floor(this.player.size), sizeNames.length - 1);
    this.sizeText.setText(`Size: ${sizeNames[sizeIndex]} (${this.player.size.toFixed(1)})`);

    // Keys and coins
    this.keysText.setText(`🔑 Keys: ${this.keysCollected}`);
    this.coinsText.setText(`🪙 Coins: ${this.coinsCollected}`);

    // Score
    this.scoreText.setText(`Score: ${this.score}`);

    // Timer
    const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
  }
}
