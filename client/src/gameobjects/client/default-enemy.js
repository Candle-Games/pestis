(function(ns){
    function DefaultEnemy(scene, tiledSpawnPoint){
        this.parseTiledObject(tiledSpawnPoint);

        Phaser.GameObjects.Sprite.call(this, scene, this._tiledObject.x, this._tiledObject.y,
        this._tiledProperties.spawn_object);

        this.id = this._tiledObject.id;
        this.name = this._tiledProperties.spawn_object;

        this.setOriginFromFrame();
        this.generateAnimations(this._tiledProperties.spawn_object);

        this.createStateMachine({
            id: 'enemy',
            initial: 'idle',
            states:{
                idle: {
                    entry: ['startIdle'],
                    on: {
                        WALK: 'walking',
                        RUN: 'running',
                        FLY: 'flying'
                    }
                },
                walking: {
                    entry: ['startWalking'],
                    on: {
                        STOP: 'idle',
                        RUN: 'running'
                    },
                },
                flying: {},
                running: {}
            }
        }, {
            actions: {
                'startWalking': this._walk.bind(this),
                'startIdle': this._stop.bind(this)
            }
        })

    }

    DefaultEnemy.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
    DefaultEnemy.prototype.constructor = DefaultEnemy;

    Phaser.Class.mixin(DefaultEnemy, [
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
    DefaultEnemy.prototype._walk = function(context, event) {
        this.play(this._animations.walk);
    }

    /**
     * Called when idle state is started
     * @param context
     * @param event
     * @private
     */
    DefaultEnemy.prototype._stop = function(context, event){
        console.log("enemy playing idle");
        this.play(this._animations.idle);
    }

    /**
     * @override Phaser.GameObjects.Sprite
     */
    DefaultEnemy.prototype.setPosition = function(x, y, z, w) {
        if (Math.abs(this.x - x) > 0) {
            this.sendStateEvent('WALK');
            this.setFlipX(x < this.x);
        } else {
            this.sendStateEvent('STOP');
        }

        // Call parent setPosition
        Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y, z, w);
    }

    ns.DefaultEnemy = DefaultEnemy;

    /**
     * Enemy gameobject loader plugin
     * @param pluginManager
     * @constructor
     */
    function DefaultEnemyPlugin(pluginManager) {
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject ('defaultenemy', this.createDefaultEnemy);
    }

    DefaultEnemyPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    DefaultEnemyPlugin.prototype.constructor = DefaultEnemyPlugin;

    DefaultEnemyPlugin.prototype.createDefaultEnemy = function(tiledSpawnPoint) {
        var enemy = new DefaultEnemy(this.scene, tiledSpawnPoint);
        this.scene.add.existing(enemy);
        return enemy;
    }

    ns.DefaultEnemyPlugin = DefaultEnemyPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));