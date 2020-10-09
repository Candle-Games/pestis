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
    this.loadingprogressbar.show();

    for(var i=0; i < 100; ++i) {
      this.load.image('logo' + i, 'resources/images/candle-games-logo.jpeg');
    }
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
