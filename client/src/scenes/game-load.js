(function(ns) {
  function GameLoad() {
    candlegames.pestis.client.scenes.MenuScene.call(this, {
      key: 'GameLoad'
    });
  }

  GameLoad.prototype = Object.create(candlegames.pestis.client.scenes.MenuScene.prototype);
  GameLoad.prototype.constructor = GameLoad;

  GameLoad.prototype.create = function(data) {
    this.add.image(0, 0, 'main-menu-background').setOrigin(0, 0);
    this.super.create.call(this, data);

    this.createSavedGames();
  }

  GameLoad.prototype.createSavedGames = function() {
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
    container.setVisible(true);
    container.createSavedGames();
    this._savesContainer = container;
  }

  ns.GameLoad = GameLoad;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
