(function(ns) {
    /**
     * Enemy gameobject
     * @param scene
     * @param x
     * @param y
     * @constructor
     */
    function Enemy(scene, tiledObject) {
        this.parseTiledObject(tiledObject);

        Phaser.GameObjects.Container.call(this, scene, this._tiledObject.x, this._tiledObject.y);

        this.id = this.getTiledProperty('id');
        this.name = this.getTiledProperty('spawn_object');

        this.setSize(80, 5);
        scene.physics.add.existing(this);

        this.body.setOffset(0, -5);
        this.body.setGravityY(2352);

    }

    Enemy.prototype = Object.create(Phaser.GameObjects.Container.prototype);
    Enemy.prototype.constructor = Enemy;

    Phaser.Class.mixin(Enemy, [
        candlegames.pestis.gameobjects.components.State,
        candlegames.pestis.gameobjects.components.TiledObject,
        candlegames.pestis.gameobjects.components.WalkingCharacter,
    ]);


    ns.Enemy = Enemy;

    /**
     * Enemy gameobject loader plugin
     * @param pluginManager
     * @constructor
     */
    function EnemyPlugin(pluginManager) {
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject('enemy', this.createEnemy);
    }

    EnemyPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    EnemyPlugin.prototype.constructor = EnemyPlugin;

    EnemyPlugin.prototype.createEnemy = function(tiledSpawnPoint) {
        var enemy = new Enemy(this.scene, tiledSpawnPoint);
        this.scene.add.existing(enemy);
        return enemy;
    }

    ns.EnemyPlugin = EnemyPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.server'));
