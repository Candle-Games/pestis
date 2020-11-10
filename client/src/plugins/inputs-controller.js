(function(ns){

    /**
     * All inputs can make the player
     * @constructor
     */
    function InputsController(scene){
        Phaser.Scenes.ScenePlugin.call(this, scene);

        this.inputs ={
            right: null,
            left: null,
            up: null,
            down: null,
            interact: null,
            chat: null,
            changeCharacter: null
        };
    }

    InputsController.prototype = Object.create(Phaser.Scenes.ScenePlugin.prototype);
    InputsController.prototype.constructor = InputsController;

    /**
     * Select the buttons in the computer keyboard that correspond to the params (keycodes)
     * @param newRight
     * @param newLeft
     * @param newUp
     * @param newDown
     * @param newInteract
     * @param newChat
     * @param newChangeCharacter
     */
    InputsController.prototype.updateComputerInputsButtons = function (newRight,newLeft,newUp,newDown,newInteract,newChat,newChangeCharacter){
        this.inputs.right = this.scene.input.keyboard.addKey(newRight);
        this.inputs.left = this.scene.input.keyboard.addKey(newLeft);
        this.inputs.up = this.scene.input.keyboard.addKey(newUp);
        this.inputs.down = this.scene.input.keyboard.addKey(newDown);
        this.inputs.interact = this.scene.input.keyboard.addKey(newInteract);
        this.inputs.chat = this.scene.input.keyboard.addKey(newChat);
        this.inputs.changeCharacter = this.scene.input.keyboard.addKey(newChangeCharacter);
    }

    ns.InputsController = InputsController
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))