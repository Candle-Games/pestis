/*global Phaser*/
(function(ns){

    /**
     *
     * @constructor
     */
    function VirtualJoystick(){
        candlegames.pestis.client.plugins.inputs.Controller.call(this)
        this.scene = null;

        this.vjoystick={
            base:null,
            joystick:null,
            angle:null
        };

        this.initPos = [0,0]

        this.maxDisplacement = 0;
        this.buttonAction1=null;
        this.buttonAction2=null;

    }

    VirtualJoystick.prototype = Object.create(candlegames.pestis.client.plugins.inputs.Controller.prototype);
    VirtualJoystick.prototype.constructor=VirtualJoystick;

    VirtualJoystick.prototype.init = function(scene){
        this.scene = scene;
        this.initPos = [200,200];
        this.vjoystick.base = scene.add.sprite(this.initPos[0],this.initPos[1],'joystick-base');
        this.vjoystick.base.anchor = [0.5,0.5];
        this.maxDisplacement = this.vjoystick.base.width *0.5;

        this.vjoystick.joystick=scene.add.sprite(this.initPos[0],this.initPos[1],'joystick');
        this.vjoystick.joystick.anchor = [0.5,0.5];

        /*
        * Inspired by https://www.youtube.com/watch?v=t56DvozbZX4
        * and https://rexrainbow.github.io/phaser3-rex-notes/docs/site/touchevents/
        */
        this.vjoystick.joystick.setInteractive().on('pointerdown', this.startDrag,this);
        this.scene.input.off('pointermove', this.doDrag, this);
        this.scene.input.off('pointerup', this.stopDrag, this);
    }

    VirtualJoystick.prototype.startDrag = function(pointer){
        this.vjoystick.joystick.setInteractive().off('pointerdown', this.startDrag,this);
        this.scene.input.on('pointermove', this.doDrag, this);
        this.scene.input.on('pointerup', this.stopDrag, this);
    }

    VirtualJoystick.prototype.doDrag = function(pointer){
        var posX = pointer.x;
        var posY = pointer.y;

        var mod = Math.sqrt((posX - this.initPos[0]) * (posX - this.initPos[0]) + (posY - this.initPos[1]) * (posY - this.initPos[1]))

        if(mod > this.maxDisplacement){
            posX = (((pointer.x - this.initPos[0]) / mod) * this.maxDisplacement) + this.initPos[0];
            posY = (((pointer.y - this.initPos[1]) / mod) * this.maxDisplacement) + this.initPos[1];
        }

        this.vjoystick.joystick.x = posX;
        this.vjoystick.joystick.y = posY;
    }

    VirtualJoystick.prototype.stopDrag = function(pointer){
        this.vjoystick.joystick.x=this.initPos[0];
        this.vjoystick.joystick.y=this.initPos[1];

        this.vjoystick.joystick.setInteractive().on('pointerdown', this.startDrag,this);
        this.scene.input.off('pointermove', this.doDrag, this);
        this.scene.input.off('pointerup', this.stopDrag, this);
    }

    ns.VirtualJoystick=VirtualJoystick;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'));