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


        stop: function(){
            this._walk(0);
        },

        walkLeft: function(){
            this._walk(this.walkVelocity, -1);
        },

        walkRight: function(){
            this._walk(this.walkVelocity, -1);
        },

        runRight: function(){
            this._walk(this.walkVelocity * this.runMultiplier, 1);
        },

        runLeft: function(){
            this._walk(this.walkVelocity * this.runMultiplier, -1);
        },

        flyRigth: function(){

        },

        _walk: function(speed, direction){
            if(direction===undefined) direction = 1;
            if(speed===undefined) speed = this.walkVelocity;

            this.body.setVelocity(speed * direction);
        },

        _fly: function(speed, direction){
            if(direction === undefined) direction=1;
            if(speed===undefined) speed = this.walkVelocity;
        },

        selectPath: function(path){
            this.path = path;
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
})