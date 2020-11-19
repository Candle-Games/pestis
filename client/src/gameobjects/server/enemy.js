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

        this.visionLine = new Phaser.Geom.Line(0,0,0,0);
        this.killLine = new Phaser.Geom.Line(0,0,0,0);

        this.currentMusic=undefined;

        this.timeWaiting = -1;
    }

    Enemy.prototype = Object.create(Phaser.GameObjects.Container.prototype);
    Enemy.prototype.constructor = Enemy;

    Phaser.Class.mixin(Enemy, [
        candlegames.pestis.gameobjects.components.State,
        candlegames.pestis.gameobjects.components.TiledObject,
        candlegames.pestis.gameobjects.components.WalkingEnemies,
    ]);

    Enemy.prototype.preUpdate = function(time, delta) {
        if(this.timeWaiting<0){
            this.searchCharacters(time);
        }else{
            if(time-this.timeWaiting > 5000){ //5 segundos
                this.timeWaiting = -1;
                this.lastCharacterPosition = -1;
            }
        }
        this.walk();

        if(this.super.preUpdate !== undefined)
        {
            this.super.preUpdate.call(this, time, delta);
        }
    }

    Enemy.prototype.searchCharacters = function(time) {
        this.visionLine.setTo(this.body.x, this.body.y  -264 * 0.5, this.body.x + this.vision * this.currentDirection, this.body.y - 264 * 0.5)
        this.currentPlayer = undefined;

        var pcs = this.scene.game_engine.pcs.getChildren()
        for(var i=0; i<pcs.length; i++){
            var pc=pcs[i];
            var pcRect =  new Phaser.Geom.Rectangle(pc.body.x - (pc.body.width * 0.5), pc.body.y - (264 * 0.5), pc.body.width, 264);
            var intersection = Phaser.Geom.Intersects.LineToRectangle(this.visionLine, pcRect);
            if(intersection) {
                if(!pc.isHiding && pc.stairs === undefined) {
                    this.currentPlayer = pc;
                    this.lastCharacterPosition = pc.body.x;
                    if(this.currentMusic === undefined){
                        this.currentMusic = pc._tiledProperties.music_chase;
                        this.scene.music.playEffect(this.currentMusic);
                    }
                    this.killLine.setTo(this.body.x, this.body.y  -264 * 0.5, this.body.x + this.distanceToKill * this.currentDirection, this.body.y - 264 * 0.5)
                    var caugth = Phaser.Geom.Intersects.LineToRectangle(this.killLine, pcRect);
                    if(caugth){
                        console.log("finish Game");
                    }
                }
                break;
            }
        }
        if(this.currentPlayer === undefined && this.currentMusic !== undefined){
            this.scene.music.stopEffect(this.currentMusic)
            this.currentMusic=undefined;
            this.timeWaiting = time;
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
