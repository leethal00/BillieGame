import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export class Player {
  public sprite: Phaser.GameObjects.Sprite;
  public body: Phaser.Physics.Arcade.Body;
  public health: number;
  public size: number;
  private scene: Phaser.Scene;
  private speedBoostMultiplier: number = 1;
  private speedBoostTimer?: Phaser.Time.TimerEvent;
  private normalTint: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.health = GAME_CONSTANTS.PLAYER.INITIAL_HEALTH;
    this.size = GAME_CONSTANTS.PLAYER.INITIAL_SIZE;

    // Create player sprite using generated guinea pig texture
    this.sprite = scene.add.sprite(x, y, this.getSpriteKey());
    this.sprite.setOrigin(0.5, 0.5);

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.7);
  }

  private getSpriteKey(): string {
    if (this.size < 1.5) return 'guineapig-idle-1';
    if (this.size < 2) return 'guineapig-idle-1.5';
    if (this.size < 2.5) return 'guineapig-idle-2';
    return 'guineapig-idle-2.5';
  }

  private getRadius(): number {
    return 15 + (this.size - 1) * 10;
  }

  public update(input: { left: boolean; right: boolean; up: boolean; down: boolean }): void {
    const speed = GAME_CONSTANTS.PLAYER.SPEED_BASE * this.speedBoostMultiplier;

    // Reset velocity
    this.body.setVelocity(0, 0);

    // Apply movement
    if (input.left) {
      this.body.setVelocityX(-speed);
      this.sprite.setFlipX(true); // Face left
    } else if (input.right) {
      this.body.setVelocityX(speed);
      this.sprite.setFlipX(false); // Face right
    }

    if (input.up) {
      this.body.setVelocityY(-speed);
    } else if (input.down) {
      this.body.setVelocityY(speed);
    }

    // Normalize diagonal movement
    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.normalize().scale(speed);
    }

    // Add subtle bouncing animation when moving
    if (this.body.velocity.length() > 0) {
      const bounce = Math.sin(Date.now() / 100) * 2;
      this.sprite.y = this.body.y + bounce;
    }
  }

  public grow(amount: number): void {
    const oldSize = this.size;
    this.size += amount;
    this.size = Math.min(this.size, GAME_CONSTANTS.PLAYER.ESCAPE_SIZE);

    // Update sprite texture if size threshold crossed
    const oldKey = this.getSpriteKey();
    const newKey = this.getSpriteKey();
    if (oldKey !== newKey) {
      this.sprite.setTexture(newKey);
      this.body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.7);
    }

    // Visual feedback
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  public heal(amount: number): void {
    this.health = Math.min(this.health + amount, GAME_CONSTANTS.PLAYER.INITIAL_HEALTH);
  }

  public takeDamage(amount: number): void {
    this.health -= amount;

    // Flash red when damaged
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.normalTint) {
        this.sprite.clearTint();
      } else {
        this.sprite.setTint(0xffff00);
      }
    });

    // Shake sprite
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + 5,
      duration: 50,
      yoyo: true,
      repeat: 2
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  public applySpeedBoost(multiplier: number, duration: number): void {
    this.speedBoostMultiplier = multiplier;
    this.normalTint = false;

    // Clear existing boost timer if any
    if (this.speedBoostTimer) {
      this.speedBoostTimer.destroy();
    }

    // Set new timer
    this.speedBoostTimer = this.scene.time.delayedCall(duration, () => {
      this.speedBoostMultiplier = 1;
      this.normalTint = true;
      this.sprite.clearTint();
    });

    // Visual feedback (yellow tint for speed boost)
    this.sprite.setTint(0xffff00);
  }

  public canEscape(): boolean {
    return this.size >= GAME_CONSTANTS.PLAYER.ESCAPE_SIZE;
  }

  private die(): void {
    // TODO: Implement game over logic
    console.log('Player died!');
    this.sprite.setVisible(false);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
