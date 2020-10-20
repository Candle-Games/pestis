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

    var text;

    TestScene.prototype.preload=function() {
    };

    TestScene.prototype.create=function(){
        this.inputmanager.selectController('virtualjoystick');
        text=this.add.text(0,0,"", 'Luckiest Guy');
    }

    TestScene.prototype.update = function(){
    }



    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))