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

  MainMenu.prototype.preload = function() {
  }

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
        { id: 'new-game', label: 'New Game',
          effect: function(option, action) {
            option.setStyle(action==='select' ? { color: '#fffe77'} : {color: '#fc7f03'});
          },
        },
        { id: 'continue-game', label: 'Continue Game', disabled: true },
        { id: 'join-game', label: 'Join Game' },
        { id: 'contact', label: 'Contact' },
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

    this.comms.on('join success', function(data){
      console.log("join success");
      game.scene.stop('MainMenu');
      game.scene.start('Lobby');
    });

    this.comms.on('join failed', function(data) {
      alert("Failed to join the room");
    })

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
    switch(optionSelected.name){
      case "new-game":
        this.comms.emit('new game');
        game.scene.stop('MainMenu');
        game.scene.start('Lobby');
        break;
      case "join-game":
        var keyRoom = prompt('Enter the Key Room');
        this.comms.emit('join game', { key:keyRoom });
        break;
    }
    console.log(optionSelected.name + ' selected!!');
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
