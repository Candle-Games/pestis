(function(ns) {
  function Hideout(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, 'hideout', tiledObject);
    this.setOrigin(0, 1);
  }

  Hideout.prototype = Object.create(ns.BaseTiledObject.prototype);
  Hideout.prototype.constructor = Hideout;

  ns.Hideout = Hideout;

  function HideoutPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('hideout', this.createGO);
  }

  HideoutPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  HideoutPlugin.prototype.constructor = HideoutPlugin;

  HideoutPlugin.prototype.createGO = function(tiledObject) {
    var go = new Hideout(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.HideoutPlugin = HideoutPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
