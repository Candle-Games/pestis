(function (ns){
    function MusicSystem (pluginManager){
        Phaser.Plugins.BasePlugin.call(this, pluginManager);

        this._dataMusic = undefined;

        this._sounds ={};
        this._soundsData = {};

        this.currentBackground = undefined;

        this.chase = {};
    }

    MusicSystem.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    MusicSystem.prototype.constructor = MusicSystem;

    MusicSystem.prototype.initMusic = function(){
        this.chase.valor = false;
        this.chase.soundId=undefined;
        this._dataMusic = this.game.cache.json.get('music');
        //if music json is loaded
        if(this._dataMusic !== undefined) {
            for (var i = 0; i < this._dataMusic.music.length; i++) {
                var currentSound = this._dataMusic.music[i];
                this._sounds[currentSound.id] = [];
                this._soundsData[currentSound.id] = [];

                //only have one music element
                if (currentSound.file !== undefined) {
                    this._sounds[currentSound.id].push(this.game.sound.add(currentSound.id));
                    this._soundsData[currentSound.id].loop=currentSound.loop;
                    if(currentSound.entry !== undefined) {
                        this._soundsData[currentSound.id].entry = currentSound.entry;
                    }
                }
                // The music have fragments
                else {
                    this._soundsData[currentSound.id].first = currentSound.first;
                    for (var j = currentSound.first; j <= currentSound.last; j++) {
                        this._sounds[currentSound.id].push(this.game.sound.add(currentSound.id + this._pad(j, currentSound.padding)));
                    }
                    if(currentSound.sequence !== undefined) {

                        if (currentSound.sequence.start) {
                            this._soundsData[currentSound.id].sequenceStart = currentSound.sequence.start.split(",");
                            this._soundsData[currentSound.id].sequenceStartIndex = 0;
                        }
                        this._soundsData[currentSound.id].loop = currentSound.sequence.loop.split(",");
                        this._soundsData[currentSound.id].loopIndex=0;
                    }
                    if(currentSound.transition !== undefined){
                        this._soundsData[currentSound.id].transition = currentSound.transition;
                    }
                }
            }
        }
        console.log(this._sounds);
        console.log(this._soundsData);

    }

    /**
     * select the background to the current scene
     * @param currentScene
     */
    MusicSystem.prototype.sceneChanged = function (currentScene){
        var background = this._dataMusic.scenes[currentScene].background
        if((this.currentBackground === undefined || this.currentBackground !== background )){
            this.currentBackground = background;
            this._playBackground();
        }
    }

    MusicSystem.prototype.playSound = function(soundId) {
        if(this._sounds[soundId][0] !== undefined){
            this._sounds[soundId][0].play();
        }
    }

    MusicSystem.prototype._playBackground = function(){
        if (this._soundsData[this.currentBackground].entry !== undefined) {
            this._sounds[this._soundsData[this.currentBackground].entry][0].play({loop: this._soundsData[this._soundsData[this.currentBackground].entry].loop})
            this._sounds[this._soundsData[this.currentBackground].entry][0].off('complete');
            this._sounds[this._soundsData[this.currentBackground].entry][0].once('complete', function () {
                this._sounds[this.currentBackground][0].play({loop:true});
            },this);
        }else{
            this._sounds[this.currentBackground][0].play();
        }
    }

    MusicSystem.prototype._stopBackground = function(){
        if(this._soundsData[this.currentBackground].entry!==undefined){
            this._sounds[this._soundsData[this.currentBackground].entry][0].stop();
        }
        this._sounds[this.currentBackground][0].stop();
    }


    MusicSystem.prototype.stopChase = function(){
        this.chase.valor=false;
    }

    MusicSystem.prototype.startChase = function(soundId){
        this.chase.valor=true;
        this.chase.soundId=soundId;
        this._stopBackground();

        this._playSequence();
    }

    MusicSystem.prototype._playSequence = function(){
        var soundId = this.chase.soundId
        if(soundId !== undefined){

            var soundData = this._soundsData[soundId];
            var transitionData = this._soundsData[this._soundsData[soundId].transition];

            if(soundData.sequenceStart !== undefined && soundData.sequenceStartIndex < soundData.sequenceStart.length){
                var currentIndex = parseInt(soundData.sequenceStart[soundData.sequenceStartIndex],10);
                if(currentIndex<transitionData.first){
                    this._playFragment(this._sounds[soundId][currentIndex-soundData.first], this._playSequence);
                    soundData.sequenceStartIndex++;
                }
                else{
                    if(this.chase.valor){
                        this._playFragment(this._sounds[soundId][currentIndex-soundData.first], this._playSequence);
                        soundData.sequenceStartIndex++;
                    }else{
                        this._playFragment(this._sounds[this._soundsData[soundId].transition][currentIndex-transitionData.first], this._playBackground);
                        soundData.sequenceStartIndex=0;
                        soundData.loopIndex=0;
                    }
                }
            }

            else if(soundData.loop !== undefined && soundData.sequenceStartIndex === soundData.sequenceStart.length){
                var currentIndex = parseInt(soundData.loop[soundData.loopIndex],10);
                if(this.chase.valor){
                    this._playFragment(this._sounds[soundId][currentIndex-soundData.first], this._playSequence);
                    soundData.loopIndex++;
                    if(soundData.loopIndex === soundData.loop.length){
                        soundData.loopIndex=0;
                    }
                }else{
                    this._playFragment(this._sounds[this._soundsData[soundId].transition][currentIndex-transitionData.first], this._playBackground);
                    soundData.loopIndex=0;
                    soundData.sequenceStartIndex=0;
                }
            }
        }
    }

    MusicSystem.prototype._playFragment = function(sound, func){
        sound.play();
        sound.off('complete');
        sound.on('complete', func, this);
    }

    MusicSystem.prototype._pad=function(n,width,z){
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    ns.MusicSystem=MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))