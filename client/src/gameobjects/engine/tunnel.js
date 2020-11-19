(function(ns) {
  function Tunnel(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, 'tunnel', tiledObject);

    this._end;
  }

  Tunnel.prototype = Object.create(ns.BaseTiledObject.prototype);
  Tunnel.prototype.constructor = Tunnel;

  ns.Tunnel = Tunnel;

  Tunnel.prototype.setEnd = function(end) {
    this._end = end;
  }

  Tunnel.prototype.getEnd = function() {
    return this._end;
  }

  Tunnel.prototype.cross = function(gameObject) {
    if(this._end !== undefined) {
      gameObject.x = this._end.x;
      gameObject.y = this._end.y;
    }
  }

  function TunnelPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('tunnel', this.createGO);
  }

  TunnelPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  TunnelPlugin.prototype.constructor = TunnelPlugin;

  TunnelPlugin.prototype.createGO = function(tiledObject) {
    var go = new Tunnel(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.TunnelPlugin = TunnelPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
