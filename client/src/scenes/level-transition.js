(function (ns) {
  function InGameMenu() {
    Phaser.Scene.call(this, {
      key: 'LevelTransition'
    });
  }

  InGameMenu.prototype = Object.create(Phaser.Scene.prototype);
  InGameMenu.prototype.constructor = InGameMenu;

  InGameMenu.prototype.preload = function () {
  }

  ns.InGameMenu = InGameMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
