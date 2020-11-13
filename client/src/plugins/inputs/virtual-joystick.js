/*global Phaser*/
(function(ns){

    /**
     *
     * @constructor
     */
    function VirtualJoystick(){
        candlegames.pestis.client.plugins.inputs.Controller.call(this);

        this.type = 'virtualjoystick';

        this.vjoystick={
            base:null,
            joystick:null,
            initPos: [200,200],
            angle: 0,
            currentDistance: 0,
            maxDistance: 0,
            offsetDistance: 15,
            offsetDegrees: 35
        };

        this.buttonAction1= {
            sprite: null,
            initPos: [400,500],
            isActive: false
        };
        this.buttonAction2= {
            sprite: null,
            initPos: [700,500],
            isActive: false
        };

    }

    VirtualJoystick.prototype = Object.create(candlegames.pestis.client.plugins.inputs.Controller.prototype);
    VirtualJoystick.prototype.constructor=VirtualJoystick;

    VirtualJoystick.prototype.init = function(scene){
        this.scene = scene;
        this.vjoystick.base = scene.add.sprite(this.vjoystick.initPos[0],this.vjoystick.initPos[1],'joystick-base');
        this.vjoystick.base.anchor = [0.5,0.5];
        this.vjoystick.maxDistance = this.vjoystick.base.width *0.5;
        this.vjoystick.base.setScrollFactor(0, 0);

        this.vjoystick.joystick=scene.add.sprite(this.vjoystick.initPos[0],this.vjoystick.initPos[1],'joystick');
        this.vjoystick.joystick.anchor = [0.5,0.5];
        this.vjoystick.joystick.setScrollFactor(0, 0);

        /*
        * Inspired by https://www.youtube.com/watch?v=t56DvozbZX4
        * and https://rexrainbow.github.io/phaser3-rex-notes/docs/site/touchevents/
        */
        this.vjoystick.joystick.setInteractive().on('pointerdown', this.startDrag,this);
        this.scene.input.off('pointermove', this.doDrag, this);
        this.scene.input.off('pointerup', this.stopDrag, this);

        this.buttonAction1.sprite = scene.add.sprite(this.buttonAction1.initPos[0], this.buttonAction1.initPos[1], 'joystick-base');
        this.buttonAction1.sprite.setInteractive().on('pointerdown', this.pressInputAction1, this);
        this.buttonAction1.sprite.setScrollFactor(0, 0);

        this.buttonAction2.sprite = scene.add.sprite(this.buttonAction2.initPos[0], this.buttonAction2.initPos[1], 'joystick-base');
        this.buttonAction2.sprite.setInteractive().on('pointerdown', this.pressInputAction2, this);
        this.buttonAction2.sprite.setScrollFactor(0, 0);

    }

    /**
     * Action1 isActive is true
     */
    VirtualJoystick.prototype.pressInputAction1 = function (){
        this.buttonAction1.isActive = true;
        this.buttonAction1.sprite.tint = 0xB1958F
        this.buttonAction1.sprite.setInteractive().off('pointerdown', this.pressInputAction1, this);
        this.buttonAction1.sprite.setInteractive().on('pointerup', this.upInputAction1, this);
    }

    /**
     * Action1 isActive is false
     */
    VirtualJoystick.prototype.upInputAction1 = function (){
        this.buttonAction1.isActive = false;
        this.buttonAction1.sprite.clearTint();
        this.buttonAction1.sprite.setInteractive().on('pointerdown', this.pressInputAction1, this);
        this.buttonAction1.sprite.setInteractive().off('pointerup', this.upInputAction1, this);
    }

    /**
     * Action2 isActive is true
     */
    VirtualJoystick.prototype.pressInputAction2 = function (){
        this.buttonAction2.isActive = true;
        this.buttonAction2.sprite.tint = 0xB1958F
        this.buttonAction2.sprite.setInteractive().off('pointerdown', this.pressInputAction2, this);
        this.buttonAction2.sprite.setInteractive().on('pointerup', this.upInputAction2, this);
    }

    /**
     * Action2 isActive is false
     */
    VirtualJoystick.prototype.upInputAction2 = function (){
        this.buttonAction2.isActive = false;
        this.buttonAction2.sprite.clearTint();
        this.buttonAction2.sprite.setInteractive().on('pointerdown', this.pressInputAction2, this);
        this.buttonAction2.sprite.setInteractive().off('pointerup', this.upInputAction2, this);
    }


    /**
     * init the joystick drag
     * @param pointer
     */
    VirtualJoystick.prototype.startDrag = function(pointer){
        this.vjoystick.joystick.setInteractive().off('pointerdown', this.startDrag,this);
        this.scene.input.on('pointermove', this.doDrag, this);
        this.scene.input.on('pointerup', this.stopDrag, this);
    }

    /**
     * Drag the joystick
     * @param pointer
     */
    VirtualJoystick.prototype.doDrag = function(pointer){
        var posX = pointer.x;
        var posY = pointer.y;

        var mod = Math.sqrt((posX - this.vjoystick.initPos[0]) * (posX - this.vjoystick.initPos[0]) + (posY - this.vjoystick.initPos[1]) * (posY - this.vjoystick.initPos[1]))

        if(mod > this.vjoystick.maxDistance){
            posX = (((pointer.x - this.vjoystick.initPos[0]) / mod) * this.vjoystick.maxDistance) + this.vjoystick.initPos[0];
            posY = (((pointer.y - this.vjoystick.initPos[1]) / mod) * this.vjoystick.maxDistance) + this.vjoystick.initPos[1];
            this.vjoystick.currentDistance = this.vjoystick.maxDistance;
        }
        else{
            this.vjoystick.currentDistance=mod;
        }

        this.joystickAngle();

        this.vjoystick.joystick.x = posX;
        this.vjoystick.joystick.y = posY;
    }

    /**
     * stop the joystick drag
     * @param pointer
     */
    VirtualJoystick.prototype.stopDrag = function(pointer){
        this.vjoystick.joystick.x=this.vjoystick.initPos[0];
        this.vjoystick.joystick.y=this.vjoystick.initPos[1];

        this.vjoystick.currentDistance=0;

        this.vjoystick.joystick.setInteractive().on('pointerdown', this.startDrag,this);
        this.scene.input.off('pointermove', this.doDrag, this);
        this.scene.input.off('pointerup', this.stopDrag, this);
    }

    /**
     * Calculate the joystick angle
     */
    VirtualJoystick.prototype.joystickAngle = function(){
        var dx = this.vjoystick.joystick.x - this.vjoystick.initPos[0];
        var dy = this.vjoystick.joystick.y - this.vjoystick.initPos[1];

        var theta = Math.atan2(dy,dx); //range (-Pi, Pi]
        theta *=180/Math.PI; //rads to degrees, range (-180, 180)
        if(theta < 0) theta = 360 + theta // range [0, 360)
        this.vjoystick.angle = theta;
    }

    /**
     * Up input is activate
     * @returns {boolean}
     */
    VirtualJoystick.prototype.isInputUp = function(){
        //to be up, must be between 180 and 360 degrees
        return ((this.vjoystick.currentDistance > this.vjoystick.offsetDistance) && (this.vjoystick.angle > 180 + this.vjoystick.offsetDegrees)
            && (this.vjoystick.angle < 360 - this.vjoystick.offsetDegrees));
    }

    /**
     * Down input is activate
     * @returns {boolean}
     */
    VirtualJoystick.prototype.isInputDown = function(){
        //to be down, must be between 0 and 180 degrees
        return ((this.vjoystick.currentDistance > this.vjoystick.offsetDistance) && (this.vjoystick.angle > 0 + this.vjoystick.offsetDegrees)
            && (this.vjoystick.angle < 180 - this.vjoystick.offsetDegrees));
    }

    /**
     * Right input is activate
     * @returns {boolean}
     */
    VirtualJoystick.prototype.isInputRight = function(){
        //to be right, must be between 0 and 90 and between 270 and 360 degrees
        return ((this.vjoystick.currentDistance > this.vjoystick.offsetDistance) && ((this.vjoystick.angle > 270 + this.vjoystick.offsetDegrees)
            || (this.vjoystick.angle < 90 - this.vjoystick.offsetDegrees)));
    }

    /**
     * Left input is activate
     * @returns {boolean}
     */
    VirtualJoystick.prototype.isInputLeft = function(){
        //to be left, must be between 90 and 270 degrees
        return ((this.vjoystick.currentDistance > this.vjoystick.offsetDistance) && (this.vjoystick.angle > 90 + this.vjoystick.offsetDegrees)
            && (this.vjoystick.angle < 270 - this.vjoystick.offsetDegrees));
    }

    VirtualJoystick.prototype.isInputAction1 = function(){
        return this.buttonAction1.isActive;
    }

    VirtualJoystick.prototype.isInputAction2 = function(){
        return this.buttonAction2.isActive;
    }

    ns.VirtualJoystick=VirtualJoystick;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'));
