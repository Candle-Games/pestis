(function (ns) {
  function BaseScene() {
    Phaser.Scene.call(this, {
      key: 'BaseScene'
    });

    this.menus = {
      main: [
        {id: 'PLAY_MENU', label: 'Play Pestis'},
        {id: 'SETTINGS', label: 'Settings'},
        {id: 'CREDITS', label: 'Credits'}
      ],
      play: [
        {id: 'NEW_GAME', label: 'New Game'},
        {id: 'LOAD_GAME', label: 'Continue Game', disabled: true },
        {id: 'JOIN_GAME', label: 'Join Game'},
        {id: 'RETURN_TO_MAIN', label: 'Return'},
      ],
      return: [
        {id: 'RETURN_TO_MAIN', label: 'Return'}
      ]
    };
  }

  BaseScene.prototype = Object.create(Phaser.Scene.prototype);
  BaseScene.prototype.constructor = BaseScene;

  Phaser.Class.mixin(BaseScene, [
    candlegames.pestis.scenes.components.State
  ]);

  BaseScene.prototype.preload = function () {
    this.settings.loadSettings();
    this.load.json('game-configuration', '/src/game-configuration.json');
  }

  BaseScene.prototype.create = function () {
    if(this.savedgames.getNumberOfSaves() > 0) {
      this.menus.play[1].disabled = false;
    }

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

    this.scene.get('MenuScene').events.on('menu-selected', function (id) {
      this.scene.stop('MenuScene');
      this.sendStateEvent(id);
    }, this);

    // Setup communications module
    // TODO: Review
    this.comms.setup(game.cache.json.get('game-configuration').comms);
  }

  BaseScene.prototype.startBoot = function () {
    this.scene.launch('Boot');
    this.scene.get('Boot').events.once('loading-finished', function () {
      // We don't need boot scene anymore, destroy it
      this.scene.remove('Boot');
      this.sendStateEvent('LOAD_FINISHED');
    }, this);
  }

  BaseScene.prototype.startMainMenu = function () {
    this.scene.launch('MenuScene', {menu: this.menus['main']});
  }

  BaseScene.prototype.launchPlayMenu = function () {
    this.scene.launch('MenuScene', {menu: this.menus['play']});
  }

  BaseScene.prototype.openSettings = function () {
    this.scene.launch('Settings', {menu: this.menus['return']});

    this.scene.get('Settings').events.on('menu-selected', function (id) {
      this.scene.stop('Settings');
      this.sendStateEvent(id);
    }, this);
  }

  BaseScene.prototype.openCredits = function () {
    this.scene.launch('Credits', {menu: this.menus['return']});

    this.scene.get('Credits').events.once('menu-selected', function () {
      this.scene.stop('Credits');
      this.sendStateEvent('RETURN_TO_MAIN');
    }, this);
  }

  BaseScene.prototype.playGame = function () {
    this.scene.launch('GameplayManager', {new: true, level: 'level1'});

    this.scene.get('GameplayManager').events.once('game-finished', function () {
      this.scene.stop('GameplayManager');
      this.sendStateEvent('RETURN_TO_PLAYMENU');
    }, this);
  }

  BaseScene.prototype.loadGame = function () {
    this.scene.launch('GameLoad', {menu: this.menus['return']})
    this.scene.get('GameLoad').events.once('menu-selected', function () {
      this.scene.stop('GameLoad');
      this.sendStateEvent('RETURN_TO_PLAYMENU');
    }, this);
  }

  BaseScene.prototype.joinGame = function () {
    console.log("Launching game joining");
    this.sendStateEvent('RETURN_TO_PLAYMENU');
  }

  ns.BaseScene = BaseScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
