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

        this.super = Phaser.GameObjects.Container.prototype;

        this.id = this.getTiledProperty('id');
        this.name = this.getTiledProperty('spawn_object');

        this.setSize(80, 10);
        scene.physics.add.existing(this);

        this.body.setOffset(0, -5);
        this.body.setGravityY(2352);

        this.line = new Phaser.Geom.Line(0,0,0,0);

        this.currentMusic=undefined;
    }

    Enemy.prototype = Object.create(Phaser.GameObjects.Container.prototype);
    Enemy.prototype.constructor = Enemy;

    Phaser.Class.mixin(Enemy, [
        candlegames.pestis.gameobjects.components.State,
        candlegames.pestis.gameobjects.components.TiledObject,
        candlegames.pestis.gameobjects.components.WalkingEnemies,
    ]);

    Enemy.prototype.preUpdate = function(time, delta) {
        this.searchCharacters();
        this._walk();
        if(this.super.preUpdate !== undefined)
        {
            this.super.preUpdate.call(this, time, delta);
        }
    }

    Enemy.prototype.searchCharacters = function() {
        this.line.setTo(this.body.x, this.body.y  -264 * 0.5, this.body.x + this.vision * this.currentDirection, this.body.y - 264 * 0.5)
        this.currentPlayer = undefined;

        var pcs = this.scene.game_engine.pcs.getChildren()
        for(var i=0; i<pcs.length; i++){
            var pc=pcs[i];
            var pcRect =  new Phaser.Geom.Rectangle(pc.body.x - (pc.body.width * 0.5), pc.body.y - (264 * 0.5), pc.body.width, 264);
            var intersection = Phaser.Geom.Intersects.LineToRectangle(this.line, pcRect);
            if(intersection){
                console.log(this.line);
                console.log(pcRect);
                //if(!pc.isHideout){
                    this.currentPlayer = pc;
                    if(this.currentMusic === undefined){
                        this.currentMusic = pc._tiledProperties.music_chase
                        this.scene.music.playEffect(this.currentMusic);
                    }
                //}
                break;
            }
        }
        if(this.currentPlayer === undefined && this.currentMusic !== undefined){
            this.scene.music.stopEffect(this.currentMusic)
            this.currentMusic=undefined;
        }
    }

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
