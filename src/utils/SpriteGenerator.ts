import Phaser from 'phaser';

/**
 * Utility class to generate sprite graphics programmatically
 * This creates high-quality pixel art style sprites
 */
export class SpriteGenerator {
  /**
   * Generate a guinea pig sprite with multiple frames for animation
   */
  static generateGuineaPig(scene: Phaser.Scene, size: number = 1): void {
    const baseSize = 32;
    const scale = size;
    const width = baseSize * scale;
    const height = Math.floor(baseSize * 0.8) * scale;

    // Create idle frame
    const graphics = scene.add.graphics();

    // Body (brown/orange fur)
    graphics.fillStyle(0xff9966, 1);
    graphics.fillEllipse(width / 2, height / 2, width * 0.9, height * 0.7);

    // Darker brown patches
    graphics.fillStyle(0xcc7744, 1);
    graphics.fillEllipse(width * 0.3, height * 0.5, width * 0.3, height * 0.25);
    graphics.fillEllipse(width * 0.7, height * 0.5, width * 0.3, height * 0.25);

    // Head
    graphics.fillStyle(0xff9966, 1);
    graphics.fillEllipse(width * 0.7, height * 0.35, width * 0.45, height * 0.4);

    // Ears
    graphics.fillStyle(0xffaa88, 1);
    graphics.fillEllipse(width * 0.65, height * 0.15, width * 0.15, height * 0.2);
    graphics.fillEllipse(width * 0.8, height * 0.15, width * 0.15, height * 0.2);

    // Ear inner (pink)
    graphics.fillStyle(0xffccdd, 1);
    graphics.fillEllipse(width * 0.65, height * 0.17, width * 0.08, height * 0.12);
    graphics.fillEllipse(width * 0.8, height * 0.17, width * 0.08, height * 0.12);

    // Eye
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(width * 0.75, height * 0.35, width * 0.05);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(width * 0.76, height * 0.34, width * 0.02);

    // Nose (pink)
    graphics.fillStyle(0xff99aa, 1);
    graphics.fillEllipse(width * 0.85, height * 0.42, width * 0.08, height * 0.06);

    // Whiskers
    graphics.lineStyle(Math.max(1, scale), 0x000000, 0.8);
    // Left whiskers
    graphics.lineBetween(width * 0.85, height * 0.4, width * 0.95, height * 0.35);
    graphics.lineBetween(width * 0.85, height * 0.42, width * 0.98, height * 0.42);
    graphics.lineBetween(width * 0.85, height * 0.44, width * 0.95, height * 0.49);

    // Feet
    graphics.fillStyle(0xffaa88, 1);
    graphics.fillEllipse(width * 0.35, height * 0.75, width * 0.15, height * 0.12);
    graphics.fillEllipse(width * 0.55, height * 0.75, width * 0.15, height * 0.12);

    graphics.generateTexture(`guineapig-idle-${size}`, width, height);
    graphics.destroy();
  }

  /**
   * Generate vegetable sprites
   */
  static generateVegetables(scene: Phaser.Scene): void {
    // Carrot
    const carrotGraphics = scene.add.graphics();
    carrotGraphics.fillStyle(0xff6600, 1);
    carrotGraphics.fillTriangle(16, 4, 10, 28, 22, 28);
    carrotGraphics.fillStyle(0xff8822, 1); // highlight
    carrotGraphics.fillTriangle(14, 8, 12, 20, 16, 20);
    // Green top
    carrotGraphics.fillStyle(0x00aa00, 1);
    carrotGraphics.fillRect(14, 0, 4, 6);
    carrotGraphics.fillRect(10, 2, 4, 4);
    carrotGraphics.fillRect(18, 2, 4, 4);
    carrotGraphics.lineStyle(1, 0xff4400, 1);
    carrotGraphics.lineBetween(14, 10, 14, 24);
    carrotGraphics.lineBetween(16, 12, 16, 26);
    carrotGraphics.lineBetween(18, 10, 18, 24);
    carrotGraphics.generateTexture('vegetable-carrot', 32, 32);
    carrotGraphics.destroy();

    // Lettuce
    const lettuceGraphics = scene.add.graphics();
    lettuceGraphics.fillStyle(0x88dd44, 1);
    lettuceGraphics.fillCircle(16, 16, 12);
    lettuceGraphics.fillStyle(0x99ee55, 1);
    lettuceGraphics.fillCircle(12, 14, 8);
    lettuceGraphics.fillCircle(20, 14, 8);
    lettuceGraphics.fillCircle(16, 20, 8);
    lettuceGraphics.fillStyle(0xaaff66, 1);
    lettuceGraphics.fillCircle(16, 14, 6);
    lettuceGraphics.lineStyle(1, 0x66aa33, 1);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x1 = 16 + Math.cos(angle) * 6;
      const y1 = 16 + Math.sin(angle) * 6;
      const x2 = 16 + Math.cos(angle) * 12;
      const y2 = 16 + Math.sin(angle) * 12;
      lettuceGraphics.lineBetween(x1, y1, x2, y2);
    }
    lettuceGraphics.generateTexture('vegetable-lettuce', 32, 32);
    lettuceGraphics.destroy();

