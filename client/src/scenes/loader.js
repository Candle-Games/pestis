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
    this.events.on('destroy', this.destroy.bind(this));

    this.loadingprogressbar.show();
    this.load.googlefont('MedievalSharp');

    this.load.image('bg-menu', 'resources/images/main-menu-bg.png');
    this.load.image('joystick', 'resources/sprites/virtual-joystick/joystick.png');
    this.load.image('joystick-base', 'resources/sprites/virtual-joystick/base.png');

    this.load.image('logo-800', 'resources/images/logo-candlegames-800.png');
    this.load.image('logo-1600', 'resources/images/logo-candlegames-1600.jpeg');
    this.load.image('main-menu-background', 'resources/images/main-menu-background.png');

    this.load.image('select-arrow','resources/sprites/select-arrow.png');
    this.load.image('has-key','resources/sprites/goldenkey.png');
    this.load.image('hasnot-key','resources/sprites/no_goldenkey.png');

    this.music.loadMusic(this.load);
  }

  Loader.prototype.create = function() {
    this.music.initMusic();

    // Create is called when preload completes, now all loading is done
    this.events.emit('loadcompleted');
  }

  Loader.prototype.destroy = function() {
    this.loadingprogressbar.destroy();
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
