(function (ns){
    function MusicSystem (scene){
        Phaser.Plugins.ScenePlugin.call(this, scene);

        this.finishChase = false;

        this.chaseMusic = {
            init: scene.add.audio('InitChase'),
            loop: scene.add.audio('LoopChase'),
            end: scene.add.audio('EndChase'),
        }

        this.backgroundMusic = undefined;

    }

    MusicSystem.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
    MusicSystem.prototype.constructor = MusicSystem;

   /* MusicSystem.prototype.start = function(){
        this.chaseMusic.init.onStop.addOnce(function(){this.chaseMusic.loop.play();}, this);
        this.chaseMusic.loop.onStop.addOnce(this.selectChaseMusic(), this);
    }*/

    MusicSystem.prototype.chase = function(){
        this.chaseMusic.init.play();
    }

    MusicSystem.prototype.finishChaseMusic = function(){
        this.finishChase = true;
    }

    MusicSystem.prototype.selectChaseMusic = function(){
        if(this.finishChase){
            this.chaseMusic.end.play();
        }
        else{
            this.chaseMusic.loop.play();
            this.finishChase=false;
        }
    }

    ns.MusicSystem=MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))