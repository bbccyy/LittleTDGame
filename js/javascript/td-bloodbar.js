
_TD.loading.push(function(TD){

  TD.bloodBar = function( host ){
    this.host = host;
    this.shield = host.shield==undefined?false:host.shield;
    this.move = function(){
      if(this.host == undefined || this.host == null) return false;
      if(this.host.live <= 0) return false;
      if(this.host.remove != undefined && this.host.remove) return false;
      var posLX = this.host.position[0] - 10,
          posRX = this.host.position[0] + 10;
          posY = this.host.position[1] - 11;
          posRx = 18 * this.host.live / this.host.maxLive + posLX + 1;
      if(this.host.type == 'building-5'){
        posY -= 37;
      }
      if(this.host.type[1] == 'o'){
        posY -= 17;
      }
      var obj = {
        type : 'bar',
        position : [[posLX, posY],[posRX, posY]],
        positionIn : [[posLX+1, posY],[posRx, posY]],
        shield : this.shield
      };
      TD.eventQueue.push(obj);
      return true;
    };
  };

});
