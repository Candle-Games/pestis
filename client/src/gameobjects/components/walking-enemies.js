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

        stop: function(){
            this._walk(0);
        },

        _walk: function(speed){
            if(speed===undefined) speed = this.walkVelocity;

            if(this.currentPlayer === undefined){
                if(this.currentDirection === -1 && this.path !== undefined && this.path.inEndPoint(this.body.position)){
                    this.currentDirection = this.currentDirection * -1;
                }else if(this.currentDirection === 1 && this.path !== undefined && this.path.inStartPoint(this.body.position)){
                    this.currentDirection = this.currentDirection * -1;
                }
                this.body.setVelocityX(speed * this.currentDirection);
            }else{
                if(this.currentPlayer.body.x < this.body.x){
                    this.currentDirection = -1;
                }else{
                    this.currentDirection = 1;
                }
                this.body.setVelocityX(speed * this.runMultiplier * this.currentDirection);
            }

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