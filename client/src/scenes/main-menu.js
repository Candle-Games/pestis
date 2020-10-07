(function(ns) {
  /**
   * Main menú scene
   * @param properties
   * @constructor
   */
  function MainMenu(properties) {
    Phaser.Scene.call(this, properties);
  }

  // Inheritance stuff
  MainMenu.prototype = Object.create(Phaser.Scene.prototype);
  MainMenu.prototype.constructor = MainMenu;

  ns.MainMenu = MainMenu;
})(namespace('candlegames.game1.client.scenes'))
