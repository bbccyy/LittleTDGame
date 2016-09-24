

_TD.loading.push(function(TD){


  TD.bullet = function( cfg ){
    this.position = cfg.position;
    this.origin = cfg.start;
    this.target = cfg.end;
    this.type = cfg.type;
    this.damage = cfg.damage;
    this.gender = cfg.gender;  // true: from building, false: from monster
    this.speed = TD.cfg.Arsenal[this.type].speed;  //bullet speed
    this.range = TD.cfg.Arsenal[this.type].damageRange;
    this.exploding = TD.cfg.Arsenal[this.type].exploding;  // exploding style
    this.index = 0;  //exploding frame index

    this.move = function(){
      if(this.type == 'bullet_layser'){
        var obj = {
          position : this.target,
          origin : this.origin,
          type : this.type
        };
        this.makeDamage();
        TD.eventQueue.push(obj);
        return false;
      }
      if(TD.lang.pointEq(this.target, this.position)==true){
        if(this.index < this.exploding.length){
          var obj = {
            position : this.position,
            type : this.type,
            exploding : this.exploding[this.index]
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.origin, this.target, this.speed);
      this.position = nextPosition;
      var obj = {
        position : nextPosition,
        type : this.type
      };
      if(TD.lang.pointEq(this.target, this.position)==true){
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.makeDamage = function(){   // now, makeDamage function can process both justice and evil bullets
      var idx, ms, key;
      if(this.gender==true){
        for(idx=0; idx<TD.monsterQueue.length; idx++){
          ms = TD.monsterQueue[idx];
          if(TD.lang.getDistance(this.target, ms.position) <= this.range){
            ms.live -= this.damage;
          }
        }
      }else{
        for(idx=0; idx<TD.inBuildingQueue.length; idx++){
          ms = TD.inBuildingQueue[idx];
          if(TD.lang.getDistance(this.target, ms.position) <= this.range){
            ms.live -= this.damage;
          }
        }
        for(key in TD.aliveTerminals){
          if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
          ms = TD.aliveTerminals[key];
          if(TD.lang.getDistance(this.target, ms.position) <= this.range){
            ms.live -= this.damage;
          }
        }
      }
    };

  }

});
