import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';

export type HazardType = 'BOMB' | 'DYNAMITE';

export class Hazard {
  public sprite: Phaser.GameObjects.Sprite;
  public body: Phaser.Physics.Arcade.Body;
  public type: HazardType;
  private scene: Phaser.Scene;
  private fuseTimer?: Phaser.Time.TimerEvent;
  public isActive: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, type: HazardType) {
    this.scene = scene;
    this.type = type;

    // Create hazard sprite using generated textures
    const textureKey = this.getTextureKey(type);
    this.sprite = scene.add.sprite(x, y, textureKey);
    this.sprite.setOrigin(0.5, 0.5);

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.7);
    this.body.setImmovable(true);

    // Start fuse timer for dynamite
    if (type === 'DYNAMITE') {
      this.startFuse();
    }
  }

  private getTextureKey(type: HazardType): string {
    return `hazard-${type.toLowerCase()}`;
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

    // Create explosion effect using particles
    const explosionRadius = this.getRadius();

    // Multiple expanding circles for better explosion effect
    for (let i = 0; i < 3; i++) {
      const delay = i * 100;
      this.scene.time.delayedCall(delay, () => {
        const explosion = this.scene.add.circle(
          this.sprite.x,
          this.sprite.y,
          0,
          i === 0 ? 0xff6600 : (i === 1 ? 0xffaa00 : 0xffdd44),
          0.8 - i * 0.2
        );

        this.scene.tweens.add({
          targets: explosion,
          radius: explosionRadius * (1 - i * 0.2),
          alpha: 0,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            explosion.destroy();
          }
        });
      });
    }

    // Shake camera
    this.scene.cameras.main.shake(200, 0.015);

    // Hide the hazard sprite
    this.sprite.setVisible(false);
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
