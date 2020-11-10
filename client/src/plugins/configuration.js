(function(ns) {
  function Configuration(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);

    this.configuration;
  }

  Configuration.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  Configuration.prototype.constructor = Configuration;

  Configuration.prototype.isSaved = function() {
    return window.localStorage.getItem('configuration') !== null;
  };

  Configuration.prototype.save = function() {
    window.localStorage.setItem('configuration', JSON.stringify(this.configuration));
  };

  Configuration.prototype.reset = function() {
    window.localStorage.removeItem('configuration');
    this.loadDefaultConfiguration();
  }

  Configuration.prototype.loadConfiguration = function() {
    var data = window.localStorage.getItem('configuration');

    if(data !== null) {
      this.configuration = JSON.parse(data);
      console.log('Configuration loaded from local storage');
    } else {
      this.loadDefaultConfiguration();
    }
  };

  Configuration.prototype.loadDefaultConfiguration = function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = this.onReadyStateChange.bind(this);
    request.open('GET', '/src/configuration.json');
    request.send();
  }

  Configuration.prototype.onReadyStateChange = function(e) {
    var request = e.srcElement;
    if(request.readyState===4) {
      if(request.status===200) {
        this.configuration = JSON.parse(request.responseText);
        console.log('Default configuration loaded');
      } else {
        throw "Error loading configuration";
      }
    }
  };

  ns.Configuration = Configuration;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
