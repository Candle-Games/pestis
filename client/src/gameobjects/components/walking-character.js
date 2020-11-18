(function(ns) {
  ns.WalkingCharacter = {
    /**
     * Current stairs spot if any
     */
    stairs_spot: undefined,

    /**
     * Current stairs if any
     */
    stairs: undefined,

    /**
     * Is it currently jumping?
     */
    isJumping: false,

    /**
     * Can it jump now?
     */
    canJump: true,

    /**
     * Jump velocity
     */
    jumpVelocity: -800,

    /**
     * Walk velocity
     */
    walkVelocity: 220,

    /**
     * Run multiplier
     */
    runMultiplier: 1.5,

    stop: function() {
      this._walk(0)
    },

    walkLeft: function() {
      this._walk(this.walkVelocity, -1);
    },

    walkRight: function() {
      this._walk(this.walkVelocity, 1)
    },

    runLeft: function() {
      this._walk(this.walkVelocity * this.runMultiplier, -1);
    },

    runRight: function() {
      this._walk(this.walkVelocity * this.runMultiplier, -1);
    },

    jump: function() {
      if(this.canJump && this.body.onFloor()) {
        this.body.setVelocityY(this.jumpVelocity);
      }
    },

    _walk: function(speed, direction) {
      if(direction===undefined) direction = 1;
      if(speed===undefined) speed = this.walkVelocity;
      if(!this.isHiding) {
        this.body.setVelocityX(speed * direction);
      }
    },

    up: function(delta) {
      if(this.stairs !== undefined) {
        var n_pixels = -this.walkVelocity * delta * 0.001;
        var stepDown = this.stairs.step(new Phaser.Math.Vector2(this.x, this.y), n_pixels);
        this.setPosition(stepDown.x, stepDown.y);

        if(this.stairs.inStartPoint(stepDown)) {
          this._setBodyEnabled(true);
          this.stairs_p = undefined;
          this.stairs = undefined;
          this.stairsUp = false;
        }
      } else if(this.stairs_spot && this.stairs_spot.type === 'stairs_bottom') {
        this._setBodyEnabled(false);
        this.stairs = this.scene.game_engine.objects[this.stairs_spot._tiledProperties.stairs];
        this.setPosition(this.stairs.endPoint.x, this.stairs.endPoint.y);
        this.stairs_spot = undefined;
        this.stairsUp = true;
      } else {
        this.jump();
        this.isJumping = true;
      }
    },

    down: function(delta) {
      if(this.stairs !== undefined) {
        var n_pixels = this.walkVelocity * delta * 0.001;
        var stepDown = this.stairs.step(new Phaser.Math.Vector2(this.x, this.y), n_pixels);
        this.setPosition(stepDown.x, stepDown.y);

        if(this.stairs.inEndPoint(stepDown)) {
          this._setBodyEnabled(true);
          this.stairs_p = undefined;
          this.stairs = undefined;
          this.stairsDown = false;
        }
      } else if(this.stairs_spot && this.stairs_spot.type === 'stairs_top') {
        this._setBodyEnabled(false);
        this.stairs = this.scene.game_engine.objects[this.stairs_spot._tiledProperties.stairs];
        this.setPosition(this.stairs.startPoint.x, this.stairs.startPoint.y);
        this.stairs_spot = undefined;
        this.stairsDown = true;
      } else if(this.hideout) {
        this.isHiding = true;
      }
    },

    /**
     *
     * @param enable
     * @private
     */
    _setBodyEnabled: function(enable) {
      if(enable===undefined) enable = true;
      this.body.enable = enable;
    }

  };
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
