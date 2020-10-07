(function(ns) {
  /**
   * Resource loading scene
   * @param properties
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

  ns.Loader = Loader;
})(namespace('candlegames.pestis.client.scenes'))
