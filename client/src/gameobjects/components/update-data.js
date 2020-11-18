(function(ns) {
  ns.UpdateData = {
    updateData: undefined,

    /**
     * Initializes update data
     */
    initUpdateData: function() {
      this.updateData = new Array(7);
      this.updateData[1] = this.id;
    },

    /**
     * Gets update data for this character
     * @param type 1 - spawn, 2 - character position
     * @return {*[]}
     */
    getUpdateData: function(type) {
      this.updateData[0] = type;
      this.updateData[2] = this.x;
      this.updateData[3] = this.y;
      this.updateData[4] = 0;

      if(this.isJumping) {
        this.updateData[4] = 1;
      } else if(this.stairsUp) {
        this.updateData[4] = 2;
      } else if(this.stairsDown) {
        this.updateData[4] = 3;
      } else if(this.isHiding) {
        this.updateData[4] = 4;
      }

      this.updateData[5] = (+this.isCurrentCharacter);
      this.updateData[6] = (+this.hasLantern);

      return this.updateData;
    }
  };
})(candlegamestools.namespace('candlegames.pestis.gameobjects.components'));
