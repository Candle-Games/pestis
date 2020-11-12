(function(ns) {
  function GameplayManager() {
    Phaser.Scene.call(this, {
      key: 'GameplayManager'
    });
  }

  GameplayManager.prototype = Object.create(Phaser.Scene.prototype);
  GameplayManager.prototype.constructor = GameplayManager;

  GameplayManager.prototype.preload = function(data) {
    this.load.json('maps-config', '/resources/maps/maps.json');
  }

  GameplayManager.prototype.create = function(data) {
    if(data.new) {
      this.startLevel(data.level);
    }
  }

  GameplayManager.prototype.startLevel = function(levelName) {
    var mapsConfig = this.cache.json.get('maps-config');
    var levelConfig = mapsConfig[levelName];

    this.scene.launch('Game', { levelConfig: levelConfig, input: 'keyboard' });

    this.scene.get('Game').events.once('game-scene-created', function() {
      this.scene.launch('GameEngineScene', {});
      this.scene.get('GameEngineScene').events.once('preupdate', function() {
        this.comms.emit('message', { event: 'load-level', level: 'tutorial-room' });
      }.bind(this))
    }.bind(this));
  }

  GameplayManager.prototype.stopLevel = function() {
    this.scene.stop('Game');
  }

  ns.GameplayManager = GameplayManager;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
