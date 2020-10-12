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

  MainMenu.prototype.preload = function() {}

  MainMenu.prototype.create = function() {
    this.menu.show({
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
      hanchor: 0.5,
      vanchor: 0.5,
      spacing: 60,
      fontfamily: "Oswald",
      fontsize: 50,
      fontcolor: '#fc7f03',
      textalign: 'center',
      debug: false,
      effect: function(option, action) {
        option.setStyle(action==='select' ? { color: '#ffcda4'} : {color: '#fc7f03'});
      },
      options: [
        { id: 'menu1', label: 'Texto menu 1',
          effect: function(option, action) {
            option.setStyle(action==='select' ? { color: '#fffe77'} : {color: '#fc7f03'});
          },
        },
        { id: 'menu2', label: 'Texto menu 2', disabled: true },
        { id: 'menu3', label: 'Texto menu 3' },
        { id: 'menu4', label: 'Texto menu 4' },
      ]
    });

    this.events.on('menuselected', this.handleMenu, this);
  }

  MainMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected._menuConfig.disabled) return;
    console.log(optionSelected.name + ' selected!!');
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
