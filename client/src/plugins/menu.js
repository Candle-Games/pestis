(function(ns) {
  /**
   * Menu system
   * @param scene
   * @constructor
   */
  function Menu(scene, pluginManager) {
    Phaser.Plugins.ScenePlugin.call(this, scene, pluginManager);

    scene.events.on('destroy', this.destroyScene, this);

    /**
     * Selected option
     * @type {Phaser.GameObjects.Text}
     */
    this.selectedOption;

    /**
     * Group of menu options
     * @type {Phaser.GameObjects.Group}
     */
    this.optionsGroup;

    /**
     * Container for menu options
     * @type {Phaser.GameObjects.Container}
     */
    this.optionsContainer;

    /**
     * Current config (default values)
     */
    this.config = {
      x: 0,
      y: 0,
      hanchor: 0,
      vanchor: 0,
      spacing: 22,
      fontfamily: 'arial',
      fontsize: 20,
      fontcolor: '#fff',
      disabledcolor: 'rgba(255,255,255,0.2)',
      textalign: 'center',
      debug: false,
      effect: this.defaultEffect,
      options: []
    };
  }

  Menu.prototype = Object.create(Phaser.Plugins.ScenePlugin.prototype);
  Menu.prototype.constructor = Menu;

  Menu.prototype.destroyScene = function(){
    console.log("destroy menu");
    this.optionsGroup.destroy();
    this.optionsContainer.destroy();
    this.selectedOption = undefined;
  }

  /**
   * Show a menu in current scene...
   * @param config Configuration object... {
   *   x: <float> X start point for the menu,
   *   y: <float> Y start point for the menu,
   *   hanchor: horizontal anchor position 0-1 (default 0),
   *   vanchor: vertical anchor position 0-1 (default 0),
   *   spacing: <float> pixels to vertically separate the menu options,
   *   fontfamily: 'font name' global font name for the menu,
   *   fontsize: <float> global font size for menu options,
   *   fontcolor: font color for menu options,
   *   textalign: 'left' (default) or 'center' or 'right' to align options inside menu container,
   *   selectEffect: <function> calls function with option when option is selected,
   *   unselectEffect: <function> class function with option when function is unselected,
   *   debug: <boolean> if true shows menu container bounding box and anchor point,
   *   options: array of options [
   *     {
   *       id: 'id' option id, to identify it in callback,
   *       label: 'label' text shown up in the menu,
   *       font: 'font name' specific font for this option,
   *       fontsize: <float> specific font size for this option,
   *       fontcolor: font color for this option
   *     }
   *   ]
   * }
   */
  Menu.prototype.show = function(config) {
    this.config = _.assign(this.config, config);
    this.selectedOption=undefined;
    this.drawMenu();
    this.setupMenu();
  }

  /**
   * Draws menu based on current config
   */
  Menu.prototype.drawMenu = function() {
    var config = this.config;
    this.optionsContainer = this.scene.add.container(0, 0);
    this.optionsGroup = this.scene.add.group();
    this.optionsGroup.classType = Phaser.GameObjects.Text;

    var optionX = 0, optionY = 0;

    for(var i=0, length=config.options.length; i < length; ++i) {
      var optionConfig = config.options[i];
      var option = this.optionsGroup.create(optionX, optionY, optionConfig.label);
      option._menuIdx = i;
      option._menuConfig = optionConfig;
      option.setInteractive();

      this.setOptionStyle(option);

      optionY += config.spacing;
      this.optionsContainer.add(option);
    }

    var cb = this.optionsContainer.getBounds();
    var x = config.x - (cb.width * config.hanchor);
    var y = config.y - (cb.height * config.vanchor);
    this.optionsContainer.setPosition(x, y);

    if(config.textalign==='center' || config.textalign==='right') {
      var options = this.optionsGroup.getChildren();
      for(i=0, length=options.length; i < length; ++i) {
        var opb = options[i].getBounds();
        if(config.textalign==='center') {
          options[i].setX(cb.width / 2);
          options[i].setOrigin(0.5, 0.5);
        } else {
          options[i].setX(cb.width);
          options[i].setOrigin(1, 1);
        }
      }
    }

    if(config.debug) {
      var rectangle = this.scene.add.rectangle(x, y, cb.width, cb.height);
      rectangle.setOrigin(0,0);
      rectangle.setStrokeStyle(2,0x03befc,1);

      var cx = x + (cb.width * config.hanchor);
      var cy = y + (cb.height * config.vanchor);
      this.scene.add.line(cx, cy, -10, 0, 10, 0, 0xfce303, 1).setOrigin(0,0);
      this.scene.add.line(cx, cy, 0, -10, 0, 10, 0xfce303, 1).setOrigin(0,0);
    }

    if(this.optionsGroup.getLength() > 0) {
      this.selectOption(this.optionsGroup.getChildren()[0])
    }
  }

  /**
   * sets menu option style
   * @param option menu option to set
   */
  Menu.prototype.setOptionStyle = function(option) {
    option.setName(option._menuConfig.id);
    option.setOrigin(0, 0);
    option.setFontFamily(option._menuConfig.fontfamily || this.config.fontfamily);
    option.setFontSize(option._menuConfig.fontsize || this.config.fontsize);
    if(!option._menuConfig.disabled) {
      option.setStyle({ color: option._menuConfig.fontcolor || this.config.fontcolor});
    } else {
      option.setStyle({ color: option._menuConfig.disabledcolor || this.config.disabledcolor});
    }
  }

  /**
   * Setup menu input and events
   */
  Menu.prototype.setupMenu = function() {
    this.scene.input.keyboard.on('keydown', this.handleKeyDown, this);
    this.scene.input.on('gameobjectover', this.handleMouseOver, this);
    this.scene.input.on('gameobjectdown', this.handleMouseDown, this);
  }

  /**
   * Handle mouse over menu options
   * @param event
   */
  Menu.prototype.handleMouseOver = function(pointer, gameObject) {
    if(!gameObject._menuConfig.disabled) {
      this.selectOption(gameObject);
    }
  }

  /**
   *
   * @param pointer
   * @param gameObject
   */
  Menu.prototype.handleMouseDown = function(pointer, gameObject) {
    this.emitSelected(gameObject);
  }

  /**
   * Handles keyboard pressing
   * @param event
   */
  Menu.prototype.handleKeyDown = function(event) {
    var length = this.optionsGroup.getLength();
    var currentIdx = this.selectedOption ? this.selectedOption._menuIdx : -1;

    switch(event.code) {
      case 'ArrowDown':
        var option = this.getOption((currentIdx + 1) % length, 'next');
        this.selectOption(option);
        break;
      case 'ArrowUp':
        var option = this.getOption((length + (currentIdx - 1)) % length, 'previous');
        this.selectOption(option);
        break;
      case 'Enter':
        if(!this.selectedOption) return;
        thi.emitSelected(this.selectedOption);
        break;
    }
  }

  /**
   * Emits selected menu event
   * @param option
   */
  Menu.prototype.emitSelected = function(option) {
    this.scene.events.emit('menuselected', option._menuConfig);
  }

  /**
   * Returns safely a option by its index.
   * @param idx {int} Index
   * @param handleDisabled {'next', 'previous'} what to do if option is disabled
   * @return {undefined|Phaser.GameObjects.Text}
   * @throws "Index out of bounds"
   */
  Menu.prototype.getOption = function(idx, handleDisabled) {
    if(idx < 0 || idx > this.optionsGroup.getLength()) throw "Index out of bounds";
    handleDisabled = handleDisabled || false;
    if(!handleDisabled) return this.optionsGroup.getChildren()[idx];

    for(var i=0, length=this.optionsGroup.getLength(); i < length; ++i) {
      var option = this.optionsGroup.getChildren()[idx];
      if(!option._menuConfig.disabled) return option;
      idx = handleDisabled==='next' ? (idx + 1) % length : (length + (idx - 1)) % length;
    }
    return undefined;
  }

  /**
   * Selects option
   * @param index {int} option index to select
   */
  Menu.prototype.selectOption = function(option) {
    if(this.selectedOption) {
      this.setOptionUnselected(this.selectedOption);
    }
    if(option) {
      this.setOptionSelected(option);
      this.selectedOption = option;
    } else {
      this.selectedOption = undefined
    }
  }

  /**
   * Sets option selected style
   * @param option {Phaser.GameObjects.Text} option to set
   */
  Menu.prototype.setOptionSelected = function(option) {
    var effect = option._menuConfig.effect || this.config.effect;
    effect(option, 'select');
  }

  /**
   * Sets option unselected style
   * @param option {Paser.GameObjects.Text} option to set
   */
  Menu.prototype.setOptionUnselected = function(option) {
    var effect = option.effect || this.config.effect;
    effect(option, 'unselect');
  }

  /**
   * Default effect for menu selection and unselection
   * @param option menu to apply effect
   * @param action 'select' or 'unselect'
   */
  Menu.prototype.defaultEffect = function(option, action) {
    if(action==='select') {
      option.setFontStyle('bolder');
    } else {
      option.setFontStyle('normal');
    }
  }

  ns.Menu = Menu;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
