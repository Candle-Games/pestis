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

    TestScene.prototype.preload=function() {};

    TestScene.prototype.create=function(){
        text=this.add.text(0,0,"Not key pressed", "Luckiest Guy");
        this.inputmanager.selectController('keyboard');
    }

    TestScene.prototype.update = function(){
        if(this.inputmanager.controller.isInputUp()){
            text.setText("True");
        }
        else{
            text.setText("false");
        }

    }

    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))