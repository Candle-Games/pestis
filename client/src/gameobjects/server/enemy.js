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

        this.loockingfor = true;
    }

    Enemy.prototype = Object.create(Phaser.GameObjects.Container.prototype);
    Enemy.prototype.constructor = Enemy;

    Phaser.Class.mixin(Enemy, [
        candlegames.pestis.gameobjects.components.State,
        candlegames.pestis.gameobjects.components.TiledObject,
        candlegames.pestis.gameobjects.components.WalkingEnemies,
    ]);

    Enemy.prototype.preUpdate = function(time, delta) {
        if(this.loockingfor) {
            this.searchCharacters();
        }
        this.walk();

        if(this.super.preUpdate !== undefined)
        {
            this.super.preUpdate.call(this, time, delta);
        }
    }

    Enemy.prototype.searchCharacters = function() {
        this.visionLine.setTo(this.x, this.body.y - 132, this.x + this.vision * this.currentDirection, this.y - 132)
        this.currentPlayer = undefined;

        var pcs = this.scene.game_engine.pcs.getChildren()
        for(var i=0; i<pcs.length; i++){
            var pc=pcs[i];
            var pcRect =  new Phaser.Geom.Rectangle(pc.x, pc.y - 264, pc.width, 264);
            var intersection = Phaser.Geom.Intersects.LineToRectangle(this.visionLine, pcRect);
            if(intersection) {
                if(!pc.isHiding && pc.stairs === undefined) {
                    this.currentPlayer = pc;
                    if (this.canSeePlayer(this.visionLine, Math.abs(pc.x - this.body.x))){
                        this.lastCharacterPosition = pc.x;
                        if (this.currentMusic === undefined) {
                            this.currentMusic = pc._tiledProperties.music_chase;
                            this.scene.game_engine.sendUpdate({type: 'enemy-chase', isChasing : true , object: this});
                        }
                        if (Math.abs(this.x - this.currentPlayer.x) < this.distanceToKill) {
                            this.scene.game_engine.sendUpdate({ type: 'game-over' });
                        }
                    }
                    else{
                        this.currentPlayer = undefined;
                    }
                }
            }
            break;
        }
        if(this.currentPlayer === undefined && this.currentMusic !== undefined){
            this.scene.game_engine.sendUpdate({type: 'enemy-chase', isChasing : false , object: this});
            this.loockingfor = false;
            window.setTimeout(function() {
                this.loockingfor = true;
                this.lastCharacterPosition = -1;
            }.bind(this), 5000);
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
