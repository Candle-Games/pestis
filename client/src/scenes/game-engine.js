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
      this.emitter = socket;
    } else {
      this.isServer = false;
    }
  }

  GameEngineScene.prototype.create = function() {
    if(!this.isServer) {
      this.emitter = this.comms;
    }

    this.emitter.off('input');
    this.emitter.on('input', this.inputHandler.bind(this));

    this.emitter.off('message');
    this.emitter.on('message', this.messageHandler.bind(this));
  }

  GameEngineScene.prototype.messageHandler = function(message) {
    console.log('Game message received ' + message.data.event);
    switch(message.data.event) {
      case 'load-level':
        this.loadLevel(message.data);
        break;
    }
  }

  GameEngineScene.prototype.inputHandler = function(input) {
  }

  GameEngineScene.prototype.loadLevel = function(data) {
    this.game_engine.loadMap(data.level);
  }

  GameEngineScene.prototype.emit = function(event, data) {
    if(this.isServer) {
      data = {
        isServer: true,
        data: data
      }
    }

    this.emitter.emit(event, data);
  }


  ns.GameEngineScene = GameEngineScene;
})(candlegamestools.namespace('candlegames.pestis.server.scenes'));
