const config = {
  type: Phaser.HEADLESS,
  parent: 'container',
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

console.log(namespace('candlegames.pestis.server.test'));

const game = new Phaser.Game(config);
phaserLoaded();
