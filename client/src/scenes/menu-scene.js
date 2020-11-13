(function(ns) {
  /**
   * Main menú scene
   * @constructor
   */
  function MenuScene(config) {
    config = _.assign({
      key: 'MenuScene'
    }, config);

    Phaser.Scene.call(this, config);
  }

  // Inheritance stuff
  MenuScene.prototype = Object.create(Phaser.Scene.prototype);
  MenuScene.prototype.constructor = MenuScene;

  MenuScene.prototype.preload = function() {
  }

  MenuScene.prototype.create = function(config) {
    this.add.image(0, 0, 'main-menu-background').setOrigin(0, 0);

    var config = _.assign(this.menu.config, { options: config.menu });
    this.menu.show(config);

    this.events.off('menuselected');
    this.events.on('menuselected', this.handleMenu, this);
  }

  MenuScene.prototype.handleMenu = function(optionSelected) {
    console.log("Menu selected: " + optionSelected.id);
    if(optionSelected.disabled) return;
    this.events.emit('menu-selected', optionSelected.id, optionSelected);
  }

  ns.MenuScene = MenuScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
