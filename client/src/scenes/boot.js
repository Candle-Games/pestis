(function(ns) {
  /**
   * Boot scene
   * TODO: Move loading logic to this function, get rid of loader scene...
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
    this.events.on('destroy', this.destroy.bind(this));
    this.load.json('music','resources/music/music.json');
    this.load.image('logo-800', 'resources/images/logo-candlegames-800.png');
  }

  Boot.prototype.create = function() {
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;
    var img = this.textures.get('logo-800').getSourceImage();
    var lang = "spanish";

    if(width > height) {
      var sy = height * 0.6;
      var sx = img.width * (sy / img.height);
    } else {
      var sx = width * 0.6;
      var sy = img.height * (sx / img.width);
    }

    var x = (width - sx) / 2;
    var y = (height / 2) - (sy / 2);

    this.background = this.add.image(x, y, 'logo-800');
    this.background.setDisplaySize(sx, sy);
    this.background.setOrigin(0, 0);

    this.loaderScene = this.scene.get('Loader');

    this.loaderScene.events.on('loadcompleted', function () {
      this.events.emit('loading-finished');
    }, this);

    this.scene.launch('Loader');
  }

  Boot.prototype.destroy = function() {
    // This scene is not needed anymore, release memory...
    this.loaderScene.scene.remove();
  }

  ns.Boot = Boot;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
