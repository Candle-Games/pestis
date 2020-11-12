/*global Phaser*/

(function (ns) {

  /**
   *
   * @constructor
   */
  function Controller() {
    this.keymapvalue = 0;
    this.scene = null;

    this.keymap = {
      UP: 0,
      DOWN: 1,
      LEFT: 2,
      RIGHT: 3,
      ACTION1: 4,
      ACTION2: 5
    };
  }

  Controller.prototype.sendInput = function (keymapvalue) {
    if (this.keymapvalue != keymapvalue) {
      //Send input to comms system
      this.scene.comms.emit('input', keymapvalue);
      this.keymapvalue = keymapvalue;
    }
  }

  Controller.prototype.updateInputs = function () {
    var keymapvalue = this.keymapvalue;

    if (this.isInputUp()) {
      keymapvalue |= (1 << this.keymap.UP);
    } else {
      keymapvalue &= ~(1 << this.keymap.UP);
    }

    if (this.isInputDown()) {
      keymapvalue |= (1 << this.keymap.DOWN);
    } else {
      keymapvalue &= ~(1 << this.keymap.DOWN);
    }

    if (this.isInputLeft()) {
      keymapvalue |= (1 << this.keymap.LEFT);
    } else {
      keymapvalue &= ~(1 << this.keymap.LEFT);
    }

    if (this.isInputRight()) {
      keymapvalue |= (1 << this.keymap.RIGHT);
    } else {
      keymapvalue &= ~(1 << this.keymap.RIGHT);
    }

    if (this.isInputAction1()) {
      keymapvalue |= (1 << this.keymap.ACTION1);
    } else {
      keymapvalue &= ~(1 << this.keymap.ACTION1);
    }

    if (this.isInputAction2()) {
      keymapvalue |= (1 << this.keymap.ACTION2);
    } else {
      keymapvalue &= ~(1 << this.keymap.ACTION2);
    }

    this.sendInput(keymapvalue);
  }

  Controller.prototype.init = function (scene) {
    throw "This method has to be implemented by child classes!!!!";
  }

  Controller.prototype.isInputUp = function () {
    throw "This method has to be implemented by child classes!!!!"
  }

  Controller.prototype.isInputDown = function () {
    throw "This method has to be implemented by child classes!!!!"
  }

  Controller.prototype.isInputRight = function () {
    throw "This method has to be implemented by child classes!!!!"
  }

  Controller.prototype.isInputLeft = function () {
    throw "This method has to be implemented by child classes!!!!"
  }

  Controller.prototype.isInputAction1 = function () {
    throw "This method has to be implemented by child classes!!!!"
  }

  Controller.prototype.isInputAction2 = function () {
    throw "This method has to be implemented by child classes!!!!"
  }


  ns.Controller = Controller;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'))
