const url = require('url')
const jsdom = require('jsdom')
const fs = require('fs')

class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(resourceUrl, options) {
    if(resourceUrl.startsWith('file://')) {
      const localResourceURL = url.fileURLToPath(resourceUrl);
      if(fs.existsSync(localResourceURL)) {
        // console.log('Requested local ' + localResourceURL + ' found!! - Returning' )
        return super.fetch(resourceUrl, options)
      } else {
        // console.log('Requested local ' + localResourceURL + ' not found!! - Redirecting to client' )
        return super.fetch(resourceUrl.replace('/server/game/', '/client/'))
      }
    } else {
      return super.fetch(resourceUrl, options)
    }
  }
}

module.exports = CustomResourceLoader
