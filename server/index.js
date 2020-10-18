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

    // Network socket
    dom.window.candlegamestools.socket = socket;
  }).catch(error => {
    console.log(`Error!! ${error.message}`)
  })
}


io.on('connection', (socket) => {
  console.log('player connected ' + socket.id)

  players[socket.id] = {
    socket: socket,
    server: setupGameInstance(socket)
  }

  socket.on('disconnect', () => {
    console.log('player disconnected')
    delete players[socket.id]
  })
})

server.listen(port, () => {
  console.log(`Game server listening on ${server.address().port}`)
})
