const config = {
  type: Phaser.HEADLESS,
  parent: 'container',
  width: 800,
  height: 600,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
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
