/*global Phaser*/

(function(ns){

    /**
     *
     * @constructor
     */
    function Keyboard(){
        candlegames.pestis.client.plugins.inputs.Controller.call(this);

        this.scene=null;

        this.inputs={
            up:null,
            left:null,
            down:null,
            right:null,
            action1:null,
            action2:null
        }
    }

    Keyboard.prototype = Object.create(candlegames.pestis.client.plugins.inputs.Controller.prototype);
    Keyboard.prototype.constructor=Keyboard;

    Keyboard.prototype.init = function(scene){
        this.scene=scene;

        this.inputs.up=scene.input.keyboard.addKey("W");
        this.inputs.left = scene.input.keyboard.addKey("A");
        this.inputs.down = scene.input.keyboard.addKey("S");
        this.inputs.right = scene.input.keyboard.addKey("D");
        this.inputs.action1 = scene.input.keyboard.addKey("Q");
        this.inputs.action2 = scene.input.keyboard.addKey("E");
    }

    /**
     * Change the default inputs keys
     * @param inputs
     */
    Keyboard.prototype.updateInputs = function(inputs){
        this.inputs = _.assign(this.inputs, inputs);
    }

    /**
     * Up input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputUp = function(){
        return this.inputs.up.isDown;
    }

    /**
     * Left input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputLeft = function(){
        return this.inputs.left.isDown;
    }

    /**
     * Down input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputDown = function(){
        return this.inputs.down.isDown;
    }

    /**
     * Down input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputRight = function(){
        return this.inputs.right.isDown;
    }

    /**
     * Action1 input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputAction1 = function(){
        return this.inputs.action1.isDown;
    }

    /**
     * Action2 input is pressed
     * @returns {boolean}
     */
    Keyboard.prototype.isInputAction2 = function(){
        return this.inputs.action2.isDown;
    }

    ns.Keyboard=Keyboard;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'));