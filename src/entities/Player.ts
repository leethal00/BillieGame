import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export class Player {
  public sprite: Phaser.GameObjects.Arc;
  public body: Phaser.Physics.Arcade.Body;
  public health: number;
  public size: number;
  private scene: Phaser.Scene;
  private speedBoostMultiplier: number = 1;
  private speedBoostTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.health = GAME_CONSTANTS.PLAYER.INITIAL_HEALTH;
    this.size = GAME_CONSTANTS.PLAYER.INITIAL_SIZE;

    // Create player sprite (circle for now - will replace with actual sprite)
    this.sprite = scene.add.circle(x, y, this.getRadius(), 0xff9966);
    this.sprite.setStrokeStyle(2, 0x000000);

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
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
    } else if (input.right) {
      this.body.setVelocityX(speed);
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
  }

  public grow(amount: number): void {
    this.size += amount;
    this.size = Math.min(this.size, GAME_CONSTANTS.PLAYER.ESCAPE_SIZE);

    // Update visual size
    this.sprite.setRadius(this.getRadius());
    this.body.setCircle(this.getRadius());

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
    this.sprite.setFillStyle(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.sprite.setFillStyle(0xff9966);
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  public applySpeedBoost(multiplier: number, duration: number): void {
    this.speedBoostMultiplier = multiplier;

    // Clear existing boost timer if any
    if (this.speedBoostTimer) {
      this.speedBoostTimer.destroy();
    }

    // Set new timer
    this.speedBoostTimer = this.scene.time.delayedCall(duration, () => {
      this.speedBoostMultiplier = 1;
    });

    // Visual feedback (yellow tint for speed boost)
    this.sprite.setFillStyle(0xffff00);
    this.scene.time.delayedCall(duration, () => {
      this.sprite.setFillStyle(0xff9966);
    });
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
