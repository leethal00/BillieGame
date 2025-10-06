import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Vegetable, VegetableType } from '../entities/Vegetable';
import { Hazard, HazardType } from '../entities/Hazard';
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
  private healthText!: Phaser.GameObjects.Text;
  private sizeText!: Phaser.GameObjects.Text;
  private vegetables: Vegetable[] = [];
  private hazards: Hazard[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create cage background
    const cage = this.add.rectangle(0, 0, width, height, 0x8b7355);
    cage.setOrigin(0, 0);

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

    // Spawn game objects
    this.spawnLevel();
  }

  private createCageBars(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const barWidth = 8;
    const spacing = 40;

    // Vertical bars
    for (let x = 0; x < width; x += spacing) {
      const bar = this.add.rectangle(x, 0, barWidth, height, 0x4a4a4a);
      bar.setOrigin(0, 0);
    }

    // Horizontal bars (top and bottom)
    this.add.rectangle(0, 0, width, 20, 0x4a4a4a).setOrigin(0, 0);
    this.add.rectangle(0, height - 20, width, 20, 0x4a4a4a).setOrigin(0, 0);

    // Exit zone (top right - will unlock when big enough)
    const exitZone = this.add.rectangle(width - 80, 10, 60, 40, 0x00ff00, 0.3);
    exitZone.setStrokeStyle(2, 0x00ff00);
    this.add.text(width - 80, 30, 'EXIT', {
      font: 'bold 12px Arial',
      color: '#00ff00'
    }).setOrigin(0.5);
  }

  private createUI(): void {
    // Health bar background
    const healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000);
    healthBarBg.setOrigin(0, 0);

    // Health bar (will update in update loop)
    this.healthText = this.add.text(20, 50, 'Health: 100', {
      font: '16px Arial',
      color: '#ffffff'
    });

    // Size meter
    this.sizeText = this.add.text(20, 75, 'Size: Small', {
      font: '16px Arial',
      color: '#ffdd00'
    });
  }

  private spawnLevel(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Spawn vegetables
    const vegTypes: VegetableType[] = ['CARROT', 'CARROT', 'LETTUCE', 'LETTUCE', 'PEPPER', 'BROCCOLI'];
    vegTypes.forEach((type, i) => {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(100, height - 100);
      const veg = new Vegetable(this, x, y, type);
      this.vegetables.push(veg);
    });

    // Spawn hazards
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(150, height - 150);
      const hazard = new Hazard(this, x, y, 'BOMB');
      this.hazards.push(hazard);
    }

    // Spawn one dynamite
    const dynamite = new Hazard(this, width / 2, height - 200, 'DYNAMITE');
    this.hazards.push(dynamite);
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

      if (distance < playerRadius + 8) {
        // Collect vegetable
        const stats = veg.getStats();
        this.player.grow(stats.growth);
        this.player.heal(stats.health);

        if ('speedBoost' in stats && stats.speedBoost) {
          this.player.applySpeedBoost(stats.speedBoost, stats.duration!);
        }

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

  private checkWinCondition(): void {
    if (this.player.canEscape()) {
      const playerPos = this.player.getPosition();
      const width = this.cameras.main.width;

      // Check if player is near exit zone (top right)
      if (playerPos.x > width - 100 && playerPos.y < 50) {
        this.win();
      }
    }
  }

  private gameOver(): void {
    this.add.text(400, 300, 'GAME OVER', {
      font: 'bold 64px Arial',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(400, 370, 'Press ENTER to restart', {
      font: '24px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.restart();
    });
  }

  private win(): void {
    this.add.text(400, 300, 'YOU ESCAPED!', {
      font: 'bold 64px Arial',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(400, 370, 'Press ENTER to play again', {
      font: '24px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.restart();
    });
  }

  private updateUI(): void {
    this.healthText.setText(`Health: ${Math.round(this.player.health)}`);

    const sizeNames = ['Tiny', 'Small', 'Medium', 'Large', 'HUGE'];
    const sizeIndex = Math.min(Math.floor(this.player.size), sizeNames.length - 1);
    this.sizeText.setText(`Size: ${sizeNames[sizeIndex]} (${this.player.size.toFixed(2)})`);
  }
}
