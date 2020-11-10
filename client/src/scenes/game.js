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
  }

  Game.prototype.setupControls = function() {
    this.keymapvalue = 0;

    this.keymap = {
      UP:       0,
      DOWN:     1,
      LEFT:     2,
      RIGHT:    3,
      ACTION1:  4,
      ACTION2:  5
    };

    this.input.keyboard.on('keydown', this.handleKeyDown, this);
    this.input.keyboard.on('keyup', this.handleKeyUp, this);
  }

  Game.prototype.handleKeyDown = function(event) {
    var keymapvalue = this.keymapvalue;
    switch(event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.W:
        keymapvalue |= (1 << this.keymap.UP);
        break;
      case Phaser.Input.Keyboard.KeyCodes.S:
        keymapvalue |= (1 << this.keymap.DOWN);
        break;
      case Phaser.Input.Keyboard.KeyCodes.A:
        keymapvalue |= (1 << this.keymap.LEFT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.D:
        keymapvalue |= (1 << this.keymap.RIGHT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.COMMA:
        keymapvalue |= (1 << this.keymap.ACTION1);
        break;
      case Phaser.Input.Keyboard.KeyCodes.PERIOD:
        keymapvalue |= (1 << this.keymap.ACTION2);
        break;
    }
    this.sendInput(keymapvalue);
  }

  Game.prototype.handleKeyUp = function(event) {
    var keymapvalue = this.keymapvalue;
    switch(event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.W:
        keymapvalue &= ~(1 << this.keymap.UP);
        break;
      case Phaser.Input.Keyboard.KeyCodes.S:
        keymapvalue &= ~(1 << this.keymap.DOWN);
        break;
      case Phaser.Input.Keyboard.KeyCodes.A:
        keymapvalue &= ~(1 << this.keymap.LEFT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.D:
        keymapvalue &= ~(1 << this.keymap.RIGHT);
        break;
      case Phaser.Input.Keyboard.KeyCodes.COMMA:
        keymapvalue &= ~(1 << this.keymap.ACTION1);
        break;
      case Phaser.Input.Keyboard.KeyCodes.PERIOD:
        keymapvalue &= ~(1 << this.keymap.ACTION2);
        break;
    }
    this.sendInput(keymapvalue);
  }

  Game.prototype.sendInput = function(keymapvalue) {
    if(this.keymapvalue != keymapvalue) {
      // Sends input to comms system
      this.comms.emit('input', keymapvalue);
      this.keymapvalue = keymapvalue;
    }
  }

  ns.Game = Game;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
