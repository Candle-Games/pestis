(function(ns) {
  function PlayerCharacter(scene, tiledSpawnPoint) {
    this.parseTiledObject(tiledSpawnPoint);

    Phaser.GameObjects.Sprite.call(this, scene, this._tiledObject.x, this._tiledObject.y,
      this._tiledProperties.spawn_object);


    if(this._tiledProperties.object_type === 'playercharacter') {

      this.id = this._tiledObject.id;
      this.name = this._tiledProperties.spawn_object;

      this.setOriginFromFrame();
      this.generateAnimations(this._tiledProperties.spawn_object);

      this.lantern = scene.add.lantern(this.x, this.y);
      this.lantern.setOrigin(this.originX, this.originY);

      this.createStateMachine({
            id: 'character',
            initial: 'idle',
            states: {
              idle: {
                entry: ['startIdle'],
                on: {
                  WALK: 'walking',
                  HIDE: 'hiding',
                  RUN: 'running',
                  JUMP: 'jumping'
                }
              },
              walking: {
                entry: ['startWalking'],
                on: {
                  STOP: 'idle',
                  RUN: 'running'
                },
              },
              hiding: {},
              running: {},
              jumping: {}
            }
          }, {
            actions: {
              'startWalking': this._walk.bind(this),
              'startIdle': this._stop.bind(this)
            }
          }
      )
    }
  }

  PlayerCharacter.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
  PlayerCharacter.prototype.constructor = PlayerCharacter;

  Phaser.Class.mixin(PlayerCharacter, [
    candlegames.pestis.gameobjects.components.State,
    candlegames.pestis.gameobjects.components.TiledObject,
    candlegames.pestis.gameobjects.components.Animated
  ]);

  /**
   * Called when walk state is started
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._walk = function(context, event) {
    console.log("Playing walk");
    this.play(this._animations.walk);
    this.lantern.play(this.lantern._animations.walk);
  }

  /**
   * Called when idle state is started
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._stop = function(context, event) {
    console.log("Playing idle");
    this.play(this._animations.idle);
  }

  /**
   * @override Phaser.GameObjects.Sprite
   */
  PlayerCharacter.prototype.setPosition = function(x, y, z, w) {
    if(Math.abs(this.x - x) > 0) {
      this.sendStateEvent('WALK');
      this.setFlipX(x < this.x);
    } else {
      this.sendStateEvent('STOP');
    }

    // Call parent setPosition
    Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y, z, w);

    if(this.lantern !== undefined) {
      this.lantern.setFlipX(this.flipX);
      this.lantern.setPosition(this.x, this.y);
    }
  }

  ns.PlayerCharacter = PlayerCharacter;

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function PlayerCharacterPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('playercharacter', this.createPlayerCharacter);
  }

  PlayerCharacterPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  PlayerCharacterPlugin.prototype.constructor = PlayerCharacterPlugin;

  PlayerCharacterPlugin.prototype.createPlayerCharacter = function(tiledSpawnPoint) {
    var character = new PlayerCharacter(this.scene, tiledSpawnPoint);
    this.scene.add.existing(character);
    return character;
  }

  ns.PlayerCharacterPlugin = PlayerCharacterPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));
