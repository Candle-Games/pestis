(function(ns) {
  /**
   * Boot scene
   * @param properties
   * @constructor
   */
  function Boot(properties) {
    Phaser.Scene.call(this, properties);
  }

  // Inheritance stuff
  Boot.prototype = Object.create(Phaser.Scene.prototype);
  Boot.prototype.constructor = Boot;

  ns.Boot = Boot;
})(namespace('candlegames.game1.client.scenes'))
