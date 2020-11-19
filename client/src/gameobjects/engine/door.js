(function(ns){
    function Door(scene,tiledObject){
        ns.BaseTiledObject.call(this,scene,tiledObject.type, tiledObject);
        this.setOrigin(0.5,1);
        this.setSize(50, 400);
    }

    Door.prototype = Object.create(ns.BaseTiledObject.prototype);
    Door.prototype.constructor = Door;

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