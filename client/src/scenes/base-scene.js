(function(ns) {
  function BaseScene() {
    Phaser.Scene.call(this, {
      key: 'BaseScene'
    });
  }

  BaseScene.prototype = Object.create(Phaser.Scene.prototype);
  BaseScene.prototype.constructor = BaseScene;

  Phaser.Class.mixin(BaseScene, [
    candlegames.pestis.scenes.components.State
  ]);

  BaseScene.prototype.preload = function() {
    this.config.loadConfiguration();
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
            LAUNCH_GAME: 'game'
          }
        },
        game: {
          entry: 'launchGame',
          on: {
            RETURN_FROM_GAME: 'main_menu'
          }
        }
      }
    }, {
      actions: {
        startBoot: this.startBoot.bind(this),
        startMainMenu: this.startMainMenu.bind(this),
        launchGame: this.launchGame.bind(this)
      }
    });
  }

  BaseScene.prototype.startBoot = function() {
    this.scene.launch('Boot');
    this.scene.get('Boot').events.on('loading-finished', function() {
      // We don't need boot scene anymore, destroy it
      this.scene.remove('Boot');
      this.sendStateEvent('LOAD_FINISHED');
    }, this);
  }

  BaseScene.prototype.startMainMenu = function() {
    this.scene.launch('MainMenu');
    this.scene.get('MainMenu').events.on('menu-selected', function(id) {
      if(id==='play-menu') {
        this.scene.stop('MainMenu');
        this.sendStateEvent('LAUNCH_GAME');
      }
    }, this);
  }

  BaseScene.prototype.launchGame = function() {
    this.scene.launch('PlayMenu');
    this.scene.get('PlayMenu').events.on('end-play-menu', function() {
      this.scene.stop('PlayMenu');
      this.sendStateEvent('RETURN_FROM_GAME');
    }, this);
  }

  ns.BaseScene = BaseScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
