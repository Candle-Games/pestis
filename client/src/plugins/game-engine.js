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

    /**
     * Current player character
     * @type {Character}
     */
    this.playerCharacter = undefined;

    /**
     * Brother charcter
     * @type {Character}
     */
    this.brotherCharacter = undefined;
  }

  GameEngine.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
  GameEngine.prototype.constructor = GameEngine;

  Phaser.Class.mixin(GameEngine, [
    candlegames.pestis.plugins.components.TiledMap
  ]);

  GameEngine.prototype.start = function(map) {
    this.map = undefined;
    this.buildMap(map);
    this.setupPlayerCharacters();
    this.setupPhysics();
    this.notifySpawnedObjects();
    this.indicateEnemiesPath();


    // TODO: review
    this.scene.comms.on('input', this.inputHandler.bind(this), this);
    this.scene.events.on('update', this.update, this);
  }

  GameEngine.prototype.setupPlayerCharacters = function() {
    var pc1 = this.pcs.children.entries[0];
    var pc2 = this.pcs.children.entries[1];
    this.setPlayerCharacter(pc1, pc2);
  }

  GameEngine.prototype.changePlayerCharacters = function() {
    var pc = this.playerCharacter;
    var brother = this.brotherCharacter;
    if(brother !== undefined) {
      this.setPlayerCharacter(brother, pc);
    }
  }

  GameEngine.prototype.setPlayerCharacter = function(pc1, pc2) {
    this.playerCharacter = pc1;
    this.playerCharacter.setCurrentCharacter(true);
    this.playerCharacter.setLantern(true);
    this.playerCharacter.setFollowTarget(undefined);

    if(pc2 !== undefined) {
      this.brotherCharacter = pc2;
      this.brotherCharacter.setCurrentCharacter(false);
      this.brotherCharacter.setLantern(false);
      this.brotherCharacter.setFollowTarget(this.playerCharacter);
    }
  }

  GameEngine.prototype.indicateEnemiesPath= function (){
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
    if(object._tiledObject.type === 'door'){
      var doorkey = object._tiledProperties.key;
      if(player.hasKey(doorkey)){
        object.destroy();
      }
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
          this.sendUpdate({ type: 'spotcollision', is_colliding: true, player: player, object: object });
          player.hideout = object;
        }
        break;
      case 'stairs_top':
      case 'stairs_bottom':
        if(player.stairs_spot === undefined) {
          player.stairs_spot = object;
          this.sendUpdate({ type: 'spotcollision', is_colliding: true, player: player, object: object });
        }
        break;
      case 'tunnel':
        if(player.tunnel_spot === undefined) {
          player.tunnel_spot = object;
          this.sendUpdate({ type: 'spotcollision', is_colliding: true, player: player, object: object });
        }
        break;
      case 'key':
        if(player.key === undefined){
          player.key = object;
          this.sendUpdate({ type: 'spotcollision', is_colliding: true, player: player, object: object });
        }
    }
  }

  GameEngine.prototype.checkOverlapEnd = function() {
    for(var i=0, length=this.pcs.children.entries.length; i < length; i++) {
      var pc = this.pcs.children.entries[i];

      // Check hideouts
      if(pc.hideout !== undefined) {
        if (!this.scene.physics.world.overlap(pc, pc.hideout)) {
          if (pc === this.playerCharacter) {
            this.sendUpdate({type: 'spotcollision', is_colliding: false, player: pc, object: pc.hideout});
          }
          pc.hideout = undefined;
          pc.setHiding(false);
        }
      }

      // Check stairs spots
      if(pc.stairs_spot !== undefined) {
        if(!this.scene.physics.world.overlap(pc, pc.stairs_spot)) {
          this.sendUpdate({type: 'spotcollision', is_colliding: false, player: pc, object: pc.stairs_spot});
          pc.stairs_spot = undefined;
        }
      }

      // Check tunnel spots
      if(pc.tunnel_spot !== undefined) {
        if(!this.scene.physics.world.overlap(pc, pc.tunnel_spot)) {
          this.sendUpdate({type: 'spotcollision', is_colliding: false, player: pc, object: pc.tunnel_spot});
          pc.tunnel_spot = undefined;
        }
      }


      //Check key
      if(pc.key !== undefined){
        if(!this.scene.physics.world.overlap(pc,pc.key)){
          this.sendUpdate({type: 'spotcollision', is_colliding: false, player: pc, object: pc.key});
          this.sendUpdate({type: 'spotcollision', object: pc.key});
          pc.key = undefined;
        }
      }
    }
  }

  GameEngine.prototype.inputUpdate = function(time, delta) {
    if(this.playerCharacter === undefined) return;

    if(!this.action2Pressed && this.keyPressed.ACTION2) {
      if(!this.playerCharacter.isJumping && !this.playerCharacter.stairsUp && !this.playerCharacter.stairsDown) {
        this.changePlayerCharacters();
      }
      this.action2Pressed = true;
    } else if(!this.keyPressed.ACTION2) {
      this.action2Pressed = false;
    }

    if(this.keyPressed.ACTION1 && this.playerCharacter.key !== undefined){
      var key = this.playerCharacter.key;
      this.playerCharacter.keys.push(key);
      key.setPosition(-100,-100);
      this.sendUpdate({type: 'position', object: key});
    }

    if(this.keyPressed.UP) {
      this.upPressed = true;
      this.playerCharacter.up(delta);
      return;
    } else if(this.keyPressed.DOWN) {
      this.downPressed = true;
      this.playerCharacter.down(delta);
      return;
    } else {
      if(this.upPressed) {
        this.upPressed = false;
        this.playerCharacter.upEnd();
      } else if(this.downPressed) {
        this.downPressed = false;
        this.playerCharacter.downEnd();
      }
    }

    if(this.keyPressed.LEFT) {
      this.playerCharacter.walkLeft();
    } else if(this.keyPressed.RIGHT) {
      this.playerCharacter.walkRight();
    } else {
      this.playerCharacter.stop();
    }
  }

  /**
   *
   * @param time
   * @param delta
   */
  GameEngine.prototype.update = function(time, delta) {
    this.checkOverlapEnd();
    this.inputUpdate(time, delta);

    for(var i=0, length=this.pcs.children.entries.length; i < length; ++i) {
      this.sendUpdate({ type: 'position', object: this.pcs.children.entries[i] });
    }

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
    this.keyPressed.ACTION1 = (input & 1 << this.keymap.ACTION1);
    this.keyPressed.ACTION2 = (input & 1 << this.keymap.ACTION2);
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
        if(update.object.getUpdateData !== undefined) {
          data = update.object.getUpdateData(1);
        } else {
          data = [ 1, update.object.id, update.object.x, update.object.y ];
        }
        break;
      case 'position':
        // If needed until all objects have getUpdateData implemented
        if(update.object.getUpdateData !== undefined) {
          data = update.object.getUpdateData(2);
        } else {
          data = [ 2, update.object.id, update.object.x, update.object.y, 0 ];
        }
        break;
      case 'spotcollision':
        data = [ 3, update.is_colliding, update.object.id, update.object.x, update.object.y,
          update.object.width, update.object.height ];
        break;
    }

    var bdata = new Int32Array(data);
    this.scene.emit('gameplay-update', bdata);
  }

  GameEngine.prototype.getGameState = function() {
    var pcs = this.pcs.getChildren();
    var characters = [];

    for(var i=0, length=pcs.length; i < length; ++i) {
      var pc = pcs[i];
      characters.push({
        id: pc.id,
        c: pc.x,
        y: pc.y
      });
    }

    var npcs = this.npcs.getChildren();
    var noncharacters = [];
    for(var i=0, length=npcs.length; i < length; ++i) {
      var npc = npcs[i];
      noncharacters.push({
        id: npc.id,
        x: npc.x,
        y: npc.y
      })
    }

    return {
      map: this.mapName,
      pcs: characters,
      npcs: noncharacters
    };
  }

  ns.GameEngine = GameEngine;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
