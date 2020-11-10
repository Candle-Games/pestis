(function (ns){

    /**
     * Check the web browser hardware
     * @param scene
     * @constructor
     */
    function BrowserChecker(scene) {
        Phaser.Scenes.ScenePlugin.call(this, scene);
    }

    BrowserChecker.prototype = Object.create(Phaser.Scenes.ScenePlugin.prototype)
    BrowserChecker.prototype.constructor=BrowserChecker;

    /**
     * This function return true if the player are in phone web browser
     * @returns {boolean}
     */
    BrowserChecker.prototype.isMobileBrowser = function(){
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    };

    ns.BrowserChecker=BrowserChecker;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'))