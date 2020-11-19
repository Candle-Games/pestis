(function(ns) {
  function DoorTrigger(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, 'door-trigger', tiledObject);
  }

  DoorTrigger.prototype = Object.create(ns.BaseTiledObject.prototype);
  DoorTrigger.prototype.constructor = DoorTrigger;

  ns.DoorTrigger = DoorTrigger;

  function DoorTriggerPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('door_trigger', this.createGO);
  }

  DoorTriggerPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  DoorTriggerPlugin.prototype.constructor = DoorTriggerPlugin;

  DoorTriggerPlugin.prototype.createGO = function(tiledObject) {
    var go = new DoorTrigger(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.DoorTriggerPlugin = DoorTriggerPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
