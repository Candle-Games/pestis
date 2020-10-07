(function(ns) {
  /**
   * Google WebFont
   * Inspired by: https://gist.github.com/supertommy/bc728957ff7dcb8016da68b04d3a2768
   * Inspired by: https://github.com/rexrainbow/phaser3-rex-notes/blob/master/plugins/loader/webfontloader/WebFont.js
   * @param loader
   * @param fileConfig
   * @constructor
   */
  var GoogleFonts = function(loader, fontNames) {
    Phaser.Loader.File.call(this, loader, {
      type: 'font',
      key: fontNames.toString()
    });

    this.fontNames = Array.isArray(fontNames) ? fontNames : [ fontNames ];
  };

  GoogleFonts.prototype = Object.create(Phaser.Loader.File.prototype);
  GoogleFonts.prototype.constructor = GoogleFonts;

  /**
   * extends: Phaser.Loader.File.load
   */
  GoogleFonts.prototype.load = function() {
    var loaderConfig = {
      fontactive: function(name) {
        this.loader.nextFile(this, true);
      },
      fontinactive: function(name) {
        this.loader.nextFile(this, false);
      },
      google: {
        families: this.fontNames
      }
    };

    WebFont.load(loaderConfig);
  };

  ns.WebFontLoader = GoogleFonts;

  Phaser.Loader.FileTypesManager.register('googlefont', function(fonts) {
    return new GoogleFonts(this, fonts);
  });
})(namespace('candlegames.game1.server.loader'));
