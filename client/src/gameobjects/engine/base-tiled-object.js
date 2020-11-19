(function(ns) {
  /**
   * Base object for all tiled object based game objects
   * @param {Phaser.Scene} scene
   * @param {string} type
   * @param {Phaser.Types.Tilemaps.TiledObject} tiledObject
   * @constructor
   */
  function BaseTiledObject(scene, type, tiledObject) {
    this.parseTiledObject(tiledObject);

    Phaser.GameObjects.Zone.call(this, scene,
      this._tiledObject.x, this._tiledObject.y, this._tiledObject.width, this._tiledObject.height);

    this.setOrigin(0, 0);
    this.id = this._tiledObject.id;
    this.type = type;
    this.rectangle = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);

    if(this._tiledObject.polygon || this._tiledObject.polyline) {
      this.generateSATPolygon();
    } else {
      this.generateSATBox();
    }
  }

  BaseTiledObject.prototype = Object.create(Phaser.GameObjects.Zone.prototype);
  BaseTiledObject.prototype.constructor = BaseTiledObject;

  Phaser.Class.mixin(BaseTiledObject, [
    candlegames.pestis.gameobjects.components.TiledObject
  ]);

  BaseTiledObject.prototype.showDebugShape = function() {
    this.debugRectangle = this.scene.add.rectangle(this.x, this.y, this.width, this.height);
    this.debugRectangle.setOrigin(0, 0);
    this.debugRectangle.setDepth(100);
    this.debugRectangle.setStrokeStyle(4, 0xff0000, 1);

    if(this._tiledObject.polygon || this._tiledObject.polyline) {
      this.debugShape = this.scene.add.polygon(this.x, this.y, this._tiledObject.polygon || this._tiledObject.polyline);
      this.debugShape.setOrigin(0, 0);
      this.debugShape.setDepth(100);
      this.debugShape.setStrokeStyle(4, 0xff0000, 1);
    }
  }

  BaseTiledObject.prototype.hideDebugShape = function() {
    if(this.debugRectangle !== undefined) {
      this.debugRectangle.destroy();
      this.debugRectangle = undefined;

      if(this.debugShape) {
        this.debugShape.destroy();
        this.debugShape = undefined;
      }
    }
  }

  BaseTiledObject.prototype.generateSATBox = function() {
    this.satBox = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height);
  }

  BaseTiledObject.prototype.generateSATPolygon = function() {
    var points = this._tiledObject.polygon || this._tiledObject.polyline;

    var x_min = y_min = x_max = y_max = 0;
    var satVectors = [];

    for(var i = points.length - 1; i >= 0; --i) {
      var point = points[i];
      var satVector = new SAT.Vector(point.x, point.y);
      satVectors.push(satVector);

      if(x_min > point.x) x_min = point.x;
      if(y_min > point.y) y_min = point.y;
      if(x_max < point.x) x_max = point.x;
      if(y_max < point.y) y_max = point.y;
    }

    this.satPolygon = new SAT.Polygon(new SAT.Vector(this._tiledObject.x, this._tiledObject.y), satVectors);
    this.setPosition(this.x + x_min, this.y + y_min);
    this.setSize(x_max - x_min, y_max - y_min);
  }

  ns.BaseTiledObject = BaseTiledObject;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));
