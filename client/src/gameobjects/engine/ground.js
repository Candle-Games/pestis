(function(ns) {
  function Ground(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, 'ground', tiledObject);
  }

  Ground.prototype = Object.create(ns.BaseTiledObject.prototype);
  Ground.prototype.constructor = Ground;

  ns.Ground = Ground;

  function GroundPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('ground', this.createGO);
  }

  GroundPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  GroundPlugin.prototype.constructor = GroundPlugin;

  GroundPlugin.prototype.createGO = function(tiledObject) {
    var go = new Ground(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.GroundPlugin = GroundPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
