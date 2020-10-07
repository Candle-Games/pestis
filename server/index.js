const express = require('express')
const app = express()
const port = 9000
const server = require('http').Server(app)
const io = require('socket.io')(server)

const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

function setupGameServer() {
  JSDOM.fromFile(path.join(__dirname, 'game/index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  }).then(dom => {
    dom.window.phaserLoaded = () => {
      server.listen(port, () => {
        console.log(`Game server listening on ${server.address().port}`)
      })
    }
  }).catch(error => {
    console.log('Error!! ${error.message}')
  })
}

setupGameServer()
