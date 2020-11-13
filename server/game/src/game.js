var width = 1280;
var height = 720;

const config = {
  type: Phaser.HEADLESS,
  parent: 'container',
  width: width,
  height: height,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    candlegames.pestis.server.scenes.GameplayManager,
    candlegames.pestis.server.scenes.GameEngineScene
  ],
  plugins: {
    global: [
      { key: 'CharacterPlugin', plugin: candlegames.pestis.gameobjects.server.CharacterPlugin, start: true},
      { key: 'HideoutPlugin', plugin: candlegames.pestis.gameobjects.engine.HideoutPlugin, start: true},
      { key: 'GroundPlugin', plugin: candlegames.pestis.gameobjects.engine.GroundPlugin, start: true},
      { key: 'StairsSpotPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsSpotPlugin, start: true},
      { key: 'StairsPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsPlugin, start: true},
    ],
    scene: [
      { key: 'GameEngine', plugin: candlegames.pestis.client.plugins.GameEngine, mapping: 'game_engine' }
    ]
  }
};


function preload() {
}

function create() {
  candlegamestools.socket.on('input', function(data) {
    console.log("Received input");
    candlegamestools.socket.emit('gamestate', data);
  });

  // Be careful here, some memory leaks have been reported
  candlegamestools.socket.on('disconnect', function() {
    console.log("Closing game instance");
    window.close();
  })

  this.__timer = 0;
  this.__last = 0;
}

function update(time, delta) {
  var current = parseInt(this.__timer / 1000);
  if(current % 5 == 0 && current > this.__last) {
    candlegamestools.socket.emit('gamestate', "timer: " + this.__timer);
    console.log(parseInt(this.__timer / 1000));
    this.__last = current;
  }
  this.__timer += delta;
}

const game = new Phaser.Game(config);
candlegamestools.socket.emit('serverstatus', 'Connected to server!!')
