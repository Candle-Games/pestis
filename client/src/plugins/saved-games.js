(function(ns) {
  function SavedGames(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);

    this.slots = 6;

    this.storageKey = 'saved-games';

    this.savedGamesSlots = new Array(this.slots);
  }

  SavedGames.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  SavedGames.prototype.constructor = SavedGames;

  SavedGames.prototype.getNumberOfSlots = function() {
    return this.slots;
  }

  SavedGames.prototype.getNumberOfSaves = function() {
    var saves = 0;

    for(var i=0, length=this.slots; i < length; ++i) {
      if(this.savedGamesSlots != null){
      if(this.savedGamesSlots[i] !== undefined && this.savedGamesSlots[i] !== null) {
        saves++;
      }
      }
    }

    return saves;
  }

  SavedGames.prototype.init = function(data) {
    var savedGamesSlots = window.localStorage.getItem(this.storageKey);

    if(savedGamesSlots !== undefined) {
      this.savedGamesSlots = JSON.parse(savedGamesSlots);
    }
  }

  SavedGames.prototype.saveGame = function(saveGameData, slot) {
    if(slot >= 0 && slot < this.savedGamesSlots.length) {
      this.savedGamesSlots[slot] = saveGameData;
    }
    this._save();
  }

  SavedGames.prototype.getGameSaveData = function(slot) {
    if(slot >= 0 && slot < this.savedGamesSlots.length) {
      return this.savedGamesSlots[slot];
    }

    return undefined;
  }

  SavedGames.prototype._save = function() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.savedGamesSlots));
  }

  ns.SavedGames = SavedGames;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
