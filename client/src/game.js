var width = 1280;
var height = 720;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  debug: true,
  roundPixels: true,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height
  },
  scene: [
    candlegames.pestis.client.scenes.BaseScene,

    candlegames.pestis.client.scenes.Boot,
    candlegames.pestis.client.scenes.Loader,
    candlegames.pestis.client.scenes.MenuScene,
    candlegames.pestis.client.scenes.Credits,
    candlegames.pestis.client.scenes.GameLoad,
    candlegames.pestis.client.scenes.Settings,
    candlegames.pestis.client.scenes.GameplayManager,
  ],
  plugins: {
    global: [
      /**
       * Global plugins
       */
      { key: 'CommsSystemPlugin', plugin: candlegames.pestis.client.plugins.CommsSystem, mapping: 'comms', start: true },
      { key: 'MusicSystemPlugin', plugin: candlegames.pestis.client.plugins.MusicSystem, mapping: 'music', start:true},
      { key: 'UserSettings', plugin: candlegames.pestis.client.plugins.UserSettings, mapping: 'settings', start: true },
      { key: 'SavedGames', plugin: candlegames.pestis.client.plugins.SavedGames, mapping: 'savedgames', start: true },

      /**
       * Game Objects registration
       */
      { key: 'CharacterPlugin', plugin: candlegames.pestis.gameobjects.server.CharacterPlugin, start: true},
      { key: 'EnemyPlugin', plugin: candlegames.pestis.gameobjects.server.EnemyPlugin, start: true},
      { key: 'HideoutPlugin', plugin: candlegames.pestis.gameobjects.engine.HideoutPlugin, start: true},
      { key: 'GroundPlugin', plugin: candlegames.pestis.gameobjects.engine.GroundPlugin, start: true},
      { key: 'StairsSpotPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsSpotPlugin, start: true},
      { key: 'StairsPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsPlugin, start: true},
      { key: 'PathPlugin', plugin: candlegames.pestis.gameobjects.engine.PathPlugin, start: true},
      { key: 'DoorPlugin', plugin: candlegames.pestis.gameobjects.engine.DoorPlugin, start: true},
      { key: 'KeyPlugin', plugin: candlegames.pestis.gameobjects.engine.KeyPlugin, start: true},

      { key: 'PlayerCharacterPlugin', plugin: candlegames.pestis.gameobjects.client.PlayerCharacterPlugin, start: true },
      { key: 'DefaultEnemyPlugin', plugin: candlegames.pestis.gameobjects.client.DefaultEnemyPlugin, start: true },
      { key: 'LanternPlugin', plugin: candlegames.pestis.gameobjects.client.LanternPlugin, start: true },
      { key: 'SavedGameSlot', plugin: candlegames.pestis.gameobjects.client.SavedGameSlotPlugin, start: true },
      { key: 'SavedGameContainer', plugin: candlegames.pestis.gameobjects.client.SavedGamesContainerPlugin, start: true }
    ],
    scene: [
      /**
       * Scene plugins
       */
      { key: 'LoadingProgressBarPlugin', plugin: candlegames.pestis.client.plugins.LoadingProgressBar, mapping: 'loadingprogressbar' },
      { key: 'MenuPlugin', plugin: candlegames.pestis.client.plugins.Menu, mapping: 'menu' },
      { key: 'InputManager', plugin: candlegames.pestis.client.plugins.InputManager, mapping: 'inputmanager' },
      { key: 'BrowserChecker', plugin: candlegames.pestis.client.plugins.BrowserChecker, mapping: 'browserchecker' },
      { key: 'GameEngine', plugin: candlegames.pestis.client.plugins.GameEngine, mapping: 'game_engine' }
    ]
  }
});
