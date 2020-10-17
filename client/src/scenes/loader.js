(function(ns) {
  /**
   * Resource loading scene
   * @constructor
   */
  function Loader() {
    Phaser.Scene.call(this, {
      key: 'Loader'
    });
  }

  // Inheritance stuff
  Loader.prototype = Object.create(Phaser.Scene.prototype);
  Loader.prototype.constructor = Loader;

  Loader.prototype.preload = function() {
    this.load.on('complete', this.onLoadComplete.bind(this));
    this.loadingprogressbar.show({ dashStyle: [ 2, 3 ]});

    // Load fonts
    this.load.googlefont('Indie Flower');
    this.load.googlefont('Oswald');
    this.load.googlefont('Frijole');
    this.load.googlefont('Luckiest Guy');

    // Load levels
    this.load.tilemapTiledJSON('tutorial-room', '/resources/maps/tutorial-room.json');
    this.load.tilemapTiledJSON('tutorial-room-resized', '/resources/maps/tutorial-room-resized.json');
    this.load.tilemapTiledJSON('tutorial-room-16x16', '/resources/maps/tutorial-room-16x16.json');

    this.load.image('tutorial-room-tileset', '/resources/maps/tutorial-room-tileset.png');
    this.load.image('tutorial-room-tileset-nombrada', '/resources/maps/tutorial-room-tileset-nombrada.png');
  }

  Loader.prototype.onLoadComplete = function(value) {
    this.events.emit('loadcompleted');
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
