(function(ns) {
  /**
   * Character gameobject
   * @param scene
   * @param x
   * @param y
   * @constructor
   */
  function Character(scene, tiledObject) {
    this.parseTiledObject(tiledObject);

    Phaser.GameObjects.Container.call(this, scene, this._tiledObject.x, this._tiledObject.y);

    this.super = Phaser.GameObjects.Container.prototype;

    this.id = this.getTiledProperty('id');
    this.name = this.getTiledProperty('spawn_object');

    this.setSize(80, 10);
    scene.physics.add.existing(this);

    this.body.setOffset(0, -5);
    this.body.setGravityY(2352);

    this.isCurrentCharacter = false;

    this.hasLantern = false;

    this.initUpdateData();

    // this.walkVelocity = 210 + Math.trunc(Math.random() * 20);   // Initialize in map

    /**
     * Hideout the player is stepping on
     * @type {Phaser.GameObjects.GameObject}
     */
    this.hideout;
  }

  Character.prototype = Object.create(Phaser.GameObjects.Container.prototype);
  Character.prototype.constructor = Character;

  Phaser.Class.mixin(Character, [
    candlegames.pestis.gameobjects.components.State,
    candlegames.pestis.gameobjects.components.TiledObject,
    candlegames.pestis.gameobjects.components.WalkingCharacter,
    candlegames.pestis.gameobjects.components.Chase,
    candlegames.pestis.gameobjects.components.UpdateData
  ]);

  Character.prototype.preUpdate = function(time, delta) {
    if(this.body.onFloor() && this.body.velocity.y==0) {
      this.isJumping = false;
    }

    this.follow(delta);

    if(this.super.preUpdate) {
      this.super.preUpdate.call(this, time, delta);
    }
  }

  Character.prototype.setCurrentCharacter = function(isCurrent) {
    this.isCurrentCharacter = isCurrent;
  }

  Character.prototype.setLantern = function(hasLantern) {
    this.hasLantern = hasLantern;
  }

  ns.Character = Character;

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function CharacterPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('character', this.createCharacter);
  }

  CharacterPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  CharacterPlugin.prototype.constructor = CharacterPlugin;

  CharacterPlugin.prototype.createCharacter = function(tiledSpawnPoint) {
    var character = new Character(this.scene, tiledSpawnPoint);
    this.scene.add.existing(character);
    return character;
  }

  ns.CharacterPlugin = CharacterPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.server'));
