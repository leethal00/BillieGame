import Phaser from 'phaser';
import { GameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';

class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.scene.add('BootScene', BootScene);
    this.scene.add('MenuScene', MenuScene);
    this.scene.add('GameScene', GameScene);

    this.scene.start('BootScene');
  }
}

window.addEventListener('load', () => {
  new Game(GameConfig);
});
