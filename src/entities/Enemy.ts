import Phaser from 'phaser';

export type EnemyType = 'CAT' | 'SNAKE' | 'HAWK';

export class Enemy {
  public sprite: Phaser.GameObjects.Graphics;
  public body: Phaser.Physics.Arcade.Body;
  public type: EnemyType;
  private scene: Phaser.Scene;
  private speed: number;
  private waypoints: { x: number; y: number }[];
  private currentWaypoint: number = 0;
  private detectionRadius: number;
  private chasing: boolean = false;
  private alive: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, type: EnemyType, waypoints: { x: number; y: number }[]) {
    this.scene = scene;
    this.type = type;
    this.waypoints = waypoints.length > 0 ? waypoints : [{ x, y }];

    // Enemy stats based on type
    switch (type) {
      case 'CAT':
        this.speed = 100;
        this.detectionRadius = 150;
        break;
      case 'SNAKE':
        this.speed = 80;
        this.detectionRadius = 120;
        break;
      case 'HAWK':
        this.speed = 140;
        this.detectionRadius = 200;
        break;
    }

    // Create enemy sprite
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.drawEnemy();

    // Add physics
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(20);
    this.body.setCollideWorldBounds(true);
  }

  private drawEnemy(): void {
    this.sprite.clear();

    if (this.type === 'CAT') {
      // Draw cat - orange with stripes
      this.sprite.fillStyle(0xff9933, 1);
      this.sprite.fillEllipse(0, 0, 40, 30);
      // Head
      this.sprite.fillCircle(-12, -8, 12);
      // Ears
      this.sprite.fillTriangle(-18, -18, -12, -18, -15, -24);
      this.sprite.fillTriangle(-6, -18, -12, -18, -9, -24);
      // Eyes (menacing)
      this.sprite.fillStyle(0xffff00, 1);
      this.sprite.fillCircle(-15, -10, 3);
      this.sprite.fillCircle(-9, -10, 3);
      this.sprite.fillStyle(0x000000, 1);
      this.sprite.fillCircle(-15, -10, 1);
      this.sprite.fillCircle(-9, -10, 1);
      // Tail
      this.sprite.lineStyle(6, 0xff9933);
      this.sprite.lineBetween(15, 0, 25, -10);
    } else if (this.type === 'SNAKE') {
      // Draw snake - green serpent
      this.sprite.fillStyle(0x00aa00, 1);
      // Body segments
      for (let i = 0; i < 5; i++) {
        const x = -i * 8;
        this.sprite.fillCircle(x, 0, 8 - i);
      }
      // Head
      this.sprite.fillCircle(0, 0, 10);
      // Eyes (red)
      this.sprite.fillStyle(0xff0000, 1);
      this.sprite.fillCircle(-3, -3, 2);
      this.sprite.fillCircle(3, -3, 2);
      // Tongue
      this.sprite.lineStyle(2, 0xff0000);
      this.sprite.lineBetween(0, 5, -2, 12);
      this.sprite.lineBetween(0, 5, 2, 12);
    } else {
      // Draw hawk - brown predator bird
      this.sprite.fillStyle(0x8b4513, 1);
      // Body
      this.sprite.fillEllipse(0, 0, 30, 40);
      // Head
      this.sprite.fillCircle(0, -12, 10);
      // Beak
      this.sprite.fillStyle(0xffaa00, 1);
      this.sprite.fillTriangle(-3, -10, 3, -10, 0, -18);
      // Wings (spread)
      this.sprite.fillStyle(0x8b4513, 1);
      this.sprite.fillEllipse(-20, 0, 15, 25);
      this.sprite.fillEllipse(20, 0, 15, 25);
      // Eyes (fierce)
      this.sprite.fillStyle(0xffff00, 1);
      this.sprite.fillCircle(-3, -12, 2);
      this.sprite.fillCircle(3, -12, 2);
      this.sprite.fillStyle(0x000000, 1);
      this.sprite.fillCircle(-3, -12, 1);
      this.sprite.fillCircle(3, -12, 1);
    }
  }

  public update(playerPos: { x: number; y: number }): void {
    if (!this.alive) return;

    const distanceToPlayer = Math.sqrt(
      Math.pow(playerPos.x - this.sprite.x, 2) + Math.pow(playerPos.y - this.sprite.y, 2)
    );

    // Chase player if within detection radius
    if (distanceToPlayer < this.detectionRadius) {
      this.chasing = true;
      // Move toward player
      const angle = Math.atan2(playerPos.y - this.sprite.y, playerPos.x - this.sprite.x);
      this.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

      // Flash red when chasing
      if (!this.sprite.getData('flashing')) {
        this.sprite.setData('flashing', true);
        this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0.5,
          duration: 200,
          yoyo: true,
          repeat: -1
        });
      }
    } else {
      this.chasing = false;
      this.sprite.setAlpha(1);
      this.sprite.setData('flashing', false);

      // Patrol waypoints
      if (this.waypoints.length > 1) {
        const target = this.waypoints[this.currentWaypoint];
        const distanceToWaypoint = Math.sqrt(
          Math.pow(target.x - this.sprite.x, 2) + Math.pow(target.y - this.sprite.y, 2)
        );

        if (distanceToWaypoint < 10) {
          this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
        } else {
          const angle = Math.atan2(target.y - this.sprite.y, target.x - this.sprite.x);
          this.body.setVelocity(Math.cos(angle) * this.speed * 0.5, Math.sin(angle) * this.speed * 0.5);
        }
      } else {
        this.body.setVelocity(0, 0);
      }
    }
  }

  public getDamage(): number {
    switch (this.type) {
      case 'CAT': return 40;
      case 'SNAKE': return 25;
      case 'HAWK': return 35;
    }
  }

  public hit(): void {
    this.alive = false;

    // Death animation
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 0,
      alpha: 0,
      angle: 360,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  public destroy(): void {
    this.sprite.destroy();
  }

  public isAlive(): boolean {
    return this.alive;
  }
}
