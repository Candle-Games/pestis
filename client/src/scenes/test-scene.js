/*global Phaser*/

(function(ns){

    function TestScene(){
        Phaser.Scene.call(this,{
            key:'TestScene'
        });
    }

    //Innheritance stuff
    TestScene.prototype=Object.create(Phaser.Scene.prototype);
    TestScene.prototype.constructor=TestScene;

    TestScene.prototype.preload=function() {
    };

    TestScene.prototype.create=function(){
        this.inputmanager.selectController('virtualjoystick');
        text1=this.add.text(0,0,"", 'Luckiest Guy');
        text2=this.add.text(100,0,"", 'Luckiest Guy');

        // Registers listening for game state
        this.comms.on('gamestate', function(data) {
            //console.log('Input received ' + (data.server ? '[server] ' : '[local] ')  + ("0000000000000000" + data.data.toString(2)).substr(-16));
            console.log('Gamestate received ' + (data.server ? '[server] ' : '[local] ')  + data.data);
        }, this);
    }

    TestScene.prototype.update = function(){
        this.inputmanager.controller.updateInputs();
    }



    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))