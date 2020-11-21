(function(ns){
    function ExitLevel(scene, tiledObject){
        ns.BaseTiledObject.call(this,scene,tiledObject.type, tiledObject);
    }

    ExitLevel.prototype = Object.create((ns.BaseTiledObject.prototype));
    ExitLevel.prototype.constructor = ExitLevel;

    ns.ExitLEvel = ExitLevel;

    function ExitLevelPlugin(pluginManager){
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject('exitlevel', this.createGo);
    }

    ExitLevelPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    ExitLevelPlugin.prototype.constructor = ExitLevelPlugin;

    ExitLevelPlugin.prototype.createGo = function(tiledObject){
        var go = new ExitLevel(this.scene, tiledObject);
        this.scene.add.existing(go);
        return go;
    }

    ns.ExitLevelPlugin = ExitLevelPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));