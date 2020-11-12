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
    this._loadMusic();
  }

  Loader.prototype.create = function() {
    this.music.initMusic();
    // Create is called when preload completes, now all loading is done
    console.log("Load completed");
    this.events.emit('loadcompleted');

  }

  Loader.prototype.destroy = function() {
    this.loadingprogressbar.destroy();
  }

  Loader.prototype._loadMusic = function(){
    var dataMusic = this.game.cache.json.get('music');
    if(dataMusic !== undefined){
      for(var i=0; i<dataMusic.music.length;i++){
        var currentSound = dataMusic.music[i];
        if(currentSound.prefix !== undefined){
          for(var j = currentSound.first; j<=currentSound.last; j++){
            this.load.audio(currentSound.id +this._pad(j,currentSound.padding),"resources/music/"+currentSound.prefix+this._pad(j,currentSound.padding)+currentSound.extension);
          }
        }else{
          this.load.audio(currentSound.id, "resources/music/"+currentSound.file);
        }
      }
    }
  }

  Loader.prototype._pad=function(n,width,z){
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  ns.Loader = Loader;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))
