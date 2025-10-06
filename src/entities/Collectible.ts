import Phaser from 'phaser';

export type CollectibleType = 'KEY' | 'COIN' | 'STAR';

export class Collectible {
  public sprite: Phaser.GameObjects.Graphics;
  public body: Phaser.Physics.Arcade.Body;
  public type: CollectibleType;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, type: CollectibleType) {
    this.scene = scene;
    this.type = type;

    // Create collectible sprite
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.drawCollectible();

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(8);
    this.body.setImmovable(true);

    // Floating animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Rotation for coins and stars
    if (type !== 'KEY') {
      scene.tweens.add({
        targets: this.sprite,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  private drawCollectible(): void {
    this.sprite.clear();

    if (this.type === 'KEY') {
      // Draw key
      this.sprite.fillStyle(0xffd700, 1);
      this.sprite.fillCircle(0, -5, 5);
      this.sprite.fillRect(-2, -5, 4, 12);
      this.sprite.fillRect(2, 3, 6, 2);
      this.sprite.fillRect(2, 6, 4, 2);
      this.sprite.lineStyle(2, 0x000000);
      this.sprite.strokeCircle(0, -5, 5);
    } else if (this.type === 'COIN') {
      // Draw coin
      this.sprite.fillStyle(0xffd700, 1);
      this.sprite.fillCircle(0, 0, 8);
      this.sprite.fillStyle(0xffed4e, 1);
      this.sprite.fillCircle(0, 0, 6);
      this.sprite.lineStyle(2, 0xdaa520);
      this.sprite.strokeCircle(0, 0, 8);
    } else {
      // Draw star
      this.sprite.fillStyle(0xffff00, 1);
      const points: number[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10 - Math.PI / 2;
        const radius = i % 2 === 0 ? 10 : 5;
        points.push(Math.cos(angle) * radius);
        points.push(Math.sin(angle) * radius);
      }
      this.sprite.fillPoints(points as any, true);
      this.sprite.lineStyle(1, 0xffa500);
      this.sprite.strokePoints(points as any, true);
    }
  }

  public collect(): void {
    // Collect animation
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 2,
      alpha: 0,
      y: this.sprite.y - 30,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
