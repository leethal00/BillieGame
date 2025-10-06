import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private baseCircle: Phaser.GameObjects.Graphics;
  private stickCircle: Phaser.GameObjects.Graphics;
  private isActive: boolean = false;
  private baseX: number = 0;
  private baseY: number = 0;
  private stickX: number = 0;
  private stickY: number = 0;
  private maxDistance: number = 50;
  private pointer?: Phaser.Input.Pointer;

  public direction: { x: number; y: number } = { x: 0, y: 0 };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.baseX = x;
    this.baseY = y;
    this.stickX = x;
    this.stickY = y;

    // Create base circle (outer)
    this.baseCircle = scene.add.graphics();
    this.baseCircle.fillStyle(0x000000, 0.3);
    this.baseCircle.fillCircle(x, y, this.maxDistance);
    this.baseCircle.lineStyle(3, 0xffffff, 0.5);
    this.baseCircle.strokeCircle(x, y, this.maxDistance);
    this.baseCircle.setDepth(5000);
    this.baseCircle.setScrollFactor(0);
    this.baseCircle.setVisible(false);

    // Create stick circle (inner)
    this.stickCircle = scene.add.graphics();
    this.stickCircle.fillStyle(0xffffff, 0.7);
    this.stickCircle.fillCircle(x, y, 25);
    this.stickCircle.lineStyle(2, 0x000000, 0.5);
    this.stickCircle.strokeCircle(x, y, 25);
    this.stickCircle.setDepth(5001);
    this.stickCircle.setScrollFactor(0);
    this.stickCircle.setVisible(false);

    // Setup touch controls
    this.setupControls();
  }

  private setupControls(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Only activate on left side of screen for joystick
      if (pointer.x < this.scene.cameras.main.width / 2) {
        this.isActive = true;
        this.pointer = pointer;
        this.baseX = pointer.x;
        this.baseY = pointer.y;
        this.stickX = pointer.x;
        this.stickY = pointer.y;

        this.baseCircle.clear();
        this.baseCircle.fillStyle(0x000000, 0.3);
        this.baseCircle.fillCircle(0, 0, this.maxDistance);
        this.baseCircle.lineStyle(3, 0xffffff, 0.5);
        this.baseCircle.strokeCircle(0, 0, this.maxDistance);
        this.baseCircle.setPosition(this.baseX, this.baseY);
        this.baseCircle.setVisible(true);

        this.stickCircle.setPosition(this.stickX, this.stickY);
        this.stickCircle.setVisible(true);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isActive && pointer === this.pointer) {
        const dx = pointer.x - this.baseX;
        const dy = pointer.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.maxDistance) {
          const angle = Math.atan2(dy, dx);
          this.stickX = this.baseX + Math.cos(angle) * this.maxDistance;
          this.stickY = this.baseY + Math.sin(angle) * this.maxDistance;
        } else {
          this.stickX = pointer.x;
          this.stickY = pointer.y;
        }

        this.stickCircle.clear();
        this.stickCircle.fillStyle(0xffffff, 0.7);
        this.stickCircle.fillCircle(0, 0, 25);
        this.stickCircle.lineStyle(2, 0x000000, 0.5);
        this.stickCircle.strokeCircle(0, 0, 25);
        this.stickCircle.setPosition(this.stickX, this.stickY);

        // Calculate direction
        const normalizedDx = (this.stickX - this.baseX) / this.maxDistance;
        const normalizedDy = (this.stickY - this.baseY) / this.maxDistance;
        this.direction.x = Math.max(-1, Math.min(1, normalizedDx));
        this.direction.y = Math.max(-1, Math.min(1, normalizedDy));
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.pointer) {
        this.isActive = false;
        this.pointer = undefined;
        this.baseCircle.setVisible(false);
        this.stickCircle.setVisible(false);
        this.direction.x = 0;
        this.direction.y = 0;
      }
    });
  }

  public getInput(): { left: boolean; right: boolean; up: boolean; down: boolean } {
    return {
      left: this.direction.x < -0.3,
      right: this.direction.x > 0.3,
      up: this.direction.y < -0.3,
      down: this.direction.y > 0.3
    };
  }

  public destroy(): void {
    this.baseCircle.destroy();
    this.stickCircle.destroy();
  }
}
