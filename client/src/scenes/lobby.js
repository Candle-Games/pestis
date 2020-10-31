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
    Lobby.prototype.init = function(data){
        console.log(data.data)
        this.keyRoom=data.data.keyRoom
        var style = {font:'50px Oswald', fill: '#a7a6a0', align: 'center'}
        var textKeyRoom = this.add.text(20,this.game.canvas.height*3/4 ,"ROOM: \" "+ this.keyRoom + " \"", style)
        textKeyRoom.anchor = [0,1];
    }

    Lobby.prototype.create = function(){

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

        this.events.off('menuselected', this.handleMenu, this);
        this.events.on('menuselected', this.handleMenu, this);
    }

    Lobby.prototype.handleMenu = function(optionSelected){
        if(optionSelected._menuConfig.disabled) return;
        switch (optionSelected.name){
            case "start-game":
                break;
            case "back-menu":
                this.comms.emit('leave game');
                game.scene.stop('Lobby');
                game.scene.start('MainMenu');
                break;
        }
    }

    ns.Lobby = Lobby
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))