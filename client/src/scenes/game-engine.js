(function(ns) {
  function GameEngine() {
    Phaser.Scene.call(this, {
      key: 'GameEngine'
    });

    this.baseZoom = 1;
  }

  GameEngine.prototype = Object.create(Phaser.Scene.prototype);
  GameEngine.prototype.constructor = GameEngine;

  GameEngine.prototype.preload = function() {
  }

  GameEngine.prototype.create = function() {
    this.map = this.make.tilemap({ key: 'tutorial-room-16x16' });
    this.tileset = this.map.addTilesetImage('tutorial-room-tileset', 'tutorial-room-tileset-nombrada');

    console.log("TileLayer names: " + this.map.getTileLayerNames());
    this.background = this.map.createStaticLayer('background', this.tileset, 0, 0);

    console.log("ObjectLayer names: " + this.map.getObjectLayerNames());
    this.collisions = this.map.createStaticLayer('collisions', this.tileset, 0, 0);
    this.soundscore = this.map.createStaticLayer('soundscore', this.tileset, 0, 0);

    this.camera = this.cameras.main;
    this.camera.setZoom(this.baseZoom);
    this.camera.setPosition(0, 0);
    this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    });

    var formatConfig = {
      style: "percent"
    }

    this.formatter = new Intl.NumberFormat('es-ES', formatConfig);

    this.zoomText = this.add.text(20, 20, 'Zoom Value: ' + this.formatter.format(this.camera.zoom));
    this.zoomText.setFontFamily("'Indie Flower'");
    this.zoomText.setFontSize(30);
    this.zoomText.setZ(100);
    this.zoomText.setStroke("#ff0000", 4);
    this.zoomText.setFill("#0x000");


    this.input.keyboard.on('keydown-Q', function() {
      this.camera.setZoom(this.camera.zoom - 0.01);
    }, this);


    this.input.keyboard.on('keydown-E', function() {
      this.camera.setZoom(this.camera.zoom + 0.01);

    }, this);

    this.input.keyboard.on('keydown-W', function() {
      this.camera.setZoom(this.baseZoom);
    }, this);

  }

  GameEngine.prototype.update = function(time, delta) {
    this.controls.update(delta * 2.5);
    var pos = this.camera.getWorldPoint(this.camera.x + 20, this.camera.y + 20);
    this.zoomText.setPosition(pos.x, pos.y);
    this.zoomText.setText('Zoom Value: ' + this.formatter.format(this.camera.zoom));
    this.zoomText.setScale(1 / this.camera.zoom);
  }

  ns.GameEngine = GameEngine;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
