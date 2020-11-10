(function(ns) {
  /**
   * Google WebFont
   * Inspired by: https://gist.github.com/supertommy/bc728957ff7dcb8016da68b04d3a2768
   * Inspired by: https://github.com/rexrainbow/phaser3-rex-notes/blob/master/plugins/loader/webfontloader/WebFont.js
   * TODO: Change to use https://github.com/bramstein/fontfaceobserver
   * @param loader
   * @param fileConfig
   * @constructor
   */
  var GoogleFonts = function(loader, fontNames) {
    fontNames = Array.isArray(fontNames) ? fontNames : [ fontNames ];
    fontLoadedCount = 0;

    var fileConfig = {
      type: 'webfont',
      key: fontNames.toString(),
      config: {
        fontNames: fontNames
      }
    };

    Phaser.Loader.File.call(this, loader, fileConfig);
  };

  GoogleFonts.prototype = Object.create(Phaser.Loader.File.prototype);
  GoogleFonts.prototype.constructor = GoogleFonts;

  /**
   * extends: Phaser.Loader.File.load
   */
  GoogleFonts.prototype.load = function() {
    var loaderConfig = {
      active: this.onLoad.bind(this),
      inactive: this.onError.bind(this),
      fontactive: this.fontActive.bind(this),
      fontinactive: this.fontInactive.bind(this),
      google: {
        families: this.config.fontNames
      }
    };

    WebFont.load(loaderConfig);
  };

  GoogleFonts.prototype.onLoad = function() {
    console.log("Font successfully loaded");
    this.loader.nextFile(this, true);
  }

  GoogleFonts.prototype.onError = function() {
    console.log("Font failed to load");
    this.loader.nextFile(this, false);
  }

  GoogleFonts.prototype.fontActive = function(name, fvd) {
    console.log("Font [" + name + "] loaded");
    // this.loader.emit('webfontactive', this, name, fvd);
  }

  GoogleFonts.prototype.fontInactive = function(name, fvd) {
    console.log("Font [" + name + "] failed to load");
    // this.loader.emit('webfontinactive', this, name, fvd);
  }

  ns.WebFontLoader = GoogleFonts;

  Phaser.Loader.FileTypesManager.register('googlefont', function(fonts) {
    this.addFile(new GoogleFonts(this, fonts));
    return this;
  });
})(candlegamestools.namespace('candlegames.pestis.server.loader'));
