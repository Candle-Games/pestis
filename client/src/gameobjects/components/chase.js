(function(ns) {
  /**
   * Chase component
   * TODO: Enhance, use A* or similar to find path to target
   * @type {{_followStairsExit: ns.Chase._followStairsExit, setFollowTarget: ns.Chase.setFollowTarget, _followTarget: undefined, _walkTo: ns.Chase._walkTo, _followThroughStairs: boolean, _defaultDistance: number, follow: (function(*=): (undefined)), chase: (function(): (undefined)), _stairsFollow: (function(*=): (undefined)), _followDistance: number, _followStairsEnter: ns.Chase._followStairsEnter, _followStairs: undefined}}
   */
  ns.Chase = {
    _followThroughStairs: false,

    _defaultDistance: 240,

    _followDistance: 240, // 2m

    _followTarget: undefined,

    _followStairs: undefined,

    /**
     * TODO: Chase function for enemies
     */
    chase: function() {
      if(this._followTarget===undefined) { return; }
    },

    /**
     * Sets a new follow target
     * TODO: register to gameobject preupdate
     * @param followTarget
     */
    setFollowTarget: function(followTarget) {
      if(this._followTarget) {
        this._followTarget.off('stairs-enter');
        this._followTarget.off('stairs-exit');
      }

      this._followTarget = undefined;
      this._followStairs = undefined;
      this._followTarget = followTarget;

      if(this._followTarget !== undefined) {
        this._followTarget.on('stairs-enter', this._followStairsEnter, this);
        this._followTarget.on('stairs-exit', this._followStairsExit, this);
      }
    },

    /**
     * Hides with a target
     */
    hideHere() {
    },

    /**
     * Follows a target
     * TODO: delay start of following
     * @param delta
     */
    follow: function(delta) {
      if(this._followTarget===undefined) { return; }

      if(this._targetStairs) {
        this._stairsFollow(delta);
      } else {
        if(this.getHiding()) {
          this.setHiding(true);
        }
        this._walkTo(this._followTarget.x, this._followTarget.y, this._followDistance);
      }
    },

    /**
     * Walks to position
     * TODO: emit events instead of hard stop
     * @param x
     * @param y
     * @param distanceToKeep
     * @param speed
     * @private
     */
    _walkTo: function(x, y, distanceToKeep, speed) {
      if(distanceToKeep===undefined) { distanceToKeep = this._followDistance };
      var v = x - this.x;
      if(Math.abs(v) > distanceToKeep) {
        if(this._walk) {
          this._walk(speed, Math.sign(v));
        }
      } else {
        if(this.stop) {
          this.stop();
        }
      }
    },

    /**
     * Target enter stairs event listener
     * @param stairs
     * @param spot
     * @private
     */
    _followStairsEnter: function(stairs, spot) {
      this._targetStairsEntry = spot;
      this._targetStairs = stairs;
    },

    /**
     * Target exit stairs event listener
     * @param stairs
     * @param spot
     * @private
     */
    _followStairsExit: function(stairs, spot) {
      this._targetStairsExit = spot;
      this._targetStairsExitPoint = { x: this._followTarget.x, y: this._followTarget.y };
    },

    /**
     * Follow stairs
     * TODO: Rethink a better way to do it
     * @param delta
     * @private
     */
    _stairsFollow: function(delta) {
      if(this._targetStairs===undefined) { return; } // came here by mistake

      if(this.stairs) {   // already in stairs
        var dest = this._targetStairsExitPoint || { x: this._followTarget.x, y: this._followTarget.y };
        var distance = this._targetStairsExitPoint===undefined ? this._followDistance : 0;

        if(Math.abs(dest.x - this.x) > distance) {
          if(dest.y < this.y) {
            if(this.up) { this.up(delta) }
          } else if(dest.y > this.y) {
            if(this.down) { this.down(delta) }
          }
        } else {
          if(dest.y < this.y) {
            this.upEnd();
          } else {
            this.downEnd();
          }
        }
      } else if(this._targetStairsEntry===undefined) {
        this._targetStairs = undefined;
        this._targetStairsExitPoint = undefined;
      } else {            // goto stairs start
        var dest = this._targetStairsEntry;
        this._walkTo(dest.x, dest.y, 0);
        if(Math.abs(dest.x - this.x) <= 10) {
          this._targetStairsEntry = undefined;
          if(dest.type==='stairs_top') {
            if(this.down) { this.down(delta) }
          } else {
            if(this.up) { this.up(delta) }
          }
        }
      }
    }
  }
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
