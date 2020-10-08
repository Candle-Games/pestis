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

function preload() {
  // Tiles image preload
  console.log('Loading: ' + candlegamestools.resource('maps/tilesets/platformPack_tilesheet.png'));
  this.load.image('tiles', candlegamestools.resource('maps/tilesets/platformPack_tilesheet.png'));

  // Tiled json preload
  console.log('Loading: ' + candlegamestools.resource('maps/test-map.json'));
  this.load.tilemapTiledJSON('testmap', candlegamestools.resource('maps/test-map.json'));
}

function create() {
  // Create tilemap object
  var map = this.make.tilemap({ key: 'testmap' });

  // Add tileset image to tilemap
  var tileset = map.addTilesetImage('platformPack_tilesheet', 'tiles');
  console.log('Tile Layers in tilemap: ' + map.getTileLayerNames());

  // Create layer
  const layer = map.createStaticLayer('TestLayer', tileset, 0, 200);
}

function update() {}

console.log(namespace('candlegames.pestis.server.test'));

const game = new Phaser.Game(config);
phaserLoaded();
