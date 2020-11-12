(function(ns) {
  function GameplayManager() {
    Phaser.Scene.call(this, {
      key: 'GameplayManager'
    });
  }

  GameplayManager.prototype = Object.create(Phaser.Scene.prototype);
  GameplayManager.prototype.constructor = GameplayManager;

  GameplayManager.prototype.preload = function(data) {
    candlegamestools.socket.on('start-level', this.startLevel.bind(this));
  }

  GameplayManager.prototype.create = function(data) {
    console.log("Server instance created");
    candlegamestools.socket.emit('hello', { message: "Hello I am the server game instance"});
  }

  GameplayManager.prototype.startLevel = function(message) {
    console.log("Starting " + message.level);
    // TODO: Chapuza!!!
    this.scene.get('GameEngineScene').comms = candlegamestools.socket;
    this.scene.launch('GameEngineScene', {
      socket: candlegamestools.socket,
      level: message.level
    });
  }

  ns.GameplayManager = GameplayManager;
})(candlegamestools.namespace('candlegames.pestis.server.scenes'));
