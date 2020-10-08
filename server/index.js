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

function setupGameServer() {
  JSDOM.fromFile(path.join(__dirname, 'game/index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  }).then(dom => {
    // Called on phaser load to start server
    dom.window.phaserLoaded = () => {
      server.listen(port, () => {
        console.log(`Game server listening on ${server.address().port}`)
      })
    }
    dom.window.URL.createObjectURL = (blob) => {
      if(blob) {
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content
      }
    }
    dom.window.URL.revokeObjectURL = (objectURL) => {
    }
    // Base to load resources from client project
    dom.window.candlegamestools = {
      resource: (resource) => path.join(__dirname, '../client/resources', resource)
    }
  }).catch(error => {
    console.log(`Error!! ${error.message}`)
  })
}

setupGameServer()
