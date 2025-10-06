import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 3, 'GUINEA PIG ESCAPE', {
      font: 'bold 48px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 60, 'Eat. Grow. Escape.', {
      font: '24px Arial',
      color: '#ffdd00'
    });
    subtitle.setOrigin(0.5);

    // Instructions
    const instructions = this.add.text(width / 2, height / 2 + 40,
      'WASD or Arrow Keys to Move\nCollect vegetables to grow\nAvoid bombs and dynamite\nGrow big enough to escape!', {
      font: '16px Arial',
      color: '#cccccc',
      align: 'center',
      lineSpacing: 8
    });
    instructions.setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height - 100, 'CLICK TO START', {
      font: 'bold 32px Arial',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    // Pulse animation for start button
    this.tweens.add({
      targets: startButton,
      scale: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on click
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Also start on Enter key
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}
