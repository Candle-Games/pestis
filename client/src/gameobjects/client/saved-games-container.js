(function(ns) {
  function SavedGamesContainer(scene, x, y, width, height) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.super = Phaser.GameObjects.Container.prototype;

    this.width = width;
    this.height = height;
  }

  SavedGamesContainer.prototype = Object.create(Phaser.GameObjects.Container.prototype);
  SavedGamesContainer.prototype.constructor = SavedGamesContainer;

  SavedGamesContainer.prototype.createSavedGames = function() {
    var maxSaveSlots = this.scene.savedgames.slots;
    var slotCols = 2;
    var slotRows = 3;
    var slotWidth = this.width / slotCols;
    var slotHeight = this.height / slotRows;

    for(var i=0; i < maxSaveSlots; ++i) {
      var savedGame = this.scene.savedgames.getGameSaveData(i);

      var col = i % slotCols;
      var row = Math.trunc(i / slotCols);
      var slot = this.scene.add.savedgameslot(col * slotWidth, row * slotHeight, slotWidth, slotHeight);
      slot.slotNumber = i;

      if(savedGame !== undefined && savedGame !== null) {
        slot.setSavedGame(savedGame);
      }

      this.add(slot);
    }
  }

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function SavedGamesContainerPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('savedgamescontainer', this.createSavedGamesContainer);
  }

  SavedGamesContainerPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  SavedGamesContainerPlugin.prototype.constructor = SavedGamesContainerPlugin;

  SavedGamesContainerPlugin.prototype.createSavedGamesContainer = function(x, y, width, height) {
    var slot = new SavedGamesContainer(this.scene, x, y, width, height);
    this.scene.add.existing(slot);
    return slot;
  }

  ns.SavedGamesContainerPlugin = SavedGamesContainerPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));
