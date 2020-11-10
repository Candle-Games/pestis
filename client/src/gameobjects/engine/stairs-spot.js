(function(ns) {
  function StairsSpot(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, tiledObject.type, tiledObject);
  }

  StairsSpot.prototype = Object.create(ns.BaseTiledObject.prototype);
  StairsSpot.prototype.constructor = StairsSpot;

  ns.StairsSpot = StairsSpot;

  function StairsSpotPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('stairs_spot', this.createGO);
  }

  StairsSpotPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  StairsSpotPlugin.prototype.constructor = StairsSpotPlugin;

  StairsSpotPlugin.prototype.createGO = function(tiledObject) {
    var go = new StairsSpot(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.StairsSpotPlugin = StairsSpotPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
