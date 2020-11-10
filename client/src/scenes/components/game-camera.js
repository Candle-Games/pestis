(function(ns) {
  ns.GameCamera = {
    /**
     * Current camera
     * @type {Phaser.Cameras.Scene2D.Camera}
     */
    camera: undefined,

    /**
     * Camera y offset
     * @type {number}
     */
    cameraYOffset: 230,

    /**
     * Sets up game camera
     */
    setupCamera: function() {
      var width = this.game.scale.width;
      var height = this.game.scale.height;

      var dzMargin = { x: 0.35, y: 0.15 };
      var dzX = width * dzMargin.x;
      var dzWidth = width - 2 * dzX;
      var yOffset = 230;

      this.camera = this.cameras.main;
      this.camera.setDeadzone(dzWidth, 0);
      this.camera.roundPixels = true;
      this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    },

    /**
     * Camera debug rectangle
     */
    cameraDebugRectangle: undefined,

    /**
     * Debugs camera space
     * @param debug
     */
    debugCamera: function(debug) {
      if(debug) {
        if(this.cameraDebugRectangle===undefined) {
          this.cameraDebugRectangle = this.add.rectangle();
          this.cameraDebugRectangle.setStrokeStyle(2, 0x00ff00, 1);
          this.cameraDebugRectangle.setDepth(1000);
        }
      } else {
        if(this.cameraDebugRectangle !== undefined) {
          this.cameraDebugRectangle.destroy();
        }
      }
    },

    /**
     * Makes camera follow object
     * @param object
     */
    cameraFollow: function(object) {
      this.camera.startFollow(object, true, 0.1, 1, 0, this.cameraYOffset);
    }
  };
})(candlegamestools.namespace('candlegames.pestis.scenes.components'));
