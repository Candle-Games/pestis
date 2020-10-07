(function(ns) {
  /**
   * Resource loading scene
   * @param properties
   * @constructor
   */
  function Loader(properties) {
    Phaser.Scene.call(this, properties);
  }

  // Inheritance stuff
  Loader.prototype = Object.create(Phaser.Scene.prototype);
  Loader.prototype.constructor = Loader;

  ns.Loader = Loader;
})(namespace('candlegames.game1.client.scenes'))
