(function(ns) {
  function GameplayManager() {
    Phaser.Scene.call(this, {
      key: 'GameplayManager'
    });

    this.key;

    this._inGameMenu;
  }

  GameplayManager.prototype = Object.create(Phaser.Scene.prototype);
  GameplayManager.prototype.constructor = GameplayManager;

  GameplayManager.prototype.preload = function(data) {
    this.load.json('maps-config', '/resources/maps/maps.json');
  }

  GameplayManager.prototype.create = function(data) {
    this.events.once('shutdown', this.shutdown, this);

    this.key = this.input.keyboard.addKey('ESC');
    this.key.on('down', this.escapePressed, this);

    if(data.new) {
      this.startLevel(data.level);
    }
  }

  GameplayManager.prototype.startLevel = function(levelName) {
    var mapsConfig = this.cache.json.get('maps-config');
    var levelConfig = mapsConfig[levelName];

    this.scene.add('Game', candlegames.pestis.client.scenes.Game);
    this.scene.launch('Game', { levelConfig: levelConfig, input: 'virtualjoystick' });

    this.scene.get('Game').events.once('game-scene-created', function() {
      if(this.comms.online) {
        this.comms.emit('start-level', {level: levelName});
      } else {
        this.scene.add('GameEngineScene', candlegames.pestis.server.scenes.GameEngineScene);
        this.scene.launch('GameEngineScene', { level: levelName });
      }
    }.bind(this));

  }

  GameplayManager.prototype.stopLevel = function() {
    this.scene.remove('Game');
    if(this.comms.online) {
      this.comms.emit('stop-level');
    } else {
      this.scene.remove('GameEngineScene');
    }
  }

  GameplayManager.prototype.escapePressed = function() {
    this.scene.get('Game').scene.pause();
    this.startInGameMenu();
  }

  GameplayManager.prototype.startInGameMenu = function() {
    if(this._inGameMenu===undefined) {
      this.scene.add('InGameMenu', candlegames.pestis.client.scenes.InGameMenu);
      this._inGameMenu = this.scene.get('InGameMenu');
      this._inGameMenu.events.on('menu-selected', this.inGameMenuSelected, this);
    }

    this.scene.launch('InGameMenu').bringToTop();
  }

  GameplayManager.prototype.inGameMenuSelected = function(id, optionSelected) {
    this._inGameMenu.scene.stop();

    switch (id) {
      case 'RETURN':
        this.scene.get('Game').scene.resume();
        break;
      case 'RETURN_TO_MAIN':
        this.stopLevel();
        this.events.emit('game-finished')
        break;
    }
  }

  GameplayManager.prototype.shutdown = function() {
    console.log("Shutting down GamePlayManager");
    if(this._inGameMenu !== undefined) {
      this.scene.remove('InGameMenu');
      this._inGameMenu = undefined;
    }
  }

  ns.GameplayManager = GameplayManager;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
