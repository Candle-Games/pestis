(function (ns) {

  /**
   *
   * @constructor
   */
  function Keyboard() {
    candlegames.pestis.client.plugins.inputs.Controller.call(this);

    this.type = 'keyboard';

    /**
     * Current keys configuration
     * @type {{ACTION1: string, DOWN: string, LEFT: string, ACTION2: string, RIGHT: string, UP: string}}
     */
    this.keys = {
      UP: "w",
      LEFT: "a",
      DOWN: "s",
      RIGHT: "d",
      ACTION1: "q",
      ACTION2: "e"
    }

    /**
     * Actual inputs pressed
     * @type {{ACTION1: boolean, DOWN: boolean, LEFT: boolean, ACTION2: boolean, RIGHT: boolean, UP: boolean}}
     */
    this.inputs = {
      UP: false,
      LEFT: false,
      DOWN: false,
      RIGHT: false,
      ACTION1: false,
      ACTION2: false
    }
  }

  Keyboard.prototype = Object.create(candlegames.pestis.client.plugins.inputs.Controller.prototype);
  Keyboard.prototype.constructor = Keyboard;

  Keyboard.prototype.init = function (scene) {
    this.scene = scene;

    scene.input.keyboard.on('keydown', this.handleKeyDown, this);
    scene.input.keyboard.on('keyup', this.handleKeyUp, this);
  }

  Keyboard.prototype.handleKeyDown = function (event) {
    this.inputs = {
      UP: false,
      LEFT: false,
      DOWN: false,
      RIGHT: false,
      ACTION1: false,
      ACTION2: false
    };

    switch (event.code) {
      case this.keys.UP:
        this.inputs.UP = true;
        break;
      case this.keys.RIGHT:
        this.inputs.RIGHT = true;
        break;
      case this.keys.DOWN:
        this.inputs.DOWN = true;
        break;
      case this.keys.LEFT:
        this.inputs.LEFT = true;
        break;
      case this.keys.ACTION1:
        this.inputs.ACTION1 = true;
        break;
      case this.keys.ACTION2:
        this.inputs.ACTION2 = true;
        break;
    }
  }

  Keyboard.prototype.handleKeyUp = function (event) {
      this.inputs = {
          UP: false,
          LEFT: false,
          DOWN: false,
          RIGHT: false,
          ACTION1: false,
          ACTION2: false
      };

    switch (event.code) {
      case this.keys.UP:
        this.inputs.UP = false;
        break;
      case this.keys.RIGHT:
        this.inputs.RIGHT = false;
        break;
      case this.keys.DOWN:
        this.inputs.DOWN = false;
        break;
      case this.keys.LEFT:
        this.inputs.LEFT = false;
        break;
      case this.keys.ACTION1:
        this.inputs.ACTION1 = false;
        break;
      case this.keys.ACTION2:
        this.inputs.ACTION2 = false;
        break;
    }
  }

  /**
   * Change the default inputs keys
   * @param config {Object} Keys configuration object
   */
  Keyboard.prototype.updateKeys = function (config) {
    this.keys = _.assign(this.keys, config);
  }

  /**
   * Up input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputUp = function () {
    return this.inputs.UP;
  }

  /**
   * Left input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputLeft = function () {
    return this.inputs.LEFT;
  }

  /**
   * Down input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputDown = function () {
    return this.inputs.DOWN;
  }

  /**
   * Down input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputRight = function () {
    return this.inputs.RIGHT;
  }

  /**
   * Action1 input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputAction1 = function () {
    return this.inputs.ACTION1;
  }

  /**
   * Action2 input is pressed
   * @returns {boolean}
   */
  Keyboard.prototype.isInputAction2 = function () {
    return this.inputs.ACTION2;
  }

  ns.Keyboard = Keyboard;
})(candlegamestools.namespace('candlegames.pestis.client.plugins.inputs'));
