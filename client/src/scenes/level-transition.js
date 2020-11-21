(function (ns) {
  function InGameMenu() {
    Phaser.Scene.call(this, {
      key: 'LevelTransition'
    });

    this.data;
  }

  InGameMenu.prototype = Object.create(Phaser.Scene.prototype);
  InGameMenu.prototype.constructor = InGameMenu;

  InGameMenu.prototype.create = function (data) {
    this.data = data;
    var text = this.data.status==='dead' ? 'dead-message' : 'escape-message';

  }

  ns.InGameMenu = InGameMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
