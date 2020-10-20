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

    var text1;
    var text2;

    TestScene.prototype.preload=function() {
    };

    TestScene.prototype.create=function(){
        this.inputmanager.selectController('virtualjoystick');
        text1=this.add.text(0,0,"", 'Luckiest Guy');
        text2=this.add.text(100,0,"", 'Luckiest Guy');
    }

    TestScene.prototype.update = function(){
        if(this.inputmanager.controller.isInputUp()){
            text1.setText("UP");
        }else if(this.inputmanager.controller.isInputDown()){
            text1.setText("DOWN");
        }else{
            text1.setText("");
        }

        if(this.inputmanager.controller.isInputRight()){
            text2.setText("RIGHT");
        }else if(this.inputmanager.controller.isInputLeft()){
            text2.setText("LEFT");
        }else{
            text2.setText("");
        }
    }



    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))