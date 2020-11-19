(function(ns){
    ns.WalkingEnemies = {
        /**
         * Walk velocity
         */
        walkVelocity: 220,

        /**
         * Run multiplier
         */
        runMultiplier: 1.5,

        /**
         * Current Path
         */
        path: undefined,

        /**
         * current player
         */
        currentPlayer: undefined,

        /**
         * current direction
         */
        currentDirection: -1,

        /**
         * vision distance
         */
        vision: 1500,

        /**
         * Distance to kill character
         */
        distanceToKill: 200,

        /**
         * Last position of Character to go
         */
        lastCharacterPosition: -1,

        stop: function(){
            this.walk(0);
        },

        walk: function(speed){
            if(speed===undefined) speed = this.walkVelocity;

            if(this.lastCharacterPosition < 0){
                if(this.currentDirection === -1 && this.path !== undefined && this.path.inStartPoint(this.body.position)){
                    this.currentDirection = this.currentDirection * -1;
                }else if(this.currentDirection === 1 && this.path !== undefined && this.path.inEndPoint(this.body.position)){
                    this.currentDirection = this.currentDirection * -1;
                }
            }else{
                if(this.lastCharacterPosition + this.distanceToKill < this.body.x){
                    this.currentDirection = -1;
                    speed = speed * this.runMultiplier;
                }else if (this.lastCharacterPosition - this.distanceToKill > this.body.x){
                    this.currentDirection = 1;
                    speed = speed * this.runMultiplier;
                }else{
                    speed = 0;
                }
            }
            this.body.setVelocityX(speed * this.currentDirection);
        },

        selectPath: function(pathId){
            this.path = this.scene.game_engine.objects[pathId];
            console.log(this.path);
        },


        /**
         *
         * @param enable
         * @private
         */
        _setBodyEnabled: function(enable) {
            if(enable===undefined) enable = true;
            this.body.enable = enable;
            // this.body.setAllowGravity(enable);
        }
    }
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));