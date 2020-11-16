(function (ns) {
  function InGameMenu() {
    Phaser.Scene.call(this, {
      key: 'InGameMenu'
    });

    this._background;

    this._gameSaveData;

    this._savesContainer;
  }

  InGameMenu.prototype = Object.create(Phaser.Scene.prototype);
  InGameMenu.prototype.constructor = InGameMenu;

  InGameMenu.prototype.preload = function () {
  }

  InGameMenu.prototype.create = function(saveData) {
    this._gameSaveData = saveData;

    var width = this.game.canvas.width;
    var height = this.game.canvas.height;

    this.events.on('menuselected', this.handleMenu, this);
    this.input.on('gameobjectdown', this.saveGame, this);

    this._background = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    this._background.setOrigin(0, 0);

    var config = _.assign(this.menu.config, {
      options: [
        {id: 'SAVE_GAME', label: 'Save game' },
        {id: 'RETURN_TO_MAIN', label: 'Exit game'},
        {id: 'RETURN', label: 'Return'}
      ]
    });

    this.menu.show(config);
    this.createSavedGames();
  }

  InGameMenu.prototype.createSavedGames = function() {
    var menuBounds = this.menu.optionsContainer.getBounds();
    var menuLeft = menuBounds.left;

    var width = menuLeft;
    var height = this.game.canvas.height;

    var margin = 0.1;
    var containerWidth = width * (1 - margin * 2);
    var containerX = width * margin;
    var containerHeight = height * (1 - margin * 2);
    var containerY = height * margin;

    var container = this.add.savedgamescontainer(containerX, containerY, containerWidth, containerHeight);
    container.setVisible(false);
    container.createSavedGames();
    this._savesContainer = container;
  }

  InGameMenu.prototype.saveGame = function(pointer, gameObject) {
    if(gameObject.name==='saveslot') {
      gameObject.setSavedGame(this._gameSaveData);
      var slot = gameObject.slotNumber;
      this.savedgames.saveGame(this._gameSaveData, slot);
      this._savesContainer.setVisible(false);
    }
  }

  InGameMenu.prototype.handleMenu = function(optionSelected) {
    if(optionSelected.disabled) return;

    if(optionSelected.id==='SAVE_GAME') {
      this._savesContainer.setVisible(true);
    } else {
      this.events.emit('menu-selected', optionSelected.id, optionSelected);
    }
  }

  ns.InGameMenu = InGameMenu;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
