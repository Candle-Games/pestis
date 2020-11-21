(function(ns) {
  function Credits() {
    candlegames.pestis.client.scenes.MenuScene.call(this, {
      key: 'Credits'
    });

    /**
     * Credits container
     * @type {Phaser.GameObjects.Container}
     */
    this.creditsContainer;

    /**
     * Credit blocks vertical spacing
     * @type {number}
     */
    this.creditSpacing = 175;

    /**
     * Total duration of credits animation
     * @type {number}
     */
    this.duration = 10000;
  }

  Credits.prototype = Object.create(candlegames.pestis.client.scenes.MenuScene.prototype);
  Credits.prototype.constructor = Credits;

  Credits.prototype.preload = function() {
    this.creditsConfiguration = game.cache.json.get('game-configuration').credits;
  }

  Credits.prototype.create = function(data) {
    this.add.image(0, 0, 'main-menu-background').setOrigin(0, 0);
    this.duration = parseInt(this.creditsConfiguration.duration);
    candlegames.pestis.client.scenes.MenuScene.prototype.create.call(this, data);
    this.createCredits();
  }

  Credits.prototype.createCredits = function() {
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;
    this.creditsContainer = this.add.container(width * 0.5, height);

    var x = 0, y = 0;

    var creditsTexts = this.creditsConfiguration.texts;
    for(var i=0, length=creditsTexts.length; i < length; ++i) {
      var creditData = creditsTexts[i];
      var creditBox = this.createCreditContainer(creditData, x, y);

      y += this.creditsConfiguration.creditBoxMarginTop;
      this.creditsContainer.add(creditBox);
      y += creditBox.getBounds().height + this.creditsConfiguration.creditBoxMarginBottom;
    }

    var lastCreditText = this.creditsContainer.getBounds().height;

    // From here on, vertically centered on screen
    y = lastCreditText + (height / 2) - (this.creditsConfiguration.logoSize.height / 2);

    var logo = this.add.image(0, y, 'logo-800');
    logo.setOrigin(0.5, 0);
    logo.setDisplaySize(this.creditsConfiguration.logoSize.width, this.creditsConfiguration.logoSize.height);
    this.creditsContainer.add(logo);

    /* debugging purposes only
    this.creditsContainer.add(
      this.add.rectangle(0, y, this.creditsConfiguration.logoSize, this.creditsConfiguration.logoSize)
      .setOrigin(0.5, 0).setStrokeStyle(1, 0x00ff00));
    */

    y += this.creditsConfiguration.logoSize.height + this.creditsConfiguration.styles.copyright.margin;

    var copyright = this.add.text(0, y, '®2020 - Candle Games - All rights reserved',
      this.creditsConfiguration.styles.copyright);
    copyright.setOrigin(0.5, 0);
    this.creditsContainer.add(copyright);

    var tween = this.add.tween({
      targets: this.creditsContainer,
      y: -lastCreditText,
      duration: this.duration,
      ease: 'Sine.easeInOut'
    });
  }

  Credits.prototype.createCreditContainer = function(credit, x, y) {
    var creditContainer = this.add.container();

    var styles = this.creditsConfiguration.styles;

    y += styles.name.margin;
    var name =  this.add.text(x, y, credit.name, styles.name);
    name.setOrigin(0.5, 0);
    creditContainer.add(name);

    y += name.getBounds().height + styles.email.margin;
    var email = this.add.text(x, y, credit.email, styles.email);
    creditContainer.add(email);
    email.setOrigin(0.5, 0);

    y += email.getBounds().height + styles.role.margin;
    var role =  this.add.text(x, y, credit.role, styles.role);
    role.setOrigin(0.5, 0);
    creditContainer.add(role);

    return creditContainer;
  }

  ns.Credits = Credits;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
