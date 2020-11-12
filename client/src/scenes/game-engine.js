(function(ns) {
  function GameEngineScene() {
    Phaser.Scene.call(this, {
      key: 'GameEngineScene'
    });

    this.isServer;

    this.emitter;
  }

  GameEngineScene.prototype = Object.create(Phaser.Scene.prototype);
  GameEngineScene.prototype.constructor = GameEngineScene;

  GameEngineScene.prototype.init = function(config) {
    if(config.socket) {
      this.isServer = true;
      this.emitter = config.socket;
    } else {
      this.isServer = false;
    }

    this.level = config.level;
  }

  GameEngineScene.prototype.create = function() {
    if(!this.isServer) {
      this.emitter = this.comms;
    }

    this.emitter.on('input', this.inputHandler.bind(this));
    this.loadLevel(this.level);
  }

  GameEngineScene.prototype.inputHandler = function(input) {
  }

  GameEngineScene.prototype.loadLevel = function(level) {
    this.game_engine.loadMap(level);
  }

  GameEngineScene.prototype.emit = function(event, data) {
    this.emitter.emit(event, data);
  }


  ns.GameEngineScene = GameEngineScene;
})(candlegamestools.namespace('candlegames.pestis.server.scenes'));
