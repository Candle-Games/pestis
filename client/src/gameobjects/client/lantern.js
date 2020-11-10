(function(ns) {
  function Lantern(scene, x, y) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, 'lantern');
    this.name = 'lantern';

    this.generateAnimations('lantern');
    this.setOriginFromFrame();

    var lightPosition = this.getLightPosition();
    this.light = scene.lights.addLight(lightPosition.x, lightPosition.y,
      400, 0xfcdc72, 4);
  }

  Lantern.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
  Lantern.prototype.constructor = Lantern;

  Phaser.Class.mixin(Lantern, [
    candlegames.pestis.gameobjects.components.Animated
  ]);

  Lantern.prototype.preUpdate = function(time, delta) {
    var lightPosition = this.getLightPosition();
    this.light.setPosition(lightPosition.x, lightPosition.y);
    Phaser.GameObjects.Sprite.prototype.preUpdate.call(this, time, delta);
  };

  Lantern.prototype.getLightPosition = function() {
    if(this._anchors['walk']) {
      var f = this.anims.currentAnim !== null ? this.anims.currentFrame.index : 1;
      var pivot = this._anchors['walk'][f - 1];
      var x = this.flipX ? 1 - pivot.x : pivot.x;

      return {
        x: this.x - (this.width * this.originX) + (this.width * x),
        y: this.y - (this.height * this.originY) + (this.height * pivot.y)
      };
    }

    return {
      x: this.x - (this.width * this.originX) + (this.width * this.frame.pivotX),
      y: this.y - (this.height * this.originY) + (this.height * this.frame.pivotY)
    };
  };

  ns.Lantern = Lantern;

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function LanternPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('lantern', this.createLantern);
  }

  LanternPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  LanternPlugin.prototype.constructor = LanternPlugin;

  LanternPlugin.prototype.createLantern = function(x, y) {
    var lantern = new Lantern(this.scene, x, y);
    this.scene.add.existing(lantern);
    return lantern;
  }

  ns.LanternPlugin = LanternPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));
