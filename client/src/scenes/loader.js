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

    this.music.init();

  }

  Loader.prototype.create = function() {
    // Create is called when preload completes, now all loading is done
    console.log("Load completed");
    this.events.emit('loadcompleted');
  }

  Loader.prototype.destroy = function() {
    this.loadingprogressbar.destroy();
  }

  Loader.prototype._loadMusic = function(){
    let dataMusic = this.game.cache.json.get('music');
    if(dataMusic !== undefined){
      for(let i=0; i<dataMusic.music.length;i++){
        let currentSound = dataMusic.music[i];
        if(currentSound.prefix !== undefined){
          for(let i = currentSound.first; i<=currentSound.last; i++){
            this.load.audio(currentSound.id +this._pad(i,4),"client/resources/music/"+currentSound.prefix+this._pad(i,4)+currentSound.extension);
          }
        }else{
          this.load.audio(currentSound.id, "client/resources/music/"+currentSound.file);
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
