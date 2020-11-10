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
        { id: 'play-menu', label: 'Play Pestis' },
        { id: 'contact', label: 'Contact' },
        { id: 'configuration', label: 'Configuration' }
      ]
    });

    this.events.off('menuselected', this.handleMenu, this);
    this.events.on('menuselected', this.handleMenu, this);


    // TODO: Remove, it's a test
    this.comms.on('gamestate', function(data) {
      // console.log('Input received ' + (data.server ? '[server] ' : '[local] ')  + ("0000000000000000" + data.data.toString(2)).substr(-16));
      console.log('Gamestate received ' + (data.server ? '[server] ' : '[local] ')  + data.data);
    }, this);

    // Registers listening for game state
    /*
    TODO: This shouldn't probably go here
    this.comms.off('gamestate');

    this.comms.off('join success');
    this.comms.on('join success', function(data){
      console.log("join success");
      var info = {keyRoom: data.data.keyRoom, host: false}
      game.scene.stop("MainMenu")
      game.scene.start('Lobby', info);
    });

    this.comms.off('new game created');
    this.comms.on('new game created', function(data){
      console.log("new game created");
      var info = {keyRoom: data.data.keyRoom, host: true}
      console.log(info);
      console.log(data);
      game.scene.stop('MainMenu');
      game.scene.start('Lobby',info);
    })

    this.comms.off('join failed');
    this.comms.on('join failed', function() {
      alert("Failed to join the room");
    })
    */
  }

  MainMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected.disabled) return;
    this.events.emit('menu-selected', optionSelected.id, optionSelected);

    /*
    TODO: This shouldn't probably go here
    if(optionSelected._menuConfig.disabled) return;
    switch(optionSelected.name){
      case "new-game":
        this.comms.emit('new game');
        break;
      case "join-game":
        var keyRoom = prompt('Enter the Key Room');
        this.comms.emit('join game', { key:keyRoom });
        break;
    }
    */
  }

  ns.MainMenu = MainMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
