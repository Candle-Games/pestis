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
    this.events.on('destroy', this.destroy.bind(this));

    this.loadingprogressbar.show();
    this.load.googlefont('Indie Flower');
    this.load.googlefont('Oswald');
    this.load.googlefont('Frijole');
    this.load.googlefont('Luckiest Guy');

    this.load.audio('RunOrDie0', 'resources/music/run-or-die-0.ogg');
    this.load.audio('RunOrDie1', 'resources/music/run-or-die-1.ogg');
    this.load.audio('RunOrDie2', 'resources/music/run-or-die-2.ogg');
    this.load.audio('RunOrDie3', 'resources/music/run-or-die-3.ogg');
    this.load.audio('RunOrDie4', 'resources/music/run-or-die-4.ogg');
    this.load.audio('RunOrDie5', 'resources/music/run-or-die-5.ogg');
    this.load.audio('RunOrDie6', 'resources/music/run-or-die-6.ogg');
    this.load.audio('RunOrDieTransition2', 'resources/music/run-or-die-transition-2.ogg');
    this.load.audio('RunOrDieTransition3', 'resources/music/run-or-die-transition-3.ogg');
    this.load.audio('RunOrDieTransition4', 'resources/music/run-or-die-transition-4.ogg');
    this.load.audio('RunOrDieTransition5', 'resources/music/run-or-die-transition-5.ogg');
    this.load.audio('RunOrDieTransition6', 'resources/music/run-or-die-transition-6.ogg');

    this.load.audio('BlackPlague', 'resources/music/the-black-plague.ogg');

    this.load.image('joystick', 'resources/sprites/virtual-joystick/joystick.png');
    this.load.image('joystick-base', 'resources/sprites/virtual-joystick/base.png');
  }

  Loader.prototype.create = function() {
    // Create is called when preload completes, now all loading is done
    console.log("Load completed");
    this.events.emit('loadcompleted');
  }

  Loader.prototype.destroy = function() {
    this.loadingprogressbar.destroy();
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
