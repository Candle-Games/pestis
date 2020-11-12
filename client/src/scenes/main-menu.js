(function(ns) {
  /**
   * Main menú scene
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

  MainMenu.prototype.preload = function() {
  }

  MainMenu.prototype.create = function(config) {
    this.add.image(0, 0, 'main-menu-background').setOrigin(0, 0);
    
    var config = _.assign(this.menu.config, { options: config.menu });
    this.menu.show(config);

    this.events.off('menuselected');
    this.events.on('menuselected', this.handleMenu, this);
  }

  MainMenu.prototype.handleMenu = function(optionSelected) {
    console.log("Menu selected: " + optionSelected.id);
    if(optionSelected.disabled) return;
    this.events.emit('menu-selected', optionSelected.id, optionSelected);
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
