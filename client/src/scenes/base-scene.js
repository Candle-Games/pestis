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

  BaseScene.prototype.create = function() {
    this.createStateMachine({
      id: 'Game Scene Manager',
      initial: 'load',
      states: {
        load: {
          entry: 'startLoading',
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
          entry: 'launchGame'
        }
      }
    }, {
      actions: {
        startLoading: this.startLoading.bind(this),
        startMainMenu: this.startMainMenu.bind(this),
        launchGame: this.launchGame.bind(this)
      }
    });
  }

  BaseScene.prototype.startLoading = function() {
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
      if(id==='game') {
        this.sendStateEvent('LAUNCH_GAME');
      }
    }, this);
  }

  BaseScene.prototype.launchGame = function() {
    this.scene.stop('MainMenu');
    this.scene.launch('Game');
  }

  ns.BaseScene = BaseScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
