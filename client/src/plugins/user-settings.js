(function(ns) {
  function UserSettings(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);

    /**
     * Current settings
     */
    this.settings;

    /**
     * Local storage key
     * @type {string}
     */
    this.key = 'user-settings';

    this.defaultSettings = 'src/user-settings.json'
  }

  UserSettings.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  UserSettings.prototype.constructor = UserSettings;

  UserSettings.prototype.get = function(key, defaultValue) {
    if(this.settings[key]===undefined) {
      return defaultValue;
    }
    return this.settings[key];
  }

  UserSettings.prototype.set = function(key, value) {
    this.settings[key] = value;
  }

  UserSettings.prototype.isSaved = function() {
    return window.localStorage.getItem(this.key) !== null;
  };

  UserSettings.prototype.save = function() {
    window.localStorage.setItem(this.key, JSON.stringify(this.settings));
  };

  UserSettings.prototype.reset = function() {
    window.localStorage.removeItem(this.key);
    this.loadDefaultSettings();
  }

  UserSettings.prototype.loadSettings = function() {
    var data = window.localStorage.getItem(this.key);

    if(data !== null) {
      this.settings = JSON.parse(data);
    } else {
      this.loadDefaultSettings();
    }
  };

  UserSettings.prototype.loadDefaultSettings = function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = this.onReadyStateChange.bind(this);
    request.open('GET', this.defaultSettings);
    request.send();
  }

  UserSettings.prototype.onReadyStateChange = function(e) {
    var request = e.srcElement;
    if(request.readyState===4) {
      if(request.status===200) {
        this.settings = JSON.parse(request.responseText);
      } else {
        throw "Error loading user settings";
      }
    }
  };

  ns.UserSettings = UserSettings;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
