(function(ns){
    function Door(scene,tiledObject){
        ns.BaseTiledObject.call(this,scene,tiledObject.type, tiledObject);
        this.setOrigin(0.5,1);

        this._trigger;
        this._key;

        this.opened = this._tiledProperties.opened;
        this.rectangle = new Phaser.Geom.Rectangle(this.x - (this.width * 0.5), this.y - this.height, this.width, this.height);
    }

    Door.prototype = Object.create(ns.BaseTiledObject.prototype);
    Door.prototype.constructor = Door;

    /**
     * Sets this door trigger
     * @param trigger
     */
    Door.prototype.setTrigger = function(trigger) {
        if(trigger !== undefined) {
            this._trigger = trigger;
            trigger._door = this;
        }
    }

    /**
     * Sets this door key
     * @param key
     */
    Door.prototype.setKey = function(key) {
        if(key !== undefined) {
            this._key = key;
            key._door = this;
        }
    }


    ns.Door = Door;

    function DoorPlugin(pluginManager){
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject('door', this.createGo);
    }

    DoorPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    DoorPlugin.prototype.constructor = DoorPlugin;

    DoorPlugin.prototype.createGo = function(tiledObject){
        var go = new Door(this.scene, tiledObject);
        this.scene.add.existing(go);
        return go;
    }

    ns.DoorPlugin = DoorPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
