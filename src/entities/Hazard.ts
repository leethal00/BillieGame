import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export type HazardType = 'BOMB' | 'DYNAMITE';

export class Hazard {
  public sprite: Phaser.GameObjects.Graphics;
  public body: Phaser.Physics.Arcade.Body;
  public type: HazardType;
  private scene: Phaser.Scene;
  private fuseTimer?: Phaser.Time.TimerEvent;
  public isActive: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, type: HazardType) {
    this.scene = scene;
    this.type = type;

    // Create hazard sprite (graphics for now)
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.drawHazard();

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(this.getRadius());
    this.body.setImmovable(true);

    // Start fuse timer for dynamite
    if (type === 'DYNAMITE') {
      this.startFuse();
    }
  }

  private getRadius(): number {
    return this.type === 'BOMB' ?
      GAME_CONSTANTS.HAZARDS.BOMB.radius :
      GAME_CONSTANTS.HAZARDS.DYNAMITE.radius;
  }

  private getDamage(): number {
    return this.type === 'BOMB' ?
      GAME_CONSTANTS.HAZARDS.BOMB.damage :
      GAME_CONSTANTS.HAZARDS.DYNAMITE.damage;
  }

  private drawHazard(): void {
    this.sprite.clear();

    if (this.type === 'BOMB') {
      // Draw bomb (black circle)
      this.sprite.fillStyle(0x000000);
      this.sprite.fillCircle(0, 0, 12);
      this.sprite.lineStyle(2, 0x666666);
      this.sprite.strokeCircle(0, 0, 12);
    } else {
      // Draw dynamite (red rectangle with fuse)
      this.sprite.fillStyle(0xff0000);
      this.sprite.fillRect(-8, -12, 16, 24);
      this.sprite.lineStyle(2, 0x000000);
      this.sprite.strokeRect(-8, -12, 16, 24);

      // Fuse
      this.sprite.lineStyle(2, 0x000000);
      this.sprite.lineBetween(0, -12, 0, -20);
    }
  }

  private startFuse(): void {
    const fuseTime = GAME_CONSTANTS.HAZARDS.DYNAMITE.fuseTime;

    // Blinking animation
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      yoyo: true,
      repeat: Math.floor(fuseTime / 600)
    });

    // Explode after fuse time
    this.fuseTimer = this.scene.time.delayedCall(fuseTime, () => {
      this.explode();
    });
  }

  public explode(): void {
    if (!this.isActive) return;

    this.isActive = false;

    // Create explosion effect
    const explosionRadius = this.getRadius();
    const explosion = this.scene.add.circle(
      this.sprite.x,
      this.sprite.y,
      0,
      0xff6600,
      0.7
    );

    this.scene.tweens.add({
      targets: explosion,
      radius: explosionRadius,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        explosion.destroy();
      }
    });

    // Shake camera
    this.scene.cameras.main.shake(200, 0.01);

    // Will be used for damage detection in GameScene
  }

  public trigger(): number {
    if (!this.isActive) return 0;

    this.explode();
    this.destroy();
    return this.getDamage();
  }

  public destroy(): void {
    if (this.fuseTimer) {
      this.fuseTimer.destroy();
    }
    this.sprite.destroy();
  }
}
