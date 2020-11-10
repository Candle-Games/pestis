(function(ns) {
  function LoadingProgressBar(scene) {
    Phaser.Scenes.ScenePlugin.call(this, scene);

    this.background;
    this.pctbar;

    this.width = this.scene.game.canvas.width;
    this.height = this.scene.game.canvas.height;
    this.hmargin = width * 0.2;
    this.vmargin = 50;

    this.config;
  }

  LoadingProgressBar.prototype = Object.create(Phaser.Scenes.ScenePlugin.prototype);
  LoadingProgressBar.prototype.constructor = LoadingProgressBar;

  LoadingProgressBar.prototype.draw = function() {
    this.background = this.scene.add.graphics();
    this.pctbar = this.scene.add.graphics();

    this.background.setDepth(100);
    this.pctbar.setDepth(100);

    this.background.beginPath();
    this.background.lineStyle(2, 0xf429ac, 1);
    this.background.moveTo(this.hmargin + 5, this.height - this.vmargin - 5);
    this.background.lineTo(this.hmargin, this.height - this.vmargin - 5);
    this.background.lineTo(this.hmargin, this.height - this.vmargin + 5);
    this.background.lineTo(this.hmargin + 5, this.height - this.vmargin + 5);

    this.background.moveTo(this.width - this.hmargin - 5, this.height - this.vmargin - 5);
    this.background.lineTo(this.width - this.hmargin, this.height - this.vmargin - 5);
    this.background.lineTo(this.width - this.hmargin, this.height - this.vmargin + 5);
    this.background.lineTo(this.width - this.hmargin - 5, this.height - this.vmargin + 5);
    this.background.strokePath();
  }

  LoadingProgressBar.prototype.updateBar = function(pct) {
    var barwidth = (this.width - 6 - (this.hmargin * 2)) * pct;
    this.pctbar.clear();
    this.pctbar.beginPath();
    this.pctbar.lineStyle(2, 0xf429ac, 1);
    if(this.config.dashStyle) {
      for(var i=0, length=barwidth; i < length; i += this.config.dashStyle[0] + this.config.dashStyle[1]) {
        this.pctbar.moveTo(this.hmargin + 3 + i, this.height - this.vmargin);
        this.pctbar.lineTo(_.clamp(this.hmargin + 3 + i + this.config.dashStyle[0], this.hmargin + 3, this.hmargin + 3 + barwidth), this.height - this.vmargin);
      }
    } else {
      this.pctbar.moveTo(this.hmargin + 3, this.height - this.vmargin);
      this.pctbar.lineTo(this.hmargin + 3 + barwidth, this.height - this.vmargin);
    }
    this.pctbar.strokePath();
  }

  LoadingProgressBar.prototype.show = function(config) {
    this.config = _.assign({
      dashStyle: null
    }, config);

    if(this.scene.load) {
      this.draw();
      this.scene.load.on('progress', this.onProgess.bind(this));
      this.scene.load.on('fileprogress', this.onFileProgress.bind(this));
      this.scene.load.on('complete', this.onLoadComplete.bind(this));
    }
  }

  LoadingProgressBar.prototype.hide = function(config) {
    this.destroy();
  }

  LoadingProgressBar.prototype.onProgess = function(pct) {
    var pct100 = pct * 100;
    var pctStr = pct100.toLocaleString();
    this.updateBar(pct);
  }

  LoadingProgressBar.prototype.onFileProgress = function(file) {
  }

  LoadingProgressBar.prototype.onLoadComplete = function(value) {
    this.updateBar(1);
  }

  LoadingProgressBar.prototype.destroy = function() {
    if(this.background) { this.background.destroy(); }
    if(this.pctbar) { this.pctbar.destroy(); }
  }

  ns.LoadingProgressBar = LoadingProgressBar;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
