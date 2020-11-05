var width = 1280;
var height = 720;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  debug: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height
  },
  scene: [
    candlegames.pestis.client.scenes.Boot,
    candlegames.pestis.client.scenes.Loader,
    candlegames.pestis.client.scenes.MainMenu
  ],
  plugins: {
    global: [
      { key: 'CommsSystemPlugin', plugin: candlegames.pestis.client.plugins.CommsSystem, mapping: 'comms', start: true }
    ],
    scene: [
      { key: 'LoadingProgressBarPlugin', plugin: candlegames.pestis.client.plugins.LoadingProgressBar, mapping: 'loadingprogressbar' },
      { key: 'MusicSystemPlugin', plugin: candlegames.pestis.client.plugins.MusicSystem, mapping: 'music' },
      { key: 'MenuPlugin', plugin: candlegames.pestis.client.plugins.Menu, mapping: 'menu' },
      /* { key: 'DebugDrawPlugin', plugin: PhaserDebugDrawPlugin, mapping: 'debugDraw' } */
    ]
  }
});

