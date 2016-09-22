_TD.loading.push(function(TD){


  //TD.eventQueue
  //TD.buildingsInBattleField
  TD.monster = function( node, range, speed, live ){
    this.position = node.position;
    this.node = node;
    this.speed = speed;
    this.attackRange = range;
    this.from = node;
    this.to = null;
    this.path = null;
    this.probe = 0;
    this.alive = true;
    this.price = 0;     // rewards when finish this monster
    this.live = live==undefined?1000:live;

    this.move = function(){
      if(this.live <= 0) {
        // can add exploding view later
        return false;
      }
      if(this.from == null) return false;
      if(this.to == null){
        var res = TD.strategy(this.from);
        this.to = res[0];
        this.path = res[1];
        this.probe = 1;
      }
      if(TD.lang.pointEq(this.position, this.to.position) || this.probe==this.path.length){
        if(this.to.Feature == 'TA'){
          return false;
        }else{
          this.from = this.to;
          this.to = null;
          if(this.from.Feature=='T' || this.from.Feature == 'TJ'){
            delete TD.aliveTerminals[this.from];
          }
          this.move();
          return true;
        }
      }
      this.position = TD.lang.getNextPos(this.position, this.path[this.probe-1][0], this.path[this.probe][0], this.speed);
      if(TD.lang.pointEq(this.position, this.path[this.probe][0])){
        this.probe++;
      }
      TD.eventQueue.push({
        position : this.position,
        type : 'Monster'
      });
      return true;
    };

    this.checkSurroundAttackable = function(){
      for(var idx=0; idx<TD.buildingsInBattleField.length; idx++){
        if(isInRange(this.position, TD.buildingsInBattleField[idx].position, this.attackRange)){
          return TD.buildingsInBattleField[idx];
        }
      }
      return null;
    };


  };






});
