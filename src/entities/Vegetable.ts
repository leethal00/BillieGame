import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export type VegetableType = 'CARROT' | 'LETTUCE' | 'PEPPER' | 'BROCCOLI';

export class Vegetable {
  public sprite: Phaser.GameObjects.Sprite;
  public body: Phaser.Physics.Arcade.Body;
  public type: VegetableType;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, type: VegetableType) {
    this.scene = scene;
    this.type = type;

    // Create vegetable sprite using generated textures
    const textureKey = this.getTextureKey(type);
    this.sprite = scene.add.sprite(x, y, textureKey);
    this.sprite.setOrigin(0.5, 0.5);

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setImmovable(true);
    this.body.setSize(this.sprite.width * 0.6, this.sprite.height * 0.6);

    // Idle animation (bob up and down + rotate slightly)
    scene.tweens.add({
      targets: this.sprite,
      y: y - 8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    scene.tweens.add({
      targets: this.sprite,
      angle: -5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private getTextureKey(type: VegetableType): string {
    return `vegetable-${type.toLowerCase()}`;
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
