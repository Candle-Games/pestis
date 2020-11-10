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

        this.host = false;
    }


    //Inheritance stuff
    Lobby.prototype = Object.create(Phaser.Scene.prototype)
    Lobby.prototype.constructor = Lobby;

    Lobby.prototype.preload = function(){};
    Lobby.prototype.init = function(data){
        console.log(this.host)
        this.keyRoom=data.keyRoom
        var styleTextKeyRoom = {font:'50px Oswald', fill: '#a7a6a0', align: 'center'}
        var textKeyRoom = this.add.text(20,this.game.canvas.height*3/4 ,"ROOM: \" "+ this.keyRoom + " \"", styleTextKeyRoom)
        textKeyRoom.anchor = [0,1];

        if(!this.host){
            if(data.host){
                console.log("Soy host")
                this.host=true;
            }else {
                this.host=false;
            }
        }
    }

    Lobby.prototype.create = function(){

        var styeTextPlayers = {font: '50px Oswald', fill: '#fc7f03', align: 'center'}
        var textPlayers = this.add.text(20,20,"Waiting Host... ", styeTextPlayers);

        if(this.host){
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
            textPlayers.setText("You are alone at the moment...")
        }
        else {
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
                effect: function (option, action) {
                    option.setStyle(action === 'select' ? {color: '#ffcda4'} : {color: '#fc7f03'});
                },
                options: [
                    {
                        id: 'back-menu', label: 'Back',
                        effect: function (option, action) {
                            option.setStyle(action === 'select' ? {color: '#fffe77'} : {color: '#fc7f03'});
                        },
                    }
                ]
            })
            textPlayers.setText("Waiting Host...")
        }

        this.events.off('menuselected', this.handleMenu, this);
        this.events.on('menuselected', this.handleMenu, this);

        this.comms.off('player joined');
        this.comms.on('player joined', function(){
            console.log("player joined");
            textPlayers.setText("Now you are with your brother... ")
        })

        this.comms.off("player leaved");
        this.comms.on('player leaved', function() {
            console.log("player leaved " + this.host)
            textPlayers.setText("You are alone at the moment...")
            if (!this.host) {
                this.host = true;
                this.menu.optionsGroup.destroy();
                this.scene.restart();
            }
        }, this);

        this.comms.off("game started");
        this.comms.on('game started', function(){
            console.log("THE GAME STARTED");
        })
    }

    Lobby.prototype.handleMenu = function(optionSelected){
        console.log("pulsado");
        if(optionSelected._menuConfig.disabled) return;
        switch (optionSelected.name){
            case "start-game":
                this.comms.emit('start game');
                break;
            case "back-menu":
                this.comms.emit('leave game');
                this.host=false;
                game.scene.stop('Lobby');
                game.scene.start('MainMenu');
                break;
        }
    }

    ns.Lobby = Lobby
})(candlegamestools.namespace('candlegames.pestis.client.scenes'))