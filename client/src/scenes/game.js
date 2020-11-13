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
    this.loadingprogressbar.show();
    this.load.on('complete', this.onLoadComplete.bind(this));

    this.loadMap(this.levelConfig);

    this.load.multiatlas('pc1', 'resources/sprites/pc1/pc1.json', 'resources/sprites/pc1/');
    this.load.json('pc1-animations', 'resources/sprites/pc1/pc1-animations.json');

    this.load.multiatlas('lantern', 'resources/sprites/lantern/lantern.json', 'resources/sprites/lantern/');
    this.load.json('lantern-animations', 'resources/sprites/lantern/lantern-animations.json');
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
        this.updateObjectPosition(update[1], update[2], update[3]);
        break;
      case 3: // hideout collision
        this.highlightHideout(update[1], update[2], update[3], update[4], update[5]);
        break;
    }
  }

  Game.prototype.spawnObject = function(id, x, y) {
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

  Game.prototype.updateObjectPosition = function(id, x, y, o, r) {
    if(this.spawnedObjects[id]) {
      var obj = this.spawnedObjects[id];
      obj.setPosition(x, y);
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
    this.levelConfig = undefined;

    // Camera
    this.camera = undefined;

    // Tilemap
    this.mapConfig = undefined;
    this.map = undefined;
    this.tilesets = [];
    this.images = {};
    this.objects = {};
    this.spawnedObjects = {};
  }

  ns.Game = Game;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
