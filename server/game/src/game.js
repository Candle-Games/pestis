const config = {
  type: Phaser.HEADLESS,
  parent: 'game1',
  width: 800,
  height: 600,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload() {}

function create() {}

function update() {}

console.log(namespace('candlegames.game1.server.test'));

const game = new Phaser.Game(config);
phaserLoaded();