    // Pepper
    const pepperGraphics = scene.add.graphics();
    pepperGraphics.fillStyle(0xff0000, 1);
    pepperGraphics.fillEllipse(16, 18, 14, 20);
    pepperGraphics.fillStyle(0xff3333, 1); // highlight
    pepperGraphics.fillEllipse(13, 16, 6, 10);
    // Green stem
    pepperGraphics.fillStyle(0x00aa00, 1);
    pepperGraphics.fillRect(14, 6, 4, 8);
    pepperGraphics.fillStyle(0x00cc00, 1);
    pepperGraphics.fillEllipse(16, 6, 8, 4);
    pepperGraphics.lineStyle(1, 0xcc0000, 1);
    pepperGraphics.strokeEllipse(16, 18, 14, 20);
    pepperGraphics.generateTexture('vegetable-pepper', 32, 32);
    pepperGraphics.destroy();

    // Broccoli
    const broccoliGraphics = scene.add.graphics();
    broccoliGraphics.fillStyle(0x228b22, 1);
    // Main florets
    for (let i = 0; i < 5; i++) {
      const x = 10 + i * 3;
      const y = 8 + (i % 2) * 2;
      broccoliGraphics.fillCircle(x, y, 4);
    }
    broccoliGraphics.fillCircle(13, 12, 5);
    broccoliGraphics.fillCircle(19, 12, 5);
    broccoliGraphics.fillCircle(16, 14, 5);
    // Lighter tops
    broccoliGraphics.fillStyle(0x2eb82e, 1);
    broccoliGraphics.fillCircle(12, 10, 3);
    broccoliGraphics.fillCircle(20, 10, 3);
    broccoliGraphics.fillCircle(16, 13, 3);
    // Stalk
    broccoliGraphics.fillStyle(0xaad4aa, 1);
    broccoliGraphics.fillRect(14, 16, 4, 10);
    broccoliGraphics.fillStyle(0x99c299, 1);
    broccoliGraphics.fillRect(15, 16, 2, 10);
    broccoliGraphics.generateTexture('vegetable-broccoli', 32, 32);
    broccoliGraphics.destroy();
  }

  /**
   * Generate hazard sprites
   */
  static generateHazards(scene: Phaser.Scene): void {
    // Bomb
    const bombGraphics = scene.add.graphics();
    // Main body (black)
    bombGraphics.fillStyle(0x1a1a1a, 1);
    bombGraphics.fillCircle(16, 20, 11);
    // Shine/highlight
    bombGraphics.fillStyle(0x404040, 1);
    bombGraphics.fillCircle(12, 17, 4);
    // Fuse
    bombGraphics.lineStyle(3, 0x333333, 1);
    bombGraphics.lineBetween(16, 9, 16, 12);
    bombGraphics.lineBetween(16, 9, 18, 6);
    bombGraphics.lineBetween(16, 9, 14, 6);
    // Spark
    bombGraphics.fillStyle(0xff6600, 1);
    bombGraphics.fillCircle(16, 6, 2);
    bombGraphics.fillStyle(0xffaa00, 1);
    bombGraphics.fillCircle(16, 6, 1);
    bombGraphics.generateTexture('hazard-bomb', 32, 32);
    bombGraphics.destroy();

    // Dynamite
    const dynamiteGraphics = scene.add.graphics();
    // Main stick (red)
    dynamiteGraphics.fillStyle(0xcc0000, 1);
    dynamiteGraphics.fillRect(10, 12, 12, 16);
    // Highlight
    dynamiteGraphics.fillStyle(0xff3333, 1);
    dynamiteGraphics.fillRect(11, 13, 3, 14);
    // Label area
    dynamiteGraphics.fillStyle(0xffeecc, 1);
    dynamiteGraphics.fillRect(11, 16, 10, 6);
    // Text "TNT"
    dynamiteGraphics.fillStyle(0x000000, 1);
    dynamiteGraphics.fillRect(12, 18, 1, 3);
    dynamiteGraphics.fillRect(15, 18, 1, 3);
    dynamiteGraphics.fillRect(18, 18, 1, 3);
    // Fuse
    dynamiteGraphics.lineStyle(2, 0x8b4513, 1);
    dynamiteGraphics.lineBetween(16, 12, 18, 6);
    dynamiteGraphics.lineBetween(18, 6, 20, 4);
    // Spark
    dynamiteGraphics.fillStyle(0xff9900, 1);
    bombGraphics.fillCircle(20, 4, 2);
    dynamiteGraphics.fillStyle(0xffdd00, 1);
    dynamiteGraphics.fillCircle(20, 4, 1);
    dynamiteGraphics.generateTexture('hazard-dynamite', 32, 32);
    dynamiteGraphics.destroy();
  }

  /**
   * Generate explosion particle effect
   */
  static generateExplosion(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xff6600, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.fillStyle(0xffaa00, 1);
    graphics.fillCircle(8, 8, 5);
    graphics.fillStyle(0xffdd44, 1);
    graphics.fillCircle(8, 8, 3);
    graphics.generateTexture('particle-explosion', 16, 16);
    graphics.destroy();
  }
}
