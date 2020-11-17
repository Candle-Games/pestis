(function(ns) {
  /**
   * Component for tiled object based gameobjects
   * @type {{_tiledObject: undefined, parseTiledObject: ns.TiledObject.parseTiledObject, _tiledProperties: {}}}
   */
  ns.TiledObject = {
    /**
     * Current tiled properties, as object
     */
    _tiledProperties: {},

    /**
     * Current tiled object
     */
    _tiledObject: undefined,

    /**
     * Parses tiled object into this gameobject
     * @param tiledObject
     */
    parseTiledObject: function(tiledObject) {
      if(tiledObject !== undefined) {
        this._tiledProperties = {};
        // Set current tiled object
        this._tiledObject = tiledObject;

        // Load tiled object properties if exist
        var properties = tiledObject.properties;
        if(properties !== undefined) {
          for(var i=0, length=properties.length; i<length; ++i) {
            this._tiledProperties[properties[i].name] = properties[i].value;
          }
        }
      }
    },

    getTiledProperty: function(property_name) {
      if(property_name in this._tiledProperties) {
        return this._tiledProperties[property_name];
      } else if(property_name in this._tiledObject) {
        return this._tiledObject[property_name];
      }
      return undefined;
    }
  };
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
