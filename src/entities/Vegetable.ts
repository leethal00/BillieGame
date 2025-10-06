import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export type VegetableType = 'CARROT' | 'LETTUCE' | 'PEPPER' | 'BROCCOLI';

export class Vegetable {
  public sprite: Phaser.GameObjects.Arc;
  public body: Phaser.Physics.Arcade.Body;
  public type: VegetableType;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, type: VegetableType) {
    this.scene = scene;
    this.type = type;

    // Create vegetable sprite (colored circles for now)
    const color = this.getColor(type);
    this.sprite = scene.add.circle(x, y, 8, color);
    this.sprite.setStrokeStyle(1, 0x000000);

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setImmovable(true);

    // Idle animation (bob up and down)
    scene.tweens.add({
      targets: this.sprite,
      y: y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private getColor(type: VegetableType): number {
    switch (type) {
      case 'CARROT':
        return 0xff6600; // Orange
      case 'LETTUCE':
        return 0x00ff00; // Green
      case 'PEPPER':
        return 0xff0000; // Red
      case 'BROCCOLI':
        return 0x228b22; // Dark green
      default:
        return 0xffffff;
    }
  }

  public collect(): void {
    // Collect animation
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  public getStats() {
    return GAME_CONSTANTS.VEGETABLES[this.type];
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
