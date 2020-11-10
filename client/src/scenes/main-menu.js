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
    this.music.init('BlackPlague');
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

    this.input.keyboard.on('keydown', this.handleKeyDown, this);
    this.input.keyboard.on('keyup', this.handleKeyUp, this);

    // Registers listening for game state
    this.comms.on('gamestate', function(data) {
      // console.log('Input received ' + (data.server ? '[server] ' : '[local] ')  + ("0000000000000000" + data.data.toString(2)).substr(-16));
      console.log('Gamestate received ' + (data.server ? '[server] ' : '[local] ')  + data.data);
    }, this);
  }

  MainMenu.prototype.handleKeyDown = function(event) {
    var keymapvalue = this.keymapvalue;
    switch(event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.W:
        keymapvalue |= (1 << this.keymap.UP);
        break;
      case Phaser.Input.Keyboard.KeyCodes.S:
        keymapvalue |= (1 << this.keymap.DOWN);
        break;
      case Phaser.Input.Keyboard.KeyCodes.A:
        keymapvalue |= (1 << this.keymap.LEFT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.D:
        keymapvalue |= (1 << this.keymap.RIGHT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.COMMA:
        keymapvalue |= (1 << this.keymap.ACTION1);
        break;
      case Phaser.Input.Keyboard.KeyCodes.PERIOD:
        keymapvalue |= (1 << this.keymap.ACTION2);
        break;
    }
    this.sendInput(keymapvalue);
  }

  MainMenu.prototype.handleKeyUp = function(event) {
    var keymapvalue = this.keymapvalue;
    switch(event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.W:
        keymapvalue &= ~(1 << this.keymap.UP);
        break;
      case Phaser.Input.Keyboard.KeyCodes.S:
        keymapvalue &= ~(1 << this.keymap.DOWN);
        break;
      case Phaser.Input.Keyboard.KeyCodes.A:
        keymapvalue &= ~(1 << this.keymap.LEFT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.D:
        keymapvalue &= ~(1 << this.keymap.RIGHT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.COMMA:
        keymapvalue &= ~(1 << this.keymap.ACTION1);
        break;
      case Phaser.Input.Keyboard.KeyCodes.PERIOD:
        keymapvalue &= ~(1 << this.keymap.ACTION2);
        break;
    }
    this.sendInput(keymapvalue);
  }

  MainMenu.prototype.sendInput = function(keymapvalue) {
    if(this.keymapvalue != keymapvalue) {
      // Sends input to comms system
      this.comms.emit('input', keymapvalue);
      this.keymapvalue = keymapvalue;
    }
  }

  MainMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected._menuConfig.disabled) return;
    console.log(optionSelected.name + ' selected!!');
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
