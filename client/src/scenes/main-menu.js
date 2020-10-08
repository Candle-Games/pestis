(function(ns) {
  /**
   * Main menú scene
   * @param properties
   * @constructor
   */
  function MainMenu() {
    Phaser.Scene.call(this, {
      key: 'MainMenu'
    });
  }

  // Inheritance stuff
  MainMenu.prototype = Object.create(Phaser.Scene.prototype);
  MainMenu.prototype.constructor = MainMenu;

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
