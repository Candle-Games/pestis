(function (ns) {
  function InGameMenu() {
    Phaser.Scene.call(this, {
      key: 'InGameMenu'
    });

    this._background;
  }

  InGameMenu.prototype = Object.create(Phaser.Scene.prototype);
  InGameMenu.prototype.constructor = InGameMenu;

  InGameMenu.prototype.preload = function () {
  }

  InGameMenu.prototype.create = function () {
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;

    this.events.on('menuselected', this.handleMenu, this);

    this._background = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    this._background.setOrigin(0, 0);

    var config = _.assign(this.menu.config, {
      options: [
        {id: 'SAVE_GAME', label: 'Save game', disabled: true },
        {id: 'RETURN_TO_MAIN', label: 'Exit game'},
        {id: 'RETURN', label: 'Return'}
      ]
    });

    this.menu.show(config);
  }

  InGameMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected.disabled) return;
    this.events.emit('menu-selected', optionSelected.id, optionSelected);
  }

  ns.InGameMenu = InGameMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
