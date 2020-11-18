(function(ns) {
  function Game() {
    Phaser.Scene.call(this, {
      key: 'Game'
    })

    /**
     * Current level configuration
     * @type {Object}
     */
    this.levelConfig;

    /**
     * Character managed by player
     * @type {candlegames.pestis.gameobjects.client.PlayerCharacter}
     */
    this.currentCharacter;

    /**
     * Loaded textures
     */
    this._textures;
  }

  Game.prototype = Object.create(Phaser.Scene.prototype);
  Game.prototype.constructor = Game;

  Phaser.Class.mixin(Game, [
    candlegames.pestis.scenes.components.TiledMap,
    candlegames.pestis.scenes.components.GameCamera
  ]);

  Game.prototype.init = function(data) {
    this.levelConfig = data.levelConfig;

    this.events.off('destroy');
    this.events.on('destroy', this.destroy, this);
  }

  Game.prototype.preload = function() {
    console.log('Game Scene preloading');
    this.loadingprogressbar.show();

    this.load.off('complete');
    this.load.on('complete', this.onLoadComplete.bind(this));

    this.loadMap(this.levelConfig);

    for(var i=0, length=this.levelConfig.characters.length; i < length; ++i) {
      var character = this.levelConfig.characters[i];
      var characterFolder = 'resources/sprites/' + character + '/';
      var characterJson = characterFolder + character + '.json';
      this.load.multiatlas(character, characterJson, characterFolder);

      var characterAnimations = characterFolder + character + '-animations.json';
      this.load.json(character + '-animations', characterAnimations);
    }

    // this.load.multiatlas('pc1', 'resources/sprites/pc1/pc1.json', 'resources/sprites/pc1/');
    // this.load.json('pc1-animations', 'resources/sprites/pc1/pc1-animations.json');
    //
    // this.load.multiatlas('lantern', 'resources/sprites/lantern/lantern.json', 'resources/sprites/lantern/');
    // this.load.json('lantern-animations', 'resources/sprites/lantern/lantern-animations.json');
  }

  Game.prototype.onLoadComplete = function(value) {
    console.log('Game Scene loaded');
    this.loadingprogressbar.hide();
  }

  Game.prototype.create = function(data) {
    console.log('Game Scene created');
    this.comms.on('gameplay-update', this.updateScene, this);

    this.buildMap();
    this.setupCamera();
    this.setupControls(data.input);
    this.setupLights();

    this.events.emit('game-scene-created');
  }

  Game.prototype.updateScene = function(update) {
    switch(update[0]) {
      case 1: // Spawn
        this.spawnObject(update[1], update[2], update[3]);
        break;
      case 2: // Position change
        this.updateObjectPosition(update[1], update[2], update[3], update[4]);
        break;
      case 3: // hideout collision
        this.highlightHideout(update[1], update[2], update[3], update[4], update[5]);
        break;
    }
  }

  Game.prototype.spawnObject = function(id, x, y) {
    console.log("Spawning object " + id);
    var object = this.getMapObject(id);
    var playerCharacter = this.add.playercharacter(object);
    playerCharacter.setPosition(x, y);
    playerCharacter.setPipeline('Light2D');

    this.spawnedObjects[playerCharacter.id] = playerCharacter;

    if(playerCharacter._tiledProperties.object_type !== undefined &&
      playerCharacter._tiledProperties.object_type === 'playercharacter') {
      this.setCurrentCharacter(playerCharacter);
    }
  }

  Game.prototype.setCurrentCharacter = function(character) {
    this.currentCharacter = character;
    this.cameraFollow(this.currentCharacter);
  }

  Game.prototype.updateObjectPosition = function(id, x, y, s) {
    if(this.spawnedObjects[id]) {
      var obj = this.spawnedObjects[id];
      obj.setPosition(x, y);
      obj.setWalkState(s);
    }
  }

  Game.prototype.highlightHideout = function(highlight, id) {
    var hideout = this.spawnedObjects[id];
    if(hideout===undefined) return;

    if(highlight) {
      hideout.resetPipeline();
    } else {
      hideout.setPipeline("Light2D");
    }
  }

  Game.prototype.setupLights = function() {
    this.lights.enable();
    this.lights.addLight().setScrollFactor(0,0);
    this.lights.setAmbientColor(0xaaaaaa);
  }

  Game.prototype.update = function(time, delta) {
    this.inputmanager.updateInputs();
  }

  Game.prototype.setupControls = function(controller) {
    this.inputmanager.selectController(controller);

    if(controller==='keyboard') {
      this.inputmanager.updateKeyboardConfig(this.settings.get('keyboard'));
    }
  }

  Game.prototype.destroy = function() {
    console.log("Shutdown game scene");

    this.currentCharacter.destroy();
    this.levelConfig = undefined;

    this.textures.removeKey('pc1');
    this.textures.removeKey('lantern');

    // Camera
    this.camera = undefined;

    // Tilemap
    this._destroyTileMap();

    // Comms
    this.comms.off('gameplay-update');

    this.input.removeAllListeners();
  }

  ns.Game = Game;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
