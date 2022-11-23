import Phaser from 'phaser';
import { Scene } from './scene.js';

export const scene = new Scene();

export const game = new Phaser.Game({
  type: Phaser.CANVAS,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    }
  },
  scene,
});
