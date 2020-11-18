(function(ns) {
  ns.Chase = {
    _followThroughStairs: false,

    _defaultDistance: 240,

    _followDistance: 240, // 2m

    _followTarget: undefined,

    _followStairs: undefined,

    setFollowTarget: function(followTarget) {
      if(this._followTarget !== undefined) {
          this._followTarget._followStairs = undefined;
          this._followTarget._targetStairsSpot = undefined;
      }

      this._followTarget = undefined;
      this._followStairs = undefined;

        this._followTarget = followTarget;
    },

    chase: function() {
      if(this._followTarget===undefined) { return; }
    },

    follow: function(delta) {
      if(this._followTarget===undefined) { return; }

      if(!this._followStairs && this._followTarget.stairs) {
        this._targetStairsSpot = this._followTarget.stairs_spot;
        this._followStairs = this._followTarget.stairs;
      }

      if(this._followStairs) {
        this._stairsFollow(delta)
      } else {
        var x = this.x;
        var targetX = this._followTarget.x;
        var distance = this._followDistance;
        var direction = targetX - x;

        if (Math.abs(direction) > distance) {
          if (this._walk) {
            this._walk(undefined, Math.sign(direction));
          }
        } else {
          if (this.stop) {
            this.stop();
          }
        }
      }
    },

    _stairsFollow: function(delta) {
      var y = this.y;
      var targetY = this._followTarget.y;

      var x = this.x;
      var targetX = this._followTarget.x;

      if(this.stairs !== undefined) {
        if(Math.abs(targetX - x) > this._followDistance) {
            if (targetY - 2 > y) {
              if(this.down) { this.down(delta); }
            } else if(targetY - 2 <= y) {
              if(this.up) { this.up(delta); }
            }

          if (!this.stairsDown && !this.stairsUp) {
            console.log("Releasing chase stairs spots");
            this._followStairs = undefined;
            this._targetStairsSpot = undefined;
          }
        } else {
          if(y < targetY) {
            this.downEnd();
          } else {
            this.upEnd();
          }
        }

        return;
      }

      targetX = this._targetStairsSpot.x;
      distance = 10;

      var direction = targetX - x;
      if (Math.abs(direction) > distance) {
        if (this._walk) { this._walk(undefined, Math.sign(direction)); }
      } else {
        if(y < targetY) {
          if (this.down) { this.down(delta); }
        } else {
          if(this.up) { this.up(delta); }
        }
      }
    }
  }
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
