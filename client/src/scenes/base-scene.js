(function(ns) {
  function BaseScene() {
    Phaser.Scene.call(this, {
      key: 'BaseScene'
    });

    this.menus = {
      'main': [
        { id: 'PLAY_MENU', label: 'Play Pestis' },
        { id: 'SETTINGS', label: 'Settings' },
        { id: 'CREDITS', label: 'Credits' }
      ],
      'play': [
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
    };
  }

  BaseScene.prototype = Object.create(Phaser.Scene.prototype);
  BaseScene.prototype.constructor = BaseScene;

  Phaser.Class.mixin(BaseScene, [
    candlegames.pestis.scenes.components.State
  ]);

  BaseScene.prototype.preload = function() {
    this.settings.loadSettings();
    this.load.json('game-configuration', '/src/game-configuration.json');
  }

  BaseScene.prototype.create = function() {
    this.createStateMachine({
      id: 'Game Scene Manager',
      initial: 'boot',
      states: {
        boot: {
          entry: 'startBoot',
          on: {
            LOAD_FINISHED: 'main_menu',
          },
        },
        main_menu: {
          entry: 'startMainMenu',
          on: {
            PLAY_MENU: 'play_menu',
            SETTINGS: 'settings',
            CREDITS: 'credits'
          }
        },
        play_menu: {
          entry: 'launchPlayMenu',
          on: {
            RETURN_TO_MAIN: 'main_menu',
            NEW_GAME: 'play_game',
            LOAD_GAME: 'load_game',
            JOIN_GAME: 'join_game'
          }
        },
        play_game: {
          entry: 'playGame',
          on: {
            RETURN_TO_PLAYMENU: 'play_menu'
          }
        },
        settings: {
          entry: 'openSettings',
          on: {
            RETURN_TO_MAIN: 'main_menu'
          }
        },
        credits: {
          entry: 'openCredits',
          on: {
            RETURN_TO_MAIN: 'main_menu'
          }
        },
        load_game: {
          entry: 'loadGame',
          on: {
            RETURN_TO_PLAYMENU: 'play_menu'
          }
        },
        join_game: {
          entry: 'joinGame',
          on: {
            RETURN_TO_PLAYMENU: 'play_menu'
          }
        }
      }
    }, {
      actions: {
        startBoot: this.startBoot.bind(this),
        startMainMenu: this.startMainMenu.bind(this),
        launchPlayMenu: this.launchPlayMenu.bind(this),
        playGame: this.playGame.bind(this),
        openSettings: this.openSettings.bind(this),
        openCredits: this.openCredits.bind(this),
        loadGame: this.loadGame.bind(this),
        joinGame: this.joinGame.bind(this)
      }
    });

    this.scene.get('MainMenu').events.on('menu-selected', function(id) {
      this.scene.stop('MainMenu');
      this.sendStateEvent(id);
    }, this);
  }

  BaseScene.prototype.startBoot = function() {
    this.scene.launch('Boot');
    this.scene.get('Boot').events.once('loading-finished', function() {
      // We don't need boot scene anymore, destroy it
      this.scene.remove('Boot');
      this.sendStateEvent('LOAD_FINISHED');
    }, this);
  }

  BaseScene.prototype.startMainMenu = function() {
    this.scene.launch('MainMenu', { menu: this.menus['main'] });
  }

  BaseScene.prototype.launchPlayMenu = function() {
    this.scene.launch('MainMenu', { menu: this.menus['play'] });
  }

  BaseScene.prototype.openSettings = function() {
    console.log("Launching settings");
    this.sendStateEvent('RETURN_TO_MAIN');
  }

  BaseScene.prototype.openCredits = function() {
    this.scene.launch('Credits');

    this.scene.get('Credits').events.once('return', function() {
      this.scene.stop('Credits');
      this.sendStateEvent('RETURN_TO_MAIN');
    }, this);
  }

  BaseScene.prototype.playGame = function() {
    this.scene.launch('GameplayManager', { new: true, level: 'tutorial-room' });

    this.scene.get('GameplayManager').events.once('game-finished', function() {
      this.scene.stop('GameplayManager');
      this.sendStateEvent('RETURN_TO_PLAYMENU');
    }, this);
  }

  BaseScene.prototype.loadGame = function() {
    console.log("Launching game loading");
    this.sendStateEvent('RETURN_TO_PLAYMENU');
  }

  BaseScene.prototype.joinGame = function() {
    console.log("Launching game joining");
    this.sendStateEvent('RETURN_TO_PLAYMENU');
  }

  ns.BaseScene = BaseScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
