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
    this.load.googlefont('Indie Flower');
    this.load.googlefont('Oswald');
    this.load.googlefont('Frijole');
    this.load.googlefont('Luckiest Guy');
  }

  Loader.prototype.create = function() {
    // Create is called when preload completes, now all loading is done
    console.log("Load completed");
    this.events.emit('loadcompleted');
  }

  Loader.prototype.destroy = function() {
    this.loadingprogressbar.destroy();
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
