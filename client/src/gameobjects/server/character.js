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

    this.id = this.getTiledProperty('id');
    this.name = this.getTiledProperty('spawn_object');

    this.setSize(80, 5);
    scene.physics.add.existing(this);

    this.body.setOffset(0, -5);
    this.body.setGravityY(2352);

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
  ]);


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
