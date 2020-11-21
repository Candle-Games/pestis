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

    this.highlightArrow;

    this.doorKey;
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
  }

  Game.prototype.onLoadComplete = function(value) {
    this.loadingprogressbar.hide();
  }

  Game.prototype.create = function(data) {
    this.comms.on('gameplay-update', this.updateScene, this);

    this.buildMap();
    this.setupCamera();
    this.setupControls(data.input);
    this.setupLights();

    this.highlightArrow = this.add.image(0, 0, 'select-arrow');
    this.highlightArrow.setVisible(false);
    this.music.playGameMusic(this.levelConfig.name);
    this.events.emit('game-scene-created');
  }

  Game.prototype.updateScene = function(update) {
    switch(update[0]) {
      case 1: // Spawn
        this.spawnObject(update);
        break;
      case 2: // Position change
        this.updateObject(update);
        break;
      case 3: // hideout collision
        this.highlightSpot(update[1], update[2], update[3], update[4], update[5], update[6]);
        break;
      case 4:
        this.highlightDoor(update[1], update[2], update[3], update[4], update[5]);
        break;
      case 5:
        this.closeDoor(update[1]);
        break;
      case 6:
        this.events.emit('game-over', 'dead');
        break;
      case 7:
        this.events.emit('game-over', 'escape');
        break;
      case 8:
        this.enemyChase(update[1], update[2]);
        break;

    }
  }

  Game.prototype.enemyChase = function(isChasing, enemyId){
    if(isChasing){
      this.music.playEffect(this.currentCharacter._tiledProperties.music_chase)
    }else{
      this.music.stopEffect(this.currentCharacter._tiledProperties.music_chase);
    }
  }

  Game.prototype.closeDoor = function(doorId) {
    var door = this.spawnedObjects[doorId];
    if(door) { door.setVisible(false) }
    if(this.doorKey) { this.doorKey.destroy(); }
  }

  Game.prototype.highlightDoor = function(isColliding, trigger, door, key, playerHasKey) {
    var door = this.spawnedObjects[door];

    if(door) {
      if(isColliding) {
        this.doorKey = this.add.image(game.canvas.width-100, 100, playerHasKey ? 'has-key' : 'hasnot-key');
        this.doorKey.setScrollFactor(0, 0);
        this.doorKey.setOrigin(1,0);
        this.doorKey.setDepth(1000);
      } else {
        this.doorKey.destroy();
      }
    }
  }

  Game.prototype.spawnObject = function(updateData) {
    var id = updateData[1];
    var x = updateData[2];
    var y = updateData[3];
    var state = updateData[4];
    var isCurrentCharacter = updateData[5];
    var hasLantern = updateData[6];

    var object = this.getMapObject(id);

    var character;

    if(object._tiledProperties.object_type === "playercharacter"){
      character = this.spawnPlayerCharacter(object, state, isCurrentCharacter, hasLantern);
    } else {
      character = this.spawnNonPlayerCharacter(object);
    }

    this.spawnedObjects[character.id] = character;
    character.setPosition(x, y);
    character.setPipeline('Light2D');

    this.spawnedObjects[id] = character;
  }

  Game.prototype.spawnPlayerCharacter = function(object, state, isCurrentCharacter, hasLantern) {
    var playerCharacter = this.add.playercharacter(object);

    if(hasLantern) {
      this.playerLantern = this.add.lantern(0, 0);
      playerCharacter.setLantern(this.playerLantern);
    }

    if(isCurrentCharacter) {
      this.setCurrentCharacter(playerCharacter);
    }

    return playerCharacter;
  }

  Game.prototype.spawnNonPlayerCharacter = function(object) {
    var character = this.add.defaultenemy(object);
    return character;
  }

  Game.prototype.setCurrentCharacter = function(character) {
    this.currentCharacter = character;
    this.cameraFollow(this.currentCharacter);
  }

  Game.prototype.updateObject = function(data) {
    var id = data[1];
    var x = data[2];
    var y = data[3];
    var status = data[4];
    var current = data[5];
    var lantern = data[6];

    if(this.spawnedObjects[id]) {
      var obj = this.spawnedObjects[id];
      obj.setPosition(x, y);
      if(obj.setWalkState) {
        obj.setWalkState(status);
      }
      if(obj.setLantern) {
        obj.setLantern(lantern == 1 ? this.playerLantern : undefined);
      }
    }
  }

  Game.prototype.highlightSpot = function(highlight, id, x, y, width, height) {
    var spot = this.spawnedObjects[id];

    if(highlight) {
      this.highlightArrow.setDepth(this.currentCharacter.depth + 1);
      this.highlightArrow.setPosition(x + (width * 0.5), y - height - 10);
      this.highlightArrow.setVisible(true);
    } else {
      this.highlightArrow.setVisible(false);
    }
  }

  Game.prototype.setupLights = function() {
    this.lights.enable();
    this.lights.addLight().setScrollFactor(0,0);
    this.lights.setAmbientColor(0x444444);
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
    this.music.stopGameMusic();
    this.music.stopAllEffects();

    this.highlightArrow.destroy();

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
