(function (ns) {

    function Key(scene, tiledObject) {
        ns.BaseTiledObject.call(this, scene, 'doorkey', tiledObject);
        this.setOrigin(0.5,0.5);
    }

    Key.prototype = Object.create(ns.BaseTiledObject.prototype);
    Key.prototype.constructor = Key;

    ns.Key = Key;

    function KeyPlugin(pluginManager) {
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject('doorkey', this.createGo);
    }

    KeyPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    KeyPlugin.prototype.constructor = KeyPlugin;

    KeyPlugin.prototype.createGo = function (tiledObject) {
        var go = new Key(this.scene, tiledObject);
        this.scene.add.existing(go);
        return go;
    }

    ns.KeyPlugin = KeyPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));