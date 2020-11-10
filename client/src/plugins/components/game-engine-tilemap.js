(function(ns) {
  ns.TiledMap = {
    objectTypes: {
      HIDEOUT: 'hideout',
      STAIRS: 'stairs',
      STAIRS_TOP: 'stairs_top',
      STAIRS_BOTTOM: 'stairs_bottom',
      GROUND: 'ground',
      WALL: 'wall',
      DOOR: 'door',
      SPAWN_POINT: 'spawnpoint'
    },
    map: undefined,

    /**
     * All map objects indexed by their IDs
     */
    objects: {},

    /**
     * Physics groups
     * overspots: non collision objects (stairs starts and ends, objects to pickup, ...)
     * colliders: colliding objects (ground, walls, doors, ...)
     */
    overspots: undefined,
    colliders: undefined,
    pcs: undefined,
    npcs: undefined,

    /**
     * Current player character
     */
    playerCharacter: undefined,

    buildMap: function(map) {
      this.map = map;
      this._createObjects();
    },

    _createObjects: function() {
      if(this.map !== undefined) {
        this.overspots = this.scene.physics.add.group();
        this.colliders = this.scene.physics.add.staticGroup();
        this.pcs = this.scene.add.group();
        this.npcs = this.scene.add.group();

        var objectLayerNames = this.map.getObjectLayerNames();

        for (var i = 0, ilength = objectLayerNames.length; i < ilength; ++i) {
          var objectLayer = this.map.getObjectLayer(objectLayerNames[i]);
          var objects = objectLayer.objects;

          for (var j = 0, olength = objects.length; j < olength; ++j) {
            var object = objects[j];
            var phaserObject;

            switch(object.type) {
              case this.objectTypes.HIDEOUT:
                phaserObject = this.scene.add.hideout(object);
                this.overspots.add(phaserObject);
                break;

              case this.objectTypes.STAIRS_TOP:
              case this.objectTypes.STAIRS_BOTTOM:
                phaserObject = this.scene.add.stairs_spot(object);
                this.overspots.add(phaserObject);
                break;

              case this.objectTypes.STAIRS:
                phaserObject = this.scene.add.stairs(object);
                break;

              case this.objectTypes.GROUND:
              case this.objectTypes.WALL:
                phaserObject = this.scene.add.ground(object);
                this.colliders.add(phaserObject);
                break;

              case this.objectTypes.DOOR:
                break;

              case this.objectTypes.SPAWN_POINT:
                phaserObject = this.scene.add.character(object);
                if(phaserObject._tiledProperties.object_type==='playercharacter') {
                  this.pcs.add(phaserObject);
                  this.playerCharacter = phaserObject;
                } else {
                  this.npcs.add(phaserObject);
                }
                break;
            }

            if(phaserObject !== undefined) {
              this.objects[phaserObject.id] = phaserObject;
            }
          }
        }
      }
    },
  };
})(candlegamestools.namespace('candlegames.pestis.plugins.components'));
