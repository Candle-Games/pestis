var width = 1280;
var height = 720;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height
  },
  scene: [
    candlegames.game1.client.scenes.Boot,
    candlegames.game1.client.scenes.Loader,
    candlegames.game1.client.scenes.MainMenu
  ]
});
