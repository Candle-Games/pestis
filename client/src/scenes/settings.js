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

    candlegames.pestis.client.scenes.MenuScene.prototype.create.call(this, data);

    var dom = this.add.dom(game.canvas.width / 2, game.canvas.height / 2).createFromCache('user-settings');
    var node = dom.node;

    $(node).find('input[name="music-volume"]')
      .on('change', function() {
        s.set('music.volume', parseInt($(this).val()) / 100);
        s.save();
      })
      .prop('value', s.get('music.volume') * 100)
      .prop('disabled', !s.get('music.status'));

    $(node).find('input[name="music"]').on('change', function() {
      var checked = $(this).prop('checked');
      $(node).find('input[name="music-volume"]').prop('disabled', !checked);
      s.set('music.status', checked);
      s.save();
    }).prop('checked', s.get('music.status'));

    $(node).find('input[name="effects-volume"]').on('change', function() {
      s.set('effects.volume', parseInt($(this).val()) / 100);
      s.save();
    })
      .prop('value', s.get('effects.volume') * 100)
      .prop('disabled', !s.get('effects.status'));

    $(node).find('input[name="effects"]').on('change', function() {
      var checked = $(this).prop('checked')
      $(node).find('input[name="effects-volume"]').prop('disabled', !checked);
      s.set('effects.status', checked);
      s.save();
    }).prop('checked', s.get('effects.status'));

    var prevKey = false;

    var getKey = function(e) {
      if(prevKey) {
        $(prevKey).removeClass('selected');
        $(document).off('keydown');
      }

      $(this).addClass('selected');
      prevKey = this;

      $(document).on('keydown', function(e) {
        var key = $(prevKey).attr('data-key');
        s.set('keyboard.' + key, e.originalEvent.code);
        s.save();

        $(prevKey)
          .text(e.originalEvent.code)
          .removeClass('selected');

        $(document).off('keydown');
      });
    }

    $(node).find('.key-button').each(function(button) {
      var key = $(this).attr('data-key');
      $(this).text(s.get('keyboard.' + key))
        .on('click', getKey);
    });
  }

  ns.Settings = Settings;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'));
