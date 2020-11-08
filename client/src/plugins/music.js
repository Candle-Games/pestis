(function (ns){
    function MusicSystem (scene, pluginManager){
        Phaser.Plugins.ScenePlugin.call(this, scene, pluginManager);

        this.finishChase = undefined;

        this.chaseMusic = {
            init: undefined,
            loop1: undefined,
            loop2: undefined,
            loop3: undefined,
            loop4: undefined,
            loop5: undefined,
            loop6: undefined,
            transition2: undefined,
            transition3: undefined,
            transition4: undefined,
            transition5: undefined,
            transition6: undefined
        }

        this.backgroundMusic = undefined;
        this.soundEffect = undefined;

        this.counterLoop3 = undefined;
        this.counterLoop4 = undefined;
        this.counterLoop5 = undefined;
        this.counterLoop6 = undefined;

    }

    MusicSystem.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
    MusicSystem.prototype.constructor = MusicSystem;

    MusicSystem.prototype.init = function (backgroundMusic){
        this.finishChase=false;

        this.counterLoop3=0;
        this.counterLoop4=0;
        this.counterLoop5=0;
        this.counterLoop6=0;

        this.chaseMusic.init =this.scene.sound.add('RunOrDie0')

        this.chaseMusic.loop1 =this.scene.sound.add('RunOrDie1')
        this.chaseMusic.loop2 =this.scene.sound.add('RunOrDie2')
        this.chaseMusic.loop3 =this.scene.sound.add('RunOrDie3')
        this.chaseMusic.loop4 =this.scene.sound.add('RunOrDie4')
        this.chaseMusic.loop5 =this.scene.sound.add('RunOrDie5')
        this.chaseMusic.loop6 =this.scene.sound.add('RunOrDie6')

        this.chaseMusic.transition2 = this.scene.sound.add('RunOrDieTransition2')
        this.chaseMusic.transition3 = this.scene.sound.add('RunOrDieTransition3')
        this.chaseMusic.transition4 = this.scene.sound.add('RunOrDieTransition4')
        this.chaseMusic.transition5 = this.scene.sound.add('RunOrDieTransition5')
        this.chaseMusic.transition6 = this.scene.sound.add('RunOrDieTransition6')

        if(backgroundMusic!=undefined){
            this.backgroundMusic = this.scene.sound.add(backgroundMusic)
            this.backgroundMusic.loop=true;
            this.backgroundMusic.play();
            this.backgroundMusic.volume=0.2;
        }

        this.chaseMusic.init.off('complete');
        this.chaseMusic.init.on('complete',function(){this.chaseMusic.loop1.play();}, this);
        this.chaseMusic.loop1.off('complete');
        this.chaseMusic.loop1.on('complete',selectChaseMusic1, this);
        this.chaseMusic.loop2.off('complete');
        this.chaseMusic.loop2.on('complete',selectChaseMusic2, this);
        this.chaseMusic.loop3.off('complete');
        this.chaseMusic.loop3.on('complete', selectChaseMusic3, this);
        this.chaseMusic.loop4.off('complete');
        this.chaseMusic.loop4.on('complete', selectChaseMusic4, this);
        this.chaseMusic.loop5.off('complete');
        this.chaseMusic.loop5.on('complete', selectChaseMusic5, this);
        this.chaseMusic.loop6.off('complete');
        this.chaseMusic.loop6.on('complete', selectChaseMusic6, this);

        this.chaseMusic.transition2.off('complete');
        this.chaseMusic.transition2.on('complete', transitionFinish, this);
        this.chaseMusic.transition3.off('complete');
        this.chaseMusic.transition3.on('complete', transitionFinish, this);
        this.chaseMusic.transition4.off('complete');
        this.chaseMusic.transition4.on('complete', transitionFinish, this);
        this.chaseMusic.transition5.off('complete');
        this.chaseMusic.transition5.on('complete', transitionFinish, this);
        this.chaseMusic.transition6.off('complete');
        this.chaseMusic.transition6.on('complete', transitionFinish, this);

    }

    MusicSystem.prototype.playSoundEffect = function (soundEffect){
        this.soundEffect = this.scene.sound.add(soundEffect);
        this.soundEffect.play();
    }

    MusicSystem.prototype.finishChaseMusic = function(){
        this.finishChase = true;
    }


    MusicSystem.prototype.startChase = function(){
        if(this.backgroundMusic){
            this.backgroundMusic.pause();
        }
        this.chaseMusic.loop1.play();
    }

    function restartLoopCounters(){
        this.counterLoop3 = 0;
        this.counterLoop4 = 0;
        this.counterLoop5 = 0;
        this.counterLoop6 = 0;
    }

    function selectChaseMusic1(){
        if(this.finishChase){
            restartLoopCounters();
            this.chaseMusic.transition2.play();
        }else{
            this.chaseMusic.loop2.play();
        }
    }

    function selectChaseMusic2(){
        if(this.finishChase){
            restartLoopCounters();
            this.chaseMusic.transition3.play();
        }else{
            this.chaseMusic.loop3.play();
        }
    }


    function selectChaseMusic3() {
        this.counterLoop3++;
        switch (this.counterLoop3){
            case 1:
            case 2:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition4.play();
                }else{
                    this.chaseMusic.loop4.play();
                }
                break;
            case 3:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition5.play();
                }else{
                    this.counterLoop3=0;
                    this.chaseMusic.loop5.play();
                }
                break;
        }
    }

    function selectChaseMusic4(){
        this.counterLoop4++;
        switch (this.counterLoop4){
            case 1:
            case 2:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition5.play();
                }else{
                    this.chaseMusic.loop5.play();
                }
                break;
            case 3:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition6.play();
                }else{
                    this.counterLoop4=0;
                    this.chaseMusic.loop6.play();
                }
                break;

        }
    }

    function selectChaseMusic5(){
        this.counterLoop5++;
        switch (this.counterLoop5){
            case 1:
            case 3:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition6.play();
                }else{
                    this.chaseMusic.loop6.play();
                }
                break;
            case 2:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition3.play();
                }else{
                    this.chaseMusic.loop3.play();
                }
                break;
            case 4:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition4.play();
                }else{
                    this.counterLoop5=0;
                    this.chaseMusic.loop4.play();
                }
                break;
        }
    }

    function selectChaseMusic6(){
        this.counterLoop6++;
        switch (this.counterLoop6){
            case 1:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition5.play();
                }else{
                    this.chaseMusic.loop5.play();
                }
                break;
            case 2:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition3.play();
                }else{
                    this.chaseMusic.loop3.play();
                }
                break;
            case 3:
                if(this.finishChase){
                    restartLoopCounters();
                    this.chaseMusic.transition3.play();
                }else{
                    this.counterLoop6=0;
                    this.chaseMusic.loop3.play();
                }
                break;
        }
    }

    function transitionFinish(){
        this.finishChase=false;
        if(this.backgroundMusic){
            this.backgroundMusic.resume();
        }
    }

    ns.MusicSystem=MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))