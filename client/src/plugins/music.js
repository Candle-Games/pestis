(function (ns){
    function MusicSystem (pluginManager){
        Phaser.Plugins.BasePlugin.call(this,pluginManager);
    }

    MusicSystem.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
    MusicSystem.prototype.constructor = MusicSystem;


    ns.MusicSystem=MusicSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))