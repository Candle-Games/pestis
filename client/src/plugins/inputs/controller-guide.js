/*global Phaser*/

(function (ns){

    /**
     *
     * @constructor
     */
    function Controller() {
    }

    Controller.prototype.init = function(scene) {
        throw "This method has to be implemented by child classes!!!!";
    }

    Controller.prototype.isInputUp = function(){
        throw "This method has to be implemented by child classes!!!!"
    }

    Controller.prototype.isInputDown = function(){
        throw "This method has to be implemented by child classes!!!!"
    }

    Controller.prototype.isInputRight = function(){
        throw "This method has to be implemented by child classes!!!!"
    }

    Controller.prototype.isInputLeft = function(){
        throw "This method has to be implemented by child classes!!!!"
    }

    Controller.prototype.isInputAction1 = function(){
        throw "This method has to be implemented by child classes!!!!"
    }

    Controller.prototype.isInputAction2 = function(){
        throw "This method has to be implemented by child classes!!!!"
    }


    ns.Controller=Controller;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'))