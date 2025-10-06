import Phaser from 'phaser';

export type PowerUpType = 'SHIELD' | 'SPEED' | 'INVINCIBILITY' | 'MEGA_GROWTH' | 'FREEZE_ENEMIES';

export class PowerUp {
  public sprite: Phaser.GameObjects.Graphics;
  public body: Phaser.Physics.Arcade.Body;
  public type: PowerUpType;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    this.scene = scene;
    this.type = type;

    // Create power-up sprite
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.drawPowerUp();

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(12);
    this.body.setImmovable(true);

    // Floating and glowing animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    scene.tweens.add({
      targets: this.sprite,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    // Pulsing glow effect
    scene.tweens.add({
      targets: this.sprite,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private drawPowerUp(): void {
    this.sprite.clear();

    if (this.type === 'SHIELD') {
      // Blue glowing shield
      this.sprite.lineStyle(4, 0x00ccff, 1);
      this.sprite.strokeCircle(0, 0, 12);
      this.sprite.lineStyle(2, 0x66ddff, 1);
      this.sprite.strokeCircle(0, 0, 8);
      this.sprite.fillStyle(0x00ccff, 0.3);
      this.sprite.fillCircle(0, 0, 10);
    } else if (this.type === 'SPEED') {
      // Lightning bolt
      this.sprite.fillStyle(0xffff00, 1);
      this.sprite.fillPoints([
        { x: 0, y: -12 },
        { x: -4, y: 0 },
        { x: 2, y: 0 },
        { x: -2, y: 12 },
        { x: 4, y: 0 },
        { x: -2, y: 0 }
      ] as any, true);
      this.sprite.lineStyle(2, 0xffa500, 1);
      this.sprite.strokePoints([
        { x: 0, y: -12 },
        { x: -4, y: 0 },
        { x: 2, y: 0 },
        { x: -2, y: 12 },
        { x: 4, y: 0 },
        { x: -2, y: 0 }
      ] as any, true);
    } else if (this.type === 'INVINCIBILITY') {
      // Rainbow star
      this.sprite.fillStyle(0xff00ff, 1);
      const points: number[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10 - Math.PI / 2;
        const radius = i % 2 === 0 ? 12 : 6;
        points.push(Math.cos(angle) * radius);
        points.push(Math.sin(angle) * radius);
      }
      this.sprite.fillPoints(points as any, true);
      this.sprite.lineStyle(2, 0xffff00, 1);
      this.sprite.strokePoints(points as any, true);
    } else if (this.type === 'MEGA_GROWTH') {
      // Growing spiral
      this.sprite.fillStyle(0x00ff00, 1);
      this.sprite.fillCircle(0, 0, 10);
      this.sprite.fillCircle(0, 0, 6);
      this.sprite.lineStyle(3, 0x00aa00, 1);
      this.sprite.strokeCircle(0, 0, 12);
      this.sprite.lineStyle(2, 0x00ff00, 1);
      this.sprite.strokeCircle(0, 0, 8);
      // Arrows pointing outward
      this.sprite.lineStyle(2, 0x00ff00, 1);
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 10;
        const y = Math.sin(angle) * 10;
        this.sprite.lineBetween(0, 0, x, y);
      }
    } else {
      // Freeze - snowflake
      this.sprite.lineStyle(3, 0x00ffff, 1);
      // Six spokes
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 12;
        const y = Math.sin(angle) * 12;
        this.sprite.lineBetween(0, 0, x, y);
      }
      this.sprite.fillStyle(0xaaffff, 1);
      this.sprite.fillCircle(0, 0, 4);
    }
  }

  public collect(): void {
    // Collect animation - explosive
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 3,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  private getColor(): number {
    switch (this.type) {
      case 'SHIELD': return 0x00ccff;
      case 'SPEED': return 0xffff00;
      case 'INVINCIBILITY': return 0xff00ff;
      case 'MEGA_GROWTH': return 0x00ff00;
      case 'FREEZE_ENEMIES': return 0x00ffff;
    }
  }

  public getDuration(): number {
    switch (this.type) {
      case 'SHIELD': return 8000;
      case 'SPEED': return 5000;
      case 'INVINCIBILITY': return 6000;
      case 'MEGA_GROWTH': return 0; // Instant
      case 'FREEZE_ENEMIES': return 4000;
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
