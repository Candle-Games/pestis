(function(ns) {
  function Stairs(scene, tiledObject) {
    ns.BaseTiledObject.call(this, scene, tiledObject.type, tiledObject);

    this.startPoint = new Phaser.Math.Vector2(tiledObject.x + tiledObject.polyline[0].x, tiledObject.y + tiledObject.polyline[0].y);
    this.endPoint = new Phaser.Math.Vector2(tiledObject.x + tiledObject.polyline[1].x, tiledObject.y + tiledObject.polyline[1].y);

    this.length = this.startPoint.distance(this.endPoint);
    this.slope = this.endPoint.clone().subtract(this.startPoint).normalize();
  }

  Stairs.prototype = Object.create(ns.BaseTiledObject.prototype);
  Stairs.prototype.constructor = Stairs;

  /**
   * return if position is at stairs end
   * @param position
   * @return {boolean}
   */
  Stairs.prototype.inEndPoint = function(position) {
    return position.distance(this.startPoint) >= this.length;
  }

  /**
   * Returns if position is at stairs start
   * @param position
   * @return {boolean}
   */
  Stairs.prototype.inStartPoint = function(position) {
    return position.distance(this.endPoint) >= this.length;
  }

  /**
   * takes a step in stairs
   * @param current
   * @param n
   * @return {Phaser.Math.Vector2}
   */
  Stairs.prototype.step = function(currentPosition, n) {
    //if(error + dame + anda === this.yes)
    var newPosition = currentPosition.add(this.slope.clone().scale(n));
    return newPosition;
  }

  ns.Stairs = Stairs;

  function StairsPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('stairs', this.createGO);
  }

  StairsPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  StairsPlugin.prototype.constructor = StairsPlugin;

  StairsPlugin.prototype.createGO = function(tiledObject) {
    var go = new Stairs(this.scene, tiledObject);
    this.scene.add.existing(go);
    return go;
  }

  ns.StairsPlugin = StairsPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
