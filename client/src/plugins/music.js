(function (ns) {
  function MusicSystem(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    this._dataMusic = undefined;
    this._sounds = {};

    this._musicSettings;
    this._effectsSettings;

    this.currentBackground = undefined;
    this.currentEffects = [];
    this.currentScene = undefined;
  }

  MusicSystem.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  MusicSystem.prototype.constructor = MusicSystem;

  /**
   * Loads music files
   * @param loader
   */
  MusicSystem.prototype.loadMusic = function (loader) {
    this._dataMusic = this.game.cache.json.get('music');

    if (this._dataMusic !== undefined) {
      for (var i = 0; i < this._dataMusic.music.length; i++) {
        var currentSound = this._dataMusic.music[i];

        if (currentSound.prefix !== undefined) {
          for (var j = currentSound.first; j <= currentSound.last; j++) {
            var paddedNumber = _.padStart("" + j, currentSound.padding, '0');
            loader.audio(currentSound.id + paddedNumber, "resources/music/" + currentSound.prefix
              + paddedNumber + currentSound.extension);
          }
        } else {
          loader.audio(currentSound.id, "resources/music/" + currentSound.file);
        }
      }
    }
  }

  /**
   * Initializes music system
   */
  MusicSystem.prototype.initMusic = function () {
    var sounds = {};

    this._musicSettings = this.game.plugins.get('UserSettings').settings.music;
    this._effectsSettings = this.game.plugins.get('UserSettings').settings.effects;

    this.game.events.on('settings-update', function(settings, scene) {
      this._musicSettings = settings.music;
      this._effectsSettings= settings.effects;
      this.updateSettings(settings, scene);
    }, this);

    if (this._dataMusic !== undefined) {
      for (var i = 0; i < this._dataMusic.music.length; i++) {
        var currentSound = this._dataMusic.music[i];
        var sound = [];

        if (currentSound.file !== undefined) {   // single file sound
          if (currentSound.entry !== undefined) {
            sound.push(this.createSound(currentSound.entry, false));
          }
          sound.push(this.createSound(currentSound.id,
            currentSound.loop !== undefined && currentSound.loop));
        } else {
          var transition = this.findSoundInData(currentSound.transition);

          if (currentSound.sequence) {
            var start = currentSound.sequence.start;
            var sequenceLoop = [];

            sequenceLoop = currentSound.sequence.loop.split(',').map(function (idx, i, array) {
              idx = parseInt(idx, 10);

              var key = currentSound.id
                + _.padStart(idx, currentSound.padding, '0');

              if (transition !== undefined) {
                var stopIdx = parseInt((i + 1 >= array.length) ? array[start] : array[(i + 1)], 10);

                var stopKey = transition.id
                  + _.padStart(stopIdx, currentSound.padding, '0');
              }
              return this.createSequenceSound(key, (i + 1) >= array.length ? start: undefined, stopKey);
            }.bind(this));

            sound = sound.concat(sequenceLoop);
          } else {
            for (var j = currentSound.first; j <= currentSound.last; j++) {
              var key = currentSound.id
                + _.padStart(j, currentSound.padding, '0');

              if (transition !== undefined && j + 1 <= transition.last) {
                var stopIdx = (j==currentSound.last) ? currentSound.first : j + 1;

                var stopKey = transition.id
                  + _.padStart(stopIdx, currentSound.padding, '0');
              }

              sound.push(this.createSequenceSound(key, start, stopKey));
            }
          }
        }

        sounds[currentSound.id] = sound;
      }
    }

    this._sounds = sounds;

    this._initSceneListeners();
  }

  MusicSystem.prototype.updateSettings = function(settings, scene) {
    if(this.currentBackground !== undefined) {
      this.currentBackground.setVolume(this._musicSettings.volume);

      if(this._musicSettings.status !== this.currentBackground.play) {

        if(this._musicSettings.status) {
          this._sceneChanged(this.currentScene);
        } else {
          this.currentBackground.stop();
          this.currentBackground = undefined;
        }
      }
    } else {
      if(this._musicSettings.status) {
        this._sceneChanged(this.currentScene);
      }
    }
  }

  /**
   * Creates a sound for playback
   * @param id
   * @param looped
   * @return {{sound, looped}}
   */
  MusicSystem.prototype.createSound = function (id, looped) {
    var sound = {
      sound: id,
      looped: looped
    };

    return sound;
  }

  /**
   *
   * @param id
   * @param loopStart
   * @param stopSound
   * @return {{}}
   */
  MusicSystem.prototype.createSequenceSound = function (id, loopStart, stopSound) {
    var sound = {
      sound: id,
      loopStart: loopStart,
      stopSound: stopSound
    };

    return sound;
  }

  /**
   * Returns the data for a sound
   * @param id
   * @return {*}
   */
  MusicSystem.prototype.findSoundInData = function (id) {
    if (id === undefined) return;

    for (var i = 0, length = this._dataMusic.music.length; i < length; ++i) {
      if (this._dataMusic.music[i].id === id) {
        return this._dataMusic.music[i];
      }
    }

    return;
  }

  /**
   * Inits scene change listeners
   * @private
   */
  MusicSystem.prototype._initSceneListeners = function () {
    var scenes = this._dataMusic.scenes;
    var keys = _.keys(scenes);

    for (var i = 0, length = keys.length; i < length; ++i) {
      var scene = this.game.scene.getScene(keys[i]);
      scene.events.on('start', function (from) {
        this.currentScene = from.scene.scene.key;
        this._sceneChanged(from.scene.scene.key);
      }, this);
    }
  }

  /**
   * select the background to the current scene
   * @param currentScene Key
   */
  MusicSystem.prototype._sceneChanged = function (currentScene) {
    var background = this._dataMusic.scenes[currentScene].background;
    this._playBackgroundMusic(background);
  }

  MusicSystem.prototype.playGameMusic = function(backgroundId) {
    var background = this._dataMusic.game[backgroundId];
    this._playBackgroundMusic(background);
  }

  MusicSystem.prototype.stopGameMusic = function() {
    this._stopBackgroundMusic(true);
  }

  /**
   * Plays current background music
   * @private
   */
  MusicSystem.prototype._playBackgroundMusic = function (background) {
    if(background === undefined) return;
    if(this.currentBackground !== undefined && this.currentBackground.name===background) return;

    // First stop current backgroun if any
    this._stopBackgroundMusic();

    var play = this._musicSettings.status;
    var volume = this._musicSettings.volume;
    this.currentBackground = this._musicLoop(background, volume, play);
    if(this.currentBackground !== undefined) {
      this.currentBackground.run();
    }
  }

  /**
   * Stops current background music
   * @private
   */
  MusicSystem.prototype._stopBackgroundMusic = function (remove) {
    remove = (remove==undefined) ? true : remove;
    if (this.currentBackground !== undefined) {
      this.currentBackground.stop();
      if(remove) {
        this.currentBackground = undefined;
      }
    }
  }

  MusicSystem.prototype.playEffect = function(effect) {
    this.stopEffect(effect);

    var play = this._effectsSettings.status;
    var volume = this._effectsSettings.volume;
    this.currentEffects[effect] = this._musicLoop(effect, volume, play);
    this.currentEffects[effect].run();
  }

  MusicSystem.prototype.stopEffect = function(effect) {
    if(this.currentEffects[effect] !== undefined) {
      this.currentEffects[effect].stop();
      this.currentEffects[effect] = undefined;
    }
  }

  MusicSystem.prototype.stopAllEffects = function() {
    var effects = _.keys(this.currentEffects);
    for(var i=0, length=effects.length; i < length; ++i) {
      var effectName = effects[i];
      this.stopEffect(effectName);
    }
    this.currentEffects = {};
  }

  /**
   * Looped music player
   * @param sound
   * @param volume
   * @param play
   * @return {{volume: *, currentIdx: number, currentSound: undefined, stop: function(): void, array: *, run: function(): void, setVolume: function(*=): void, playNext: function(): void}|undefined}
   * @private
   */
  MusicSystem.prototype._musicLoop = function (sound, volume, play) {
    if(!play || this._sounds[sound]===undefined) {
      return undefined;
    }

    var musicSystem = this;
    var soundSystem = this.game.sound;

    var musicLoop = {
      array: musicSystem._sounds[sound],
      currentIdx: 0,
      currentSound: undefined,
      volume: volume,
      name: sound,
      play: play,

      run: function () {
        var data = this.array[this.currentIdx];
        this.currentSound = soundSystem.add(data.sound);
        this.currentSound.play();
        this.currentSound.setLoop(data.looped != undefined && data.looped);
        this.currentSound.setVolume(this.volume);
        this.currentSound.once('complete', this._playNext, this);
        console.log("Playing " + data.sound);
      },
      _playNext: function () {
        if (this.currentIdx + 1 >= this.array.length) {
          var data = this.array[this.currentIdx];
          if (data.loopStart) {
            this.currentIdx = data.loopStart;
          } else {
            return;
          }
        } else {
          this.currentIdx++;
        }

        this.run();
      },
      stop: function () {
        var data = this.array[this.currentIdx];

        if (this.currentSound !== undefined) {
            if(data.stopSound !== undefined) {
              this.currentSound.off('complete');
              this.currentSound.once('complete', function() {
                this.currentSound = soundSystem.add(data.stopSound);
                this.currentSound.play();
                this.currentSound.setVolume(this.volume);
              }, this);
          } else {
            this.currentSound.stop();
            console.log("Stopped " + data.sound);
          }
        }
      },
      setVolume: function(volume) {
        if(this.currentSound !== undefined) {
          this.currentSound.setVolume(volume);
          this.volume = volume;
        }
      }
    };

    return musicLoop;
  }

  ns.MusicSystem = MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
