(function (ns){
    function MusicSystem (scene, pluginManager){
        Phaser.Plugins.ScenePlugin.call(this, scene, pluginManager);

        this.finishChase = false;

        this.chaseMusic = {
            init: undefined,
            loop: undefined,
            end: undefined,
        }

        this.backgroundMusic = undefined;

    }

    MusicSystem.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
    MusicSystem.prototype.constructor = MusicSystem;

    MusicSystem.prototype.init = function (backgroundMusic){
        this.chaseMusic.init =this.scene.sound.add('Run2')
        //this.chaseMusic.init =this.scene.sound.add('Run2')
        this.chaseMusic.loop =this.scene.sound.add('Run3')
        this.chaseMusic.end = this.scene.sound.add('Run1')
        if(backgroundMusic!=undefined){
            this.backgroundMusic = this.scene.sound.add(backgroundMusic)
        }

        this.chaseMusic.init.off('complete');
        this.chaseMusic.init.on('complete',function(){this.chaseMusic.loop.play();}, this);
        this.chaseMusic.loop.off('complete');
        this.chaseMusic.loop.on('complete',this.selectChaseMusic, this);
    }

    MusicSystem.prototype.finishChaseMusic = function(){
        this.finishChase = true;
    }


    MusicSystem.prototype.startChase = function(){
        this.chaseMusic.loop.play();
    }

    MusicSystem.prototype.selectChaseMusic = function(){
        console.log("Enter Loop");
        if(this.finishChase){
            this.chaseMusic.end.play();
            this.finishChase=false;
        }
        else{
            this.chaseMusic.loop.play();
        }
    }

    ns.MusicSystem=MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))