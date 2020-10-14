(function (ns){
    /**
     * Test Scene
     * @constructor
     */
    function TestScene() {
        Phaser.Scene.call(this, {
            key: 'TestScene'
        });
    }

    //Inheritance stuff
    TestScene.prototype = Object.create(Phaser.Scene.prototype);
    TestScene.prototype.constructor = TestScene;

    TestScene.prototype.preload = function() {};

    TestScene.prototype.create = function() {
        if(this.browserchecker.isMobileBrowser()){
            text=this.add.text(0, 0, "Mobile", 'Luckiest Guy');

        }else{
            console.log("not mobile");
            text=this.add.text(0, 0, "Not Mobile", 'Luckiest Guy');
        }
    };

    ns.TestScene=TestScene;
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))