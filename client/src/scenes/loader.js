(function(ns) {
  /**
   * Resource loading scene
   * @constructor
   */
  function Loader() {
    Phaser.Scene.call(this, {
      key: 'Loader'
    });
  }

  // Inheritance stuff
  Loader.prototype = Object.create(Phaser.Scene.prototype);
  Loader.prototype.constructor = Loader;

  Loader.prototype.preload = function() {
    this.load.on('complete', this.onLoadComplete.bind(this));
    this.loadingprogressbar.show({ dashStyle: [ 2, 3 ]});

    this.load.googlefont('Indie Flower');
    this.load.googlefont('Oswald');
    this.load.googlefont('Frijole');
    this.load.googlefont('Luckiest Guy');
    
  }

  Loader.prototype.onLoadComplete = function(value) {
    this.events.emit('loadcompleted');
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
