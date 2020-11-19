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
     * Is it currently hiding
     */
    isHiding: false,

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
      this._walk(this.walkVelocity * this.runMultiplier, 1);
    },

    jump: function() {
      if(this.canJump && this.body.onFloor()) {
        this.body.setVelocityY(this.jumpVelocity);
        this.isJumping = true;
      }
    },

    _walk: function(speed, direction) {
      if(direction===undefined) direction = 1;
      if(speed===undefined) speed = this.walkVelocity;

      this.body.setVelocityX(speed * direction);
    },

    upEnd: function() {
      if(!this.stairsUp) {
        this.canJump = true;
      }
      this.stairsUp = false;
    },

    downEnd: function() {
      if(!this.stairsDown) {
        this.canJump = true;
      }

      this.stairsDown = false;
      this.inTunnel = false;

      if(this.getHiding()) {
        this.setHiding(false);
      }
    },

    up: function(delta) {
      if(this.stairs !== undefined) {
        var n_pixels = -this.walkVelocity * delta * 0.001;
        var stepDown = this.stairs.step(new Phaser.Math.Vector2(this.x, this.y), n_pixels);
        this.emit('stairs-up', this.stairs, stepDown);
        this.setPosition(stepDown.x, stepDown.y);
        this.canJump = false;
        this.stairsUp = true;
        this.stairsDown = false;

        if(this.stairs.inStartPoint(stepDown)) {
          this.emit('stairs-exit', this.stairs, this.stairs_spot);
          this.stairs_p = undefined;
          this.stairs = undefined;
          this.stairsUp = false;
          this._setBodyEnabled(true);
        }
      } else if(this.stairs_spot && this.stairs_spot.type === 'stairs_bottom') {
        this._setBodyEnabled(false);
        this.stairs = this.scene.game_engine.objects[this.stairs_spot._tiledProperties.stairs];
        this.setPosition(this.stairs.endPoint.x, this.stairs.endPoint.y);
        this.stairsUp = true;
        this.emit('stairs-enter', this.stairs, this.stairs_spot);
      } else {
        this.jump();
      }
    },

    down: function(delta) {
      if(this.stairs !== undefined) {
        var n_pixels = this.walkVelocity * delta * 0.001;
        var stepDown = this.stairs.step(new Phaser.Math.Vector2(this.x, this.y), n_pixels);
        this.emit('stairs-up', this.stairs, stepDown);
        this.setPosition(stepDown.x, stepDown.y);
        this.canJump = false;
        this.stairsDown = true;
        this.stairsUp = false;

        if(this.stairs.inEndPoint(stepDown)) {
          this.emit('stairs-exit', this.stairs, this.stairs_spot);
          this.stairs_p = undefined;
          this.stairs = undefined;
          this.stairsDown = false;
          this.canJump = true;
          this._setBodyEnabled(true);
        }
      } else if(this.stairs_spot && this.stairs_spot.type === 'stairs_top') {
        this._setBodyEnabled(false);
        this.stairs = this.scene.game_engine.objects[this.stairs_spot._tiledProperties.stairs];
        this.setPosition(this.stairs.startPoint.x, this.stairs.startPoint.y);
        this.stairsDown = true;
        this.emit('stairs-enter', this.stairs, this.stairs_spot);
      } else if(this.hideout !== undefined) {
        if(!this.getHiding()) {
          this.setHiding(true);
          this.stop();
        }
      } else if(this.tunnel_spot !== undefined && !this.inTunnel) {
        this.inTunnel = true;
        this.tunnel_spot.cross(this);
      }
    },

    setHiding: function(hiding) {
      if(hiding !== this.isHiding) {
        if(this.name==='pc1') { console.log("Change hiding to " + (hiding ? 'true' : 'false' )); }
        this.isHiding = hiding;
      }
    },

    getHiding: function() {
      return this.isHiding;
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
