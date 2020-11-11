var width = 1280;
var height = 720;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  debug: true,
  roundPixels: true,
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
    candlegames.pestis.client.scenes.PlayMenu,
    candlegames.pestis.client.scenes.MainMenu,
    candlegames.pestis.client.scenes.Game,
  ],
  plugins: {
    global: [
      { key: 'CommsSystemPlugin', plugin: candlegames.pestis.client.plugins.CommsSystem, mapping: 'comms', start: true },
      { key: 'MusicSystemPlugin', plugin: candlegames.pestis.client.plugins.MusicSystem, mapping: 'music', start:true},

      { key: 'CharacterPlugin', plugin: candlegames.pestis.gameobjects.server.CharacterPlugin, start: true},
      { key: 'HideoutPlugin', plugin: candlegames.pestis.gameobjects.engine.HideoutPlugin, start: true},
      { key: 'GroundPlugin', plugin: candlegames.pestis.gameobjects.engine.GroundPlugin, start: true},
      { key: 'StairsSpotPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsSpotPlugin, start: true},
      { key: 'StairsPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsPlugin, start: true},

      { key: 'PlayerCharacterPlugin', plugin: candlegames.pestis.gameobjects.client.PlayerCharacterPlugin, start: true },
      { key: 'LanternPlugin', plugin: candlegames.pestis.gameobjects.client.LanternPlugin, start: true }
    ],
    scene: [
      { key: 'LoadingProgressBarPlugin', plugin: candlegames.pestis.client.plugins.LoadingProgressBar, mapping: 'loadingprogressbar' },
      { key: 'MenuPlugin', plugin: candlegames.pestis.client.plugins.Menu, mapping: 'menu' },
      { key: 'BrowserChecker', plugin: candlegames.pestis.client.plugins.BrowserChecker, mapping: 'browserchecker' },
      { key: 'InputsController', plugin: candlegames.pestis.client.plugins.InputsController, mapping: 'inputscontroller' },
      { key: 'GameEngine', plugin: candlegames.pestis.client.plugins.GameEngine, mapping: 'game_engine' }
      /* { key: 'DebugDrawPlugin', plugin: PhaserDebugDrawPlugin, mapping: 'debugDraw' } */
    ]
  }
});

