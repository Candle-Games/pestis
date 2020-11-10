(function(ns) {
  /**
   * Component for animated gameobjects
   * Generates animations and maintains animations array
   * @type {{generateAnimations: ns.Animated.generateAnimations, getAnimation: (function(*): *), _animations: Object}}
   */
  ns.Animated = {
    /**
     * Animations for this gameobject
     * Contains an object mapping animation names to animations
     * example: {
     *   walk: animation,
     *   run: animation
     * }
     * @type {Object}
     */
    _animations: undefined,

    /**
     * Animation anchors for this gameobject
     */
    _anchors: undefined,

    /**
     * Gets an animation from the animations array
     * @param animation_name
     * @return {*}
     */
    getAnimation: function(animation_name) {
      if(this._animations===undefined) return undefined;
      return this._animations[animation_name];
    },

    /**
     * Generates animations for the given key
     * @param key
     */
    generateAnimations: function(key) {
      if(this._animations===undefined) {
        this._animations = {};
      }

      if(this._anchors===undefined) {
        this._anchors = {};
      }

      var animations_key = key + '-animations';
      var animations = this.scene.cache.json.get(animations_key);

      if(animations !== undefined) {
        for(var i=0, length = animations.animations.length; i < length; ++i) {
          var anim = animations.animations[i];

          var frames = this.scene.anims.generateFrameNames(key, {
            key: key + '-' + anim.key,
            prefix: anim.prefix,
            suffix: anim.suffix,
            start: anim.start,
            end: anim.end,
            zeroPad: anim.zeroPad
          });

          var animation = this.scene.anims.create({
            key: key + '-' + anim.key,
            frames: frames,
            frameRate: anim.frameRate,
            repeat: anim.repeat
          })

          this._animations[anim.key] = animation;

          if(anim.anchors !== undefined) {
            this._anchors[anim.key] = anim.anchors;
          }
        }
      }
    }
  };
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
