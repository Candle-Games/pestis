(function(ns) {
  function SavedGameSlot(scene, x, y, width, height) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.super = Phaser.GameObjects.Container.prototype;

    this.name = 'saveslot';

    this.padding = 4;
    this.width = width;
    this.height = height;
    this.size;

    this.background;

    this.backgroundNoSlotText;

    this.snapshot;

    this.savedGameData;

    this.drawBackground();
    this.setupInput();
    this.once('shutdown', this._shutdown, this);
  }

  SavedGameSlot.prototype = Object.create(Phaser.GameObjects.Container.prototype);
  SavedGameSlot.prototype.constructor = SavedGameSlot;

  SavedGameSlot.prototype.setupInput = function() {
    this.setInteractive(this.background, Phaser.Geom.Rectangle.Contains);
  }

  SavedGameSlot.prototype._shutdown = function() {
    this.size = undefined;

    if(this.background !== undefined) {
      this.background.destroy();
      this.background = undefined;
    }

    if(this.backgroundNoSlotText !== undefined) {
      this.backgroundNoSlotText.destroy();
      this.backgroundNoSlotText = undefined;
    }

    if(this.snapshot !== undefined) {
      this.snapshot.destroy();
      this.snapshot = undefined;
    }
  }

  SavedGameSlot.prototype.drawBackground = function() {
    this.innerSize = this.calculateSize();

    this.background = this.scene.add.rectangle(this.width / 2, this.height / 2,
      this.innerSize.width, this.innerSize.height, 0xffffff, 0.3);
    this.background.setOrigin(0.5, 0.5);
    this.add(this.background);

    var centerX = this.width / 2;
    var centerY = this.height / 2;
    this.backgroundNoSlotText = this.scene.add.text(centerX, centerY, "Empty slot",
      { fontFamily: "MedievalSharp", fontSize: 20, color: 'rgba(255,255,255,0.3)' });
    this.backgroundNoSlotText.setOrigin(0.5, 0.5);
    this.add(this.backgroundNoSlotText);
  }

  SavedGameSlot.prototype.setSavedGame = function(savedGame) {
    this.backgroundNoSlotText.setVisible(false);
    this.savedGameData = savedGame;
    this._renderSavedGame();
  }

  SavedGameSlot.prototype._renderSavedGame = function() {
    var imageName = 'snapshot-' + this.savedGameData.timestamp;
    if(!this.scene.game.textures.exists(imageName)) {
      var htmlImage = new Image();
      htmlImage.onload = this._snapshotLoaded.bind(this);
      htmlImage.src = this.savedGameData.snapshot;
    } else {
      this._generateSavedGame();
    }
  }

  SavedGameSlot.prototype._snapshotLoaded = function(event) {
    var imageName = 'snapshot-' + this.savedGameData.timestamp;
    this.scene.game.textures.addImage(imageName, event.srcElement);
    this._generateSavedGame();
  }

  SavedGameSlot.prototype._generateSavedGame = function() {
    var imageName = 'snapshot-' + this.savedGameData.timestamp;
    var image = this.scene.add.image(this.width / 2, this.height / 2, imageName);
    image.setOrigin(0.5, 0.5);
    image.setDisplaySize(this.innerSize.width, this.innerSize.height);
    this.add(image);
    this.snapshot = image;

    var centerX = this.width / 2;
    var centerY = this.height / 2;
    var saveDate = luxon.DateTime.fromMillis(this.savedGameData.timestamp).toFormat("dd/MM/yyyy hh:mm:ss");
    var label = this.scene.add.text(centerX, centerY, saveDate,
      {fontFamily: "MedievalSharp", fontSize: 25, color: '#fc7f03'});
    label.setBackgroundColor('rgba(0,0,0,0.6)');
    label.setOrigin(0.5, 0.5);
    this.backgroundNoSlotText.destroy();
    this.backgroundNoSlotText = label;
    this.add(this.backgroundNoSlotText);
  }

  SavedGameSlot.prototype.calculateSize = function() {
    var width = this.scene.game.canvas.width;
    var height = this.scene.game.canvas.height;
    var ratio = width / height;
    var h = this.height - (2 * this.padding);
    var w = h * ratio;

    return {
      width: w,
      height: h
    };
  }

  ns.SavedGameSlot = SavedGameSlot;

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function SavedGameSlotPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('savedgameslot', this.createSavedGameSlot);
  }

  SavedGameSlotPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  SavedGameSlotPlugin.prototype.constructor = SavedGameSlotPlugin;

  SavedGameSlotPlugin.prototype.createSavedGameSlot = function(x, y, width, height) {
    var slot = new SavedGameSlot(this.scene, x, y, width, height);
    this.scene.add.existing(slot);
    return slot;
  }

  ns.SavedGameSlotPlugin = SavedGameSlotPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));
