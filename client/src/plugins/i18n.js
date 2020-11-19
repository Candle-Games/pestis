(function(ns) {
  function I18N(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    this.languages = [];
    this.ready = false;
    this.defaultLanguage = 'es-ES';
    this.currentLanguage = navigator.language || this.defaultLanguage;

    this.loadLanguages();
  }

  I18N.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  I18N.prototype.constructor = I18N;

  I18N.prototype.get = function(key, defaultValue, lang) {
    if(key==undefined) return '';
    defaultValue = defaultValue || key;
    lang = lang ||this.currentLanguage;
    return this.languages[lang][key] || defaultValue;
  }

  I18N.prototype.loadLanguages = function() {
    $.when(
      $.getJSON('resources/i18n/es-ES.json'),
      $.getJSON('resources/i18n/en.json')
    ).then(function(responseES, responseEN) {
      this.languages['es-ES'] = responseES[0];
      this.languages['en'] = responseEN[0];
      this.ready = true;
    }.bind(this));
  }

  ns.I18N = I18N;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
