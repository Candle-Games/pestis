(function(ns) {
  function Settings() {
    candlegames.pestis.client.scenes.MenuScene.call(this, {
      key: 'Settings'
    });
  }

  Settings.prototype = Object.create(candlegames.pestis.client.scenes.MenuScene.prototype);
  Settings.prototype.constructor = Settings;

  Settings.prototype.preload = function() {
    this.load.html('user-settings', '/html/user-settings.html');
    this.load.css('user-settings', '/css/user-settings.css');
  }

  Settings.prototype.create = function(data) {
    var s = this.settings;
    var settings = this.settings.settings;

    candlegames.pestis.client.scenes.MenuScene.prototype.create.call(this, data);

    var dom = this.add.dom(game.canvas.width / 2, game.canvas.height / 2).createFromCache('user-settings');
    var node = dom.node;

    $(node).find('input[name="music-volume"]')
      .on('change', function() {
        settings.music.volume = parseInt($(this).val()) / 100;
        s.save();
      })
      .prop('value', settings.music.volume * 100)
      .prop('disabled', !settings.music.status);

    $(node).find('input[name="music"]').on('change', function() {
      settings.music.status = $(this).prop('checked');
      $(node).find('input[name="music-volume"]').prop('disabled', !$(this).prop('checked'));
      s.save();
    }).prop('checked', settings.music.status);

    $(node).find('input[name="effects-volume"]').on('change', function() {
      settings.effects.volume = parseInt($(this).val()) / 100;
      s.save();
    })
      .prop('value', settings.effects.volume * 100)
      .prop('disabled', !settings.effects.status);

    $(node).find('input[name="effects"]').on('change', function() {
      settings.effects.status = $(this).prop('checked');
      $(node).find('input[name="effects-volume"]').prop('disabled', !$(this).prop('checked'));
      s.save();
    }).prop('checked', settings.effects.status);

    var prevKey = false;

    var getKey = function(e) {
      console.log("Getting key " + $(this).text());
      if(prevKey) {
        $(prevKey).removeClass('selected');
        $(document).off('keydown');
      }

      $(this).addClass('selected');
      prevKey = this;

      $(document).on('keydown', function(e) {
        var key = $(prevKey).attr('data-key');
        settings.keyboard[key] = e.originalEvent.code;
        s.save();
        
        $(prevKey)
          .text(e.originalEvent.code)
          .removeClass('selected');

        $(document).off('keydown');
      });
    }

    $(node).find('.key-button').each(function(button) {
      var key = $(this).attr('data-key');
      $(this).text(settings.keyboard[key])
        .on('click', getKey);
    });
  }

  ns.Settings = Settings;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
