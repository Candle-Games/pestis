(function(ns) {
  function GameplayManager() {
    Phaser.Scene.call(this, {
      key: 'GameplayManager'
    });

    this.key;

    this._inGameMenu;

    this._mapsConfig;

    this._currentMap;
  }

  GameplayManager.prototype = Object.create(Phaser.Scene.prototype);
  GameplayManager.prototype.constructor = GameplayManager;

  GameplayManager.prototype.getCurrentMapConfig = function() {
    var key = this._maps[this._currentMap];
    return this._mapsConfig[key];
  }

  GameplayManager.prototype.preload = function(data) {
  }

  GameplayManager.prototype.create = function(data) {
    this.events.once('shutdown', this.shutdown, this);

    this._mapsConfig = this.cache.json.get('maps-config');
    this._maps = _.keys(this._mapsConfig);
    this._currentMap = 0;

    this.key = this.input.keyboard.addKey('ESC');
    this.key.once('down', this.escapePressed, this);

    if(data.new) {
      this.startLevel();
    }
  }

  GameplayManager.prototype.startLevel = function() {
    this._levelBanner = this.add.text(game.canvas.width / 2, game.canvas.height / 2,
      this.i18n.get('level_banner') + this._currentMap, { fontSize: 50, fontFamily: 'MedievalSharp'});
    this._levelBanner.setOrigin(0.5, 0.5);
    
    var levelConfig = this.getCurrentMapConfig();
    this.scene.add('Game', candlegames.pestis.client.scenes.Game);
    this.scene.launch('Game', { levelConfig: levelConfig, input: 'keyboard' });
    this.scene.get('Game').events.once('game-scene-created', this.gameSceneCreated, this);
    this.scene.get('Game').events.once('game-over', this.gameOver.bind(this));
  }

  GameplayManager.prototype.gameSceneCreated = function() {
    var levelConfig = this.getCurrentMapConfig();
    if(this.comms.online) {
      this.comms.emit('start-level', {level: levelConfig.name});
    } else {
      this.scene.add('GameEngineScene', candlegames.pestis.server.scenes.GameEngineScene);
      this.scene.launch('GameEngineScene', { level: levelConfig.name });
    }
  }

  GameplayManager.prototype.gameOver = function() {
    this.stopLevel();
    this._currentMap = (this._currentMap + 1) % this._maps.length;
    window.setTimeout(function() {
      this.startLevel('level1');
    }.bind(this), 1000);

    /*
    TODO: It doesn't work like this, check it out...
    this.time.delayedCall(1000, function() {
      this.startLevel('level1');
    }, [], this);
    */
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
