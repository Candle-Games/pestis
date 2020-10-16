(function (ns){
    /**
     * Test Scene
     * @constructor
     */
    function TestScene() {
        Phaser.Scene.call(this, {
            key: 'TestScene'
        });
    }

    //Inheritance stuff
    TestScene.prototype = Object.create(Phaser.Scene.prototype);
    TestScene.prototype.constructor = TestScene;

    var textKeyPressed;

    TestScene.prototype.preload = function() {};

    TestScene.prototype.create = function() {
        if(this.browserchecker.isMobileBrowser()){
            text=this.add.text(0, 0, "Mobile", 'Luckiest Guy');

        }else{
            console.log("not mobile");
            text=this.add.text(0, 0, "Not Mobile", 'Luckiest Guy');

            this.inputscontroller.updateComputerInputsButtons('D', 'A', 'W', 'S', 'E', 'SPACE', 'Q')
        }

        textKeyPressed = this.add.text(300, 300, "", 'Luckiest Guy');
    };

    TestScene.prototype.update = function(){


        if(this.inputscontroller.inputs.right.isDown){
            textKeyPressed.setText("RIGHT");
        } else if (this.inputscontroller.inputs.left.isDown){
            textKeyPressed.setText("LEFT");
        } else if (this.inputscontroller.inputs.up.isDown){
            textKeyPressed.setText("UP");
        } else if (this.inputscontroller.inputs.down.isDown){
            textKeyPressed.setText("DOWN");
        } else if (this.inputscontroller.inputs.interact.isDown){
            textKeyPressed.setText("INTERACT");
        } else if (this.inputscontroller.inputs.chat.isDown){
            textKeyPressed.setText("CHAT");
        } else if (this.inputscontroller.inputs.changeCharacter.isDown){
            textKeyPressed.setText("CHANGE CHARACTER");
        } else{
            textKeyPressed.setText("NOT KEY PRESSED");
        }
    };

    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))