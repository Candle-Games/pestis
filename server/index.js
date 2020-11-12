const express = require('express')
const app = express()
const port = 9000
const server = require('http').Server(app)
const io = require('socket.io')(server)

const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const DatauriParser = require('datauri/parser')
const datauri = new DatauriParser()

const players = {}

const games = {}

function setupGameInstance(socket) {
  return JSDOM.fromFile(path.join(__dirname, 'game/index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  }).then(dom => {
    // Implementation of missing createObjectURL function
    dom.window.URL.createObjectURL = (blob) => {
      if(blob) {
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content
      }
    }

    // Implementation of missing revokeObjectURL function
    dom.window.URL.revokeObjectURL = (blobUrl) => {}

    // Base to load resources from client project
    dom.window.candlegamestools = {
      resource: (resource) => path.join(__dirname, '../client/resources', resource)
    }

    // Base to load sources from client project
    dom.window.source = {
      source: (file) => {

      }
    }

    // Network socket
    dom.window.candlegamestools.socket = socket;
  }).catch(error => {
    console.log(`Error!! ${error.message}`)
  })
}


io.on('connection', (socket) => {
  console.log('player connected ' + socket.id)

  players[socket.id] = {
    id:socket.id,
    socket: socket,
    server: setupGameInstance(socket)
  }

  socket.on('disconnect', () => {
    console.log('player disconnected')
    if(players[socket.id].keyRoom){
      var keyRoom =players[socket.id].keyRoom;
      socket.leave(keyRoom);
      socket.to(keyRoom).emit('player leaved');
      if(games[keyRoom].players.length === 1){
        delete games.keyRoom;
      }
      else if (games[keyRoom].players[0].id === socket.id){
        games[keyRoom].players.shift();
      }else{
        games[keyRoom].players.pop();
      }
    }
    delete players[socket.id]
  })

  socket.on('new game', function (){
    console.log("Received New Partida");
    var key = createKey();
    players[socket.id].keyRoom=key;
    games[key]= {players: [players[socket.id]] };
    socket.join(key);

    socket.emit("new game created", {keyRoom: key} );
  })

  socket.on('leave game', function(){
    console.log("received Leave Game");
    var keyRoom = players[socket.id].keyRoom;
    socket.leave(keyRoom);
    players[socket.id].keyRoom=undefined;
    if(games[keyRoom].players.length === 1){
      delete games.keyRoom;
    }
    else{
      if (games[keyRoom].players[0].id === socket.id){
        games[keyRoom].players.shift();
      }else{
        games[keyRoom].players.pop();
      }
      socket.to(keyRoom).emit('player leaved');
    }

  })

  socket.on('join game', function(data){
    console.log("Received Join Game");
    var keyroom=data.key;
    var parserKeyRoom = keyroom.toUpperCase();

    if(games[parserKeyRoom]){
      console.log("game exist")
      if(games[parserKeyRoom].players.length === 1){
        socket.to(parserKeyRoom).emit("player joined");
        socket.join(parserKeyRoom);
        games[parserKeyRoom].players.push(players[socket.id]);
        players[socket.id].keyRoom=parserKeyRoom;
        console.log("included in game")
        socket.emit("join success", {keyRoom:parserKeyRoom});
      }else{
        socket.emit("join failed");
      }
    }else{
      socket.emit("join failed");
    }

  })

  socket.on('start game', function(){
    console.log("Received start game");
    var keyRoom = players[socket.id].keyRoom;
    console.log(keyRoom);
    socket.to(keyRoom).emit("game started");
  })
})

server.listen(port, () => {
  console.log(`Game server listening on ${server.address().port}`)
})

function createKey(){
  var characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var key="";
  for(i=0;i<5;i++){
    key+=characters.charAt(Math.floor(Math.random()*characters.length));
  }
  console.log(key);
  while(games[key]){
    console.log("bucle")
    key+=characters.charAt(Math.floor(Math.random()*characters.length));
  }

  return key;
}

