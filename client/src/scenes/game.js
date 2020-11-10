(function(ns) {
  function Game() {
    Phaser.Scene.call(this, {
      key: 'Game'
    })

    this.levelConfig = {
      "name": "tutorial-room",
      "description": "Tutorial",
      "images": [
        "bedchild.png",
        "bedparents.png",
        "chairleft.png",
        "chairright.png",
        "chest.png",
        "chimney-top.png",
        "chimney.png",
        "closet.png",
        "coats.png",
        "firewood.png",
        "sidetable.png",
        "stairs.png",
        "table.png",
        "tutorial-roof.png",
        "tutorial-wall.png"
      ]
    };

    this.currentLevel = 'tutorial-room';

    /**
     * Character managed by player
     * @type {undefined}
     */
    this.currentCharacter = undefined;
  }

  Game.prototype = Object.create(Phaser.Scene.prototype);
  Game.prototype.constructor = Game;

  Phaser.Class.mixin(Game, [
    candlegames.pestis.scenes.components.TiledMap,
    candlegames.pestis.scenes.components.GameCamera
  ]);

  Game.prototype.preload = function() {
    this.loadingprogressbar.show();
    this.load.on('complete', this.onLoadComplete.bind(this));

    this.loadMap(this.levelConfig);

    this.load.multiatlas('pc1', 'resources/sprites/pc1/pc1.json', 'resources/sprites/pc1/');
    this.load.json('pc1-animations', 'resources/sprites/pc1/pc1-animations.json');

    this.load.multiatlas('lantern', 'resources/sprites/lantern/lantern.json', 'resources/sprites/lantern/');
    this.load.json('lantern-animations', 'resources/sprites/lantern/lantern-animations.json');
  }

  Game.prototype.create = function() {
    this.comms.on('gameplay-update', this.updateScene, this);

    this.buildMap();
    this.setupCamera();
    this.setupControls();
    this.setupLights();

    // TODO: This should be done only working in offline mode
    this.game_engine.init(this.map);
  }

  Game.prototype.setupControls = function() {
    this.inputmanager.selectController('keyboard');
    this.inputmanager.updateKeyboardConfig(this.config.configuration.keyboard);
  }

  Game.prototype.updateScene = function(update) {
    if(!update.data) return;

    var data = update.data;
    switch(data[0]) {
      case 1: // Spawn
        this.spawnObject(data[1], data[2], data[3]);
        break;
      case 2: // Position change
        this.updateObjectPosition(data[1], data[2], data[3]);
        break;
      case 3: // hideout collision
        this.highlightHideout(data[1], data[2], data[3], data[4], data[5]);
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
    this.lights.enable().setAmbientColor(0x555555);
  }


  Game.prototype.onLoadComplete = function(value) {
    console.log('Scene loaded');
    this.loadingprogressbar.hide();
  }

  Game.prototype.update = function(time, delta) {
    this.inputmanager.updateInputs();
  }

  ns.Game = Game;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
