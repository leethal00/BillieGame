import Phaser from 'phaser';

export type ObstacleType = 'WALL' | 'CRATE' | 'LOCKED_CRATE' | 'WATER' | 'ROCK';

export class Obstacle {
  public sprite: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite;
  public body: Phaser.Physics.Arcade.Body;
  public type: ObstacleType;
  public isLocked: boolean;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, type: ObstacleType) {
    this.scene = scene;
    this.type = type;
    this.isLocked = type === 'LOCKED_CRATE';

    // Create obstacle sprite
    if (type === 'LOCKED_CRATE') {
      this.sprite = this.createLockedCrate(scene, x, y, width, height);
    } else if (type === 'CRATE') {
      this.sprite = this.createCrate(scene, x, y, width, height);
    } else if (type === 'WATER') {
      this.sprite = this.createWater(scene, x, y, width, height);
    } else if (type === 'ROCK') {
      this.sprite = this.createRock(scene, x, y, width, height);
    } else {
      this.sprite = this.createWall(scene, x, y, width, height);
    }

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setImmovable(true);
  }

  private createWall(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    const wall = scene.add.rectangle(x, y, w, h, 0x654321);
    wall.setOrigin(0, 0);
    wall.setStrokeStyle(2, 0x3a2410);
    return wall;
  }

  private createCrate(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    const crate = scene.add.rectangle(x, y, w, h, 0xcd853f);
    crate.setOrigin(0, 0);
    crate.setStrokeStyle(3, 0x8b4513);

    // Add wood grain effect
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0x8b4513, 0.5);
    graphics.strokeRect(x + 5, y + 5, w - 10, h - 10);
    graphics.lineBetween(x, y, x + w, y + h);
    graphics.lineBetween(x + w, y, x, y + h);

    return crate;
  }

  private createLockedCrate(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    const crate = scene.add.rectangle(x, y, w, h, 0x8b7355);
    crate.setOrigin(0, 0);
    crate.setStrokeStyle(4, 0x000000);

    // Add lock symbol
    const lockX = x + w / 2;
    const lockY = y + h / 2;
    const lock = scene.add.graphics();
    lock.fillStyle(0xffd700, 1);
    lock.fillCircle(lockX, lockY - 3, 6);
    lock.fillRect(lockX - 4, lockY - 2, 8, 8);
    lock.lineStyle(2, 0x000000);
    lock.strokeCircle(lockX, lockY - 3, 6);

    return crate;
  }

  private createWater(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    const water = scene.add.rectangle(x, y, w, h, 0x4169e1, 0.6);
    water.setOrigin(0, 0);

    // Animate water
    scene.tweens.add({
      targets: water,
      alpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return water;
  }

  private createRock(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    const rock = scene.add.rectangle(x, y, w, h, 0x696969);
    rock.setOrigin(0, 0);
    rock.setStrokeStyle(2, 0x2f4f4f);
    return rock;
  }

  public unlock(): void {
    if (this.type === 'LOCKED_CRATE') {
      this.isLocked = false;

      // Visual feedback
      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          this.destroy();
        }
      });
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
