/*global Phaser*/

(function(ns){
    function InputManager(scene, pluginManager){
        Phaser.Plugins.ScenePlugin.call(this, scene, pluginManager);

        this.controllers ={
            keyboard : new candlegames.pestis.client.plugins.inputs.Keyboard(),
            virtualjoystick: null
        }

        this.controller;
    }

    InputManager.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
    InputManager.prototype.constructor = InputManager;

    /**
     * Select the controller that will be used
     * @param controller
     */
    InputManager.prototype.selectController = function(controller){
        switch (controller){
            case 'keyboard':
                this.controller=this.controllers.keyboard;
                this.controller.updateInputs({
                    up:this.scene.input.keyboard.addKey("W"),
                    left:this.scene.input.keyboard.addKey("A"),
                    down:this.scene.input.keyboard.addKey("S"),
                    right:this.scene.input.keyboard.addKey("D"),
                    action1:this.scene.input.keyboard.addKey("Q"),
                    action2:this.scene.input.keyboard.addKey("E"),
                });
                break;
            case 'virtualjoystick':
                this.controller=this.controllers.virtualjoystick;
                break;
        }
    }

    ns.InputManager=InputManager;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
