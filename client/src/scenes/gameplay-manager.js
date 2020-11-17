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
    this.key.once('down', this.escapePressed, this);

    if(data.new) {
      this.startLevel(data.level);
    }
  }

  GameplayManager.prototype.startLevel = function(levelName) {
    var mapsConfig = this.cache.json.get('maps-config');
    var levelConfig = mapsConfig[levelName];

    this.scene.add('Game', candlegames.pestis.client.scenes.Game);
    this.scene.launch('Game', { levelConfig: levelConfig, input: 'keyboard' });

    this.scene.get('Game').events.once('game-scene-created', function() {
      if(this.comms.online) {
        this.comms.emit('start-level', {level: levelConfig.name});
      } else {
        this.scene.add('GameEngineScene', candlegames.pestis.server.scenes.GameEngineScene);
        this.scene.launch('GameEngineScene', { level: levelConfig.name });
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
    this.generateSaveData(function(saveData) {
      this.scene.get('Game').scene.pause();
      this.startInGameMenu(saveData);
    }.bind(this));
  }

  GameplayManager.prototype.startInGameMenu = function(saveData) {
    if(this._inGameMenu===undefined) {
      this.scene.add('InGameMenu', candlegames.pestis.client.scenes.InGameMenu);
      this._inGameMenu = this.scene.get('InGameMenu');
      this._inGameMenu.events.on('menu-selected', this.inGameMenuSelected, this);
    }

    this.scene.launch('InGameMenu', saveData).bringToTop();
    this.key.once('down', this.returnToGame, this);
  }

  GameplayManager.prototype.inGameMenuSelected = function(id, optionSelected) {
    this._inGameMenu.scene.stop();

    switch (id) {
      case 'RETURN':
        this.returnToGame();
        break;
      case 'RETURN_TO_MAIN':
        this.returnToMainMenu();
        break;
    }
  }

  GameplayManager.prototype.returnToGame = function() {
    this.scene.remove('InGameMenu');
    this._inGameMenu = undefined;
    this.scene.get('Game').scene.resume();
    
    this.key.once('down', this.escapePressed, this);
  }

  GameplayManager.prototype.returnToMainMenu = function() {
    this.stopLevel();
    this.events.emit('game-finished')
  }

  GameplayManager.prototype.shutdown = function() {
    console.log("Shutting down GamePlayManager");
    if(this._inGameMenu !== undefined) {
      this.scene.remove('InGameMenu');
      this._inGameMenu = undefined;
    }
  }

  GameplayManager.prototype.generateSaveData = function(callback) {
    var callback = callback;
    var saveData = {};

    if(this.comms.online) {
      // TODO: Get state from server
    } else {
      var gameEngineScene = this.scene.get('GameEngineScene');
      saveData = gameEngineScene.getGameState();
    }

    this.game.renderer.snapshot(function(image) {
      saveData.snapshot = image.src;
      saveData.timestamp = Date.now();

      callback(saveData);
    }.bind(this));
  }

  GameplayManager.prototype.generateSnapshot = function() {
    this.game.renderer.snapshot(function(image) {
      var link = document.createElement('a');
      link.setAttribute("href", image.src);
      link.setAttribute("download", 'snapshot.png');
      link.click();
    });
  }

  ns.GameplayManager = GameplayManager;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
