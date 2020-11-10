(function(ns) {
  /**
   * Main menú scene
   * @constructor
   */
  function MainMenu() {
    Phaser.Scene.call(this, {
      key: 'MainMenu'
    });

    this.keymapvalue = 0;

    this.keymap = {
      UP:       0,
      DOWN:     1,
      LEFT:     2,
      RIGHT:    3,
      ACTION1:  4,
      ACTION2:  5
    };
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
        { id: 'game', label: 'Iniciar partida',
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

    // Registers listening for game state
    // TODO: Remove, it's a test
    this.comms.on('gamestate', function(data) {
      // console.log('Input received ' + (data.server ? '[server] ' : '[local] ')  + ("0000000000000000" + data.data.toString(2)).substr(-16));
      console.log('Gamestate received ' + (data.server ? '[server] ' : '[local] ')  + data.data);
    }, this);
  }

  MainMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected.disabled) return;
    this.events.emit('menu-selected', optionSelected.id, optionSelected);
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
