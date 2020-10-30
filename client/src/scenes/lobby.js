/*global Phaser*/
(function(ns){
    /**
     * Resource Lobby scene
     * @constructor
     */
    function Lobby(){
        Phaser.Scene.call(this, {
            key: 'Lobby'
        });

        this.keyRoom ="";
    }


    //Inheritance stuff
    Lobby.prototype = Object.create(Phaser.Scene.prototype)
    Lobby.prototype.constructor = Lobby;

    Lobby.prototype.preload = function(){};

    Lobby.prototype.create = function(){
        this.comms.emit('need key');
        var style = {font:'50px Oswald', fill: '#a7a6a0', align: 'center'}
        var textKeyRoom = this.add.text(20,this.game.canvas.height*3/4 ,this.keyRoom, style)
        textKeyRoom.anchor = [0,1];

        this.comms.on("take the key", function(key){
            this.keyRoom=key.data;
            textKeyRoom.setText("Key Room: \" " + this.keyRoom +" \"");
        })

        this.menu.show({
            x: this.game.canvas.width - 20,
            y: this.game.canvas.height - 20,
            hanchor: 1,
            vanchor: 1,
            spacing: 100,
            fontfamily: "Oswald",
            fontsize: 50,
            fontcolor: '#fc7f03',
            textalign: 'center',
            debug: false,
            effect: function(option, action) {
                option.setStyle(action==='select' ? { color: '#ffcda4'} : {color: '#fc7f03'});
            },
            options: [
                { id: 'start-game', label: 'Start Game',
                    effect: function(option, action) {
                        option.setStyle(action==='select' ? { color: '#fffe77'} : {color: '#fc7f03'});
                    },
                },
                { id: 'back-menu', label: 'Back'}
            ]
        });
        
    }



    ns.Lobby = Lobby
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))