(function(ns){
    function Path(scene,tiledObject){
        ns.BaseTiledObject.call(this, scene, tiledObject.type, tiledObject);

        this.startPoint = new Phaser.Math.Vector2(tiledObject.x + tiledObject.polyline[0].x, tiledObject.y + tiledObject.polyline[0].y);
        this.endPoint = new Phaser.Math.Vector2(tiledObject.x + tiledObject.polyline[1].x, tiledObject.y + tiledObject.polyline[1].y);

        this.length = this.startPoint.distance(this.endPoint);
    }

    Path.prototype = Object.create(ns.BaseTiledObject.prototype);
    Path.prototype.constructor = Path;

    /**
     * return if position is at path end
     * @param position
     * @returns {boolean}
     */
    Path.prototype.inEndPoint = function(position){
        return position.distance(this.startPoint) >= this.length;
    }

    /**
     * return if position is at path start
     * @param position
     * @returns {boolean}
     */
    Path.prototype.inStartPoint = function(position){
        return position.distance(this.endPoint) >= this.length;
    }

    ns.Path = Path;

    function PathPlugin(pluginManager) {
        Phaser.Plugins.BasePlugin.call(this, pluginManager);
        pluginManager.registerGameObject('objectpath', this.createGO);
    }

    PathPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    PathPlugin.prototype.constructor = PathPlugin;

    PathPlugin.prototype.createGO = function(tiledObject) {
        var go = new Path(this.scene, tiledObject);
        this.scene.add.existing(go);
        return go;
    }

    ns.PathPlugin = PathPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.engine'));