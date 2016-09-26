

_TD.loading.push(function(TD){


  TD.bullet = function( cfg ){
    this.position = cfg.position;
    this.origin = cfg.start;
    this.target = cfg.end;   // in missile type, this stores the monster object
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
          if(TD.lang.getDistance(this.position, ms.position) <= this.range){
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
  };

  // inherit from bullet
  // make sure cfg.end = monster object
  TD.missile = function( cfg ){
    this.__proto__ = new TD.bullet( cfg );
    this.track = [];
    this.count = -3;
    this.hit = false;
    this.curTargetPosition = this.target.position;  // previous position, if target has been destroied, use this curTargetPosition

    this.move = function(){
      if(!this.hit && this.target != undefined && this.target != null && this.target.live > 0){
        this.curTargetPosition = this.target.position;
      }

      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        this.count++;
        if(this.count == 0){
          this.track[0].a=0.9;
        }else if(this.count > 0){
          if(this.track[0].a == 0.1) this.track.shift();
          for(idx=0; idx<this.track.length; idx++){
            this.track[idx].a -= 0.1;
            if(this.track[idx].a == 0.9) break;
          }
        }
        if( this.track.length > 0){
          var obj = {
            position : this.curTargetPosition,
            type : this.type,
            exploding : this.exploding[this.index],
            track : this.track
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.position, this.curTargetPosition, this.speed);
      var point = [this.position, nextPosition], idx;
      point.a = 1;
      this.track.push(point);
      this.position = nextPosition;
      this.count++;
      if(this.count == 0){
        this.track[0].a=0.9;
      }else if(this.count > 0){
        if(this.track[0].a == 0.1) this.track.shift();
        for(idx=0; idx<this.track.length; idx++){
          this.track[idx].a -= 0.1;
          if(this.track[idx].a == 0.9) break;
        }
      }
      var obj = {
        position : this.curTargetPosition,
        type : this.type,
        track : this.track
      };
      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        this.hit = true;
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

  };

});
