import Phaser from 'phaser';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    min: {
      width: 320,
      height: 240
    },
    max: {
      width: 1920,
      height: 1440
    }
  }
};

// Game constants
export const GAME_CONSTANTS = {
  PLAYER: {
    INITIAL_SIZE: 1,
    SMALL_SIZE: 1,
    MEDIUM_SIZE: 2,
    LARGE_SIZE: 3,
    ESCAPE_SIZE: 4,
    INITIAL_HEALTH: 100,
    SPEED_BASE: 150
  },
  VEGETABLES: {
    CARROT: { growth: 0.3, health: 10, rarity: 'common' },
    LETTUCE: { growth: 0.1, health: 20, rarity: 'common' },
    PEPPER: { growth: 0.2, health: 5, speedBoost: 1.5, duration: 3000, rarity: 'uncommon' },
    BROCCOLI: { growth: 0.5, health: 15, rarity: 'rare' }
  },
  HAZARDS: {
    BOMB: { damage: 30, radius: 50 },
    DYNAMITE: { damage: 50, radius: 80, fuseTime: 3000 }
  }
};
