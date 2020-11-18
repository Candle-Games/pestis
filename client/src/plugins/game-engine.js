(function(ns) {
  function GameEngine(scene, pluginManager) {
    Phaser.Plugins.ScenePlugin.call(this, scene, pluginManager);

    /**
     * Keys received from comms modules
     * @type {{ACTION1: number, DOWN: number, LEFT: number, ACTION2: number, RIGHT: number, UP: number}}
     */
    this.keymap = {
      UP:       0,
      DOWN:     1,
      LEFT:     2,
      RIGHT:    3,
      ACTION1:  4,
      ACTION2:  5
    };

    this.keyPressed = {
      UP:       0,
      DOWN:     0,
      LEFT:     0,
      RIGHT:    0,
      ACTION1:  0,
      ACTION2:  0
    };

    this.map;

  }

  GameEngine.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
  GameEngine.prototype.constructor = GameEngine;

  Phaser.Class.mixin(GameEngine, [
    candlegames.pestis.plugins.components.TiledMap
  ]);

  GameEngine.prototype.start = function(map) {
    this.map = undefined;
    this.buildMap(map);
    this.setupPhysics();
    this.notifySpawnedObjects();
    this.indicateEnemiesPath()


    // TODO: review
    this.scene.comms.on('input', this.inputHandler.bind(this), this);
    this.scene.events.on('update', this.update, this);
  }

  GameEngine.prototype.indicateEnemiesPath = function (){
    var npcs = this.npcs.getChildren();
    for(var i=0, length=npcs.length; i < length; ++i) {
      var pathId = npcs[i]._tiledObject._tiledProperties.path;
      npcs[i].selectPath(pathId);
    }
  }

  GameEngine.prototype.notifySpawnedObjects = function() {
    var npcs = this.npcs.getChildren();
    for(var i=0, length=npcs.length; i < length; ++i) {
      this.sendUpdate({ type: 'spawn', object: npcs[i] });
    }

    var pcs = this.pcs.getChildren();
    for(i=0, length=pcs.length; i < length; ++i) {
      this.sendUpdate({ type: 'spawn', object: pcs[i] });
    }
  }

  /**
   * Setups physics
   */
  GameEngine.prototype.setupPhysics = function() {
    this.scene.physics.world.colliders.destroy();
    this.scene.physics.add.collider(this.pcs, this.colliders, this.objectsCollision, null, this);
    this.scene.physics.add.collider(this.npcs, this.colliders, this.objectsCollision, null, this);
    this.scene.physics.add.overlap(this.pcs, this.overspots, this.spotOverlap, null, this);
  }

  /**
   * Player Character <-> Object collision handler
   * @param player
   * @param object
   */
  GameEngine.prototype.objectsCollision = function(player, object) {
    if(object._tiledObject.polygon) {
      SAT.pointInPolygon(new SAT.Vector(player.x, player.y), object.__satPolygon);
    }
  }

  /**
   * Player Character <-> Hideout collision handler
   * @param player
   * @param object
   */
  GameEngine.prototype.spotOverlap = function(player, object) {
    switch(object._tiledObject.type) {
      case 'hideout':
        if(player.hideout === undefined) {
          this.sendUpdate({ type: 'hideoutcollision', is_colliding: true, player: player, object: object });
          player.hideout = object;
        }
        break;
      case 'stairs_top':
      case 'stairs_bottom':
        if(player.stairs_spot === undefined) {
          player.stairs_spot = object;
        }
        break;
    }
  }

  GameEngine.prototype.inputUpdate = function(time, delta) {
    if(this.playerCharacter === undefined) return;

    if(this.playerCharacter.hideout !== undefined) {
      // TODO: Check performance try to speed up
      if(!this.scene.physics.world.overlap(this.playerCharacter, this.playerCharacter.hideout)) {
        this.sendUpdate({ type: 'hideoutcollision', is_colliding: false, player: this.playerCharacter, object: this.playerCharacter.hideout });
        this.playerCharacter.hideout = undefined;
      }
    }

    if(this.playerCharacter.stairs_spot !== undefined) {
      if(!this.scene.physics.world.overlap(this.playerCharacter, this.playerCharacter.stairs_spot)) {
        this.playerCharacter.stairs_spot = undefined;
      }
    }

    if(this.keyPressed.LEFT) {
      this.playerCharacter.walkLeft();
    } else if(this.keyPressed.RIGHT) {
      this.playerCharacter.walkRight();
    } else {
      this.playerCharacter.stop();
    }

    if(this.keyPressed.UP) {
      this.playerCharacter.up(delta);
    } else if(this.keyPressed.DOWN) {
      this.playerCharacter.down(delta);
    }
  }

  /**
   *
   * @param time
   * @param delta
   */
  GameEngine.prototype.update = function(time, delta) {
    if(this.playerCharacter === undefined) return;
    
    this.inputUpdate(time, delta);
    this.sendUpdate({ type: 'position', object: this.playerCharacter });

    var npcs = this.npcs.getChildren();
    for(var i=0, length=npcs.length; i < length; ++i) {
      this.sendUpdate({ type: 'position', object: npcs[i] });
    }
  }

  /**
   * Handles input messages
   * @param input Input message
   */
  GameEngine.prototype.inputHandler = function(input) {
    this.keyPressed.RIGHT = (input & 1 << this.keymap.RIGHT);
    this.keyPressed.LEFT = (input & 1 << this.keymap.LEFT);
    this.keyPressed.UP = (input & 1 << this.keymap.UP);
    this.keyPressed.DOWN = (input & 1 << this.keymap.DOWN);
  }

  /**
   * Sends gameplay updates to comms service
   * @param update
   */
  GameEngine.prototype.sendUpdate = function(update) {
    var length = 0;
    var data = [];

    // if(update.type !== 'spawn') return;

    switch(update.type) {
      case 'spawn':
        data = [ 1, update.object.id, update.object.x, update.object.y ];
        break;
      case 'position':
        data = [ 2, update.object.id, update.object.x, update.object.y ];
        break;
      case 'hideoutcollision':
        data = [ 3, update.is_colliding, update.object.id ];
        break;
    }

    var bdata = new Int32Array(data);
    this.scene.emit('gameplay-update', bdata);
  }

  ns.GameEngine = GameEngine;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
