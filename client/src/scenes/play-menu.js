(function(ns) {
  function PlayMenu() {
    Phaser.Scene.call(this, {
      key: 'PlayMenu'
    });
  }

  PlayMenu.prototype = Object.create(Phaser.Scene.prototype);
  PlayMenu.prototype.constructor = PlayMenu;

  Phaser.Class.mixin(PlayMenu, [
    candlegames.pestis.scenes.components.State
  ]);

  PlayMenu.prototype.create = function() {
    this.menuInitialized = false;

    this.createStateMachine({
      id: 'Play Menu',
      initial: 'in-menu',
      states: {
        'in-menu': {
          entry: 'initMenu',
          on: {
            NEW_GAME: 'new-game',
            LOAD_GAME: 'load-game',
            JOIN_GAME: 'join-game',
            RETURN_TO_MAIN: 'return'
          }
        },
        'new-game': {
          entry: 'startNewGame',
          on: {
            RETURN: 'in-menu'
          }
        },
        'load-game': {
          entry: 'loadGame',
          on: {
            RETURN: 'in-menu'
          }
        },
        'join-game': {
          entry: 'joinGame',
          on: {
            RETURN: 'in-menu'
          }
        },
        'return': {
          entry: 'returnToMainMenu'
        }
      }
    },
      {
        actions: {
          'initMenu': this.initMenu.bind(this),
          'startNewGame': this.startNewGame.bind(this),
          'loadGame': this.loadGame.bind(this),
          'joinGame': this.joinGame.bind(this),
          'returnToMainMenu': this.returnToMainMenu.bind(this),
        }
      });

    this.createMenu();
  };

  PlayMenu.prototype.createMenu = function() {
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
      effect: function (option, action) {
        option.setStyle(action === 'select' ? {color: '#ffcda4'} : {color: '#fc7f03'});
      },
      options: [
        {
          id: 'NEW_GAME', label: 'New Game',
          effect: function (option, action) {
            option.setStyle(action === 'select' ? {color: '#fffe77'} : {color: '#fc7f03'});
          },
        },
        {id: 'LOAD_GAME', label: 'Continue Game', disabled: true},
        {id: 'JOIN_GAME', label: 'Join Game'},
        {id: 'RETURN_TO_MAIN', label: 'Return'},
      ]
    });

    this.events.off('menuselected');
    this.events.on('menuselected', this.menuSelected, this);
  }

  PlayMenu.prototype.initMenu = function() {
  }

  PlayMenu.prototype.menuSelected = function(menuConfig) {
    this.sendStateEvent(menuConfig.id);
  }

  PlayMenu.prototype.startNewGame = function() {
    console.log('Start new game');
    this.scene.launch('Game');

    this.scene.get('Game').events.on('game-finished', function() {
      this.sendStateEvent('RETURN');
    }, this);
  }

  PlayMenu.prototype.loadGame = function() {
    // .......
    // ->
    // this.scene.launch('GamePlayManager', { game: 'partida-1' });
    // this.scene.get('GamePlayManager').on('end-of-play', function() {
    //    this.scene.stop('GamePlayManager');
    //    this.sendStateEvent('RETURN');
    // }, this);
  }

  PlayMenu.prototype.joinGame = function() {
    // .......
    // ->
    // this.scene.launch('GamePlayManager', { game: undefined, connectTo: 'xxxxxxx' );
  }

  PlayMenu.prototype.returnToMainMenu = function() {
    this.events.emit('end-play-menu');
  }

  ns.PlayMenu = PlayMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
