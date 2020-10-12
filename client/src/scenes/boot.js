(function(ns) {
  /**
   * Boot scene
   * @constructor
   */
  function Boot() {
    Phaser.Scene.call(this, {
      key: 'Boot'
    });
  }

  // Inheritance stuff
  Boot.prototype = Object.create(Phaser.Scene.prototype);
  Boot.prototype.constructor = Boot;

  Boot.prototype.preload = function() {
    this.load.image('logo', 'resources/images/candle-games-logo.jpeg');
  }

  Boot.prototype.create = function() {
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;
    var img = this.textures.get('logo').getSourceImage();

    if(width > height) {
      var sy = height * 0.9;
      var sx = img.width * (sy / img.height);
    } else {
      var sx = width * 0.9;
      var sy = img.height * (sx / img.width);
    }

    var x = (width - sx) / 2;
    var y = (height / 2) - (sy / 2);

    this.background = this.add.image(x, y, 'logo');
    this.background.setDisplaySize(sx, sy);
    this.background.setOrigin(0, 0);

    var loaderScene = this.scene.get('Loader');

    loaderScene.events.on('loadcompleted', function () {
      this.scene.stop('Loader');
      this.scene.start('MainMenu');
    }, this);

    this.scene.launch('Loader');
  }

  ns.Boot = Boot;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
